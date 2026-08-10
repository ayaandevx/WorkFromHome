"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";

const EMPLOYMENT_TYPES = [
  { value: "", label: "Any type" },
  { value: "full_time", label: "Full-time" },
  { value: "part_time", label: "Part-time" },
  { value: "contract", label: "Contract" },
  { value: "freelance", label: "Freelance" },
  { value: "internship", label: "Internship" },
];

const REGIONS = [
  { value: "", label: "Any region" },
  { value: "worldwide", label: "Worldwide" },
  { value: "americas", label: "Americas" },
  { value: "emea", label: "Europe / Middle East / Africa" },
  { value: "apac", label: "Asia-Pacific" },
];

const SORTS = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "salary_desc", label: "Salary: high to low" },
  { value: "salary_asc", label: "Salary: low to high" },
];

export function JobFilters({ categories }: { categories: { category: string; count: number }[] }) {
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") || "");

  function updateParam(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete("page");
    router.push(`/jobs?${next.toString()}`);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    updateParam("q", q);
  }

  return (
    <div className="rounded-lg border border-border bg-paper-raised p-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <label htmlFor="job-search-q" className="sr-only">
          Search jobs
        </label>
        <input
          id="job-search-q"
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search title, company, or skill…"
          className="w-full rounded-md border border-border bg-paper px-3 py-2 text-sm"
        />
        <button type="submit" className="shrink-0 rounded-md bg-ink px-4 py-2 text-sm font-medium text-paper">
          Search
        </button>
      </form>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Select
          label="Category"
          value={params.get("category") || ""}
          onChange={(v) => updateParam("category", v)}
          options={[{ value: "", label: "All categories" }, ...categories.map((c) => ({ value: c.category, label: `${c.category} (${c.count})` }))]}
        />
        <Select
          label="Type"
          value={params.get("employmentType") || ""}
          onChange={(v) => updateParam("employmentType", v)}
          options={EMPLOYMENT_TYPES}
        />
        <Select
          label="Region"
          value={params.get("region") || ""}
          onChange={(v) => updateParam("region", v)}
          options={REGIONS}
        />
        <Select
          label="Sort"
          value={params.get("sort") || "newest"}
          onChange={(v) => updateParam("sort", v)}
          options={SORTS}
        />
      </div>
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  const id = `filter-${label.toLowerCase()}`;
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-xs font-medium text-text-muted">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full truncate rounded-md border border-border bg-paper px-2 py-1.5 text-sm"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
