"use client";

import { useMemo, useState } from "react";
import { track } from "@/lib/analytics";

const COMMON_TIMEZONES = [
  "Pacific/Honolulu",
  "America/Anchorage",
  "America/Los_Angeles",
  "America/Denver",
  "America/Chicago",
  "America/New_York",
  "America/Sao_Paulo",
  "UTC",
  "Europe/London",
  "Europe/Lisbon",
  "Europe/Berlin",
  "Europe/Athens",
  "Africa/Johannesburg",
  "Asia/Dubai",
  "Asia/Kolkata",
  "Asia/Bangkok",
  "Asia/Singapore",
  "Asia/Shanghai",
  "Asia/Tokyo",
  "Australia/Sydney",
  "Pacific/Auckland",
];

function getOffsetMinutes(timeZone: string, at: Date): number {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
  const parts = Object.fromEntries(dtf.formatToParts(at).map((p) => [p.type, p.value]));
  const asUTC = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour),
    Number(parts.minute)
  );
  return Math.round((asUTC - at.getTime()) / 60000);
}

function formatOffset(minutes: number): string {
  const sign = minutes >= 0 ? "+" : "-";
  const abs = Math.abs(minutes);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  return `UTC${sign}${h}${m ? `:${String(m).padStart(2, "0")}` : ""}`;
}

const WORK_START_MIN = 9 * 60;
const WORK_END_MIN = 18 * 60;

export function TimezoneCalculator() {
  const [zones, setZones] = useState<string[]>(["America/New_York", "Europe/London", "Asia/Kolkata"]);
  const now = useMemo(() => new Date(), []);

  function addZone(tz: string) {
    if (!tz || zones.includes(tz)) return;
    setZones((z) => [...z, tz]);
    track({ name: "tool_usage", toolSlug: "timezone-meeting-calculator", action: "add_zone" });
  }
  function removeZone(tz: string) {
    setZones((z) => z.filter((x) => x !== tz));
  }

  const rows = zones.map((tz) => {
    const offset = getOffsetMinutes(tz, now);
    return { tz, offset, label: formatOffset(offset) };
  });

  // Overlap window: hours (in UTC minutes-of-day) where every zone is within its local 9am-6pm.
  const overlapHours: number[] = [];
  for (let utcHour = 0; utcHour < 24; utcHour++) {
    const utcMin = utcHour * 60;
    const allWithin = rows.every((r) => {
      const localMin = ((utcMin + r.offset) % 1440 + 1440) % 1440;
      return localMin >= WORK_START_MIN && localMin < WORK_END_MIN;
    });
    if (allWithin) overlapHours.push(utcHour);
  }

  return (
    <div>
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex-1 min-w-[220px]">
          <label htmlFor="tz-add" className="mb-1 block text-sm font-medium text-text">
            Add a time zone
          </label>
          <select
            id="tz-add"
            onChange={(e) => {
              addZone(e.target.value);
              e.target.value = "";
            }}
            defaultValue=""
            className="w-full rounded-md border border-border bg-paper-raised px-3 py-2 text-sm"
          >
            <option value="" disabled>
              Choose a city / region…
            </option>
            {COMMON_TIMEZONES.filter((tz) => !zones.includes(tz)).map((tz) => (
              <option key={tz} value={tz}>
                {tz.replace("_", " ")}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {rows.map((r) => (
          <div key={r.tz} className="flex items-center justify-between rounded-lg border border-border bg-paper-raised p-4">
            <div>
              <p className="font-medium text-text">{r.tz.replace("_", " ")}</p>
              <p className="font-mono text-sm text-text-muted">{r.label}</p>
            </div>
            <button
              type="button"
              onClick={() => removeZone(r.tz)}
              aria-label={`Remove ${r.tz}`}
              className="rounded-md border border-border px-2.5 py-1 text-xs text-text-muted hover:text-danger"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-lg border border-sage/40 bg-sage-light p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-sage">Overlap window (9am–6pm local, all zones)</p>
        {overlapHours.length === 0 ? (
          <p className="mt-2 text-sm text-text">
            No hour works for everyone&apos;s standard 9–6 day. Consider async updates or a rotating meeting time.
          </p>
        ) : (
          <p className="mt-2 font-mono text-lg text-ink">
            {overlapHours.length} hour{overlapHours.length > 1 ? "s" : ""} overlap, starting {String(overlapHours[0]).padStart(2, "0")}:00 UTC
          </p>
        )}
      </div>
    </div>
  );
}
