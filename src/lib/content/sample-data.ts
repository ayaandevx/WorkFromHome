import type { Article, Author, Category, Resource, Tool, Topic } from "@/types/content";

/**
 * Local sample content. Ships the site with real, useful pages out of the
 * box. Once Sanity is connected (see README), src/lib/content/service.ts
 * automatically switches to live CMS data with the exact same shape.
 */

export const sampleAuthors: Author[] = [
  {
    _id: "author-1",
    name: "Priya Nathan",
    slug: "priya-nathan",
    role: "Remote Careers Editor",
    bioPlain:
      "Priya has spent eight years writing about distributed teams and remote hiring, and previously worked in talent acquisition for two fully-remote startups.",
  },
  {
    _id: "author-2",
    name: "Marcus Webb",
    slug: "marcus-webb",
    role: "Freelance & Productivity Writer",
    bioPlain:
      "Marcus is an independent consultant and writer covering freelancing, rate-setting, and async work habits for people building location-independent careers.",
  },
];

export const sampleCategories: Category[] = [
  { _id: "cat-1", title: "Remote Jobs", slug: "remote-jobs", description: "Guides on finding and evaluating remote roles." },
  { _id: "cat-2", title: "Career Guides", slug: "career-guides", description: "Long-term career strategy for remote workers." },
  { _id: "cat-3", title: "Resume & Interview", slug: "resume-interview", description: "Getting hired, from resume to offer." },
  { _id: "cat-4", title: "Freelancing", slug: "freelancing", description: "Running an independent remote career." },
  { _id: "cat-5", title: "Productivity", slug: "productivity", description: "Working effectively from anywhere." },
  { _id: "cat-6", title: "Scam Prevention", slug: "scam-prevention", description: "Spotting and avoiding remote-job scams." },
];

export const sampleTopics: Topic[] = [
  {
    _id: "topic-1",
    title: "Getting Hired Remotely",
    slug: "getting-hired-remotely",
    description: "The full pillar on finding, applying to, and landing legitimate remote jobs.",
  },
  {
    _id: "topic-2",
    title: "Working Better From Anywhere",
    slug: "working-better-from-anywhere",
    description: "Productivity, tools, and habits for distributed work.",
  },
];

const now = new Date();
const daysAgo = (n: number) => new Date(now.getTime() - n * 86400000).toISOString();

