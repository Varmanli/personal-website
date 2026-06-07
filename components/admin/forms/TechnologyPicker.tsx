"use client";

import { useMemo, useRef, useState } from "react";
import { FiChevronDown, FiCheck, FiX, FiCode, FiSearch } from "react-icons/fi";
import { useI18n } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";
import { FieldLabel, FieldHint, FieldError } from "@/components/admin/forms/fields";
import { FloatingPanel } from "@/components/admin/forms/FloatingPanel";
import {
  TECHNOLOGIES,
  getTechnology,
  type TechnologyOption,
} from "@/lib/admin/technologies";

interface TechnologyPickerProps {
  name: string;
  label: string;
  defaultValue?: string[] | null;
  options?: TechnologyOption[];
  hint?: string;
  error?: string;
  placeholder?: string;
  dir?: "rtl" | "ltr";
}

/**
 * Multi-select technology picker — custom popover (portalled, never clipped)
 * with search + icons. Selected items render as chips and serialise into a
 * single hidden input (one value per line) under `name`, matching the server
 * action's `list()` parser. Unknown stored values are preserved as plain chips.
 */
export function TechnologyPicker({
  name,
  label,
  defaultValue,
  options = TECHNOLOGIES,
  hint,
  error,
  placeholder,
  dir,
}: TechnologyPickerProps) {
  const { dict } = useI18n();
  const t = dict.admin.tech;

  const [selected, setSelected] = useState<string[]>(
    (defaultValue ?? []).filter(Boolean),
  );
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const triggerRef = useRef<HTMLButtonElement>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, query]);

  function toggle(value: string) {
    setSelected((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  }

  function remove(value: string) {
    setSelected((prev) => prev.filter((v) => v !== value));
  }

  const ph = placeholder ?? t.placeholder;

  return (
    <div className="space-y-1.5">
      <FieldLabel htmlFor={`${name}-tech`}>{label}</FieldLabel>

      {/* Serialized value — one technology per line. */}
      <input type="hidden" name={name} value={selected.join("\n")} />

      <div className="relative" dir={dir}>
        <button
          ref={triggerRef}
          type="button"
          id={`${name}-tech`}
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className={cn(
            "field-control flex min-h-11 items-center gap-2 text-start",
            error && "field-error",
            open && "border-primary/60 ring-2 ring-primary/20",
          )}
        >
          <span className={cn("min-w-0 flex-1 truncate", !selected.length && "text-faint")}>
            {selected.length ? `${selected.length} ${t.selected}` : ph}
          </span>
          <FiChevronDown
            aria-hidden
            className={cn("shrink-0 text-faint transition-transform", open && "rotate-180")}
          />
        </button>

        <FloatingPanel
          anchorRef={triggerRef}
          open={open}
          onClose={() => setOpen(false)}
          dir={dir}
        >
          <div className="flex items-center gap-2 border-b border-border px-3">
            <FiSearch className="shrink-0 text-faint" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.search}
              className="w-full bg-transparent py-2.5 text-sm text-foreground placeholder:text-faint focus:outline-none"
            />
          </div>

          <ul role="listbox" aria-multiselectable className="max-h-60 overflow-auto p-1.5">
            {filtered.length === 0 ? (
              <li className="px-3 py-6 text-center text-sm text-faint">{t.empty}</li>
            ) : (
              filtered.map((option) => {
                const isSelected = selected.includes(option.value);
                return (
                  <li key={option.value} role="option" aria-selected={isSelected}>
                    <button
                      type="button"
                      onClick={() => toggle(option.value)}
                      className={cn(
                        "flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-start text-sm transition-colors",
                        isSelected
                          ? "bg-primary/15 text-foreground"
                          : "text-muted hover:bg-surface-2/70 hover:text-foreground",
                      )}
                    >
                      <span className={cn("shrink-0 text-base", option.colorClass)}>
                        {option.icon}
                      </span>
                      <span className="min-w-0 flex-1 truncate font-medium">
                        {option.label}
                      </span>
                      {isSelected && <FiCheck className="shrink-0 text-primary-light" />}
                    </button>
                  </li>
                );
              })
            )}
          </ul>

          {selected.length > 0 && (
            <div className="border-t border-border p-1.5">
              <button
                type="button"
                onClick={() => setSelected([])}
                className="flex w-full items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium text-faint transition-colors hover:bg-surface-2/70 hover:text-red-300"
              >
                <FiX /> {t.clear}
              </button>
            </div>
          )}
        </FloatingPanel>
      </div>

      {/* Selected chips */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {selected.map((value) => {
            const tech = getTechnology(value);
            return (
              <span
                key={value}
                className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-gradient-to-r from-primary/15 to-accent/10 px-2.5 py-1 text-xs font-medium text-foreground backdrop-blur"
              >
                <span className={cn("text-sm", tech?.colorClass ?? "text-primary-light")}>
                  {tech?.icon ?? <FiCode />}
                </span>
                {tech?.label ?? value}
                <button
                  type="button"
                  onClick={() => remove(value)}
                  aria-label={`${t.clear}: ${tech?.label ?? value}`}
                  className="text-faint transition-colors hover:text-red-300"
                >
                  <FiX className="text-[0.85rem]" />
                </button>
              </span>
            );
          })}
        </div>
      )}

      {error ? (
        <FieldError>{error}</FieldError>
      ) : hint ? (
        <FieldHint>{hint}</FieldHint>
      ) : null}
    </div>
  );
}
