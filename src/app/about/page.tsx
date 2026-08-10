import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export const metadata: Metadata = buildMetadata({
  title: "About | WorkFrom.blog",
  description: "WorkFrom.blog helps people find legitimate remote work and build sustainable remote careers.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "About", path: "/about" }]} />
      <h1 className="mt-3 font-display text-3xl font-semibold text-ink">About WorkFrom.blog</h1>
      <div className="prose-article mt-6 max-w-none">
        <p>
          WorkFrom.blog exists because most remote-job content online is either a thin affiliate funnel or a
          scraped job board with no editorial standard behind it. We built something different: a platform that
          treats remote-job seekers as people making a real career decision, not traffic to monetize.
        </p>
        <h2>What we do</h2>
        <p>
          We aggregate remote job listings from vetted providers, always preserving the original source and
          application link. Alongside that, we publish original guides on resumes, interviews, freelancing, and
          productivity, and build free tools that solve one concrete problem at a time.
        </p>
        <h2>What we don&apos;t do</h2>
        <p>
          We don&apos;t claim a job is active when our source data doesn&apos;t support it. We don&apos;t publish thin,
          templated content to chase search volume. We don&apos;t require an account to browse jobs or read guides.
        </p>
      </div>
    </div>
  );
}
