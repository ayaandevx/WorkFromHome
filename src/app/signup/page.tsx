import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";
import { SignupForm } from "@/components/content/SignupForm";

export const metadata: Metadata = buildMetadata({
  title: "Sign Up | WorkFrom.blog",
  description: "Create a free account to save jobs, articles, and tools.",
  path: "/signup",
  noIndex: true,
});

export default function SignupPage() {
  return (
    <div className="mx-auto max-w-sm px-4 py-16 sm:px-6">
      <h1 className="font-display text-2xl font-semibold text-ink">Create an account</h1>
      <p className="mt-1 text-sm text-text-muted">Free, and never required to browse jobs or guides.</p>
      <div className="mt-6"><SignupForm /></div>
    </div>
  );
}
