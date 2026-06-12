import { NextResponse, type NextRequest } from "next/server";

import { sendContactEmail } from "@/lib/email/contact";
import { rateLimit } from "@/lib/rate-limit";
import { contactSchema, getFieldErrors } from "@/lib/validation/contact";

export async function POST(request: NextRequest) {
  // Identify the caller for rate limiting. `x-forwarded-for` is set by the proxy
  // in front of the app (e.g. Vercel); it can be spoofed when not behind a trusted
  // proxy, so this is a soft control, not authentication.
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (!rateLimit(ip)) {
    return NextResponse.json(
      { ok: false, error: "Too many messages — please try again in a few minutes." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request." },
      { status: 400 },
    );
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    // Field errors here are non-sensitive (it's a public contact form), so returning
    // them improves UX. We never echo back internal details or stack traces.
    return NextResponse.json(
      {
        ok: false,
        error: "Please check the form and try again.",
        fieldErrors: getFieldErrors(parsed.error),
      },
      { status: 400 },
    );
  }

  const { name, email, message, company } = parsed.data;

  // Honeypot tripped: respond like a success so the bot gets no signal, but send
  // nothing. Real users never see or fill `company`.
  if (company && company.trim().length > 0) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  try {
    await sendContactEmail({ name, email, message });
  } catch (error) {
    // Log the real reason server-side; return a generic message to the client so
    // we never leak provider errors or config details.
    console.error("[contact] failed to send:", error);
    return NextResponse.json(
      { ok: false, error: "Couldn't send right now — please email me directly." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
