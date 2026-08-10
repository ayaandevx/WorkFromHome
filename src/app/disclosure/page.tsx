import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export const metadata: Metadata = buildMetadata({
  title: "Disclosure | WorkFrom.blog",
  description: "How WorkFrom.blog sources job listings and handles editorial independence.",
  path: "/disclosure",
});

export default function DisclosurePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Disclosure", path: "/disclosure" }]} />
      <h1 className="mt-3 font-display text-3xl font-semibold text-ink">Disclosure</h1>
      <div className="prose-article mt-6 max-w-none">
        <h2>Job sourcing</h2>
        <p>
          Remote job listings on WorkFrom.blog are aggregated from public APIs — currently Remotive and Arbeitnow —
          with source attribution and the original application link preserved on every listing. We do not accept
          payment to feature a specific listing more prominently.
        </p>
        <h2>Editorial independence</h2>
        <p>
          Guides, tool recommendations, and resource picks reflect our own editorial judgment. If we ever accept
          sponsorships or affiliate relationships, they will be clearly disclosed on the specific page involved.
        </p>
      </div>
    </div>
  );
}
