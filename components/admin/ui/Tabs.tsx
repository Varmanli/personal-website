"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/utils";

export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
}

/**
 * Accessible tabs. All panels stay mounted (inactive ones use `hidden`) so
 * form fields in every tab are still submitted with the form.
 */
export function Tabs({ items }: { items: TabItem[] }) {
  const [active, setActive] = useState(items[0]?.id);
  const base = useId();

  function onKeyDown(e: React.KeyboardEvent) {
    const i = items.findIndex((t) => t.id === active);
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      const dir = e.key === "ArrowRight" ? 1 : -1;
      const next = (i + dir + items.length) % items.length;
      setActive(items[next].id);
    }
  }

  return (
    <div>
      <div
        role="tablist"
        aria-orientation="horizontal"
        onKeyDown={onKeyDown}
        className="grid w-full auto-cols-fr grid-flow-col gap-1.5 rounded-2xl border border-border bg-background/40 p-1.5 backdrop-blur"
      >
        {items.map((t) => {
          const selected = t.id === active;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              id={`${base}-tab-${t.id}`}
              aria-selected={selected}
              aria-controls={`${base}-panel-${t.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(t.id)}
              className={cn(
                "relative overflow-hidden rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60",
                selected
                  ? "bg-gradient-to-r from-primary to-accent text-white shadow-[0_10px_30px_-10px_rgba(79,124,255,0.7)]"
                  : "text-muted hover:bg-surface-2/60 hover:text-foreground",
              )}
            >
              {selected && (
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/0 to-white/15"
                />
              )}
              <span className="relative">{t.label}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-5">
        {items.map((t) => (
          <div
            key={t.id}
            role="tabpanel"
            id={`${base}-panel-${t.id}`}
            aria-labelledby={`${base}-tab-${t.id}`}
            hidden={t.id !== active}
            className="space-y-5"
          >
            {t.content}
          </div>
        ))}
      </div>
    </div>
  );
}
