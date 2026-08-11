"use client";

/**
 * WFH Electricity Cost Calculator
 * -------------------------------------------------------------
 * Next.js (App Router) client component. Suggested metadata:
 *
 * export const metadata = {
 *   title: "WFH Electricity Cost Calculator | Estimate Your Home Office Power Bill",
 *   description:
 *     "Calculate the estimated electricity cost of working from home based on your devices, wattage, hours of use, electricity rate, and working days per week.",
 * };
 */

import { useMemo, useState } from "react";

interface Device {
  id: string;
  name: string;
  watts: string;
  hoursPerDay: string;
  quantity: string;
}

let idCounter = 0;
function newId() {
  idCounter += 1;
  return `device-${idCounter}-${Date.now()}`;
}

const DEFAULT_DEVICES: Device[] = [
  { id: newId(), name: "Laptop", watts: "65", hoursPerDay: "8", quantity: "1" },
  { id: newId(), name: "External monitor", watts: "30", hoursPerDay: "8", quantity: "1" },
  { id: newId(), name: "Wi-Fi router", watts: "10", hoursPerDay: "24", quantity: "1" },
  { id: newId(), name: "Desk lamp / lighting", watts: "12", hoursPerDay: "6", quantity: "1" },
  { id: newId(), name: "Air conditioner / heater", watts: "1200", hoursPerDay: "2", quantity: "1" },
];

