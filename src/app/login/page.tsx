import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";
import { LoginForm } from "@/components/content/LoginForm";

export const metadata: Metadata = buildMetadata({
  title: "Log In | WorkFrom.blog",
  description: "Log in to save jobs, articles, and tools.",
  path: "/login",
  noIndex: true,
});

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-sm px-4 py-16 sm:px-6">
      <h1 className="font-display text-2xl font-semibold text-ink">Log in</h1>
      <p className="mt-1 text-sm text-text-muted">Save jobs, articles, and tools to your account.</p>
      <div className="mt-6"><LoginForm /></div>
    </div>
  );
}
