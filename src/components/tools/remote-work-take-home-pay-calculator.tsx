"use client";

/**
 * Remote Work Take-Home Pay Calculator
 * -------------------------------------------------------------
 * Next.js (App Router) client component. Suggested metadata:
 *
 * export const metadata = {
 *   title: "Remote Work Take-Home Pay Calculator | Real Net Pay After Expenses",
 *   description:
 *     "Estimate your true take-home pay from a remote job after taxes, pre-tax deductions, benefits, and remote-work expenses like internet, equipment, and a home office stipend.",
 * };
 */

import { useMemo, useState } from "react";

type Frequency = "weekly" | "biweekly" | "monthly" | "annual";

const PERIODS_PER_YEAR: Record<Frequency, number> = {
  weekly: 52,
  biweekly: 26,
  monthly: 12,
  annual: 1,
};

const FREQUENCY_LABEL: Record<Frequency, string> = {
  weekly: "Weekly",
  biweekly: "Bi-weekly",
  monthly: "Monthly",
  annual: "Annual",
};

function parseNum(v: string): number {
  const n = parseFloat(v);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

export function RemoteWorkTakeHomePayCalculator() {
  const [grossAnnual, setGrossAnnual] = useState("70000");
  const [symbol, setSymbol] = useState("$");
  const [payFrequency, setPayFrequency] = useState<Frequency>("monthly");
  const [taxRatePct, setTaxRatePct] = useState("24");
  const [retirementPct, setRetirementPct] = useState("5");
  const [healthInsuranceMonthly, setHealthInsuranceMonthly] = useState("250");
  const [otherPreTaxMonthly, setOtherPreTaxMonthly] = useState("0");
  const [postTaxBenefitsMonthly, setPostTaxBenefitsMonthly] = useState("0");
  const [remoteExpensesMonthly, setRemoteExpensesMonthly] = useState("150");
  const [employerStipendMonthly, setEmployerStipendMonthly] = useState("50");
  const [errors, setErrors] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const result = useMemo(() => {
    const gross = parseNum(grossAnnual);
    const tax = Math.min(Math.max(parseNum(taxRatePct), 0), 70) / 100;
    const retirement = Math.min(Math.max(parseNum(retirementPct), 0), 100) / 100;

    const retirementAnnual = gross * retirement;
    const healthInsuranceAnnual = parseNum(healthInsuranceMonthly) * 12;
    const otherPreTaxAnnual = parseNum(otherPreTaxMonthly) * 12;

    const preTaxDeductionsAnnual =
      retirementAnnual + healthInsuranceAnnual + otherPreTaxAnnual;
    const taxableIncome = Math.max(gross - preTaxDeductionsAnnual, 0);
    const taxAnnual = taxableIncome * tax;
    const netAfterTaxAnnual = taxableIncome - taxAnnual;

    const postTaxBenefitsAnnual = parseNum(postTaxBenefitsMonthly) * 12;
    const remoteExpensesAnnual = parseNum(remoteExpensesMonthly) * 12;
    const employerStipendAnnual = parseNum(employerStipendMonthly) * 12;

    const finalTakeHomeAnnual =
      netAfterTaxAnnual -
      postTaxBenefitsAnnual -
      remoteExpensesAnnual +
      employerStipendAnnual;

    const periods = PERIODS_PER_YEAR[payFrequency];
    const perPeriod = (n: number) => n / periods;

    return {
      gross,
      retirementAnnual,
      healthInsuranceAnnual,
      otherPreTaxAnnual,
      preTaxDeductionsAnnual,
      taxableIncome,
      taxAnnual,
      netAfterTaxAnnual,
      postTaxBenefitsAnnual,
      remoteExpensesAnnual,
      employerStipendAnnual,
      finalTakeHomeAnnual,
      perPeriodGross: perPeriod(gross),
      perPeriodFinal: perPeriod(finalTakeHomeAnnual),
      effectiveRate:
        gross > 0 ? ((gross - finalTakeHomeAnnual) / gross) * 100 : 0,
    };
  }, [
    grossAnnual,
    taxRatePct,
    retirementPct,
    healthInsuranceMonthly,
    otherPreTaxMonthly,
    postTaxBenefitsMonthly,
    remoteExpensesMonthly,
    employerStipendMonthly,
    payFrequency,
  ]);

  function validate(): string[] {
    const problems: string[] = [];
    if (parseNum(grossAnnual) <= 0)
      problems.push("Enter a valid gross annual salary greater than 0.");
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

  const fields: {
    key: string;
    label: string;
    value: string;
    setter: (v: string) => void;
    help?: string;
  }[] = [
    {
      key: "retirementPct",
      label: "Retirement / pension contribution (%)",
      value: retirementPct,
      setter: setRetirementPct,
    },
    {
      key: "healthInsuranceMonthly",
      label: "Health insurance premium (monthly, pre-tax)",
      value: healthInsuranceMonthly,
      setter: setHealthInsuranceMonthly,
    },
    {
      key: "otherPreTaxMonthly",
      label: "Other pre-tax deductions (monthly)",
      value: otherPreTaxMonthly,
      setter: setOtherPreTaxMonthly,
    },
    {
      key: "postTaxBenefitsMonthly",
      label: "Post-tax benefits / deductions (monthly)",
      value: postTaxBenefitsMonthly,
      setter: setPostTaxBenefitsMonthly,
    },
    {
      key: "remoteExpensesMonthly",
      label: "Remote-work expenses: internet, tools, equipment (monthly)",
      value: remoteExpensesMonthly,
      setter: setRemoteExpensesMonthly,
    },
    {
      key: "employerStipendMonthly",
      label: "Employer remote-work stipend (monthly)",
      value: employerStipendMonthly,
      setter: setEmployerStipendMonthly,
    },
  ];

  return (
    <main className="min-h-screen bg-stone-50 text-stone-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Remote Work Take-Home Pay Calculator",
            applicationCategory: "FinanceApplication",
            operatingSystem: "Any",
            description:
              "Estimate true take-home pay from a remote job after taxes, pre-tax deductions, benefits, and remote-work expenses.",
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
            Remote Work Take-Home Pay Calculator
          </h1>
          <p className="mt-3 max-w-2xl text-stone-600">
            Go beyond gross salary. Enter your taxes, pre-tax deductions,
            benefits, and remote-work expenses to see what actually lands
            in your pocket per pay period.
          </p>
        </header>

        <form onSubmit={onSubmit} noValidate className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-8">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="grossAnnual" className="block text-sm font-semibold text-stone-800">
                Gross annual salary
              </label>
              <input
                id="grossAnnual"
                type="number"
                min={0}
                inputMode="decimal"
                required
                value={grossAnnual}
                onChange={(e) => setGrossAnnual(e.target.value)}
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
              <label htmlFor="payFrequency" className="block text-sm font-semibold text-stone-800">
                Pay frequency
              </label>
              <select
                id="payFrequency"
                value={payFrequency}
                onChange={(e) => setPayFrequency(e.target.value as Frequency)}
                className="mt-1.5 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              >
                {(Object.keys(FREQUENCY_LABEL) as Frequency[]).map((f) => (
                  <option key={f} value={f}>{FREQUENCY_LABEL[f]}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="taxRatePct" className="block text-sm font-semibold text-stone-800">
                Effective tax rate (%)
              </label>
              <input
                id="taxRatePct"
                type="number"
                min={0}
                max={70}
                step="0.1"
                inputMode="decimal"
                value={taxRatePct}
                onChange={(e) => setTaxRatePct(e.target.value)}
                aria-describedby="taxHelp"
                className="mt-1.5 w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              />
              <p id="taxHelp" className="mt-1 text-xs text-stone-500">
                Combined income tax rate. Rules vary by country/state — use an
                official calculator for exact figures.
              </p>
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
            Calculate take-home pay
          </button>
        </form>

        {submitted && errors.length === 0 && (
          <section aria-live="polite" className="mt-8 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-8">
            <h2 className="text-xl font-bold text-stone-900">Your take-home pay</h2>

            <dl className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg bg-emerald-50 p-4 sm:col-span-2">
                <dt className="text-xs font-medium uppercase text-emerald-700">
                  {FREQUENCY_LABEL[payFrequency]} take-home (after expenses)
                </dt>
                <dd className="mt-1 text-2xl font-bold text-emerald-800">
                  {money(result.perPeriodFinal)}
                </dd>
              </div>
              <div className="rounded-lg bg-stone-50 p-4">
                <dt className="text-xs font-medium uppercase text-stone-500">Annual take-home (final)</dt>
                <dd className="mt-1 text-lg font-bold text-stone-900">{money(result.finalTakeHomeAnnual)}</dd>
              </div>
              <div className="rounded-lg bg-stone-50 p-4">
                <dt className="text-xs font-medium uppercase text-stone-500">Effective total deduction rate</dt>
                <dd className="mt-1 text-lg font-bold text-stone-900">{result.effectiveRate.toFixed(1)}%</dd>
              </div>
            </dl>

            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[420px] border-collapse text-sm">
                <caption className="mb-2 text-left text-xs font-medium uppercase text-stone-500">
                  Annual breakdown
                </caption>
                <tbody>
                  {[
                    ["Gross annual salary", result.gross],
                    ["− Retirement contribution", -result.retirementAnnual],
                    ["− Health insurance premium", -result.healthInsuranceAnnual],
                    ["− Other pre-tax deductions", -result.otherPreTaxAnnual],
                    ["= Taxable income", result.taxableIncome],
                    ["− Estimated taxes", -result.taxAnnual],
                    ["= Net pay after tax", result.netAfterTaxAnnual],
                    ["− Post-tax benefits/deductions", -result.postTaxBenefitsAnnual],
                    ["− Remote-work expenses", -result.remoteExpensesAnnual],
                    ["+ Employer remote stipend", result.employerStipendAnnual],
                    ["= Final annual take-home", result.finalTakeHomeAnnual],
                  ].map(([label, value]) => (
                    <tr key={label as string} className="border-b border-stone-100">
                      <td className="py-2 pr-3 text-stone-700">{label}</td>
                      <td className="py-2 text-right font-medium text-stone-900">
                        {money(value as number)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="mt-5 text-sm leading-relaxed text-stone-600">
              This is an estimate for planning purposes. It uses a single
              effective tax rate rather than full progressive tax brackets,
              and does not account for tax credits, employer-matched
              retirement contributions, or region-specific payroll rules.
              Verify exact figures with an official government calculator
              or a licensed tax professional.
            </p>
          </section>
        )}
      </div>
    </main>
  );
}
