"use client";

/**
 * Remote Job Location & Timezone Checker
 * -------------------------------------------------------------
 * Next.js (App Router) client component. Suggested metadata:
 *
 * export const metadata = {
 *   title: "Remote Timezone Checker | Compare Your Hours With a Remote Employer",
 *   description:
 *     "Compare your timezone with a remote employer or team's timezone. See your live working-hour overlap and spot scheduling conflicts before you accept a role.",
 * };
 */

import { useMemo, useState } from "react";

const FALLBACK_ZONES = [
  "UTC", "America/Los_Angeles", "America/Denver", "America/Chicago",
  "America/New_York", "America/Sao_Paulo", "America/Mexico_City",
  "Europe/London", "Europe/Lisbon", "Europe/Paris", "Europe/Berlin",
  "Europe/Warsaw", "Europe/Athens", "Europe/Moscow", "Africa/Lagos",
  "Africa/Cairo", "Africa/Johannesburg", "Asia/Dubai", "Asia/Karachi",
  "Asia/Kolkata", "Asia/Dhaka", "Asia/Bangkok", "Asia/Jakarta",
  "Asia/Singapore", "Asia/Shanghai", "Asia/Tokyo", "Asia/Seoul",
  "Australia/Perth", "Australia/Sydney", "Pacific/Auckland",
];

function getTimeZoneList(): string[] {
  try {
    // @ts-ignore - supportedValuesOf may not exist in older TS lib targets
    if (typeof Intl !== "undefined" && typeof (Intl as any).supportedValuesOf === "function") {
      // @ts-ignore
      const zones = (Intl as any).supportedValuesOf("timeZone") as string[];
      if (zones && zones.length > 0) return zones;
    }
  } catch {
    // fall through to fallback list
  }
  return FALLBACK_ZONES;
}

function getOffsetMinutes(timeZone: string, date: Date): number {
  try {
    const dtf = new Intl.DateTimeFormat("en-US", {
      timeZone,
      timeZoneName: "shortOffset",
    });
    const parts = dtf.formatToParts(date);
    const tzPart = parts.find((p) => p.type === "timeZoneName")?.value ?? "GMT+0";
    const match = tzPart.match(/GMT([+-])(\d{1,2})(?::?(\d{2}))?/);
    if (!match) return 0;
    const sign = match[1] === "-" ? -1 : 1;
    const hours = parseInt(match[2], 10);
    const mins = match[3] ? parseInt(match[3], 10) : 0;
    return sign * (hours * 60 + mins);
  } catch {
    return 0;
  }
}

function timeToMinutes(t: string): number {
  const [h, m] = t.split(":").map((n) => parseInt(n, 10));
  return (h || 0) * 60 + (m || 0);
}

