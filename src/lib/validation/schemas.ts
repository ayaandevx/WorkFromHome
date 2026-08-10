import { z } from "zod";

export const newsletterSchema = z.object({
  email: z.string().trim().email("Enter a valid email address.").max(254),
  consent: z.literal(true, { message: "Consent is required to subscribe." }),
  source: z.string().max(64).optional(),
});

export const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(120),
  email: z.string().trim().email("Enter a valid email address.").max(254),
  topic: z.enum(["general", "job-scam", "correction", "partnership"]).default("general"),
  message: z.string().trim().min(10, "Message is too short.").max(5000),
});

export type NewsletterInput = z.infer<typeof newsletterSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
