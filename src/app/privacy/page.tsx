import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy | WorkFrom.blog",
  description: "How WorkFrom.blog collects, uses, and protects your data.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Privacy", path: "/privacy" }]} />
      <h1 className="mt-3 font-display text-3xl font-semibold text-ink">Privacy Policy</h1>
      <div className="prose-article mt-6 max-w-none">
        <p><em>Last updated: this is placeholder legal content — replace with counsel-reviewed language before launch.</em></p>
        <h2>What we collect</h2>
        <p>
          Account information (email, and any profile details you add) if you create an account. Newsletter
          subscriber email addresses, only with your explicit consent. Standard technical logs (IP address,
          browser, pages visited) for security and analytics purposes.
        </p>
        <h2>What we don&apos;t require</h2>
        <p>Browsing jobs, articles, tools, and resources never requires an account or any personal information.</p>
        <h2>Third parties</h2>
        <p>
          Job listings are sourced from third-party providers (currently Remotive and Arbeitnow); visiting a
          listing&apos;s original source or apply link is subject to that provider&apos;s own privacy policy.
        </p>
        <h2>Your rights</h2>
        <p>You can request account deletion, unsubscribe from the newsletter at any time via the link in every email, and request a copy of data we hold about you by contacting us.</p>
      </div>
    </div>
  );
}
