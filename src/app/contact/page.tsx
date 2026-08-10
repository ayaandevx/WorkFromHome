import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ContactForm } from "@/components/content/ContactForm";

export const metadata: Metadata = buildMetadata({
  title: "Contact | WorkFrom.blog",
  description: "Get in touch with the WorkFrom.blog team.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }]} />
      <h1 className="mt-3 font-display text-3xl font-semibold text-ink">Contact</h1>
      <p className="mt-2 text-text-muted">
        Questions, corrections, or a scam report? Send us a message and we&apos;ll get back to you.
      </p>
      <div className="mt-6">
        <ContactForm />
      </div>
    </div>
  );
}
