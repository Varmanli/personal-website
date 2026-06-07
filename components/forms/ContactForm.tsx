"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useI18n } from "@/lib/i18n/context";
import type { ApiResponse, ContactMessage } from "@/types";

type Status = "idle" | "submitting" | "success" | "error";

// Shared premium control styling (see .field-control in globals.css).
const inputClasses = "field-control";

/** Public contact form. Submits to POST /api/contact. */
export function ContactForm() {
  const { dict } = useI18n();
  const f = dict.contact.form;
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setError(null);

    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      subject: String(data.get("subject") ?? ""),
      message: String(data.get("message") ?? ""),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json: ApiResponse<ContactMessage> = await res.json();
      if (!res.ok || !json.ok) {
        throw new Error("request-failed");
      }
      setStatus("success");
      form.reset();
    } catch {
      // Show a localized, friendly message rather than leaking the raw
      // (English) API/network error to the visitor.
      setStatus("error");
      setError(f.errorGeneric);
    }
  }

  if (status === "success") {
    return (
      <div className="flex items-start gap-3 rounded-2xl border border-success/30 bg-success/10 p-5 text-sm text-success shadow-[0_10px_40px_-15px_rgba(52,211,153,0.5)]">
        <span
          aria-hidden
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-success/20 text-base font-bold"
        >
          ✓
        </span>
        <p className="leading-relaxed">{f.success}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <label htmlFor="name" className="text-sm font-medium text-foreground">
            {f.name}
          </label>
          <input id="name" name="name" required className={inputClasses} />
        </div>
        <div className="space-y-1">
          <label htmlFor="email" className="text-sm font-medium text-foreground">
            {f.email}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className={inputClasses}
          />
        </div>
      </div>
      <div className="space-y-1">
        <label htmlFor="subject" className="text-sm font-medium text-foreground">
          {f.subject}
        </label>
        <input id="subject" name="subject" className={inputClasses} />
      </div>
      <div className="space-y-1">
        <label htmlFor="message" className="text-sm font-medium text-foreground">
          {f.message}
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className={inputClasses}
        />
      </div>

      {status === "error" && error && (
        <p
          role="alert"
          className="flex items-start gap-2.5 rounded-xl border border-red-500/40 bg-red-500/10 p-3.5 text-sm text-red-300"
        >
          <span
            aria-hidden
            className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500/20 text-xs font-bold"
          >
            !
          </span>
          <span className="leading-relaxed">{error}</span>
        </p>
      )}

      <Button type="submit" disabled={status === "submitting"}>
        {status === "submitting" ? f.sending : f.send}
      </Button>
    </form>
  );
}