export const sampleArticles: Article[] = [
  {
    _id: "article-1",
    title: "How to Spot a Remote-Job Scam Before You Apply",
    slug: "how-to-spot-a-remote-job-scam",
    excerpt:
      "Fake remote job postings are designed to look ordinary. Here are the concrete red flags — in the posting, the interview, and the offer — that separate scams from legitimate remote roles.",
    author: sampleAuthors[0],
    categories: [sampleCategories[5], sampleCategories[0]],
    topics: [sampleTopics[0]],
    tags: [{ _id: "tag-1", title: "Job Scams", slug: "job-scams" }],
    bodyHtml: `
      <p>Remote-job scams have gotten harder to spot because they borrow the same language, tone, and structure as real postings. The good news: the tells are consistent once you know where to look.</p>
      <h2>Red flags in the job posting</h2>
      <ul>
        <li>Vague company details — no verifiable website, physical address, or leadership team.</li>
        <li>Pay that is significantly above market for the stated experience level.</li>
        <li>Interviews conducted entirely over chat apps like Telegram or WhatsApp, never a call or video.</li>
        <li>A job description that reads like a template with the company name swapped in.</li>
      </ul>
      <h2>Red flags during the "hiring" process</h2>
      <ul>
        <li>Being asked to buy your own equipment and get reimbursed later.</li>
        <li>Being asked for banking details before you've signed any formal offer.</li>
        <li>Pressure to decide immediately, with urgency used as a persuasion tactic.</li>
        <li>A check or "advance" arrives before you've done any work, with a request to send part of it elsewhere.</li>
      </ul>
      <h2>How to verify a company quickly</h2>
      <p>Search the company name plus "scam" or "review." Check whether the recruiter's profile and the company's official domain match. Look up the company on a business registry if it claims to be incorporated. Legitimate employers are glad to verify their identity — scammers avoid anything that can be checked.</p>
    `,
    bodyPlain:
      "Remote-job scams borrow the tone of real postings, but the tells are consistent: vague company details, pay above market, chat-only interviews, requests for money or banking details up front, and pressure to decide immediately. Verifying a company's domain and registration takes minutes and filters out nearly all scams.",
    faqs: [
      {
        question: "Is it a scam if a company asks me to buy my own laptop?",
        answerPlain:
          "Not automatically — some legitimate remote roles use a stipend model. It becomes a red flag when you're asked to pay first and get reimbursed later, especially before signing any formal paperwork.",
      },
      {
        question: "Are all-text interviews always a scam?",
        answerPlain:
          "Not always, but a company that refuses any video or phone contact throughout the entire process, including after an offer, is a strong warning sign worth investigating further.",
      },
    ],
    relatedArticles: [],
    relatedTools: [{ title: "Remote-Job Readiness Checker", slug: "remote-job-readiness-checker" }],
    publishedAt: daysAgo(6),
    updatedAt: daysAgo(2),
    readingTimeMinutes: 6,
  },
  {
    _id: "article-2",
    title: "The Remote Resume: What Actually Gets Past ATS Filters",
    slug: "remote-resume-ats-filters",
    excerpt:
      "Applicant tracking systems reject far more remote resumes than hiring managers ever see. Here's how the filters actually work and how to format around them.",
    author: sampleAuthors[0],
    categories: [sampleCategories[2]],
    topics: [sampleTopics[0]],
    tags: [{ _id: "tag-2", title: "ATS", slug: "ats" }, { _id: "tag-3", title: "Resume", slug: "resume" }],
    bodyHtml: `
      <p>Most mid-size and large employers filter resumes through an applicant tracking system before a human ever sees them. For remote roles, competition is higher, so ATS filtering is stricter.</p>
      <h2>What ATS software actually checks</h2>
      <p>It's mostly keyword and structure matching, not intelligent reading. The system looks for skills and job titles that match the posting, standard section headers, and clean, parseable formatting.</p>
      <h2>Formatting choices that hurt you</h2>
      <ul>
        <li>Text inside tables, columns, or text boxes — many parsers skip it entirely.</li>
        <li>Headers/footers containing your contact info.</li>
        <li>Unusual fonts or graphics used as section dividers.</li>
        <li>Job titles that don't match how the role is commonly searched.</li>
      </ul>
      <h2>What to do instead</h2>
      <p>Use a single-column layout, standard section names ("Experience," "Skills," "Education"), and mirror 2-3 exact phrases from the job posting where they honestly describe your background. Save as a standard .docx or text-based PDF, not an image-based export.</p>
    `,
    bodyPlain:
      "ATS software matches keywords and structure, not meaning. Tables, columns, headers/footers, and image-based PDFs often get skipped. Use a single-column layout, standard section headers, and phrases that mirror the posting where accurate.",
    faqs: [
      {
        question: "Do I need a different resume for every application?",
        answerPlain:
          "You don't need a full rewrite, but adjusting the skills section and a few phrases to match each posting's language meaningfully improves ATS match rates.",
      },
    ],
    relatedArticles: [],
    relatedTools: [{ title: "Resume & ATS Checklist", slug: "resume-ats-checklist" }],
    publishedAt: daysAgo(10),
    readingTimeMinutes: 7,
  },
  {
    _id: "article-3",
    title: "Setting Your Freelance Rate: A Practical Framework",
    slug: "setting-your-freelance-rate",
    excerpt:
      "Most new freelancers price based on guesswork. Here's a framework that accounts for your costs, taxes, non-billable time, and target income.",
    author: sampleAuthors[1],
    categories: [sampleCategories[3]],
    topics: [sampleTopics[1]],
    tags: [{ _id: "tag-4", title: "Rates", slug: "rates" }],
    bodyHtml: `
      <p>An hourly rate isn't just your desired salary divided by 2,080 hours. It has to absorb the hours you don't bill, your own taxes and benefits, and business costs a salaried job would otherwise cover.</p>
      <h2>The four inputs that matter</h2>
      <ul>
        <li><strong>Target annual income</strong> — what you actually want to take home.</li>
        <li><strong>Billable ratio</strong> — most freelancers bill 60-75% of working hours once you subtract admin, marketing, and gaps between contracts.</li>
        <li><strong>Overhead</strong> — software, insurance, self-employment tax, equipment.</li>
        <li><strong>Buffer</strong> — a margin for slow months and rate negotiation room.</li>
      </ul>
      <p>Use the <a href="/tools/freelance-rate-calculator">freelance rate calculator</a> to turn these into a concrete hourly or project rate.</p>
    `,
    bodyPlain:
      "Freelance rates need to absorb non-billable hours, overhead, and taxes — not just your target income divided by working hours. A billable ratio of 60-75% is typical once admin and gaps are accounted for.",
    faqs: [],
    relatedArticles: [],
    relatedTools: [{ title: "Freelance Rate Calculator", slug: "freelance-rate-calculator" }],
    publishedAt: daysAgo(14),
    readingTimeMinutes: 5,
  },
  {
    _id: "article-4",
    title: "Running Meetings Across Five Time Zones Without Burning Anyone Out",
    slug: "running-meetings-across-time-zones",
    excerpt:
      "Distributed teams either rotate the pain of inconvenient meeting times fairly, or the same people always lose. Here's how to do the former.",
    author: sampleAuthors[1],
    categories: [sampleCategories[4]],
    topics: [sampleTopics[1]],
    tags: [{ _id: "tag-5", title: "Time Zones", slug: "time-zones" }],
    bodyHtml: `
      <p>The default failure mode on distributed teams is that meeting times quietly optimize for whoever is in the majority time zone, and everyone else absorbs the cost.</p>
      <h2>A better default</h2>
      <ul>
        <li>Rotate recurring meeting times across time zones on a fixed schedule, not ad hoc.</li>
        <li>Default to async updates for anything that doesn't need real-time discussion.</li>
        <li>Record synchronous meetings and publish notes within the hour.</li>
      </ul>
      <p>Use the <a href="/tools/timezone-meeting-calculator">timezone meeting calculator</a> to find overlap windows before you propose a time.</p>
    `,
    bodyPlain:
      "Distributed teams often default to meeting times that favor the majority time zone. Rotating recurring meetings fairly, defaulting to async, and publishing notes quickly spreads the cost evenly.",
    faqs: [],
    relatedArticles: [],
    relatedTools: [{ title: "Timezone & Meeting Calculator", slug: "timezone-meeting-calculator" }],
    publishedAt: daysAgo(18),
    readingTimeMinutes: 5,
  },
  {
    _id: "article-5",
    title: "How to Answer 'Why Do You Want to Work Remotely?' Without Sounding Generic",
    slug: "why-do-you-want-to-work-remotely-interview-answer",
    excerpt:
      "This question filters for candidates who've actually thought about how they work, not just where. Here's how to answer it with specifics.",
    author: sampleAuthors[0],
    categories: [sampleCategories[2]],
    topics: [sampleTopics[0]],
    tags: [{ _id: "tag-6", title: "Interviewing", slug: "interviewing" }],
    bodyHtml: `
      <p>Interviewers ask this question to filter out candidates who want remote work only for the commute savings, without having thought about how they'll stay accountable, communicate async, or avoid isolation.</p>
      <h2>A stronger structure</h2>
      <ol>
        <li>Name a specific way you work best (deep focus blocks, async written communication, etc.)</li>
        <li>Give one concrete example from past remote or hybrid experience.</li>
        <li>Acknowledge one real challenge of remote work and how you handle it.</li>
      </ol>
      <p>Avoid answers that are entirely about lifestyle benefits — commute, flexibility, travel — without connecting them to how you'll actually perform in the role.</p>
    `,
    bodyPlain:
      "This interview question filters for candidates who've thought about how they work, not just the lifestyle benefits. A strong answer names a specific working style, gives a concrete example, and acknowledges a real challenge of remote work.",
    faqs: [],
    relatedArticles: [],
    relatedTools: [{ title: "Remote-Job Readiness Checker", slug: "remote-job-readiness-checker" }],
    publishedAt: daysAgo(22),
    readingTimeMinutes: 4,
  },
  {
    _id: "article-6",
    title: "The Remote Job Boards Worth Your Time in 2026",
    slug: "best-remote-job-boards",
    excerpt:
      "Most job board lists are outdated or padded with affiliate links. Here's an honest breakdown of boards actually worth checking regularly.",
    author: sampleAuthors[1],
    categories: [sampleCategories[0]],
    topics: [sampleTopics[0]],
    tags: [{ _id: "tag-7", title: "Job Boards", slug: "job-boards" }],
    bodyHtml: `
      <p>Job board quality varies enormously — some are curated and current, others resell stale listings scraped from elsewhere. Prioritize boards that link directly back to the original source and refresh frequently.</p>
      <h2>What to check before trusting a board</h2>
      <ul>
        <li>Does it show a real publish date, and does the listing still exist on the original site?</li>
        <li>Does it link to the employer's own application page rather than an intermediary form?</li>
        <li>Is the listing volume consistent with a real, maintained feed, not a one-time scrape?</li>
      </ul>
      <p>Our own <a href="/jobs">remote jobs board</a> aggregates from providers we've vetted for exactly these properties, with the original source always linked from each listing.</p>
    `,
    bodyPlain:
      "Job board quality varies widely. Prioritize boards with real publish dates, direct links to the employer's own application page, and listing volume consistent with an actively maintained feed rather than a stale scrape.",
    faqs: [],
    relatedArticles: [],
    relatedTools: [],
    publishedAt: daysAgo(28),
    readingTimeMinutes: 5,
  },
];

