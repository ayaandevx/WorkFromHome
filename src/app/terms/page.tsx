import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export const metadata: Metadata = buildMetadata({
  title: "Terms of Service | WorkFrom.blog",
  description: "Terms governing use of WorkFrom.blog.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Terms", path: "/terms" }]} />
      <h1 className="mt-3 font-display text-3xl font-semibold text-ink">Terms of Service</h1>
      <div className="prose-article mt-6 max-w-none">
        <p><em>Last updated: this is placeholder legal content — replace with counsel-reviewed language before launch.</em></p>
        <h2>Job listings</h2>
        <p>
          Job listings are aggregated from third-party sources and displayed with attribution. We do not employ,
          vet, or guarantee any listed employer, and applying is always at your own discretion via the linked
          source or apply page.
        </p>
        <h2>Tools</h2>
        <p>Free tools on this site (resume checklist, readiness checker, rate calculator, timezone calculator) provide general guidance only and are not professional, legal, or financial advice.</p>
        <h2>Acceptable use</h2>
        <p>You agree not to scrape, resell, or misrepresent content from this site, and not to use it to facilitate fraud, including posting or promoting fraudulent job listings.</p>
      </div>
    </div>
  );
}
