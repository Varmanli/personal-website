"use client";

import { useTransition } from "react";
import { type Locale } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/context";
import { setLocale } from "@/lib/actions/locale";
import { cn } from "@/lib/utils";

const options: { value: Locale; label: string }[] = [
  { value: "en", label: "EN" },
  { value: "fa", label: "فا" },
];

/** Modern, minimal language toggle */
export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, dict } = useI18n();
  const [pending, startTransition] = useTransition();

  function changeLocale(next: Locale) {
    if (next === locale || pending) return;
    startTransition(() => void setLocale(next));
  }

  return (
    <div
      className={cn(
        "inline-flex h-9 rounded-full border border-border bg-surface-2/70 backdrop-blur-md p-1 shadow-sm",
        "transition-all duration-200",
        pending && "opacity-60 pointer-events-none",
        className,
      )}
      role="group"
      aria-label={dict.common.language}
    >
      {options.map((option) => {
        const active = locale === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => changeLocale(option.value)}
            aria-pressed={active}
            className={cn(
              "relative flex items-center justify-center px-3 rounded-full text-sm font-semibold transition-all duration-200",
              active
                ? "bg-linear-to-r from-primary to-accent text-white shadow-md"
                : "text-muted hover:text-foreground hover:bg-background/40",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