export const sampleTools: Tool[] = [
  {
    _id: "tool-1",
    title: "Resume & ATS Checklist",
    slug: "resume-ats-checklist",
    summary: "Check your resume against the formatting and content rules ATS software actually enforces.",
    kind: "resume-ats-checklist",
    introHtml:
      "<p>Work through each item before you submit. Every rule here reflects a documented ATS parsing behavior, not a stylistic preference.</p>",
    relatedArticles: [{ title: "The Remote Resume: What Actually Gets Past ATS Filters", slug: "remote-resume-ats-filters" }],
  },
  {
    _id: "tool-2",
    title: "Remote-Job Readiness Checker",
    slug: "remote-job-readiness-checker",
    summary: "A short self-assessment covering communication, self-management, and setup before you apply.",
    kind: "readiness-checker",
    introHtml: "<p>Answer honestly — this is a planning tool, not a test you pass or fail.</p>",
    relatedArticles: [{ title: "How to Spot a Remote-Job Scam Before You Apply", slug: "how-to-spot-a-remote-job-scam" }],
  },
  {
    _id: "tool-3",
    title: "Freelance Rate Calculator",
    slug: "freelance-rate-calculator",
    summary: "Turn your target income, billable ratio, and overhead into a concrete hourly or project rate.",
    kind: "rate-calculator",
    introHtml: "<p>Based on the framework in our guide to setting your freelance rate.</p>",
    relatedArticles: [{ title: "Setting Your Freelance Rate: A Practical Framework", slug: "setting-your-freelance-rate" }],
  },
  {
    _id: "tool-4",
    title: "Timezone & Meeting Calculator",
    slug: "timezone-meeting-calculator",
    summary: "Find real overlap windows across your team's time zones before you propose a meeting time.",
    kind: "timezone-calculator",
    introHtml: "<p>Add your team's locations to see working-hour overlap at a glance.</p>",
    relatedArticles: [{ title: "Running Meetings Across Five Time Zones Without Burning Anyone Out", slug: "running-meetings-across-time-zones" }],
  },
];

