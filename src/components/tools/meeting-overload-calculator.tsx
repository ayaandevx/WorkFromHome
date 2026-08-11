"use client";

/**
 * Meeting Overload Calculator
 * -------------------------------------------------------------
 * Next.js (App Router) client component. Suggested metadata:
 *
 * export const metadata = {
 *   title: "Meeting Overload Calculator | How Much of Your Week Do Meetings Eat?",
 *   description:
 *     "Calculate how many hours and how much money your recurring meetings cost each week, and how much real focus time you have left.",
 * };
 */

import { useMemo, useState } from "react";

interface MeetingType {
  id: string;
  name: string;
  durationMin: string;
  perWeek: string;
  attendees: string;
}

let idCounter = 0;
function newId() {
  idCounter += 1;
  return `meeting-${idCounter}-${Date.now()}`;
}

const DEFAULT_MEETINGS: MeetingType[] = [
  { id: newId(), name: "Daily standup", durationMin: "15", perWeek: "5", attendees: "6" },
  { id: newId(), name: "1:1 with manager", durationMin: "30", perWeek: "1", attendees: "2" },
  { id: newId(), name: "Sprint planning", durationMin: "60", perWeek: "1", attendees: "8" },
  { id: newId(), name: "Team sync", durationMin: "30", perWeek: "2", attendees: "6" },
];

