import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";
import { DashboardView } from "@/components/content/DashboardView";

export const metadata: Metadata = buildMetadata({
  title: "Dashboard | WorkFrom.blog",
  description: "Your saved jobs, articles, and tools.",
  path: "/dashboard",
  noIndex: true,
});

export default function DashboardPage() {
  return <DashboardView />;
}
