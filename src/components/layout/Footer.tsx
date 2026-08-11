import Link from "next/link";
import { NewsletterForm } from "../content/NewsletterForm";

const COLUMNS: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "Jobs",
    links: [
      { href: "/jobs", label: "Browse remote jobs" },
      { href: "/categories/software-development", label: "Software development" },
      { href: "/resources/how-to-report-a-job-scam", label: "Scam prevention" },
    ],
  },
  {
    title: "Tools",
    links: [
      { href: "/tools/resume-ats-checklist", label: "Resume & ATS checklist" },
      { href: "/tools/remote-job-readiness-checker", label: "Readiness checker" },
      { href: "/tools/freelance-rate-calculator", label: "Rate calculator" },
      { href: "/tools/timezone-meeting-calculator", label: "Timezone calculator" },
    ],
  },
  {
    title: "Guides",
    links: [
      { href: "/topics/getting-hired-remotely", label: "Getting hired remotely" },
      { href: "/topics/working-better-from-anywhere", label: "Working from anywhere" },
      { href: "/articles", label: "All articles" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
      { href: "/disclosure", label: "Disclosure" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-ink text-paper">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.3fr_repeat(4,1fr)]">
          <div>
            <span className="font-display text-lg font-semibold">
              WorkFrom<span className="text-amber-light">.blog</span>
            </span>
            <p className="mt-3 max-w-xs text-sm text-paper/70">
              Find remote work. Build your career. Work better from anywhere.
            </p>
            <div className="mt-5">
              <NewsletterForm variant="footer" />
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-paper/50">{col.title}</h3>
              <ul className="mt-3 space-y-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-paper/80 hover:text-amber-light transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-paper/15 pt-6 text-xs text-paper/50 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} WorkFrom.blog. Job listings sourced with attribution from Remotive, Arbeitnow, and Jobicy.</p>
          <p>Built for people building remote careers.</p>
        </div>
      </div>
    </footer>
  );
}
