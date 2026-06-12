import { z } from "zod";

/**
 * Shared contact schema — the SAME schema runs on the client (for instant UX
 * feedback) and on the server (the actual trust boundary). Client validation is
 * a convenience; the server re-validates every request because client checks can
 * be bypassed trivially (curl, devtools, a tampered bundle).
 */
export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(80),
  email: z.email("Please enter a valid email address.").max(254),
  message: z
    .string()
    .trim()
    .min(10, "Tell me a little more — 10 characters or so.")
    .max(2000, "That's a bit long — keep it under 2000 characters."),
  // Honeypot. Hidden from real users; bots fill every field they find. Left loose
  // on purpose so a filled value never surfaces as a "validation error" — the
  // route decides what to do with it (silently accept, send nothing).
  company: z.string().optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;

export type ContactField = "name" | "email" | "message";
export type ContactFieldErrors = Partial<Record<ContactField, string>>;

/** First error message per field — used identically on client and server. */
export function getFieldErrors(error: z.ZodError<ContactInput>): ContactFieldErrors {
  const { fieldErrors } = z.flattenError(error);
  return {
    name: fieldErrors.name?.[0],
    email: fieldErrors.email?.[0],
    message: fieldErrors.message?.[0],
  };
}
