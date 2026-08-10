"use client";

import { useMemo, useState } from "react";
import { track } from "@/lib/analytics";

interface ChecklistItem {
  id: string;
  label: string;
  detail: string;
}

const SECTIONS: { title: string; items: ChecklistItem[] }[] = [
  {
    title: "Formatting ATS can actually parse",
    items: [
      { id: "single-column", label: "Single-column layout (no tables or text boxes)", detail: "Multi-column layouts and tables are frequently skipped or scrambled by parsers." },
      { id: "standard-headers", label: "Standard section headers (Experience, Skills, Education)", detail: "Creative header names like \"Where I've Been\" often aren't recognized." },
      { id: "no-header-footer-contact", label: "Contact info in the body, not header/footer", detail: "Many parsers ignore header and footer content entirely." },
      { id: "text-based-file", label: "Saved as a text-based .docx or PDF, not an image", detail: "Image-based or scanned PDFs can't be parsed at all." },
      { id: "standard-fonts", label: "Standard, widely-supported fonts", detail: "Unusual fonts can render as garbled characters after parsing." },
    ],
  },
  {
    title: "Content that matches the posting",
    items: [
      { id: "keyword-match", label: "Skills section mirrors 2–3 exact phrases from the posting (where accurate)", detail: "Exact-phrase matching materially improves keyword scoring." },
      { id: "job-title-match", label: "Job titles reflect how the role is commonly searched", detail: "An unusual internal title can fail to match the posting's target title." },
      { id: "quantified-results", label: "Bullet points include a measurable result where possible", detail: "Numbers signal impact to both ATS ranking and human reviewers." },
      { id: "no-graphics-for-skills", label: "Skill levels shown as text, not bars/graphics", detail: "Graphical skill meters convey nothing to a parser and often confuse it." },
    ],
  },
  {
    title: "Before you submit",
    items: [
      { id: "consistent-dates", label: "Employment dates are consistent and unambiguous", detail: "MM/YYYY format throughout avoids parsing errors." },
      { id: "file-name", label: "File named clearly, e.g. FirstLast-Resume.pdf", detail: "Generic file names look less professional to human reviewers downstream." },
      { id: "proofread", label: "Proofread for typos and consistent tense", detail: "Passes both ATS keyword matching and a human's first impression." },
    ],
  },
];

export function ResumeAtsChecklist() {
  const allIds = useMemo(() => SECTIONS.flatMap((s) => s.items.map((i) => i.id)), []);
  const [checked, setChecked] = useState<Set<string>>(new Set());

  function toggle(id: string) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      track({ name: "tool_usage", toolSlug: "resume-ats-checklist", action: next.has(id) ? "check" : "uncheck" });
      return next;
    });
  }

  const percent = Math.round((checked.size / allIds.length) * 100);

  return (
    <div>
      <div className="rounded-lg border border-border bg-paper-raised p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-text">Progress</span>
          <span className="font-mono text-text-muted">{checked.size}/{allIds.length} · {percent}%</span>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-border">
          <div className="h-full bg-sage transition-[width]" style={{ width: `${percent}%` }} />
        </div>
      </div>

      <div className="mt-6 space-y-8">
        {SECTIONS.map((section) => (
          <div key={section.title}>
            <h3 className="font-display text-lg font-semibold text-ink">{section.title}</h3>
            <ul className="mt-3 space-y-3">
              {section.items.map((item) => (
                <li key={item.id} className="flex gap-3 rounded-lg border border-border bg-paper-raised p-3">
                  <input
                    type="checkbox"
                    id={item.id}
                    checked={checked.has(item.id)}
                    onChange={() => toggle(item.id)}
                    className="mt-1 h-4 w-4 shrink-0"
                  />
                  <label htmlFor={item.id} className="cursor-pointer">
                    <span className="block text-sm font-medium text-text">{item.label}</span>
                    <span className="mt-0.5 block text-xs text-text-muted">{item.detail}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