function parseNum(v: string): number {
  const n = parseFloat(v);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

export function MeetingOverloadCalculator() {
  const [meetings, setMeetings] = useState<MeetingType[]>(DEFAULT_MEETINGS);
  const [workHoursPerWeek, setWorkHoursPerWeek] = useState("40");
  const [avgHourlyCost, setAvgHourlyCost] = useState("45");
  const [symbol, setSymbol] = useState("$");
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  function updateMeeting(id: string, key: keyof MeetingType, value: string) {
    setMeetings((list) => list.map((m) => (m.id === id ? { ...m, [key]: value } : m)));
  }
  function addMeeting() {
    setMeetings((list) => [...list, { id: newId(), name: "", durationMin: "", perWeek: "1", attendees: "2" }]);
  }
  function removeMeeting(id: string) {
    setMeetings((list) => list.filter((m) => m.id !== id));
  }

  const result = useMemo(() => {
    const hourlyCost = parseNum(avgHourlyCost);
    const workWeek = Math.max(parseNum(workHoursPerWeek), 1);

    const perMeeting = meetings.map((m) => {
      const durationHrs = parseNum(m.durationMin) / 60;
      const perWeek = parseNum(m.perWeek);
      const attendees = Math.max(parseNum(m.attendees), 1);
      const personHoursPerWeek = durationHrs * perWeek * attendees;
      const yourHoursPerWeek = durationHrs * perWeek;
      const costPerWeek = personHoursPerWeek * hourlyCost;
      return { ...m, yourHoursPerWeek, personHoursPerWeek, costPerWeek };
    });

    const totalYourHours = perMeeting.reduce((s, m) => s + m.yourHoursPerWeek, 0);
    const totalPersonHours = perMeeting.reduce((s, m) => s + m.personHoursPerWeek, 0);
    const totalCost = perMeeting.reduce((s, m) => s + m.costPerWeek, 0);
    const meetingSharePct = (totalYourHours / workWeek) * 100;
    const remainingFocusHours = Math.max(workWeek - totalYourHours, 0);

    let verdict: "Healthy balance" | "Getting heavy" | "Meeting-overloaded" | "Critical overload";
    if (meetingSharePct < 20) verdict = "Healthy balance";
    else if (meetingSharePct < 35) verdict = "Getting heavy";
    else if (meetingSharePct < 55) verdict = "Meeting-overloaded";
    else verdict = "Critical overload";

    return { perMeeting, totalYourHours, totalPersonHours, totalCost, meetingSharePct, remainingFocusHours, verdict };
  }, [meetings, avgHourlyCost, workHoursPerWeek]);

  function validate(): string[] {
    const problems: string[] = [];
    if (meetings.length === 0) problems.push("Add at least one recurring meeting.");
    meetings.forEach((m, i) => {
      if (!m.name.trim()) problems.push(`Meeting #${i + 1} needs a name.`);
    });
    return problems;
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const problems = validate();
    setErrors(problems);
    setSubmitted(true);
  }

  function money(n: number) {
    return `${symbol}${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  }

  const verdictStyles: Record<string, string> = {
    "Healthy balance": "bg-emerald-50 text-emerald-800 border-emerald-300",
    "Getting heavy": "bg-lime-50 text-lime-800 border-lime-300",
    "Meeting-overloaded": "bg-amber-50 text-amber-800 border-amber-300",
    "Critical overload": "bg-rose-50 text-rose-800 border-rose-300",
  };

  return (
    <main className="min-h-screen bg-stone-50 text-stone-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Meeting Overload Calculator",
            applicationCategory: "BusinessApplication",
            operatingSystem: "Any",
            description:
              "Calculate how many hours and how much money recurring meetings cost each week, and how much focus time is left.",
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
            Meeting Overload Calculator
          </h1>
          <p className="mt-3 max-w-2xl text-stone-600">
            List your recurring meetings to see exactly how many hours —
            and how much money — they consume each week, and how much
            genuine focus time you have left.
          </p>
        </header>

        <form onSubmit={onSubmit} noValidate className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-8">
          <div className="grid gap-5 sm:grid-cols-3">
            <div>
              <label htmlFor="workHoursPerWeek" className="block text-sm font-semibold text-stone-800">
                Working hours per week
              </label>
              <input
                id="workHoursPerWeek"
                type="number"
                min={1}
                inputMode="decimal"
                value={workHoursPerWeek}
                onChange={(e) => setWorkHoursPerWeek(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              />
            </div>
            <div>
              <label htmlFor="avgHourlyCost" className="block text-sm font-semibold text-stone-800">
                Avg. hourly cost per attendee
              </label>
              <input
                id="avgHourlyCost"
                type="number"
                min={0}
                inputMode="decimal"
                value={avgHourlyCost}
                onChange={(e) => setAvgHourlyCost(e.target.value)}
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

          <div className="mt-7">
            <h2 className="text-sm font-semibold text-stone-800">Recurring meetings</h2>
            <div className="mt-3 space-y-3">
              {meetings.map((m, i) => (
                <div key={m.id} className="grid grid-cols-2 gap-3 rounded-lg border border-stone-200 p-3 sm:grid-cols-12 sm:items-end">
                  <div className="col-span-2 sm:col-span-4">
                    <label htmlFor={`name-${m.id}`} className="block text-xs font-medium text-stone-600">
                      Meeting name
                    </label>
                    <input
                      id={`name-${m.id}`}
                      type="text"
                      value={m.name}
                      onChange={(e) => updateMeeting(m.id, "name", e.target.value)}
                      placeholder={`Meeting #${i + 1}`}
                      className="mt-1 w-full rounded-md border border-stone-300 px-2 py-1.5 text-sm focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor={`dur-${m.id}`} className="block text-xs font-medium text-stone-600">
                      Duration (min)
                    </label>
                    <input
                      id={`dur-${m.id}`}
                      type="number"
                      min={0}
                      inputMode="decimal"
                      value={m.durationMin}
                      onChange={(e) => updateMeeting(m.id, "durationMin", e.target.value)}
                      className="mt-1 w-full rounded-md border border-stone-300 px-2 py-1.5 text-sm focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor={`freq-${m.id}`} className="block text-xs font-medium text-stone-600">
                      Times/week
                    </label>
                    <input
                      id={`freq-${m.id}`}
                      type="number"
                      min={0}
                      inputMode="decimal"
                      value={m.perWeek}
                      onChange={(e) => updateMeeting(m.id, "perWeek", e.target.value)}
                      className="mt-1 w-full rounded-md border border-stone-300 px-2 py-1.5 text-sm focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor={`att-${m.id}`} className="block text-xs font-medium text-stone-600">
                      Attendees
                    </label>
                    <input
                      id={`att-${m.id}`}
                      type="number"
                      min={1}
                      inputMode="numeric"
                      value={m.attendees}
                      onChange={(e) => updateMeeting(m.id, "attendees", e.target.value)}
                      className="mt-1 w-full rounded-md border border-stone-300 px-2 py-1.5 text-sm focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                    />
                  </div>
                  <div className="col-span-2 flex items-end sm:col-span-2">
                    <button
                      type="button"
                      onClick={() => removeMeeting(m.id)}
                      className="w-full rounded-md border border-rose-300 px-2 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-50"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addMeeting}
              className="mt-3 rounded-lg border border-emerald-300 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
            >
              + Add meeting
            </button>
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
            Calculate meeting load
          </button>
        </form>

        {submitted && errors.length === 0 && (
          <section aria-live="polite" className="mt-8 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-8">
            <h2 className="text-xl font-bold text-stone-900">Your meeting load</h2>

            <div className={`mt-4 rounded-xl border px-4 py-3 text-sm font-semibold ${verdictStyles[result.verdict]}`}>
              {result.verdict} — {result.meetingSharePct.toFixed(0)}% of your work week is meetings
            </div>

            <dl className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg bg-stone-50 p-4">
                <dt className="text-xs font-medium uppercase text-stone-500">Your hours in meetings/week</dt>
                <dd className="mt-1 text-lg font-bold text-stone-900">{result.totalYourHours.toFixed(1)} hrs</dd>
              </div>
              <div className="rounded-lg bg-stone-50 p-4">
                <dt className="text-xs font-medium uppercase text-stone-500">Remaining focus time/week</dt>
                <dd className="mt-1 text-lg font-bold text-stone-900">{result.remainingFocusHours.toFixed(1)} hrs</dd>
              </div>
              <div className="rounded-lg bg-stone-50 p-4">
                <dt className="text-xs font-medium uppercase text-stone-500">Total attendee-hours/week</dt>
                <dd className="mt-1 text-lg font-bold text-stone-900">{result.totalPersonHours.toFixed(1)} hrs</dd>
              </div>
              <div className="rounded-lg bg-stone-50 p-4">
                <dt className="text-xs font-medium uppercase text-stone-500">Estimated weekly meeting cost</dt>
                <dd className="mt-1 text-lg font-bold text-stone-900">{money(result.totalCost)}</dd>
              </div>
            </dl>

            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[420px] border-collapse text-sm">
                <caption className="mb-2 text-left text-xs font-medium uppercase text-stone-500">
                  Breakdown by meeting
                </caption>
                <thead>
                  <tr className="border-b border-stone-200 text-left text-xs uppercase text-stone-500">
                    <th scope="col" className="py-2 pr-3">Meeting</th>
                    <th scope="col" className="py-2 pr-3">Your hrs/week</th>
                    <th scope="col" className="py-2">Weekly cost</th>
                  </tr>
                </thead>
                <tbody>
                  {result.perMeeting.map((m) => (
                    <tr key={m.id} className="border-b border-stone-100">
                      <td className="py-2 pr-3 font-medium text-stone-800">{m.name || "Untitled meeting"}</td>
                      <td className="py-2 pr-3">{m.yourHoursPerWeek.toFixed(2)}</td>
                      <td className="py-2">{money(m.costPerWeek)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="mt-5 text-sm leading-relaxed text-stone-600">
              Weekly cost is estimated as total attendee-hours × your entered
              average hourly cost per attendee — a simplified stand-in for
              blended salary cost across a team, useful for comparison, not
              a payroll figure.
            </p>
          </section>
        )}
      </div>
    </main>
  );
}
