"use client";

import { useEffect, useState } from "react";

interface Heading {
  id: string;
  text: string;
  level: number;
}

/** Reads h2/h3 headings already rendered in the article body and builds a TOC. */
export function TableOfContents({ containerId }: { containerId: string }) {
  const [headings, setHeadings] = useState<Heading[]>([]);

  useEffect(() => {
    const container = document.getElementById(containerId);
    if (!container) return;
    const nodes = Array.from(container.querySelectorAll("h2, h3"));
    const found: Heading[] = nodes.map((node, i) => {
      const id = node.id || `section-${i}`;
      node.id = id;
      return { id, text: node.textContent || "", level: node.tagName === "H2" ? 2 : 3 };
    });
    setHeadings(found);
  }, [containerId]);

  if (headings.length < 3) return null;

  return (
    <nav aria-label="Table of contents" className="rounded-lg border border-border bg-paper-raised p-4 text-sm">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-muted">On this page</p>
      <ul className="space-y-1.5">
        {headings.map((h) => (
          <li key={h.id} className={h.level === 3 ? "ml-3" : ""}>
            <a href={`#${h.id}`} className="text-text hover:text-amber">
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
