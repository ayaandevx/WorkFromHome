"use client";

/**
 * WFH Internet Reliability Checker
 * -------------------------------------------------------------
 * Next.js (App Router) client component. Suggested metadata:
 *
 * export const metadata = {
 *   title: "WFH Internet Reliability Checker | Is Your Connection Good Enough?",
 *   description:
 *     "Check whether your home internet setup — speed, latency, uptime, data limits, and backup connection — is reliable enough for your remote work requirements.",
 * };
 */

import { useMemo, useState } from "react";

type WorkLevel = "light" | "standard" | "heavy" | "critical";

const REQUIREMENTS: Record<WorkLevel, { label: string; download: number; upload: number; latency: number; description: string }> = {
  light: {
    label: "Light (email, chat, occasional docs)",
    download: 10,
    upload: 3,
    latency: 200,
    description: "Mostly asynchronous work with rare video calls.",
  },
  standard: {
    label: "Standard (regular video calls, cloud tools)",
    download: 25,
    upload: 5,
    latency: 100,
    description: "Daily video meetings and cloud-based collaboration.",
  },
  heavy: {
    label: "Heavy (all-day video calls, large file transfers)",
    download: 50,
    upload: 10,
    latency: 80,
    description: "Back-to-back video calls plus uploading/downloading large files.",
  },
  critical: {
    label: "Critical (real-time dev/server work, screen sharing, live production)",
    download: 100,
    upload: 20,
    latency: 40,
    description: "Low-latency-sensitive work such as remote servers, live streaming, or pair programming.",
  },
};

