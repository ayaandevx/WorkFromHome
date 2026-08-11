"use client";

/**
 * Remote Work Readiness Score
 * -------------------------------------------------------------
 * Next.js (App Router) client component. Suggested metadata:
 *
 * export const metadata = {
 *   title: "Remote Work Readiness Score | Are You Set Up to Work From Home?",
 *   description:
 *     "Get a practical readiness score for remote work based on your workspace, internet, equipment, communication habits, schedule, skills, backup plans, and distractions.",
 * };
 */

import { useMemo, useState } from "react";

interface Category {
  id: string;
  title: string;
  question: string;
  tip: string;
}

const CATEGORIES: Category[] = [
  {
    id: "workspace",
    title: "Workspace",
    question: "How well set up is your dedicated work area (desk, chair, quiet space)?",
    tip: "Set up a dedicated space you can leave your work in, even if it's a small desk in a corner. A door or divider that signals \"working\" helps mentally and with housemates.",
  },
  {
    id: "internet",
    title: "Internet connection",
    question: "How reliable is your internet for calls, uploads, and daily tools?",
    tip: "Run a speed test during work hours and consider a backup hotspot if your connection drops occasionally.",
  },
  {
    id: "equipment",
    title: "Equipment",
    question: "How well does your computer, webcam, and audio setup meet your job's needs?",
    tip: "Prioritize a decent webcam and microphone — audio quality affects how you're perceived in meetings more than video quality does.",
  },
  {
    id: "communication",
    title: "Communication habits",
    question: "How proactively do you communicate status, blockers, and availability to your team?",
    tip: "Over-communicate in remote settings: post status updates, respond within agreed windows, and default to writing things down.",
  },
  {
    id: "schedule",
    title: "Schedule & time management",
    question: "How consistent is your daily work schedule and time-blocking?",
    tip: "Set consistent start/end times and block focus time on your calendar so meetings don't fragment your day.",
  },
  {
    id: "skills",
    title: "Remote-specific skills",
    question: "How comfortable are you with async work, self-direction, and remote tools?",
    tip: "Practice writing clear async updates and get comfortable working independently between check-ins.",
  },
  {
    id: "backup",
    title: "Backup plans",
    question: "How prepared are you for outages (power, internet, device failure)?",
    tip: "Keep a charged power bank, a mobile hotspot option, and know your nearest backup working location (café, coworking space, library).",
  },
  {
    id: "distractions",
    title: "Distraction management",
    question: "How well can you manage household distractions during work hours?",
    tip: "Set clear boundaries with household members during work hours and use tools like website blockers during focus blocks.",
  },
];

const SCALE_LABELS = ["Poor", "Weak", "Okay", "Good", "Excellent"];

export function RemoteWorkReadinessScore() {
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  function setRating(id: string, value: number) {
    setRatings((r) => ({ ...r, [id]: value }));
  }

  const result = useMemo(() => {
    const answered = CATEGORIES.filter((c) => ratings[c.id]);
    const total = answered.reduce((sum, c) => sum + (ratings[c.id] || 0), 0);
    const maxPossible = CATEGORIES.length * 5;
    const score = Math.round((total / maxPossible) * 100);

    const weakCategories = CATEGORIES.filter((c) => (ratings[c.id] || 0) > 0 && ratings[c.id] <= 2);

    let verdict: "Fully ready" | "Mostly ready" | "Some gaps" | "Not yet ready";
    if (score >= 85) verdict = "Fully ready";
    else if (score >= 65) verdict = "Mostly ready";
    else if (score >= 40) verdict = "Some gaps";
    else verdict = "Not yet ready";

    return { score, weakCategories, verdict, answeredCount: answered.length };
  }, [ratings]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (Object.keys(ratings).length < CATEGORIES.length) {
      setError("Please rate every category before checking your score.");
      setSubmitted(false);
      return;
    }
    setError("");
    setSubmitted(true);
  }

  const verdictStyles: Record<string, string> = {
    "Fully ready": "bg-emerald-50 text-emerald-800 border-emerald-300",
    "Mostly ready": "bg-lime-50 text-lime-800 border-lime-300",
    "Some gaps": "bg-amber-50 text-amber-800 border-amber-300",
    "Not yet ready": "bg-rose-50 text-rose-800 border-rose-300",
  };

  return (
    <main className="min-h-screen bg-stone-50 text-stone-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Remote Work Readiness Score",
            applicationCategory: "UtilitiesApplication",
            operatingSystem: "Any",
            description:
              "Get a practical readiness score for remote work based on workspace, internet, equipment, communication, schedule, skills, backup plans, and distractions.",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />

      <div className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
        <header className="mb-8">
          <p className="text-sm font-medium uppercase tracking-wide text-emerald-700">
            Remote work tools
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
            Remote Work Readiness Score
          </h1>
          <p className="mt-3 max-w-2xl text-stone-600">
            Rate yourself honestly across eight practical areas to see how
            ready you are to work remotely — and exactly where to focus
            before you start (or improve) a remote role.
          </p>
        </header>

        <form onSubmit={onSubmit} className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-8">
          <div className="space-y-6">
            {CATEGORIES.map((cat) => (
              <fieldset key={cat.id} className="rounded-xl border border-stone-200 p-4">
                <legend className="px-1 text-sm font-semibold text-stone-800">{cat.title}</legend>
                <p className="mt-1 text-sm text-stone-600">{cat.question}</p>
                <div className="mt-3 flex flex-wrap gap-2" role="radiogroup" aria-label={cat.title}>
                  {SCALE_LABELS.map((label, idx) => {
                    const value = idx + 1;
                    const active = ratings[cat.id] === value;
                    return (
                      <button
                        key={value}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        onClick={() => setRating(cat.id, value)}
                        className={`rounded-full border px-3 py-1.5 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-emerald-400 ${
                          active
                            ? "border-emerald-600 bg-emerald-600 text-white"
                            : "border-stone-300 bg-white text-stone-700 hover:bg-stone-50"
                        }`}
                      >
                        {value} · {label}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            ))}
          </div>

          {error && (
            <div role="alert" className="mt-6 rounded-lg border border-rose-300 bg-rose-50 p-3 text-sm text-rose-800">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="mt-7 w-full rounded-lg bg-emerald-700 px-5 py-3 font-semibold text-white transition hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 sm:w-auto"
          >
            See my readiness score
          </button>
        </form>

        {submitted && (
          <section aria-live="polite" className="mt-8 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-8">
            <h2 className="text-xl font-bold text-stone-900">Your readiness score</h2>

            <div className={`mt-4 rounded-xl border px-4 py-3 text-sm font-semibold ${verdictStyles[result.verdict]}`}>
              {result.verdict} — {result.score}/100
            </div>

            {result.weakCategories.length > 0 ? (
              <div className="mt-5">
                <h3 className="text-sm font-semibold text-stone-800">Areas to improve first</h3>
                <ul className="mt-3 space-y-3">
                  {result.weakCategories.map((c) => (
                    <li key={c.id} className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm">
                      <p className="font-semibold text-amber-900">{c.title}</p>
                      <p className="mt-1 text-amber-800">{c.tip}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="mt-5 text-sm text-stone-600">
                No area scored critically low — nice work. Review the
                categories rated "Okay" for further improvement.
              </p>
            )}

            <p className="mt-6 text-sm leading-relaxed text-stone-600">
              This score is a self-assessment tool meant to highlight gaps
              before or during a remote role. It reflects your honest
              ratings, not an objective audit of your setup.
            </p>
          </section>
        )}
      </div>
    </main>
  );
}
