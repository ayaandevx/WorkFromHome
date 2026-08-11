"use client";

/**
 * Home Office Deduction / Expense Organizer
 * -------------------------------------------------------------
 * Next.js (App Router) client component. Suggested metadata:
 *
 * export const metadata = {
 *   title: "Home Office Deduction & Expense Organizer | Estimate Your Deduction",
 *   description:
 *     "Organize home office and business expenses and estimate a potential home office deduction using the square-footage or actual-expense method. Rules vary by country — verify with a tax professional.",
 * };
 */

import { useMemo, useState } from "react";

interface ExpenseEntry {
  id: string;
  description: string;
  category: string;
  amount: string;
}

let idCounter = 0;
function newId() {
  idCounter += 1;
  return `exp-${idCounter}-${Date.now()}`;
}

const CATEGORIES = [
  "Equipment (laptop, monitor, desk, chair)",
  "Software & subscriptions",
  "Internet & phone (business portion)",
  "Office supplies",
  "Professional development",
  "Other",
];

function parseNum(v: string): number {
  const n = parseFloat(v);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

export function HomeOfficeDeductionExpenseOrganizer() {
  const [symbol, setSymbol] = useState("$");
  const [method, setMethod] = useState<"simplified" | "actual">("actual");

  // Business-use percentage inputs
  const [totalSqFt, setTotalSqFt] = useState("1200");
  const [officeSqFt, setOfficeSqFt] = useState("120");

  // Simplified method inputs
  const [ratePerSqFt, setRatePerSqFt] = useState("5");
  const [sqFtCap, setSqFtCap] = useState("300");

  // Actual method: monthly home expenses
  const [rentMortgage, setRentMortgage] = useState("1500");
  const [utilities, setUtilities] = useState("180");
  const [homeInsurance, setHomeInsurance] = useState("60");
  const [repairsMaintenance, setRepairsMaintenance] = useState("40");

  const [expenses, setExpenses] = useState<ExpenseEntry[]>([
    { id: newId(), description: "External monitor", category: CATEGORIES[0], amount: "220" },
    { id: newId(), description: "Project management software", category: CATEGORIES[1], amount: "144" },
  ]);

  const [submitted, setSubmitted] = useState(false);

  function updateExpense(id: string, key: keyof ExpenseEntry, value: string) {
    setExpenses((list) => list.map((e) => (e.id === id ? { ...e, [key]: value } : e)));
  }
  function addExpense() {
    setExpenses((list) => [...list, { id: newId(), description: "", category: CATEGORIES[0], amount: "" }]);
  }
  function removeExpense(id: string) {
    setExpenses((list) => list.filter((e) => e.id !== id));
  }

  const businessUsePct = useMemo(() => {
    const total = parseNum(totalSqFt);
    const office = parseNum(officeSqFt);
    if (total <= 0) return 0;
    return Math.min((office / total) * 100, 100);
  }, [totalSqFt, officeSqFt]);

  const result = useMemo(() => {
    const directExpensesAnnual = expenses.reduce((sum, e) => sum + parseNum(e.amount), 0);

    let homeOfficeDeductionAnnual = 0;

    if (method === "simplified") {
      const rate = parseNum(ratePerSqFt);
      const cap = parseNum(sqFtCap);
      const eligibleSqFt = Math.min(parseNum(officeSqFt), cap);
      homeOfficeDeductionAnnual = eligibleSqFt * rate;
    } else {
      const monthlyEligible =
        parseNum(rentMortgage) +
        parseNum(utilities) +
        parseNum(homeInsurance) +
        parseNum(repairsMaintenance);
      const annualEligible = monthlyEligible * 12;
      homeOfficeDeductionAnnual = annualEligible * (businessUsePct / 100);
    }

    const totalEstimatedDeduction = homeOfficeDeductionAnnual + directExpensesAnnual;

    return { directExpensesAnnual, homeOfficeDeductionAnnual, totalEstimatedDeduction };
  }, [method, ratePerSqFt, sqFtCap, officeSqFt, rentMortgage, utilities, homeInsurance, repairsMaintenance, businessUsePct, expenses]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  function money(n: number) {
    return `${symbol}${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  }

  return (
    <main className="min-h-screen bg-stone-50 text-stone-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Home Office Deduction & Expense Organizer",
            applicationCategory: "FinanceApplication",
            operatingSystem: "Any",
            description:
              "Organize home office and business expenses and estimate a potential home office deduction using the square-footage or actual-expense method.",
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
            Home Office Deduction & Expense Organizer
          </h1>
          <p className="mt-3 max-w-2xl text-stone-600">
            Organize your home office and work-related expenses and get an
            estimated deduction total. Tax rules for home office and
            business deductions vary significantly by country and
            employment status — always verify with an accountant or your
            local tax authority before filing.
          </p>
        </header>

        <form onSubmit={onSubmit} className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-8">
          <div className="grid gap-5 sm:grid-cols-2">
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
              <label htmlFor="method" className="block text-sm font-semibold text-stone-800">
                Home office deduction method
              </label>
              <select
                id="method"
                value={method}
                onChange={(e) => setMethod(e.target.value as "simplified" | "actual")}
                className="mt-1.5 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              >
                <option value="actual">Actual expenses × business-use %</option>
                <option value="simplified">Simplified per-square-foot rate</option>
              </select>
            </div>
          </div>

          <fieldset className="mt-6 rounded-xl border border-stone-200 p-4">
            <legend className="px-1 text-sm font-semibold text-stone-800">Home & office size</legend>
            <div className="mt-2 grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="totalSqFt" className="block text-sm font-medium text-stone-700">
                  Total home area (sq ft)
                </label>
                <input
                  id="totalSqFt"
                  type="number"
                  min={0}
                  inputMode="decimal"
                  value={totalSqFt}
                  onChange={(e) => setTotalSqFt(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                />
              </div>
              <div>
                <label htmlFor="officeSqFt" className="block text-sm font-medium text-stone-700">
                  Office/work area (sq ft)
                </label>
                <input
                  id="officeSqFt"
                  type="number"
                  min={0}
                  inputMode="decimal"
                  value={officeSqFt}
                  onChange={(e) => setOfficeSqFt(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                />
              </div>
            </div>
            <p className="mt-2 text-sm text-stone-600">
              Business-use percentage: <strong>{businessUsePct.toFixed(1)}%</strong>
            </p>
          </fieldset>

          {method === "simplified" ? (
            <fieldset className="mt-6 rounded-xl border border-stone-200 p-4">
              <legend className="px-1 text-sm font-semibold text-stone-800">Simplified method rate</legend>
              <div className="mt-2 grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="ratePerSqFt" className="block text-sm font-medium text-stone-700">
                    Rate per sq ft
                  </label>
                  <input
                    id="ratePerSqFt"
                    type="number"
                    min={0}
                    step="0.1"
                    inputMode="decimal"
                    value={ratePerSqFt}
                    onChange={(e) => setRatePerSqFt(e.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  />
                </div>
                <div>
                  <label htmlFor="sqFtCap" className="block text-sm font-medium text-stone-700">
                    Maximum eligible sq ft
                  </label>
                  <input
                    id="sqFtCap"
                    type="number"
                    min={0}
                    inputMode="decimal"
                    value={sqFtCap}
                    onChange={(e) => setSqFtCap(e.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  />
                </div>
              </div>
              <p className="mt-2 text-xs text-stone-500">
                Defaults reflect a common flat-rate structure (e.g. the US
                IRS simplified option). Confirm the correct rate and cap
                for your own country's tax rules.
              </p>
            </fieldset>
          ) : (
            <fieldset className="mt-6 rounded-xl border border-stone-200 p-4">
              <legend className="px-1 text-sm font-semibold text-stone-800">Monthly home expenses</legend>
              <div className="mt-2 grid gap-5 sm:grid-cols-2">
                {[
                  { label: "Rent / mortgage", value: rentMortgage, setter: setRentMortgage },
                  { label: "Utilities", value: utilities, setter: setUtilities },
                  { label: "Home insurance", value: homeInsurance, setter: setHomeInsurance },
                  { label: "Repairs & maintenance", value: repairsMaintenance, setter: setRepairsMaintenance },
                ].map((f) => (
                  <div key={f.label}>
                    <label htmlFor={f.label} className="block text-sm font-medium text-stone-700">
                      {f.label}
                    </label>
                    <input
                      id={f.label}
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
            </fieldset>
          )}

          <div className="mt-6">
            <h2 className="text-sm font-semibold text-stone-800">Direct business expenses</h2>
            <div className="mt-3 space-y-3">
              {expenses.map((exp, i) => (
                <div key={exp.id} className="grid grid-cols-2 gap-3 rounded-lg border border-stone-200 p-3 sm:grid-cols-12 sm:items-end">
                  <div className="col-span-2 sm:col-span-4">
                    <label htmlFor={`desc-${exp.id}`} className="block text-xs font-medium text-stone-600">
                      Description
                    </label>
                    <input
                      id={`desc-${exp.id}`}
                      type="text"
                      value={exp.description}
                      onChange={(e) => updateExpense(exp.id, "description", e.target.value)}
                      placeholder={`Expense #${i + 1}`}
                      className="mt-1 w-full rounded-md border border-stone-300 px-2 py-1.5 text-sm focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-4">
                    <label htmlFor={`cat-${exp.id}`} className="block text-xs font-medium text-stone-600">
                      Category
                    </label>
                    <select
                      id={`cat-${exp.id}`}
                      value={exp.category}
                      onChange={(e) => updateExpense(exp.id, "category", e.target.value)}
                      className="mt-1 w-full rounded-md border border-stone-300 bg-white px-2 py-1.5 text-sm focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor={`amt-${exp.id}`} className="block text-xs font-medium text-stone-600">
                      Amount
                    </label>
                    <input
                      id={`amt-${exp.id}`}
                      type="number"
                      min={0}
                      inputMode="decimal"
                      value={exp.amount}
                      onChange={(e) => updateExpense(exp.id, "amount", e.target.value)}
                      className="mt-1 w-full rounded-md border border-stone-300 px-2 py-1.5 text-sm focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                    />
                  </div>
                  <div className="col-span-2 flex items-end sm:col-span-2">
                    <button
                      type="button"
                      onClick={() => removeExpense(exp.id)}
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
              onClick={addExpense}
              className="mt-3 rounded-lg border border-emerald-300 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
            >
              + Add expense
            </button>
          </div>

          <button
            type="submit"
            className="mt-7 w-full rounded-lg bg-emerald-700 px-5 py-3 font-semibold text-white transition hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 sm:w-auto"
          >
            Calculate estimated deduction
          </button>
        </form>

        {submitted && (
          <section aria-live="polite" className="mt-8 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-8">
            <h2 className="text-xl font-bold text-stone-900">Your estimated totals</h2>

            <dl className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg bg-stone-50 p-4">
                <dt className="text-xs font-medium uppercase text-stone-500">Home office deduction (annual)</dt>
                <dd className="mt-1 text-lg font-bold text-stone-900">{money(result.homeOfficeDeductionAnnual)}</dd>
              </div>
              <div className="rounded-lg bg-stone-50 p-4">
                <dt className="text-xs font-medium uppercase text-stone-500">Direct business expenses</dt>
                <dd className="mt-1 text-lg font-bold text-stone-900">{money(result.directExpensesAnnual)}</dd>
              </div>
              <div className="rounded-lg bg-emerald-50 p-4 sm:col-span-2">
                <dt className="text-xs font-medium uppercase text-emerald-700">Total estimated deduction</dt>
                <dd className="mt-1 text-2xl font-bold text-emerald-800">{money(result.totalEstimatedDeduction)}</dd>
              </div>
            </dl>

            <p className="mt-6 text-sm leading-relaxed text-stone-600">
              This is a planning estimate only, not a tax filing. Eligibility
              for home office and business expense deductions depends on
              your employment status (self-employed vs. employee), country,
              and local tax rules, which this tool does not attempt to
              determine. Keep receipts for everything you enter and consult
              a licensed tax professional or your local tax authority before
              filing.
            </p>
          </section>
        )}
      </div>
    </main>
  );
}