function parseNum(v: string): number {
  const n = parseFloat(v);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

export  function WfhElectricityCostCalculator() {
  const [devices, setDevices] = useState<Device[]>(DEFAULT_DEVICES);
  const [ratePerKwh, setRatePerKwh] = useState("0.16");
  const [symbol, setSymbol] = useState("$");
  const [daysPerWeek, setDaysPerWeek] = useState("5");
  const [errors, setErrors] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  function updateDevice(id: string, key: keyof Device, value: string) {
    setDevices((list) =>
      list.map((d) => (d.id === id ? { ...d, [key]: value } : d))
    );
  }

  function addDevice() {
    setDevices((list) => [
      ...list,
      { id: newId(), name: "", watts: "", hoursPerDay: "", quantity: "1" },
    ]);
  }

  function removeDevice(id: string) {
    setDevices((list) => list.filter((d) => d.id !== id));
  }

  const result = useMemo(() => {
    const rate = parseNum(ratePerKwh);
    const days = Math.min(Math.max(parseNum(daysPerWeek), 0), 7);

    const perDevice = devices.map((d) => {
      const watts = parseNum(d.watts);
      const hours = parseNum(d.hoursPerDay);
      const qty = Math.max(parseNum(d.quantity) || 0, 0);
      const dailyKwh = (watts * hours * qty) / 1000;
      const dailyCost = dailyKwh * rate;
      const weeklyCost = dailyCost * days;
      const monthlyCost = weeklyCost * (52 / 12);
      const annualCost = weeklyCost * 52;
      return { ...d, dailyKwh, dailyCost, weeklyCost, monthlyCost, annualCost };
    });

    const totals = perDevice.reduce(
      (acc, d) => ({
        dailyKwh: acc.dailyKwh + d.dailyKwh,
        dailyCost: acc.dailyCost + d.dailyCost,
        weeklyCost: acc.weeklyCost + d.weeklyCost,
        monthlyCost: acc.monthlyCost + d.monthlyCost,
        annualCost: acc.annualCost + d.annualCost,
      }),
      { dailyKwh: 0, dailyCost: 0, weeklyCost: 0, monthlyCost: 0, annualCost: 0 }
    );

    return { perDevice, totals };
  }, [devices, ratePerKwh, daysPerWeek]);

  function validate(): string[] {
    const problems: string[] = [];
    if (devices.length === 0) problems.push("Add at least one device.");
    if (parseNum(ratePerKwh) <= 0)
      problems.push("Enter a valid electricity rate greater than 0.");
    devices.forEach((d, i) => {
      if (!d.name.trim())
        problems.push(`Device #${i + 1} needs a name.`);
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
    return `${symbol}${n.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  return (
    <main className="min-h-screen bg-stone-50 text-stone-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "WFH Electricity Cost Calculator",
            applicationCategory: "UtilitiesApplication",
            operatingSystem: "Any",
            description:
              "Calculate the estimated electricity cost of working from home based on devices, wattage, hours of use, electricity rate, and working days per week.",
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
            WFH Electricity Cost Calculator
          </h1>
          <p className="mt-3 max-w-2xl text-stone-600">
            Estimate how much working from home adds to your electricity
            bill. Add every device you run during work hours, its wattage,
            and how long it's on, then enter your local electricity rate.
          </p>
        </header>

        <form onSubmit={onSubmit} noValidate className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-8">
          <div className="grid gap-5 sm:grid-cols-3">
            <div>
              <label htmlFor="rate" className="block text-sm font-semibold text-stone-800">
                Electricity rate (per kWh)
              </label>
              <input
                id="rate"
                type="number"
                min={0}
                step="0.01"
                inputMode="decimal"
                value={ratePerKwh}
                onChange={(e) => setRatePerKwh(e.target.value)}
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
            <div>
              <label htmlFor="days" className="block text-sm font-semibold text-stone-800">
                Working days per week
              </label>
              <input
                id="days"
                type="number"
                min={0}
                max={7}
                inputMode="numeric"
                value={daysPerWeek}
                onChange={(e) => setDaysPerWeek(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              />
            </div>
          </div>

          <div className="mt-7">
            <h2 className="text-sm font-semibold text-stone-800">Devices</h2>
            <div className="mt-3 space-y-3">
              {devices.map((d, i) => (
                <div
                  key={d.id}
                  className="grid grid-cols-2 gap-3 rounded-lg border border-stone-200 p-3 sm:grid-cols-12 sm:items-end"
                >
                  <div className="col-span-2 sm:col-span-4">
                    <label htmlFor={`name-${d.id}`} className="block text-xs font-medium text-stone-600">
                      Device name
                    </label>
                    <input
                      id={`name-${d.id}`}
                      type="text"
                      value={d.name}
                      onChange={(e) => updateDevice(d.id, "name", e.target.value)}
                      placeholder={`Device #${i + 1}`}
                      className="mt-1 w-full rounded-md border border-stone-300 px-2 py-1.5 text-sm focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor={`watts-${d.id}`} className="block text-xs font-medium text-stone-600">
                      Watts
                    </label>
                    <input
                      id={`watts-${d.id}`}
                      type="number"
                      min={0}
                      inputMode="decimal"
                      value={d.watts}
                      onChange={(e) => updateDevice(d.id, "watts", e.target.value)}
                      className="mt-1 w-full rounded-md border border-stone-300 px-2 py-1.5 text-sm focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor={`hours-${d.id}`} className="block text-xs font-medium text-stone-600">
                      Hours/day
                    </label>
                    <input
                      id={`hours-${d.id}`}
                      type="number"
                      min={0}
                      max={24}
                      inputMode="decimal"
                      value={d.hoursPerDay}
                      onChange={(e) => updateDevice(d.id, "hoursPerDay", e.target.value)}
                      className="mt-1 w-full rounded-md border border-stone-300 px-2 py-1.5 text-sm focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor={`qty-${d.id}`} className="block text-xs font-medium text-stone-600">
                      Quantity
                    </label>
                    <input
                      id={`qty-${d.id}`}
                      type="number"
                      min={0}
                      inputMode="numeric"
                      value={d.quantity}
                      onChange={(e) => updateDevice(d.id, "quantity", e.target.value)}
                      className="mt-1 w-full rounded-md border border-stone-300 px-2 py-1.5 text-sm focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                    />
                  </div>
                  <div className="col-span-2 flex items-end sm:col-span-2">
                    <button
                      type="button"
                      onClick={() => removeDevice(d.id)}
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
              onClick={addDevice}
              className="mt-3 rounded-lg border border-emerald-300 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
            >
              + Add another device
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
            Calculate electricity cost
          </button>
        </form>

        {submitted && errors.length === 0 && (
          <section aria-live="polite" className="mt-8 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-8">
            <h2 className="text-xl font-bold text-stone-900">Your estimated electricity cost</h2>

            <dl className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg bg-stone-50 p-4">
                <dt className="text-xs font-medium uppercase text-stone-500">Daily cost</dt>
                <dd className="mt-1 text-lg font-bold text-stone-900">{money(result.totals.dailyCost)}</dd>
              </div>
              <div className="rounded-lg bg-stone-50 p-4">
                <dt className="text-xs font-medium uppercase text-stone-500">Weekly cost</dt>
                <dd className="mt-1 text-lg font-bold text-stone-900">{money(result.totals.weeklyCost)}</dd>
              </div>
              <div className="rounded-lg bg-stone-50 p-4">
                <dt className="text-xs font-medium uppercase text-stone-500">Monthly cost</dt>
                <dd className="mt-1 text-lg font-bold text-stone-900">{money(result.totals.monthlyCost)}</dd>
              </div>
              <div className="rounded-lg bg-stone-50 p-4">
                <dt className="text-xs font-medium uppercase text-stone-500">Annual cost</dt>
                <dd className="mt-1 text-lg font-bold text-stone-900">{money(result.totals.annualCost)}</dd>
              </div>
            </dl>

            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[480px] border-collapse text-sm">
                <caption className="mb-2 text-left text-xs font-medium uppercase text-stone-500">
                  Cost breakdown by device
                </caption>
                <thead>
                  <tr className="border-b border-stone-200 text-left text-xs uppercase text-stone-500">
                    <th scope="col" className="py-2 pr-3">Device</th>
                    <th scope="col" className="py-2 pr-3">Daily kWh</th>
                    <th scope="col" className="py-2 pr-3">Monthly cost</th>
                    <th scope="col" className="py-2">Annual cost</th>
                  </tr>
                </thead>
                <tbody>
                  {result.perDevice.map((d) => (
                    <tr key={d.id} className="border-b border-stone-100">
                      <td className="py-2 pr-3 font-medium text-stone-800">{d.name || "Untitled device"}</td>
                      <td className="py-2 pr-3">{d.dailyKwh.toFixed(2)}</td>
                      <td className="py-2 pr-3">{money(d.monthlyCost)}</td>
                      <td className="py-2">{money(d.annualCost)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="mt-5 text-sm leading-relaxed text-stone-600">
              Formula used: (watts × hours per day × quantity ÷ 1000) ×
              electricity rate = daily cost per device, scaled to your
              working days per week. Actual utility bills vary with tiered
              rates, standing charges, and appliance efficiency — treat this
              as a planning estimate, not a guaranteed bill amount.
            </p>
          </section>
        )}
      </div>
    </main>
  );
}
