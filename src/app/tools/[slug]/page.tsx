import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllTools, getToolBySlug } from "@/lib/content/service";
import { buildMetadata } from "@/lib/seo/metadata";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ResumeAtsChecklist } from "@/components/tools/ResumeAtsChecklist";
import { ReadinessChecker } from "@/components/tools/ReadinessChecker";
import { RateCalculator } from "@/components/tools/RateCalculator";
import { TimezoneCalculator } from "@/components/tools/TimezoneCalculator";
import { CanIWorkThisJobRemotelyChecker } from "@/components/tools/can-i-work-this-job-remotely-checker";
import { HomeOfficeDeductionExpenseOrganizer } from "@/components/tools/home-office-deduction-expense-organizer";
import { JobApplicationRoiCalculator } from "@/components/tools/job-application-roi-calculator";
import { MeetingOverloadCalculator } from "@/components/tools/meeting-overload-calculator";
import { RemoteJobSalaryRealityCalculator } from "@/components/tools/remote-job-salary-reality-calculator";
import { RemoteJobScamRiskChecker } from "@/components/tools/remote-job-scam-risk-checker";
import { RemoteTimezoneChecker } from "@/components/tools/remote-timezone-checker";
import { RemoteWorkReadinessScore } from "@/components/tools/remote-work-readiness-score";
import { RemoteWorkTakeHomePayCalculator } from "@/components/tools/remote-work-take-home-pay-calculator";
import { WfhElectricityCostCalculator } from "@/components/tools/wfh-electricity-cost-calculator";
import { WfhInternetReliabilityChecker } from "@/components/tools/wfh-internet-reliability-checker";
import { WfhProductivityCostCalculator } from "@/components/tools/wfh-productivity-cost-calculator";




export const revalidate = 3600;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const tools = await getAllTools();
  return tools.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = await getToolBySlug(slug);
  if (!tool) return buildMetadata({ title: "Tool not found", description: "", path: `/tools/${slug}`, noIndex: true });
  return buildMetadata({
    title: tool.seoTitle || `${tool.title} | WorkFrom.blog`,
    description: tool.seoDescription || tool.summary,
    path: `/tools/${tool.slug}`,
  });
}

function renderWidget(kind: string) {
  switch (kind) {
    case "resume-checklist":
      return <ResumeAtsChecklist />;
    case "readiness-checker":
      return <ReadinessChecker />;
    case "rate-calculator":
      return <RateCalculator />;
    case "timezone-calculator":
      return <TimezoneCalculator />;
    case "can-i-work-this-job-remotely-checker":
      return <CanIWorkThisJobRemotelyChecker />;
    case "job-application-roi-calculator":
      return <JobApplicationRoiCalculator />;
    case "home-office-deduction-expense-organizer":
      return <HomeOfficeDeductionExpenseOrganizer />;
    case "meeting-overload-calculator":
      return <MeetingOverloadCalculator />;
    case "remote-job-salary-reality-calculator":
      return <RemoteJobSalaryRealityCalculator />;
    case "remote-job-scam-risk-checker":
      return <RemoteJobScamRiskChecker />;
    case "remote-timezone-checker":
      return <RemoteTimezoneChecker />;
    case "remote-work-readiness-score":
      return <RemoteWorkReadinessScore />;
    case "remote-work-take-home-pay-calculator":
      return <RemoteWorkTakeHomePayCalculator />;
    case "wfh-electricity-cost-calculator":
      return <WfhElectricityCostCalculator />;
    case "wfh-internet-reliability-checker":
      return <WfhInternetReliabilityChecker />;
    case "wfh-productivity-cost-calculator":
      return <WfhProductivityCostCalculator />;
    default:
      return null;
  }
}

export default async function ToolDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const tool = await getToolBySlug(slug);
  if (!tool) notFound();

  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Tools", path: "/tools" },
    { name: tool.title, path: `/tools/${tool.slug}` },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <Breadcrumbs items={breadcrumbItems} />
      <span className="mt-3 inline-block rounded-full bg-amber/10 px-2.5 py-0.5 text-xs font-medium text-amber">Free tool</span>
      <h1 className="mt-2 font-display text-3xl font-semibold text-ink">{tool.title}</h1>
      <p className="mt-1 text-lg text-text-muted">{tool.summary}</p>

      {tool.introHtml && <div className="prose-article mt-4 max-w-none" dangerouslySetInnerHTML={{ __html: tool.introHtml }} />}

      <div className="mt-8">{renderWidget(tool.kind)}</div>

      {tool.relatedArticles?.length > 0 && (
        <div className="mt-10 border-t border-border pt-6">
          <h2 className="font-display text-lg font-semibold text-ink">Related reading</h2>
          <ul className="mt-3 space-y-2">
            {tool.relatedArticles.map((a) => (
              <li key={a.slug}>
                <Link href={`/articles/${a.slug}`} className="text-amber hover:underline">
                  {a.title} →
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
