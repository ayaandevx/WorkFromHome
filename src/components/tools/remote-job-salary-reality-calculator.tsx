"use client";

/**
 * Remote Job Salary Reality Calculator
 * -------------------------------------------------------------
 * Drop this file into a Next.js (App Router) project, e.g.
 *   app/tools/remote-job-salary-reality-calculator/page.tsx
 * and wrap it with the metadata block below in that page's
 * parent layout or by re-exporting metadata from a sibling
 * server file, since "use client" files cannot export metadata.
 *
 * export const metadata = {
 *   title: "Remote Job Salary Reality Calculator | Is That Remote Salary Enough?",
 *   description:
 *     "Check whether a remote job salary realistically covers your cost of living. Enter your offer, rent, insurance, and expenses to see your true monthly surplus or shortfall.",
 * };
 */

import { useMemo, useState } from "react";

type Currency = "USD" | "EUR" | "GBP" | "INR" | "CAD" | "AUD" | "OTHER";

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  INR: "₹",
  CAD: "CA$",
  AUD: "AU$",
  OTHER: "",
};

interface FormState {
  annualSalary: string;
  currency: Currency;
  customSymbol: string;
  taxRatePct: string;
  rentMortgage: string;
  utilities: string;
  healthInsurance: string;
  internetTools: string;
  officeSetupOneTime: string;
  otherEssentials: string;
  coworkingSpace: string;
  commuteSavings: string;
}

const DEFAULTS: FormState = {
  annualSalary: "65000",
  currency: "USD",
  customSymbol: "",
  taxRatePct: "22",
  rentMortgage: "1400",
  utilities: "120",
  healthInsurance: "350",
  internetTools: "80",
  officeSetupOneTime: "600",
  otherEssentials: "900",
  coworkingSpace: "0",
  commuteSavings: "150",
};

