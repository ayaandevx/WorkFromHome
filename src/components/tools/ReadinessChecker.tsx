"use client";

import { useState } from "react";
import { track } from "@/lib/analytics";

interface Question {
  id: string;
  text: string;
}

const QUESTIONS: Question[] = [
  { id: "async-comfort", text: "I'm comfortable writing clear updates without a daily in-person check-in." },
  { id: "quiet-space", text: "I have a workspace with reliable internet and minimal interruptions during work hours." },
  { id: "self-direction", text: "I can prioritize my own work without someone checking in on me hourly." },
  { id: "overlap-hours", text: "I can commit to a few consistent hours that overlap with a team's core time zone." },
  { id: "written-communication", text: "I default to writing things down rather than relying on verbal-only context." },
  { id: "isolation-plan", text: "I have a plan for social contact outside of work to avoid isolation." },
  { id: "boundary-setting", text: "I can set a clear end to my workday without an office to physically leave." },
  { id: "tooling-comfort", text: "I'm comfortable learning new collaboration tools (video calls, shared docs, chat) quickly." },
];

function interpret(score: number, total: number) {
  const pct = score / total;
  if (pct >= 0.85) {
    return {
      label: "Strong fit",
      detail: "Your habits line up well with what distributed teams need. Focus your prep time on interview stories that demonstrate this.",
      color: "text-sage",
    };
  }
  if (pct >= 0.6) {
    return {
      label: "Good foundation, a few gaps",
      detail: "You have solid fundamentals. Identify which specific items you marked no, and build a concrete plan for each before you start.",
      color: "text-amber",
    };
  }
  return {
    label: "Worth strengthening first",
    detail: "That's normal, not disqualifying. Pick two or three items to work on deliberately, then revisit this checker before applying.",
    color: "text-danger",
  };
}

export function ReadinessChecker() {
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);

  const answeredCount = Object.keys(answers).length;
  const score = Object.values(answers).filter(Boolean).length;

  function setAnswer(id: string, value: boolean) {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  }

  function handleSubmit() {
    setSubmitted(true);
    track({ name: "tool_usage", toolSlug: "remote-job-readiness-checker", action: "submit" });
  }

  if (submitted) {
    const result = interpret(score, QUESTIONS.length);
    return (
      <div className="rounded-lg border border-border bg-paper-raised p-6">
        <p className={`text-sm font-semibold uppercase tracking-wider ${result.color}`}>{result.label}</p>
        <p className="mt-2 font-display text-2xl font-semibold text-ink">
          {score}/{QUESTIONS.length}
        </p>
        <p className="mt-2 text-text-muted">{result.detail}</p>
        <button
          type="button"
          onClick={() => {
            setSubmitted(false);
            setAnswers({});
          }}
          className="mt-4 rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-sage-light"
        >
          Start over
        </button>
      </div>
    );
  }

  return (
    <div>
      <ul className="space-y-3">
        {QUESTIONS.map((q, i) => (
          <li key={q.id} className="rounded-lg border border-border bg-paper-raised p-4">
            <p className="text-sm font-medium text-text">
              {i + 1}. {q.text}
            </p>
            <div className="mt-2 flex gap-2" role="radiogroup" aria-label={q.text}>
              <button
                type="button"
                role="radio"
                aria-checked={answers[q.id] === true}
                onClick={() => setAnswer(q.id, true)}
                className={`rounded-md border px-4 py-1.5 text-sm font-medium transition-colors ${
                  answers[q.id] === true ? "border-sage bg-sage-light text-sage" : "border-border text-text-muted"
                }`}
              >
                Yes
              </button>
              <button
                type="button"
                role="radio"
                aria-checked={answers[q.id] === false}
                onClick={() => setAnswer(q.id, false)}
                className={`rounded-md border px-4 py-1.5 text-sm font-medium transition-colors ${
                  answers[q.id] === false ? "border-danger bg-danger/10 text-danger" : "border-border text-text-muted"
                }`}
              >
                Not yet
              </button>
            </div>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={answeredCount < QUESTIONS.length}
        className="mt-6 w-full rounded-md bg-ink py-3 text-sm font-semibold text-paper disabled:opacity-40 sm:w-auto sm:px-8"
      >
        {answeredCount < QUESTIONS.length ? `Answer all questions (${answeredCount}/${QUESTIONS.length})` : "See my result"}
      </button>
    </div>
  );
}
