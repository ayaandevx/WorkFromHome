"use client";

import { useMemo, useState } from "react";
import { track } from "@/lib/analytics";

export function RateCalculator() {
  const [targetIncome, setTargetIncome] = useState(80000);
  const [workWeeks, setWorkWeeks] = useState(48);
  const [hoursPerWeek, setHoursPerWeek] = useState(35);
  const [billableRatio, setBillableRatio] = useState(70);
  const [overheadMonthly, setOverheadMonthly] = useState(400);
  const [bufferPercent, setBufferPercent] = useState(15);

  const result = useMemo(() => {
    const totalHours = workWeeks * hoursPerWeek;
    const billableHours = totalHours * (billableRatio / 100);
    const annualOverhead = overheadMonthly * 12;
    const baseNeeded = targetIncome + annualOverhead;
    const withBuffer = baseNeeded * (1 + bufferPercent / 100);
    const hourlyRate = billableHours > 0 ? withBuffer / billableHours : 0;
    const dayRate = hourlyRate * 8;
    return { billableHours, hourlyRate, dayRate, withBuffer };
  }, [targetIncome, workWeeks, hoursPerWeek, billableRatio, overheadMonthly, bufferPercent]);

  function handleChange<T>(setter: (v: T) => void, value: T) {
    setter(value);
    track({ name: "tool_usage", toolSlug: "freelance-rate-calculator", action: "adjust" });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-5">
        <Field label="Target annual income" prefix="$" value={targetIncome} onChange={(v) => handleChange(setTargetIncome, v)} min={0} step={1000} />
        <Field label="Working weeks per year" value={workWeeks} onChange={(v) => handleChange(setWorkWeeks, v)} min={1} max={52} />
        <Field label="Hours available per week" value={hoursPerWeek} onChange={(v) => handleChange(setHoursPerWeek, v)} min={1} max={80} />
        <Field label="Billable ratio (%)" value={billableRatio} onChange={(v) => handleChange(setBillableRatio, v)} min={1} max={100} suffix="%" />
        <Field label="Monthly overhead" prefix="$" value={overheadMonthly} onChange={(v) => handleChange(setOverheadMonthly, v)} min={0} step={50} />
        <Field label="Buffer / margin (%)" value={bufferPercent} onChange={(v) => handleChange(setBufferPercent, v)} min={0} max={100} suffix="%" />
      </div>

      <div className="rounded-lg border border-border bg-paper-raised p-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">Your target rate</p>
        <p className="mt-2 font-mono text-4xl font-semibold text-ink">
          ${result.hourlyRate.toFixed(0)}
          <span className="text-lg text-text-muted">/hr</span>
        </p>
        <p className="mt-1 font-mono text-lg text-text-muted">≈ ${result.dayRate.toFixed(0)}/day</p>

        <dl className="mt-6 space-y-2 border-t border-border pt-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-text-muted">Billable hours/year</dt>
            <dd className="font-mono text-text">{result.billableHours.toFixed(0)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-text-muted">Income + overhead + buffer</dt>
            <dd className="font-mono text-text">${result.withBuffer.toFixed(0)}</dd>
          </div>
        </dl>

        <p className="mt-6 text-xs text-text-muted">
          This is a planning estimate, not tax or financial advice. Adjust for your local tax obligations and market rate.
        </p>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  prefix,
  suffix,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  prefix?: string;
  suffix?: string;
}) {
  const id = `field-${label.replace(/\s+/g, "-").toLowerCase()}`;
  return (
    <div>
      <label htmlFor={id} className="mb-1 flex items-center justify-between text-sm font-medium text-text">
        <span>{label}</span>
        <span className="font-mono text-text-muted">
          {prefix}
          {value}
          {suffix}
        </span>
      </label>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-amber"
      />
    </div>
  );
}
