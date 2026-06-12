import "server-only";

type ContactMessage = {
  name: string;
  email: string;
  message: string;
};

/**
 * Sends a contact message via Resend's REST API.
 *
 * Uses plain `fetch` rather than the SDK to avoid a dependency — it's also a clear
 * picture of what any email SDK does under the hood: a POST with a bearer token.
 *
 * SECURITY: this module is `server-only`, so the API key can never be bundled into
 * client JS. `RESEND_API_KEY` stays in the server environment exclusively.
 */
export async function sendContactEmail({
  name,
  email,
  message,
}: ContactMessage): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    throw new Error(
      "Email is not configured: set RESEND_API_KEY, CONTACT_TO_EMAIL and CONTACT_FROM_EMAIL.",
    );
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      // Replies go straight to the sender, but we never put their address in `from`
      // (that would fail SPF/DKIM for your domain and land in spam).
      reply_to: email,
      subject: `Portfolio enquiry from ${name}`,
      text: `${message}\n\n— ${name} <${email}>`,
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Resend responded ${res.status}: ${detail}`);
  }
}
