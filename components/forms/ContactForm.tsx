"use client";

import { useState } from "react";
import { CustomSelect } from "@/components/admin/forms/CustomSelect";
import { Button } from "@/components/ui/Button";
import type { SelectOption } from "@/lib/admin/options";
import { useI18n } from "@/lib/i18n/context";
import type { ApiResponse, ContactMessage } from "@/types";

type Status = "idle" | "submitting" | "success" | "error";

// Shared premium control styling (see .field-control in globals.css).
const inputClasses = "field-control";

/** Public contact form. Submits to POST /api/contact. */
export function ContactForm() {
  const { dict, dir } = useI18n();
  const f = dict.contact.form;
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [formKey, setFormKey] = useState(0);

  const projectTypeOptions: SelectOption[] = [
    { value: "website", label: f.options.projectType.website },
    { value: "dashboard", label: f.options.projectType.dashboard },
    { value: "webapp", label: f.options.projectType.webapp },
    { value: "optimization", label: f.options.projectType.optimization },
    { value: "other", label: f.options.projectType.other },
  ];

  const budgetOptions: SelectOption[] = [
    { value: "estimate", label: f.options.budgetRange.estimate },
    { value: "under30", label: f.options.budgetRange.under30 },
    { value: "between30And70", label: f.options.budgetRange.between30And70 },
    {
      value: "between70And150",
      label: f.options.budgetRange.between70And150,
    },
    { value: "above150", label: f.options.budgetRange.above150 },
  ];

  const timelineOptions: SelectOption[] = [
    { value: "urgent", label: f.options.timeline.urgent },
    { value: "oneToTwoMonths", label: f.options.timeline.oneToTwoMonths },
    { value: "threePlusMonths", label: f.options.timeline.threePlusMonths },
    { value: "flexible", label: f.options.timeline.flexible },
  ];

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
      projectType: String(data.get("projectType") ?? ""),
      budgetRange: String(data.get("budgetRange") ?? ""),
      timeline: String(data.get("timeline") ?? ""),
    };

    if (!payload.name.trim() || !payload.email.trim() || !payload.message.trim()) {
      setStatus("error");
      setError(f.errorRequired);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email.trim())) {
      setStatus("error");
      setError(f.errorEmail);
      return;
    }

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
      setFormKey((current) => current + 1);
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
    <form key={formKey} onSubmit={handleSubmit} className="space-y-3.5" dir={dir}>
      <div className="grid gap-3.5 sm:grid-cols-2">
        <div className="space-y-1">
          <label htmlFor="name" className="text-sm font-medium text-foreground">
            {f.name}
          </label>
          <input
            id="name"
            name="name"
            required
            placeholder={f.placeholders.name}
            className={inputClasses}
          />
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
            dir="ltr"
            placeholder={f.placeholders.email}
            className={inputClasses}
          />
        </div>
      </div>
      <div className="space-y-1">
        <label htmlFor="subject" className="text-sm font-medium text-foreground">
          {f.subject}
        </label>
        <input
          id="subject"
          name="subject"
          placeholder={f.placeholders.subject}
          className={inputClasses}
        />
      </div>

      <div className="grid gap-3.5 sm:grid-cols-3">
        <div className="space-y-1">
          <label
            htmlFor="projectType"
            className="text-sm font-medium text-foreground"
          >
            {f.projectType}
          </label>
          <CustomSelect
            id="projectType"
            name="projectType"
            dir={dir}
            options={projectTypeOptions}
            placeholder={f.options.empty}
            className="w-full"
          />
        </div>
        <div className="space-y-1">
          <label
            htmlFor="budgetRange"
            className="text-sm font-medium text-foreground"
          >
            {f.budgetRange}
          </label>
          <CustomSelect
            id="budgetRange"
            name="budgetRange"
            dir={dir}
            options={budgetOptions}
            placeholder={f.options.empty}
            className="w-full"
          />
        </div>
        <div className="space-y-1">
          <label
            htmlFor="timeline"
            className="text-sm font-medium text-foreground"
          >
            {f.timeline}
          </label>
          <CustomSelect
            id="timeline"
            name="timeline"
            dir={dir}
            options={timelineOptions}
            placeholder={f.options.empty}
            className="w-full"
          />
        </div>
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
          placeholder={f.placeholders.message}
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
