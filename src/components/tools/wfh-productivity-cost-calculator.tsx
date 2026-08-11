"use client";

/**
 * WFH Productivity Cost Calculator
 * -------------------------------------------------------------
 * Next.js (App Router) client component. Suggested metadata:
 *
 * export const metadata = {
 *   title: "WFH Productivity Cost Calculator | Interruptions vs. Commute Savings",
 *   description:
 *     "Calculate the net productivity impact of working from home by weighing time lost to interruptions and distractions against time reclaimed from not commuting.",
 * };
 */

import { useMemo, useState } from "react";

function parseNum(v: string): number {
  const n = parseFloat(v);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

export function WfhProductivityCostCalculator() {
  const [hourlyRate, setHourlyRate] = useState("40");
  const [symbol, setSymbol] = useState("$");
  const [interruptionsPerDay, setInterruptionsPerDay] = useState("6");
  const [minutesLostPerInterruption, setMinutesLostPerInterruption] = useState("15");
  const [extraDistractionMinutes, setExtraDistractionMinutes] = useState("30");
  const [commuteSavedMinutes, setCommuteSavedMinutes] = useState("60");
  const [commuteConversionPct, setCommuteConversionPct] = useState("50");
  const [workDaysPerWeek, setWorkDaysPerWeek] = useState("5");
  const [submitted, setSubmitted] = useState(false);

  const result = useMemo(() => {
    const rate = parseNum(hourlyRate);
    const interruptions = parseNum(interruptionsPerDay);
    const minutesPerInterruption = parseNum(minutesLostPerInterruption);
    const extraDistraction = parseNum(extraDistractionMinutes);
    const commuteSaved = parseNum(commuteSavedMinutes);
    const conversionPct = Math.min(Math.max(parseNum(commuteConversionPct), 0), 100) / 100;
    const days = Math.min(Math.max(parseNum(workDaysPerWeek), 0), 7);

    const dailyLostMinutes = interruptions * minutesPerInterruption + extraDistraction;
    const dailyGainedMinutes = commuteSaved * conversionPct;
    const netDailyMinutes = dailyGainedMinutes - dailyLostMinutes;

    const netDailyCost = (netDailyMinutes / 60) * rate;
    const netWeeklyCost = netDailyCost * days;
    const netAnnualCost = netWeeklyCost * 52;

    const dailyLostCost = (dailyLostMinutes / 60) * rate;
    const dailyGainedValue = (dailyGainedMinutes / 60) * rate;

    let verdict: "Net productivity gain" | "Roughly balanced" | "Net productivity loss" | "Significant productivity loss";
    if (netDailyMinutes > 30) verdict = "Net productivity gain";
    else if (netDailyMinutes >= -15) verdict = "Roughly balanced";
    else if (netDailyMinutes >= -60) verdict = "Net productivity loss";
    else verdict = "Significant productivity loss";

    return {
      dailyLostMinutes,
      dailyGainedMinutes,
      netDailyMinutes,
      netDailyCost,
      netWeeklyCost,
      netAnnualCost,
      dailyLostCost,
      dailyGainedValue,
      verdict,
    };
  }, [
    hourlyRate,
    interruptionsPerDay,
    minutesLostPerInterruption,
    extraDistractionMinutes,
    commuteSavedMinutes,
    commuteConversionPct,
    workDaysPerWeek,
  ]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  function money(n: number) {
    const sign = n < 0 ? "-" : "";
    return `${sign}${symbol}${Math.abs(n).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  }

  const verdictStyles: Record<string, string> = {
    "Net productivity gain": "bg-emerald-50 text-emerald-800 border-emerald-300",
    "Roughly balanced": "bg-lime-50 text-lime-800 border-lime-300",
    "Net productivity loss": "bg-amber-50 text-amber-800 border-amber-300",
    "Significant productivity loss": "bg-rose-50 text-rose-800 border-rose-300",
  };

  const fields: { key: string; label: string; value: string; setter: (v: string) => void; help?: string }[] = [
    { key: "interruptionsPerDay", label: "Interruptions per day", value: interruptionsPerDay, setter: setInterruptionsPerDay },
    { key: "minutesLostPerInterruption", label: "Minutes lost per interruption (context-switch recovery)", value: minutesLostPerInterruption, setter: setMinutesLostPerInterruption },
    { key: "extraDistractionMinutes", label: "Other daily distraction time (minutes)", value: extraDistractionMinutes, setter: setExtraDistractionMinutes },
    { key: "commuteSavedMinutes", label: "Commute time saved per day (minutes)", value: commuteSavedMinutes, setter: setCommuteSavedMinutes },
    { key: "commuteConversionPct", label: "% of saved commute time turned into actual work", value: commuteConversionPct, setter: setCommuteConversionPct },
    { key: "workDaysPerWeek", label: "Working days per week", value: workDaysPerWeek, setter: setWorkDaysPerWeek },
  ];

  return (
    <main className="min-h-screen bg-stone-50 text-stone-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "WFH Productivity Cost Calculator",
            applicationCategory: "BusinessApplication",
            operatingSystem: "Any",
            description:
              "Calculate the net productivity impact of working from home by weighing time lost to interruptions and distractions against time reclaimed from not commuting.",
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
            WFH Productivity Cost Calculator
          </h1>
          <p className="mt-3 max-w-2xl text-stone-600">
            Weigh the time you lose to home distractions and interruptions
            against the time you reclaim by not commuting, and see the net
            productivity impact in hours and money.
          </p>
        </header>

        <form onSubmit={onSubmit} className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-8">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="hourlyRate" className="block text-sm font-semibold text-stone-800">
                Value of your time (per hour)
              </label>
              <input
                id="hourlyRate"
                type="number"
                min={0}
                inputMode="decimal"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              />
            </div>
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

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {fields.map((f) => (
              <div key={f.key}>
                <label htmlFor={f.key} className="block text-sm font-medium text-stone-700">
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
          </div>

          <button
            type="submit"
            className="mt-7 w-full rounded-lg bg-emerald-700 px-5 py-3 font-semibold text-white transition hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 sm:w-auto"
          >
            Calculate productivity impact
          </button>
        </form>

        {submitted && (
          <section aria-live="polite" className="mt-8 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-8">
            <h2 className="text-xl font-bold text-stone-900">Your net productivity impact</h2>

            <div className={`mt-4 rounded-xl border px-4 py-3 text-sm font-semibold ${verdictStyles[result.verdict]}`}>
              {result.verdict} — {result.netDailyMinutes >= 0 ? "+" : ""}{result.netDailyMinutes.toFixed(0)} minutes/day
            </div>

            <dl className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg bg-stone-50 p-4">
                <dt className="text-xs font-medium uppercase text-stone-500">Daily time lost to distractions</dt>
                <dd className="mt-1 text-lg font-bold text-stone-900">{result.dailyLostMinutes.toFixed(0)} min ({money(result.dailyLostCost)})</dd>
              </div>
              <div className="rounded-lg bg-stone-50 p-4">
                <dt className="text-xs font-medium uppercase text-stone-500">Daily time reclaimed from commute</dt>
                <dd className="mt-1 text-lg font-bold text-stone-900">{result.dailyGainedMinutes.toFixed(0)} min ({money(result.dailyGainedValue)})</dd>
              </div>
              <div className="rounded-lg bg-stone-50 p-4">
                <dt className="text-xs font-medium uppercase text-stone-500">Net weekly impact</dt>
                <dd className={`mt-1 text-lg font-bold ${result.netWeeklyCost >= 0 ? "text-emerald-700" : "text-rose-700"}`}>
                  {money(result.netWeeklyCost)}
                </dd>
              </div>
              <div className="rounded-lg bg-stone-50 p-4">
                <dt className="text-xs font-medium uppercase text-stone-500">Net annual impact</dt>
                <dd className={`mt-1 text-lg font-bold ${result.netAnnualCost >= 0 ? "text-emerald-700" : "text-rose-700"}`}>
                  {money(result.netAnnualCost)}
                </dd>
              </div>
            </dl>

            <p className="mt-5 text-sm leading-relaxed text-stone-600">
              Net daily impact = (commute time saved × the share you
              estimated actually converts to work) − (interruptions ×
              recovery time per interruption + other distraction time),
              converted to money using your entered hourly value. This is a
              self-reported estimate meant to prompt reflection on your
              habits, not a precise productivity audit.
            </p>
          </section>
        )}
      </div>
    </main>
  );
}