function parseNum(v: string): number {
  const n = parseFloat(v);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

function formatMoney(n: number, symbol: string): string {
  const sign = n < 0 ? "-" : "";
  return `${sign}${symbol}${Math.abs(n).toLocaleString(undefined, {
    maximumFractionDigits: 0,
  })}`;
}

export function RemoteJobSalaryRealityCalculator() {
  const [form, setForm] = useState<FormState>(DEFAULTS);
  const [errors, setErrors] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const symbol =
    form.currency === "OTHER"
      ? form.customSymbol.trim() || "¤"
      : CURRENCY_SYMBOLS[form.currency];

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function validate(): string[] {
    const problems: string[] = [];
    if (!form.annualSalary || parseNum(form.annualSalary) <= 0) {
      problems.push("Enter a valid annual salary greater than 0.");
    }
    const tax = parseNum(form.taxRatePct);
    if (tax < 0 || tax > 70) {
      problems.push("Effective tax rate should be between 0% and 70%.");
    }
    return problems;
  }

  const result = useMemo(() => {
    const annualSalary = parseNum(form.annualSalary);
    const taxRate = Math.min(Math.max(parseNum(form.taxRatePct), 0), 70) / 100;

    const monthlyGross = annualSalary / 12;
    const monthlyTakeHome = monthlyGross * (1 - taxRate);

    const officeSetupMonthly = parseNum(form.officeSetupOneTime) / 12; // amortized over year 1
    const monthlyCosts =
      parseNum(form.rentMortgage) +
      parseNum(form.utilities) +
      parseNum(form.healthInsurance) +
      parseNum(form.internetTools) +
      officeSetupMonthly +
      parseNum(form.otherEssentials) +
      parseNum(form.coworkingSpace) -
      parseNum(form.commuteSavings);

    const surplus = monthlyTakeHome - monthlyCosts;
    const essentialsShare =
      monthlyTakeHome > 0 ? (monthlyCosts / monthlyTakeHome) * 100 : 0;
    const breakEvenAnnual =
      (monthlyCosts * 12) / Math.max(1 - taxRate, 0.01);

    let rating: "Comfortable" | "Tight" | "Not sustainable" | "Insufficient data";
    if (annualSalary <= 0) rating = "Insufficient data";
    else if (surplus >= monthlyTakeHome * 0.25) rating = "Comfortable";
    else if (surplus >= 0) rating = "Tight";
    else rating = "Not sustainable";

    return {
      monthlyGross,
      monthlyTakeHome,
      monthlyCosts,
      surplus,
      essentialsShare,
      breakEvenAnnual,
      rating,
    };
  }, [form]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const problems = validate();
    setErrors(problems);
    setSubmitted(true);
  }

  const ratingStyles: Record<string, string> = {
    Comfortable: "bg-emerald-50 text-emerald-800 border-emerald-300",
    Tight: "bg-amber-50 text-amber-800 border-amber-300",
    "Not sustainable": "bg-rose-50 text-rose-800 border-rose-300",
    "Insufficient data": "bg-stone-100 text-stone-700 border-stone-300",
  };

  return (
    <main className="min-h-screen bg-stone-50 text-stone-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Remote Job Salary Reality Calculator",
            applicationCategory: "FinanceApplication",
            operatingSystem: "Any",
            description:
              "Free calculator to check whether a remote job salary realistically covers your cost of living, factoring in taxes, housing, insurance, and home-office expenses.",
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
            Remote Job Salary Reality Calculator
          </h1>
          <p className="mt-3 max-w-2xl text-stone-600">
            A remote salary that sounds generous can still fall short once
            taxes, housing, insurance, and home-office costs are subtracted.
            Enter your numbers below to see your realistic monthly surplus or
            shortfall — not just the headline salary figure.
          </p>
        </header>

        <form
          onSubmit={onSubmit}
          noValidate
          className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-8"
        >
          <fieldset className="grid gap-5 sm:grid-cols-2">
            <legend className="sr-only">Salary and currency</legend>

            <div>
              <label
                htmlFor="annualSalary"
                className="block text-sm font-semibold text-stone-800"
              >
                Annual remote salary offered
              </label>
              <input
                id="annualSalary"
                type="number"
                min={0}
                inputMode="decimal"
                required
                value={form.annualSalary}
                onChange={(e) => update("annualSalary", e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              />
            </div>

            <div>
              <label
                htmlFor="currency"
                className="block text-sm font-semibold text-stone-800"
              >
                Currency
              </label>
              <select
                id="currency"
                value={form.currency}
                onChange={(e) => update("currency", e.target.value as Currency)}
                className="mt-1.5 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="INR">INR (₹)</option>
                <option value="CAD">CAD (CA$)</option>
                <option value="AUD">AUD (AU$)</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            {form.currency === "OTHER" && (
              <div>
                <label
                  htmlFor="customSymbol"
                  className="block text-sm font-semibold text-stone-800"
                >
                  Currency symbol
                </label>
                <input
                  id="customSymbol"
                  type="text"
                  maxLength={4}
                  value={form.customSymbol}
                  onChange={(e) => update("customSymbol", e.target.value)}
                  placeholder="e.g. R$"
                  className="mt-1.5 w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                />
              </div>
            )}

            <div>
              <label
                htmlFor="taxRatePct"
                className="block text-sm font-semibold text-stone-800"
              >
                Estimated effective tax rate (%)
              </label>
              <input
                id="taxRatePct"
                type="number"
                min={0}
                max={70}
                step="0.1"
                inputMode="decimal"
                value={form.taxRatePct}
                onChange={(e) => update("taxRatePct", e.target.value)}
                aria-describedby="taxHelp"
                className="mt-1.5 w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              />
              <p id="taxHelp" className="mt-1 text-xs text-stone-500">
                Rules vary by country/state. Use your last payslip or a local
                tax estimator for an accurate figure.
              </p>
            </div>
          </fieldset>

          <fieldset className="mt-6 grid gap-5 sm:grid-cols-2">
            <legend className="mb-1 text-sm font-semibold text-stone-800 sm:col-span-2">
              Monthly costs
            </legend>

            {[
              { key: "rentMortgage", label: "Rent / mortgage" },
              { key: "utilities", label: "Utilities (incl. extra WFH usage)" },
              { key: "healthInsurance", label: "Health insurance (self-paid)" },
              { key: "internetTools", label: "Internet & work tools/software" },
              { key: "coworkingSpace", label: "Coworking space (if any)" },
              { key: "otherEssentials", label: "Other essentials (food, transport, etc.)" },
            ].map(({ key, label }) => (
              <div key={key}>
                <label
                  htmlFor={key}
                  className="block text-sm font-medium text-stone-700"
                >
                  {label}
                </label>
                <input
                  id={key}
                  type="number"
                  min={0}
                  inputMode="decimal"
                  value={form[key as keyof FormState] as string}
                  onChange={(e) =>
                    update(key as keyof FormState, e.target.value as never)
                  }
                  className="mt-1.5 w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                />
              </div>
            ))}

            <div>
              <label
                htmlFor="officeSetupOneTime"
                className="block text-sm font-medium text-stone-700"
              >
                One-time home office setup cost
              </label>
              <input
                id="officeSetupOneTime"
                type="number"
                min={0}
                inputMode="decimal"
                value={form.officeSetupOneTime}
                onChange={(e) => update("officeSetupOneTime", e.target.value)}
                aria-describedby="setupHelp"
                className="mt-1.5 w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              />
              <p id="setupHelp" className="mt-1 text-xs text-stone-500">
                Spread across 12 months in the calculation below.
              </p>
            </div>

            <div>
              <label
                htmlFor="commuteSavings"
                className="block text-sm font-medium text-stone-700"
              >
                Monthly commute savings (offset)
              </label>
              <input
                id="commuteSavings"
                type="number"
                min={0}
                inputMode="decimal"
                value={form.commuteSavings}
                onChange={(e) => update("commuteSavings", e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              />
            </div>
          </fieldset>

          {errors.length > 0 && (
            <div
              role="alert"
              className="mt-6 rounded-lg border border-rose-300 bg-rose-50 p-3 text-sm text-rose-800"
            >
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
            Calculate my reality check
          </button>
        </form>

        {submitted && errors.length === 0 && (
          <section
            aria-live="polite"
            className="mt-8 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-8"
          >
            <h2 className="text-xl font-bold text-stone-900">Your results</h2>

            <div
              className={`mt-4 rounded-xl border px-4 py-3 text-sm font-semibold ${ratingStyles[result.rating]}`}
            >
              Verdict: {result.rating}
            </div>

            <dl className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg bg-stone-50 p-4">
                <dt className="text-xs font-medium uppercase text-stone-500">
                  Estimated monthly take-home
                </dt>
                <dd className="mt-1 text-lg font-bold text-stone-900">
                  {formatMoney(result.monthlyTakeHome, symbol)}
                </dd>
              </div>
              <div className="rounded-lg bg-stone-50 p-4">
                <dt className="text-xs font-medium uppercase text-stone-500">
                  Total monthly costs entered
                </dt>
                <dd className="mt-1 text-lg font-bold text-stone-900">
                  {formatMoney(result.monthlyCosts, symbol)}
                </dd>
              </div>
              <div className="rounded-lg bg-stone-50 p-4">
                <dt className="text-xs font-medium uppercase text-stone-500">
                  Monthly surplus / shortfall
                </dt>
                <dd
                  className={`mt-1 text-lg font-bold ${result.surplus >= 0 ? "text-emerald-700" : "text-rose-700"}`}
                >
                  {formatMoney(result.surplus, symbol)}
                </dd>
              </div>
              <div className="rounded-lg bg-stone-50 p-4">
                <dt className="text-xs font-medium uppercase text-stone-500">
                  Share of take-home spent on costs
                </dt>
                <dd className="mt-1 text-lg font-bold text-stone-900">
                  {result.essentialsShare.toFixed(0)}%
                </dd>
              </div>
              <div className="rounded-lg bg-stone-50 p-4 sm:col-span-2">
                <dt className="text-xs font-medium uppercase text-stone-500">
                  Annual salary needed to break even on these costs
                </dt>
                <dd className="mt-1 text-lg font-bold text-stone-900">
                  {formatMoney(result.breakEvenAnnual, symbol)}
                </dd>
              </div>
            </dl>

            <p className="mt-5 text-sm leading-relaxed text-stone-600">
              This estimate spreads your one-time office setup cost over 12
              months and treats commute savings as an offset to monthly
              costs. Tax rules, insurance requirements, and cost of living
              vary significantly by country, state, and city — verify tax
              figures with an official calculator or accountant before making
              a decision based on this tool. Figures shown are estimates for
              planning purposes only, not guaranteed take-home pay.
            </p>
          </section>
        )}

        <section className="mt-10 border-t border-stone-200 pt-6 text-sm text-stone-600">
          <h2 className="text-base font-semibold text-stone-800">
            How this calculator works
          </h2>
          <p className="mt-2">
            The calculator subtracts your estimated tax rate from the
            offered annual salary to find monthly take-home pay, then
            subtracts your entered monthly living and work costs (with
            one-time setup costs spread across a year) to find your true
            monthly surplus. A rating of "Comfortable" means your surplus is
            at least 25% of take-home pay; "Tight" means you break even with
            little buffer; "Not sustainable" means costs exceed take-home
            pay.
          </p>
        </section>
      </div>
    </main>
  );
}