function parseNum(v: string): number {
  const n = parseFloat(v);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

export  function WfhInternetReliabilityChecker() {
  const [download, setDownload] = useState("60");
  const [upload, setUpload] = useState("15");
  const [latency, setLatency] = useState("35");
  const [uptimePct, setUptimePct] = useState("98");
  const [hasDataCap, setHasDataCap] = useState(false);
  const [dataCapGb, setDataCapGb] = useState("500");
  const [estimatedUsageGb, setEstimatedUsageGb] = useState("300");
  const [hasBackup, setHasBackup] = useState(true);
  const [workLevel, setWorkLevel] = useState<WorkLevel>("standard");
  const [submitted, setSubmitted] = useState(false);

  const req = REQUIREMENTS[workLevel];

  const result = useMemo(() => {
    const dl = parseNum(download);
    const ul = parseNum(upload);
    const lat = parseNum(latency);
    const uptime = Math.min(parseNum(uptimePct), 100);

    const dlScore = Math.min((dl / req.download) * 100, 100);
    const ulScore = Math.min((ul / req.upload) * 100, 100);
    const latScore = lat <= req.latency ? 100 : Math.max(0, 100 - ((lat - req.latency) / req.latency) * 100);
    const uptimeScore = Math.min((uptime / 99.5) * 100, 100);

    let score =
      dlScore * 0.3 + ulScore * 0.25 + latScore * 0.25 + uptimeScore * 0.2;

    const issues: string[] = [];
    if (dl < req.download) {
      issues.push(`Download speed (${dl} Mbps) is below the ${req.download} Mbps recommended for ${req.label.toLowerCase()}.`);
    }
    if (ul < req.upload) {
      issues.push(`Upload speed (${ul} Mbps) is below the ${req.upload} Mbps recommended for this work level.`);
    }
    if (lat > req.latency) {
      issues.push(`Latency (${lat} ms) is higher than the ${req.latency} ms recommended — expect lag on calls or real-time tools.`);
    }
    if (uptime < 98) {
      issues.push(`Reported uptime (${uptime}%) suggests occasional outages that could interrupt work.`);
    }
    if (hasDataCap) {
      const cap = parseNum(dataCapGb);
      const usage = parseNum(estimatedUsageGb);
      if (usage > cap * 0.85) {
        issues.push(`Estimated monthly usage (${usage} GB) is close to or over your ${cap} GB data cap.`);
        score -= 10;
      }
    }
    if (!hasBackup) {
      issues.push("No backup connection (e.g. mobile hotspot) is available if your main connection goes down.");
      score -= 10;
    }

    score = Math.max(0, Math.min(100, Math.round(score)));

    let verdict: "Excellent" | "Reliable" | "Risky" | "Not sufficient";
    if (score >= 85) verdict = "Excellent";
    else if (score >= 65) verdict = "Reliable";
    else if (score >= 40) verdict = "Risky";
    else verdict = "Not sufficient";

    return { score, verdict, issues };
  }, [download, upload, latency, uptimePct, hasDataCap, dataCapGb, estimatedUsageGb, hasBackup, req]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  const verdictStyles: Record<string, string> = {
    Excellent: "bg-emerald-50 text-emerald-800 border-emerald-300",
    Reliable: "bg-lime-50 text-lime-800 border-lime-300",
    Risky: "bg-amber-50 text-amber-800 border-amber-300",
    "Not sufficient": "bg-rose-50 text-rose-800 border-rose-300",
  };

  return (
    <main className="min-h-screen bg-stone-50 text-stone-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "WFH Internet Reliability Checker",
            applicationCategory: "UtilitiesApplication",
            operatingSystem: "Any",
            description:
              "Check whether your home internet connection is reliable enough for remote work using speed, latency, uptime, data limits, and backup connection availability.",
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
            WFH Internet Reliability Checker
          </h1>
          <p className="mt-3 max-w-2xl text-stone-600">
            Enter your connection details from a recent speed test to see
            whether your internet setup can reliably support your specific
            remote work requirements.
          </p>
        </header>

        <form onSubmit={onSubmit} className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-8">
          <div>
            <label htmlFor="workLevel" className="block text-sm font-semibold text-stone-800">
              What does your remote work require?
            </label>
            <select
              id="workLevel"
              value={workLevel}
              onChange={(e) => setWorkLevel(e.target.value as WorkLevel)}
              className="mt-1.5 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            >
              {(Object.keys(REQUIREMENTS) as WorkLevel[]).map((k) => (
                <option key={k} value={k}>{REQUIREMENTS[k].label}</option>
              ))}
            </select>
            <p className="mt-1 text-xs text-stone-500">{req.description}</p>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="download" className="block text-sm font-medium text-stone-700">
                Download speed (Mbps)
              </label>
              <input
                id="download"
                type="number"
                min={0}
                inputMode="decimal"
                value={download}
                onChange={(e) => setDownload(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              />
            </div>
            <div>
              <label htmlFor="upload" className="block text-sm font-medium text-stone-700">
                Upload speed (Mbps)
              </label>
              <input
                id="upload"
                type="number"
                min={0}
                inputMode="decimal"
                value={upload}
                onChange={(e) => setUpload(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              />
            </div>
            <div>
              <label htmlFor="latency" className="block text-sm font-medium text-stone-700">
                Latency / ping (ms)
              </label>
              <input
                id="latency"
                type="number"
                min={0}
                inputMode="decimal"
                value={latency}
                onChange={(e) => setLatency(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              />
            </div>
            <div>
              <label htmlFor="uptimePct" className="block text-sm font-medium text-stone-700">
                Estimated monthly uptime (%)
              </label>
              <input
                id="uptimePct"
                type="number"
                min={0}
                max={100}
                step="0.1"
                inputMode="decimal"
                value={uptimePct}
                onChange={(e) => setUptimePct(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="flex items-center gap-2 text-sm font-medium text-stone-700">
              <input
                type="checkbox"
                checked={hasDataCap}
                onChange={(e) => setHasDataCap(e.target.checked)}
                className="h-4 w-4 rounded border-stone-400 text-emerald-700 focus:ring-emerald-500"
              />
              My plan has a monthly data cap
            </label>

            {hasDataCap && (
              <div className="mt-3 grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="dataCapGb" className="block text-sm font-medium text-stone-700">
                    Data cap (GB/month)
                  </label>
                  <input
                    id="dataCapGb"
                    type="number"
                    min={0}
                    inputMode="decimal"
                    value={dataCapGb}
                    onChange={(e) => setDataCapGb(e.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  />
                </div>
                <div>
                  <label htmlFor="estimatedUsageGb" className="block text-sm font-medium text-stone-700">
                    Your estimated usage (GB/month)
                  </label>
                  <input
                    id="estimatedUsageGb"
                    type="number"
                    min={0}
                    inputMode="decimal"
                    value={estimatedUsageGb}
                    onChange={(e) => setEstimatedUsageGb(e.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="mt-6">
            <label className="flex items-center gap-2 text-sm font-medium text-stone-700">
              <input
                type="checkbox"
                checked={hasBackup}
                onChange={(e) => setHasBackup(e.target.checked)}
                className="h-4 w-4 rounded border-stone-400 text-emerald-700 focus:ring-emerald-500"
              />
              I have a backup connection (mobile hotspot, second ISP, etc.)
            </label>
          </div>

          <button
            type="submit"
            className="mt-7 w-full rounded-lg bg-emerald-700 px-5 py-3 font-semibold text-white transition hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 sm:w-auto"
          >
            Check my internet reliability
          </button>
        </form>

        {submitted && (
          <section aria-live="polite" className="mt-8 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-8">
            <h2 className="text-xl font-bold text-stone-900">Your reliability score</h2>

            <div className={`mt-4 rounded-xl border px-4 py-3 text-sm font-semibold ${verdictStyles[result.verdict]}`}>
              {result.verdict} — {result.score}/100
            </div>

            {result.issues.length === 0 ? (
              <p className="mt-5 text-sm text-stone-600">
                Your connection meets the recommended thresholds for this
                work level across speed, latency, and uptime.
              </p>
            ) : (
              <div className="mt-5">
                <h3 className="text-sm font-semibold text-stone-800">Issues found</h3>
                <ul className="mt-3 space-y-2">
                  {result.issues.map((issue) => (
                    <li key={issue} className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                      {issue}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <p className="mt-6 text-sm leading-relaxed text-stone-600">
              Thresholds are general guidelines, not official requirements
              from any specific employer or platform — some roles may have
              stricter connectivity requirements. Run a speed test (e.g. at
              a reputable speed-test provider) during your normal working
              hours for the most accurate numbers.
            </p>
          </section>
        )}
      </div>
    </main>
  );
}
