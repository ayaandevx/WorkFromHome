"use client";

/**
 * Remote Job Scam Risk Checker
 * -------------------------------------------------------------
 * Next.js (App Router) client component. Suggested metadata for
 * the parent page.tsx:
 *
 * export const metadata = {
 *   title: "Remote Job Scam Risk Checker | Spot Fake Job Offers Fast",
 *   description:
 *     "Check a remote job offer against 15 common scam warning signs. Get an instant risk score and a clear list of red flags to verify before you apply or accept.",
 * };
 */

import { useMemo, useState } from "react";

interface Flag {
  id: string;
  label: string;
  weight: number; // 1-10 severity
  advice: string;
}

const FLAGS: Flag[] = [
  {
    id: "upfront_payment",
    label: "You're asked to pay for training, a starter kit, software, or a background check before starting",
    weight: 10,
    advice: "Legitimate employers never require you to pay them to get hired. Treat any upfront payment request as disqualifying.",
  },
  {
    id: "check_deposit",
    label: "You're asked to deposit a check and send part of the funds back or to a third party",
    weight: 10,
    advice: "This is a classic overpayment/check-fraud scam. Never forward funds from a check you just deposited.",
  },
  {
    id: "ssn_before_offer",
    label: "You're asked for a Social Security number, bank details, or ID scans before a formal written offer",
    weight: 9,
    advice: "Sensitive personal or banking information should only be requested after a signed offer, during official onboarding.",
  },
  {
    id: "no_interview",
    label: "You were offered the job with no interview, or after only a short chat message exchange",
    weight: 8,
    advice: "Ask for a live video or phone interview. A refusal or repeated avoidance is a strong red flag.",
  },
  {
    id: "text_only",
    label: "All communication happens over text message, WhatsApp, or Telegram instead of company email or a video call",
    weight: 8,
    advice: "Request to move communication to official company email or a verifiable video call before proceeding.",
  },
  {
    id: "personal_email",
    label: "Recruiter or 'HR' contacts you from a personal email address (Gmail, Yahoo, Outlook) instead of a company domain",
    weight: 7,
    advice: "Verify the sender's domain matches the company's real website. Search the exact email address online.",
  },
  {
    id: "buy_equipment",
    label: "You must personally buy equipment and get 'reimbursed' later",
    weight: 8,
    advice: "Legitimate employers typically ship equipment directly or reimburse only after standard, verifiable payroll processing.",
  },
  {
    id: "too_good",
    label: "The pay is significantly higher than similar roles for the stated skill level or experience",
    weight: 6,
    advice: "Compare the salary against public data for the role, location, and experience level before proceeding.",
  },
  {
    id: "unsolicited",
    label: "You were contacted unsolicited about a role you never applied for, especially via text",
    weight: 6,
    advice: "Verify the job exists on the company's official careers page before responding further.",
  },
  {
    id: "no_web_presence",
    label: "You can't find the company on LinkedIn, a business registry, or via an independent web search",
    weight: 9,
    advice: "Search the company name plus \"scam\" or \"reviews,\" and check it's registered in its claimed location.",
  },
  {
    id: "vague_description",
    label: "The job description is vague about actual day-to-day duties or uses generic corporate buzzwords only",
    weight: 4,
    advice: "Ask the recruiter for specifics: team name, manager's title, and concrete first-30-days tasks.",
  },
  {
    id: "pressure",
    label: "You're pressured to accept or provide information within a very short deadline (same day/hour)",
    weight: 7,
    advice: "Legitimate offers allow reasonable time to review. Urgency is a common manipulation tactic.",
  },
  {
    id: "generic_signature",
    label: "Offer letters or emails have inconsistent company names, logos, or generic signatures",
    weight: 6,
    advice: "Cross-check the letterhead, domain, and signer's name/title against the company's real staff on LinkedIn.",
  },
  {
    id: "grammar",
    label: "Official-looking messages contain frequent spelling or grammar errors",
    weight: 3,
    advice: "Not conclusive alone, but combined with other flags it raises the likelihood of fraud.",
  },
  {
    id: "interview_app_only",
    label: "The 'interview' happens through a chat app where you only answer typed questions from an unverified profile",
    weight: 5,
    advice: "Ask to verify the interviewer's identity via a company-domain email or a live video call.",
  },
];

const MAX_SCORE = FLAGS.reduce((sum, f) => sum + f.weight, 0);

