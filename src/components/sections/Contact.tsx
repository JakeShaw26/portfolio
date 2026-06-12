"use client";

import { useState } from "react";

import { Section } from "@/components/layout/Section";
import { Magnetic } from "@/components/motion/Magnetic";
import { site } from "@/lib/content/site";
import {
  contactSchema,
  getFieldErrors,
  type ContactFieldErrors,
} from "@/lib/validation/contact";

type Status = "idle" | "sending" | "success" | "error";

const inputClass =
  "mt-2 w-full border-b border-line bg-transparent py-3 text-lg text-foreground outline-none transition-colors placeholder:text-muted/50 focus:border-accent";

export function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [fieldErrors, setFieldErrors] = useState<ContactFieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setFieldErrors({});

    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    // Client-side pass for instant feedback. The server re-validates regardless.
    const parsed = contactSchema.safeParse(data);
    if (!parsed.success) {
      setFieldErrors(getFieldErrors(parsed.error));
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const json = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        fieldErrors?: ContactFieldErrors;
      };

      if (!res.ok || !json.ok) {
        if (json.fieldErrors) setFieldErrors(json.fieldErrors);
        setFormError(json.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      form.reset();
      setStatus("success");
    } catch {
      setFormError("Network error — please email me directly.");
      setStatus("error");
    }
  }

  return (
    <Section id="contact" index="06" label="Contact">
      <div className="grid gap-12 md:grid-cols-12">
        <div className="md:col-span-7">
          <h2 className="font-display text-h2 font-semibold">
            Let’s build something{" "}
            <span className="text-accent italic">together</span>.
          </h2>

          {status === "success" ? (
            <p
              role="status"
              aria-live="polite"
              className="mt-8 text-lg text-muted"
            >
              Thanks — your message is on its way. I’ll be in touch soon.
            </p>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-6">
              <Field
                name="name"
                label="Name"
                autoComplete="name"
                error={fieldErrors.name}
              />
              <Field
                name="email"
                label="Email"
                type="email"
                autoComplete="email"
                error={fieldErrors.email}
              />
              <div>
                <label
                  htmlFor="message"
                  className="text-eyebrow text-foreground/50 uppercase"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  required
                  aria-invalid={Boolean(fieldErrors.message)}
                  aria-describedby={
                    fieldErrors.message ? "message-error" : undefined
                  }
                  className={`${inputClass} resize-none`}
                  placeholder="Tell me about your project…"
                />
                {fieldErrors.message && (
                  <p id="message-error" role="alert" className="mt-2 text-sm text-accent">
                    {fieldErrors.message}
                  </p>
                )}
              </div>

              {/* Honeypot — hidden from people, irresistible to bots. */}
              <div aria-hidden className="absolute left-[-9999px]" tabIndex={-1}>
                <label htmlFor="company">Company</label>
                <input
                  id="company"
                  name="company"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              {formError && (
                <p role="alert" className="text-sm text-accent">
                  {formError}
                </p>
              )}

              <Magnetic>
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="rounded-full bg-accent px-8 py-3 font-display text-lg text-surface transition-opacity hover:opacity-90 disabled:opacity-60"
                >
                  {status === "sending" ? "Sending…" : "Send message"}
                </button>
              </Magnetic>
            </form>
          )}

          <p className="mt-6 text-sm text-muted">
            Prefer email?{" "}
            <a href={`mailto:${site.email}`} className="text-accent hover:opacity-70">
              {site.email}
            </a>
          </p>
        </div>

        <ul className="space-y-3 text-lg md:col-span-4 md:col-start-9 md:self-end">
          {site.socials.map((social) => (
            <li key={social.label}>
              <a
                href={social.href}
                className="text-muted transition-colors hover:text-foreground"
              >
                {social.label} ↗
              </a>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}

type FieldProps = {
  name: "name" | "email";
  label: string;
  type?: string;
  autoComplete?: string;
  error?: string;
};

function Field({ name, label, type = "text", autoComplete, error }: FieldProps) {
  return (
    <div>
      <label
        htmlFor={name}
        className="text-eyebrow text-foreground/50 uppercase"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${name}-error` : undefined}
        className={inputClass}
      />
      {error && (
        <p id={`${name}-error`} role="alert" className="mt-2 text-sm text-accent">
          {error}
        </p>
      )}
    </div>
  );
}
