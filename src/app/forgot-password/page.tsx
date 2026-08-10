import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";
import { ForgotPasswordForm } from "@/components/content/ForgotPasswordForm";

export const metadata: Metadata = buildMetadata({
  title: "Reset Password | WorkFrom.blog",
  description: "Reset your WorkFrom.blog account password.",
  path: "/forgot-password",
  noIndex: true,
});

export default function ForgotPasswordPage() {
  return (
    <div className="mx-auto max-w-sm px-4 py-16 sm:px-6">
      <h1 className="font-display text-2xl font-semibold text-ink">Reset password</h1>
      <p className="mt-1 text-sm text-text-muted">We&apos;ll email you a link to reset your password.</p>
      <div className="mt-6"><ForgotPasswordForm /></div>
    </div>
  );
}
