"use client";

/**
 * "Can I Actually Work This Job Remotely?" Checker
 * -------------------------------------------------------------
 * Next.js (App Router) client component. Suggested metadata:
 *
 * export const metadata = {
 *   title: "Can I Actually Work This Job Remotely? | Remote Feasibility Checker",
 *   description:
 *     "Check whether a job is genuinely remote-compatible by evaluating physical presence needs, equipment, compliance, and collaboration requirements. Get an instant feasibility score.",
 * };
 */

import { useMemo, useState } from "react";

interface Flag {
  id: string;
  label: string;
  weight: number;
  note: string;
}

const FLAGS: Flag[] = [
  {
    id: "physical_equipment",
    label: "The role requires operating physical equipment or machinery on-site",
    weight: 10,
    note: "Hands-on equipment operation generally cannot be done remotely.",
  },
  {
    id: "inventory",
    label: "The role involves directly handling physical inventory, stock, or products",
    weight: 8,
    note: "Physical handling of goods ties the role to a location.",
  },
  {
    id: "in_person_care",
    label: "The role involves direct in-person client, patient, or customer care",
    weight: 9,
    note: "In-person service delivery is a strong indicator this role can't be fully remote.",
  },
  {
    id: "secure_network",
    label: "Systems or data must legally stay on a secured, on-site network",
    weight: 8,
    note: "Regulatory or security requirements like this can block remote access entirely — confirm with IT/compliance.",
  },
  {
    id: "lab_equipment",
    label: "The role requires specialized on-site hardware, lab, or studio equipment",
    weight: 9,
    note: "Equipment that can't be replicated at home limits remote feasibility.",
  },
  {
    id: "jurisdiction",
    label: "Licensing or regulation requires physical presence in a specific jurisdiction",
    weight: 7,
    note: "Common in healthcare, legal, and financial-services roles — verify licensing rules for your location.",
  },
  {
    id: "frequent_client_meetings",
    label: "Frequent in-person client meetings are core to the role, not occasional",
    weight: 6,
    note: "This may still allow a hybrid arrangement rather than fully blocking remote work.",
  },
  {
    id: "whiteboard_collab",
    label: "The team relies heavily on spontaneous in-person collaboration (e.g. whiteboarding)",
    weight: 4,
    note: "Often solvable with async tools and digital whiteboards, but worth discussing with the team.",
  },
  {
    id: "manager_preference",
    label: "Your manager has expressed a strong preference for in-office presence",
    weight: 5,
    note: "This is a policy/preference issue, not a technical blocker — it's negotiable in some organizations.",
  },
  {
    id: "onsite_onboarding_only",
    label: "Onboarding or compliance training must happen on-site, one time only",
    weight: 2,
    note: "A one-time on-site requirement doesn't block ongoing remote work afterward.",
  },
];

function parseChecked(v: Record<string, boolean>) {
  return FLAGS.filter((f) => v[f.id]);
}

const MAX_FLAG_SCORE = FLAGS.reduce((s, f) => s + f.weight, 0);
const DIGITAL_PENALTY = 15;
const MAX_SCORE = MAX_FLAG_SCORE + DIGITAL_PENALTY;

export function CanIWorkThisJobRemotelyChecker() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [digitalDeliverables, setDigitalDeliverables] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  function toggle(id: string) {
    setChecked((c) => ({ ...c, [id]: !c[id] }));
  }

  const result = useMemo(() => {
    const triggered = parseChecked(checked);
    let rawScore = triggered.reduce((s, f) => s + f.weight, 0);
    if (!digitalDeliverables) rawScore += DIGITAL_PENALTY;

    const pct = Math.round((rawScore / MAX_SCORE) * 100);
    const remoteFriendliness = 100 - pct;

    let verdict: "Fully remote-friendly" | "Hybrid likely works" | "Remote is a stretch" | "Not remote-compatible";
    if (pct < 15) verdict = "Fully remote-friendly";
    else if (pct < 35) verdict = "Hybrid likely works";
    else if (pct < 60) verdict = "Remote is a stretch";
    else verdict = "Not remote-compatible";

    return { triggered, pct, remoteFriendliness, verdict };
  }, [checked, digitalDeliverables]);

  const verdictStyles: Record<string, string> = {
    "Fully remote-friendly": "bg-emerald-50 text-emerald-800 border-emerald-300",
    "Hybrid likely works": "bg-lime-50 text-lime-800 border-lime-300",
    "Remote is a stretch": "bg-amber-50 text-amber-800 border-amber-300",
    "Not remote-compatible": "bg-rose-50 text-rose-800 border-rose-300",
  };

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  function reset() {
    setChecked({});
    setDigitalDeliverables(true);
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
            name: '"Can I Actually Work This Job Remotely?" Checker',
            applicationCategory: "UtilitiesApplication",
            operatingSystem: "Any",
            description:
              "Check whether a job is genuinely remote-compatible based on physical presence needs, equipment, compliance, and collaboration requirements.",
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
            "Can I Actually Work This Job Remotely?" Checker
          </h1>
          <p className="mt-3 max-w-2xl text-stone-600">
            Not every role advertised as "remote-friendly" actually is.
            Answer honestly about the job's real requirements to get a
            feasibility verdict before you negotiate or accept.
          </p>
        </header>

        <form onSubmit={onSubmit} className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-8">
          <div className="rounded-xl border border-stone-200 p-4">
            <label className="flex items-start gap-3 text-sm font-medium text-stone-700">
              <input
                type="checkbox"
                checked={digitalDeliverables}
                onChange={(e) => setDigitalDeliverables(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-stone-400 text-emerald-700 focus:ring-emerald-500"
              />
              My day-to-day deliverables are entirely digital (documents, code, data, designs, calls, etc.)
            </label>
          </div>

          <fieldset className="mt-5">
            <legend className="text-sm font-semibold text-stone-800">
              Which of these apply to the role?
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
              Check remote feasibility
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
            <h2 className="text-xl font-bold text-stone-900">Your feasibility verdict</h2>

            <div className={`mt-4 rounded-xl border px-4 py-3 text-sm font-semibold ${verdictStyles[result.verdict]}`}>
              {result.verdict} — {result.remoteFriendliness}/100 remote-friendliness score
            </div>

            {!digitalDeliverables && (
              <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                Your deliverables aren't entirely digital, which is one of
                the strongest indicators of remote incompatibility.
              </p>
            )}

            {result.triggered.length === 0 ? (
              <p className="mt-5 text-sm text-stone-600">
                No blocking factors selected — this role looks structurally
                compatible with remote work.
              </p>
            ) : (
              <div className="mt-5">
                <h3 className="text-sm font-semibold text-stone-800">
                  Factors limiting remote work ({result.triggered.length})
                </h3>
                <ul className="mt-3 space-y-3">
                  {result.triggered
                    .slice()
                    .sort((a, b) => b.weight - a.weight)
                    .map((f) => (
                      <li key={f.id} className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm">
                        <p className="font-semibold text-amber-900">{f.label}</p>
                        <p className="mt-1 text-amber-800">{f.note}</p>
                      </li>
                    ))}
                </ul>
              </div>
            )}

            <p className="mt-6 text-sm leading-relaxed text-stone-600">
              This checker highlights structural and compliance factors
              commonly used to evaluate remote feasibility. It isn't legal
              advice — licensing, labor law, and data-residency requirements
              vary by industry and location, so verify anything
              regulation-related with your employer's compliance team or a
              qualified professional.
            </p>
          </section>
        )}
      </div>
    </main>
  );
}

