import Link from "next/link";
import { AccountMenu } from "./AccountMenu";
import { MobileNav } from "./MobileNav";
import Image from "next/image";

const NAV_LINKS = [
  { href: "/jobs", label: "Jobs" },
  { href: "/tools", label: "Tools" },
  { href: "/articles", label: "Guides" },
  { href: "/resources", label: "Resources" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-paper/95 backdrop-blur supports-[backdrop-filter]:bg-paper/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2 shrink-0" aria-label="WorkFrom.blog home">
                    <Image src="/icon-64.png"
              alt=""
              width={32}
              height={32}
              className="size-8"
            />
          <span className="font-display text-xl font-semibold tracking-tight text-ink">
            WorkFrom<span className="text-amber">.blog</span>
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-text hover:text-amber transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/search"
            className="text-sm font-medium text-text-muted hover:text-ink transition-colors"
            aria-label="Search"
          >
            Search
          </Link>
          <AccountMenu />
        </div>

        <MobileNav links={NAV_LINKS} />
      </div>
    </header>
  );
}
