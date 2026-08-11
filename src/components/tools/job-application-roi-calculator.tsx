"use client";

/**
 * Job Application ROI Calculator
 * -------------------------------------------------------------
 * Next.js (App Router) client component. Suggested metadata:
 *
 * export const metadata = {
 *   title: "Job Application ROI Calculator | Is Your Job Search Time Worth It?",
 *   description:
 *     "Calculate the expected value of your job search effort based on applications sent, interview rate, offer rate, target salary, and time invested per application.",
 * };
 */

import { useMemo, useState } from "react";

function parseNum(v: string): number {
  const n = parseFloat(v);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

export function JobApplicationRoiCalculator() {
  const [applications, setApplications] = useState("40");
  const [hoursPerApp, setHoursPerApp] = useState("1");
  const [interviewRatePct, setInterviewRatePct] = useState("12");
  const [offerRatePct, setOfferRatePct] = useState("25");
  const [hoursPerInterview, setHoursPerInterview] = useState("4");
  const [targetSalary, setTargetSalary] = useState("75000");
  const [hourlyValue, setHourlyValue] = useState("30");
  const [symbol, setSymbol] = useState("$");
  const [errors, setErrors] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const result = useMemo(() => {
    const n = parseNum(applications);
    const interviewRate = Math.min(Math.max(parseNum(interviewRatePct), 0), 100) / 100;
    const offerRate = Math.min(Math.max(parseNum(offerRatePct), 0), 100) / 100;
    const perAppHours = parseNum(hoursPerApp);
    const perInterviewHours = parseNum(hoursPerInterview);
    const salary = parseNum(targetSalary);
    const hourlyVal = parseNum(hourlyValue);

    const expectedInterviews = n * interviewRate;
    const expectedOffers = expectedInterviews * offerRate;
    const pPerApplication = interviewRate * offerRate;
    const probAtLeastOneOffer =
      pPerApplication > 0 ? 1 - Math.pow(1 - pPerApplication, n) : 0;

    const totalHours = n * perAppHours + expectedInterviews * perInterviewHours;
    const timeCost = totalHours * hourlyVal;
    const expectedValue = probAtLeastOneOffer * salary - timeCost;

    const hoursPerExpectedOffer =
      expectedOffers > 0 ? totalHours / expectedOffers : Infinity;
    const hoursPerExpectedInterview =
      expectedInterviews > 0 ? totalHours / expectedInterviews : Infinity;

    let verdict: "Strong ROI" | "Reasonable ROI" | "Marginal ROI" | "Reconsider strategy";
    if (expectedValue > salary * 0.5) verdict = "Strong ROI";
    else if (expectedValue > 0) verdict = "Reasonable ROI";
    else if (expectedValue > -timeCost * 0.5) verdict = "Marginal ROI";
    else verdict = "Reconsider strategy";

    return {
      expectedInterviews,
      expectedOffers,
      probAtLeastOneOffer,
      totalHours,
      timeCost,
      expectedValue,
      hoursPerExpectedOffer,
      hoursPerExpectedInterview,
      verdict,
    };
  }, [applications, interviewRatePct, offerRatePct, hoursPerApp, hoursPerInterview, targetSalary, hourlyValue]);

  function validate(): string[] {
    const problems: string[] = [];
    if (parseNum(applications) <= 0) problems.push("Enter a number of applications greater than 0.");
    if (parseNum(targetSalary) <= 0) problems.push("Enter a target salary greater than 0.");
    return problems;
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const problems = validate();
    setErrors(problems);
    setSubmitted(true);
  }

  function money(n: number) {
    if (!Number.isFinite(n)) return "—";
    return `${symbol}${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  }

  const verdictStyles: Record<string, string> = {
    "Strong ROI": "bg-emerald-50 text-emerald-800 border-emerald-300",
    "Reasonable ROI": "bg-lime-50 text-lime-800 border-lime-300",
    "Marginal ROI": "bg-amber-50 text-amber-800 border-amber-300",
    "Reconsider strategy": "bg-rose-50 text-rose-800 border-rose-300",
  };

  const fields: { key: string; label: string; value: string; setter: (v: string) => void; help?: string }[] = [
    { key: "applications", label: "Applications sent (or planned)", value: applications, setter: setApplications },
    { key: "hoursPerApp", label: "Hours spent per application", value: hoursPerApp, setter: setHoursPerApp },
    { key: "interviewRatePct", label: "Interview rate (% of applications)", value: interviewRatePct, setter: setInterviewRatePct },
    { key: "offerRatePct", label: "Offer rate (% of interviews)", value: offerRatePct, setter: setOfferRatePct },
    { key: "hoursPerInterview", label: "Hours per interview (prep + interview)", value: hoursPerInterview, setter: setHoursPerInterview },
    { key: "targetSalary", label: "Target annual salary if hired", value: targetSalary, setter: setTargetSalary },
    { key: "hourlyValue", label: "Value of your time (per hour)", value: hourlyValue, setter: setHourlyValue },
  ];

  return (
    <main className="min-h-screen bg-stone-50 text-stone-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Job Application ROI Calculator",
            applicationCategory: "BusinessApplication",
            operatingSystem: "Any",
            description:
              "Calculate the expected value of job search effort based on applications, interview rate, offer rate, target salary, and time invested.",
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
            Job Application ROI Calculator
          </h1>
          <p className="mt-3 max-w-2xl text-stone-600">
            Estimate whether your current job search strategy is worth the
            hours you're putting into it, based on your real interview and
            offer conversion rates.
          </p>
        </header>

        <form onSubmit={onSubmit} noValidate className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-8">
          <div className="grid gap-5 sm:grid-cols-2">
            {fields.map((f) => (
              <div key={f.key}>
                <label htmlFor={f.key} className="block text-sm font-semibold text-stone-800">
                  {f.label}
                </label>
                <input
                  id={f.key}
                  type="number"
                  min={0}
                  inputMode="decimal"
                  value={f.value}
                  onChange={(e) => f.setter(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                />
              </div>
            ))}
            <div>
              <label htmlFor="symbol" className="block text-sm font-semibold text-stone-800">
                Currency symbol
              </label>
              <input
                id="symbol"
                type="text"
                maxLength={4}
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              />
            </div>
          </div>

          {errors.length > 0 && (
            <div role="alert" className="mt-6 rounded-lg border border-rose-300 bg-rose-50 p-3 text-sm text-rose-800">
              <ul className="list-inside list-disc">
                {errors.map((err) => (
                  <li key={err}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          <button
            type="submit"
            className="mt-7 w-full rounded-lg bg-emerald-700 px-5 py-3 font-semibold text-white transition hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 sm:w-auto"
          >
            Calculate my job search ROI
          </button>
        </form>

        {submitted && errors.length === 0 && (
          <section aria-live="polite" className="mt-8 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-8">
            <h2 className="text-xl font-bold text-stone-900">Your job search ROI</h2>

            <div className={`mt-4 rounded-xl border px-4 py-3 text-sm font-semibold ${verdictStyles[result.verdict]}`}>
              {result.verdict} — expected value {money(result.expectedValue)}
            </div>

            <dl className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg bg-stone-50 p-4">
                <dt className="text-xs font-medium uppercase text-stone-500">Expected interviews</dt>
                <dd className="mt-1 text-lg font-bold text-stone-900">{result.expectedInterviews.toFixed(1)}</dd>
              </div>
              <div className="rounded-lg bg-stone-50 p-4">
                <dt className="text-xs font-medium uppercase text-stone-500">Expected offers</dt>
                <dd className="mt-1 text-lg font-bold text-stone-900">{result.expectedOffers.toFixed(2)}</dd>
              </div>
              <div className="rounded-lg bg-stone-50 p-4">
                <dt className="text-xs font-medium uppercase text-stone-500">Probability of at least one offer</dt>
                <dd className="mt-1 text-lg font-bold text-stone-900">{(result.probAtLeastOneOffer * 100).toFixed(0)}%</dd>
              </div>
              <div className="rounded-lg bg-stone-50 p-4">
                <dt className="text-xs font-medium uppercase text-stone-500">Total hours invested</dt>
                <dd className="mt-1 text-lg font-bold text-stone-900">{result.totalHours.toFixed(0)} hrs</dd>
              </div>
              <div className="rounded-lg bg-stone-50 p-4">
                <dt className="text-xs font-medium uppercase text-stone-500">Time cost of your effort</dt>
                <dd className="mt-1 text-lg font-bold text-stone-900">{money(result.timeCost)}</dd>
              </div>
              <div className="rounded-lg bg-stone-50 p-4">
                <dt className="text-xs font-medium uppercase text-stone-500">Hours per expected offer</dt>
                <dd className="mt-1 text-lg font-bold text-stone-900">
                  {Number.isFinite(result.hoursPerExpectedOffer) ? `${result.hoursPerExpectedOffer.toFixed(0)} hrs` : "—"}
                </dd>
              </div>
            </dl>

            <p className="mt-5 text-sm leading-relaxed text-stone-600">
              Expected value = (probability of landing at least one offer ×
              target salary) − (total hours invested × the hourly value you
              assigned to your time). This treats your interview and offer
              rates as independent probabilities per application, which is
              a simplification — real results depend heavily on résumé
              quality, market conditions, and role fit. Use this as a
              directional guide for adjusting your search strategy, not a
              guaranteed outcome.
            </p>
          </section>
        )}
      </div>
    </main>
  );
}