export const sampleResources: Resource[] = [
  {
    _id: "resource-1",
    title: "How to Report a Job Scam",
    slug: "how-to-report-a-job-scam",
    description: "Where to report fraudulent job postings in the US, UK, and EU, and what information to include.",
    category: "scam-prevention",
    bodyHtml:
      "<p>In the US, report to the FTC at reportfraud.ftc.gov and to the job board itself. In the UK, report to Action Fraud. In the EU, report to your national consumer protection authority. Include the posting URL, any messages exchanged, and payment requests if applicable.</p>",
  },
  {
    _id: "resource-2",
    title: "Free Invoicing Tools for Freelancers",
    slug: "free-invoicing-tools-for-freelancers",
    description: "A short list of invoicing tools with genuinely usable free tiers for independent contractors.",
    category: "freelancing",
    bodyHtml: "<p>Look for tools with recurring invoices, multi-currency support, and payment reminders even on the free tier.</p>",
  },
  {
    _id: "resource-3",
    title: "Async Communication Norms Template",
    slug: "async-communication-norms-template",
    description: "A starting template distributed teams can adapt to set explicit async communication expectations.",
    category: "productivity",
    bodyHtml: "<p>Cover response-time expectations, which channels are for what, and how urgent issues get flagged.</p>",
  },
  {
    _id: "resource-4",
    title: "Salary Research Sources That Aren't Guesswork",
    slug: "salary-research-sources",
    description: "Where to find real compensation data instead of relying on a single self-reported average.",
    category: "career",
    bodyHtml: "<p>Cross-reference at least two independent data sources, and weight recency heavily — comp data ages quickly.</p>",
  },
];