export function RemoteJobScamRiskChecker() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);

  function toggle(id: string) {
    setChecked((c) => ({ ...c, [id]: !c[id] }));
  }

  const result = useMemo(() => {
    const triggered = FLAGS.filter((f) => checked[f.id]);
    const rawScore = triggered.reduce((sum, f) => sum + f.weight, 0);
    const pct = Math.round((rawScore / MAX_SCORE) * 100);

    let level: "Low risk" | "Medium risk" | "High risk" | "Critical risk";
    if (pct === 0) level = "Low risk";
    else if (pct < 20) level = "Low risk";
    else if (pct < 45) level = "Medium risk";
    else if (pct < 70) level = "High risk";
    else level = "Critical risk";

    return { triggered, pct, level };
  }, [checked]);

  const levelStyles: Record<string, string> = {
    "Low risk": "bg-emerald-50 text-emerald-800 border-emerald-300",
    "Medium risk": "bg-amber-50 text-amber-800 border-amber-300",
    "High risk": "bg-orange-50 text-orange-800 border-orange-300",
    "Critical risk": "bg-rose-50 text-rose-800 border-rose-300",
  };

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  function reset() {
    setChecked({});
    setSubmitted(false);
  }

  return (
    <main className="min-h-screen bg-stone-50 text-stone-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Remote Job Scam Risk Checker",
            applicationCategory: "UtilitiesApplication",
            operatingSystem: "Any",
            description:
              "Check a remote job offer against common scam warning signs and get an instant risk score with actionable advice.",
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
            Remote Job Scam Risk Checker
          </h1>
          <p className="mt-3 max-w-2xl text-stone-600">
            Select every statement below that applies to a remote job offer
            or recruiter conversation you're evaluating. You'll get an
            instant risk score plus a specific explanation for each red
            flag you selected.
          </p>
        </header>

        <form onSubmit={onSubmit} className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-8">
          <fieldset>
            <legend className="text-sm font-semibold text-stone-800">
              Which of these apply to your situation?
            </legend>
            <div className="mt-4 space-y-3">
              {FLAGS.map((flag) => (
                <label
                  key={flag.id}
                  className="flex cursor-pointer items-start gap-3 rounded-lg border border-stone-200 p-3 transition hover:bg-stone-50 has-[:checked]:border-emerald-400 has-[:checked]:bg-emerald-50"
                >
                  <input
                    type="checkbox"
                    checked={!!checked[flag.id]}
                    onChange={() => toggle(flag.id)}
                    className="mt-0.5 h-4 w-4 shrink-0 rounded border-stone-400 text-emerald-700 focus:ring-emerald-500"
                  />
                  <span className="text-sm text-stone-700">{flag.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="mt-7 flex flex-wrap gap-3">
            <button
              type="submit"
              className="rounded-lg bg-emerald-700 px-5 py-3 font-semibold text-white transition hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2"
            >
              Check risk score
            </button>
            <button
              type="button"
              onClick={reset}
              className="rounded-lg border border-stone-300 px-5 py-3 font-semibold text-stone-700 transition hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-stone-300 focus:ring-offset-2"
            >
              Reset
            </button>
          </div>
        </form>

        {submitted && (
          <section aria-live="polite" className="mt-8 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-8">
            <h2 className="text-xl font-bold text-stone-900">Your risk assessment</h2>

            <div className={`mt-4 rounded-xl border px-4 py-3 ${levelStyles[result.level]}`}>
              <p className="text-sm font-semibold">
                {result.level} — {result.pct}/100 scam-risk score
              </p>
            </div>

            {result.triggered.length === 0 ? (
              <p className="mt-5 text-sm text-stone-600">
                No common warning signs were selected. Still verify the
                company's official careers page and interviewer identity
                before sharing personal information.
              </p>
            ) : (
              <div className="mt-5">
                <h3 className="text-sm font-semibold text-stone-800">
                  Red flags identified ({result.triggered.length})
                </h3>
                <ul className="mt-3 space-y-3">
                  {result.triggered
                    .slice()
                    .sort((a, b) => b.weight - a.weight)
                    .map((f) => (
                      <li
                        key={f.id}
                        className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm"
                      >
                        <p className="font-semibold text-rose-900">{f.label}</p>
                        <p className="mt-1 text-rose-800">{f.advice}</p>
                      </li>
                    ))}
                </ul>
              </div>
            )}

            <p className="mt-6 text-sm leading-relaxed text-stone-600">
              This score is a heuristic guide based on commonly reported
              remote-job scam patterns, not a legal or official
              determination. When in doubt, verify a company through its
              official website, business registry records, and independent
              reviews before sharing personal or financial information or
              making any payment.
            </p>
          </section>
        )}

        <section className="mt-10 border-t border-stone-200 pt-6 text-sm text-stone-600">
          <h2 className="text-base font-semibold text-stone-800">
            How the score is calculated
          </h2>
          <p className="mt-2">
            Each warning sign carries a severity weight from 1 (minor) to
            10 (severe, e.g. being asked to pay money or deposit a check).
            Your score is the sum of the weights for everything you select,
            shown as a percentage of the maximum possible score across all
            15 indicators.
          </p>
        </section>
      </div>
    </main>
  );
}
