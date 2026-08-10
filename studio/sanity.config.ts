import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemas";

/**
 * Sanity Studio config for WorkFrom.blog.
 * Run `npx sanity init` in this /studio folder to connect it to your own
 * Sanity project, then set NEXT_PUBLIC_SANITY_PROJECT_ID / DATASET in the
 * Next.js app's .env.local. See ../README.md for full setup steps.
 */
export default defineConfig({
  name: "workfrom-blog",
  title: "WorkFrom.blog",
  projectId: "aqcgdgu8",
  dataset: "production",
  plugins: [structureTool(), visionTool()],
  schema: { types: schemaTypes },
});