function minutesToTime(mins: number): string {
  const normalized = ((mins % 1440) + 1440) % 1440;
  const h = Math.floor(normalized / 60);
  const m = normalized % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function overlapWindow(aStart: number, aEnd: number, bStart: number, bEnd: number) {
  let best = { minutes: 0, start: 0, end: 0 };
  for (const shift of [-1440, 0, 1440]) {
    const s = Math.max(aStart, bStart + shift);
    const e = Math.min(aEnd, bEnd + shift);
    const len = Math.max(0, e - s);
    if (len > best.minutes) best = { minutes: len, start: s, end: e };
  }
  return best;
}

export function RemoteTimezoneChecker() {
  const zones = useMemo(getTimeZoneList, []);
  const [myZone, setMyZone] = useState(
    () => Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC"
  );
  const [theirZone, setTheirZone] = useState("America/New_York");
  const [myStart, setMyStart] = useState("09:00");
  const [myEnd, setMyEnd] = useState("17:00");
  const [theirStart, setTheirStart] = useState("09:00");
  const [theirEnd, setTheirEnd] = useState("17:00");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const result = useMemo(() => {
    const now = new Date();
    const myOffset = getOffsetMinutes(myZone, now);
    const theirOffset = getOffsetMinutes(theirZone, now);
    const diffMinutes = myOffset - theirOffset;

    const myStartMin = timeToMinutes(myStart);
    const myEndMin = timeToMinutes(myEnd);
    const theirStartMin = timeToMinutes(theirStart);
    const theirEndMin = timeToMinutes(theirEnd);

    // Convert both local windows into a shared UTC-minutes frame
    const myUtcStart = myStartMin - myOffset;
    const myUtcEnd = myEndMin - myOffset;
    const theirUtcStart = theirStartMin - theirOffset;
    const theirUtcEnd = theirEndMin - theirOffset;

    const overlap = overlapWindow(myUtcStart, myUtcEnd, theirUtcStart, theirUtcEnd);
    const overlapHours = overlap.minutes / 60;

    const overlapStartMine = minutesToTime(overlap.start + myOffset);
    const overlapEndMine = minutesToTime(overlap.end + myOffset);
    const overlapStartTheirs = minutesToTime(overlap.start + theirOffset);
    const overlapEndTheirs = minutesToTime(overlap.end + theirOffset);

    let verdict: "Excellent overlap" | "Workable overlap" | "Limited overlap" | "Almost no overlap";
    if (overlapHours >= 5) verdict = "Excellent overlap";
    else if (overlapHours >= 3) verdict = "Workable overlap";
    else if (overlapHours > 0) verdict = "Limited overlap";
    else verdict = "Almost no overlap";

    return {
      diffHours: diffMinutes / 60,
      overlapHours,
      overlapStartMine,
      overlapEndMine,
      overlapStartTheirs,
      overlapEndTheirs,
      verdict,
    };
  }, [myZone, theirZone, myStart, myEnd, theirStart, theirEnd]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (timeToMinutes(myEnd) <= timeToMinutes(myStart)) {
      setError("Your working end time must be after your start time.");
      setSubmitted(false);
      return;
    }
    if (timeToMinutes(theirEnd) <= timeToMinutes(theirStart)) {
      setError("Their working end time must be after their start time.");
      setSubmitted(false);
      return;
    }
    setError("");
    setSubmitted(true);
  }

  const verdictStyles: Record<string, string> = {
    "Excellent overlap": "bg-emerald-50 text-emerald-800 border-emerald-300",
    "Workable overlap": "bg-lime-50 text-lime-800 border-lime-300",
    "Limited overlap": "bg-amber-50 text-amber-800 border-amber-300",
    "Almost no overlap": "bg-rose-50 text-rose-800 border-rose-300",
  };

  return (
    <main className="min-h-screen bg-stone-50 text-stone-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Remote Job Location & Timezone Checker",
            applicationCategory: "UtilitiesApplication",
            operatingSystem: "Any",
            description:
              "Compare your timezone with a remote employer's timezone and see your working-hour overlap instantly.",
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
            Remote Timezone Checker
          </h1>
          <p className="mt-3 max-w-2xl text-stone-600">
            Compare your timezone and working hours with a remote employer
            or team's timezone to see exactly how many hours you'd realistically
            overlap for meetings and collaboration.
          </p>
        </header>

        <form onSubmit={onSubmit} className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-8">
          <div className="grid gap-6 sm:grid-cols-2">
            <fieldset className="rounded-xl border border-stone-200 p-4">
              <legend className="px-1 text-sm font-semibold text-stone-800">Your details</legend>
              <label htmlFor="myZone" className="mt-2 block text-sm font-medium text-stone-700">
                Your timezone
              </label>
              <select
                id="myZone"
                value={myZone}
                onChange={(e) => setMyZone(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              >
                {zones.map((z) => (
                  <option key={z} value={z}>{z.replace(/_/g, " ")}</option>
                ))}
              </select>

              <div className="mt-3 grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="myStart" className="block text-xs font-medium text-stone-600">
                    Work start
                  </label>
                  <input
                    id="myStart"
                    type="time"
                    value={myStart}
                    onChange={(e) => setMyStart(e.target.value)}
                    className="mt-1 w-full rounded-md border border-stone-300 px-2 py-1.5 text-sm focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  />
                </div>
                <div>
                  <label htmlFor="myEnd" className="block text-xs font-medium text-stone-600">
                    Work end
                  </label>
                  <input
                    id="myEnd"
                    type="time"
                    value={myEnd}
                    onChange={(e) => setMyEnd(e.target.value)}
                    className="mt-1 w-full rounded-md border border-stone-300 px-2 py-1.5 text-sm focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  />
                </div>
              </div>
            </fieldset>

            <fieldset className="rounded-xl border border-stone-200 p-4">
              <legend className="px-1 text-sm font-semibold text-stone-800">Employer / team details</legend>
              <label htmlFor="theirZone" className="mt-2 block text-sm font-medium text-stone-700">
                Their timezone
              </label>
              <select
                id="theirZone"
                value={theirZone}
                onChange={(e) => setTheirZone(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              >
                {zones.map((z) => (
                  <option key={z} value={z}>{z.replace(/_/g, " ")}</option>
                ))}
              </select>

              <div className="mt-3 grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="theirStart" className="block text-xs font-medium text-stone-600">
                    Work start
                  </label>
                  <input
                    id="theirStart"
                    type="time"
                    value={theirStart}
                    onChange={(e) => setTheirStart(e.target.value)}
                    className="mt-1 w-full rounded-md border border-stone-300 px-2 py-1.5 text-sm focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  />
                </div>
                <div>
                  <label htmlFor="theirEnd" className="block text-xs font-medium text-stone-600">
                    Work end
                  </label>
                  <input
                    id="theirEnd"
                    type="time"
                    value={theirEnd}
                    onChange={(e) => setTheirEnd(e.target.value)}
                    className="mt-1 w-full rounded-md border border-stone-300 px-2 py-1.5 text-sm focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  />
                </div>
              </div>
            </fieldset>
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
            Compare timezones
          </button>
        </form>

        {submitted && !error && (
          <section aria-live="polite" className="mt-8 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-8">
            <h2 className="text-xl font-bold text-stone-900">Your overlap results</h2>

            <div className={`mt-4 rounded-xl border px-4 py-3 text-sm font-semibold ${verdictStyles[result.verdict]}`}>
              {result.verdict}: {result.overlapHours.toFixed(1)} hours of shared working time per day
            </div>

            <dl className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg bg-stone-50 p-4">
                <dt className="text-xs font-medium uppercase text-stone-500">Time difference</dt>
                <dd className="mt-1 text-lg font-bold text-stone-900">
                  {result.diffHours === 0
                    ? "Same time"
                    : `${Math.abs(result.diffHours)} hour${Math.abs(result.diffHours) !== 1 ? "s" : ""} ${result.diffHours > 0 ? "ahead" : "behind"}`}
                </dd>
              </div>
              <div className="rounded-lg bg-stone-50 p-4">
                <dt className="text-xs font-medium uppercase text-stone-500">Overlap duration</dt>
                <dd className="mt-1 text-lg font-bold text-stone-900">
                  {result.overlapHours.toFixed(1)} hrs/day
                </dd>
              </div>
              <div className="rounded-lg bg-stone-50 p-4">
                <dt className="text-xs font-medium uppercase text-stone-500">Overlap window (your time)</dt>
                <dd className="mt-1 text-lg font-bold text-stone-900">
                  {result.overlapHours > 0 ? `${result.overlapStartMine} – ${result.overlapEndMine}` : "None"}
                </dd>
              </div>
              <div className="rounded-lg bg-stone-50 p-4">
                <dt className="text-xs font-medium uppercase text-stone-500">Overlap window (their time)</dt>
                <dd className="mt-1 text-lg font-bold text-stone-900">
                  {result.overlapHours > 0 ? `${result.overlapStartTheirs} – ${result.overlapEndTheirs}` : "None"}
                </dd>
              </div>
            </dl>

            <p className="mt-5 text-sm leading-relaxed text-stone-600">
              Overlap is calculated using each timezone's current UTC offset,
              including daylight saving time where applicable today. Offsets
              can shift on daylight-saving transition dates in either
              location, so recheck around those dates.
            </p>
          </section>
        )}
      </div>
    </main>
  );
}
