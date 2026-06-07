"use client";

import { useState } from "react";
import { PortfolioCard } from "@/components/cards/PortfolioCard";
import { useI18n } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";
import type { PortfolioItem } from "@/types";

type Filter = "all" | PortfolioItem["type"];

const filterValues: Filter[] = ["all", "commercial", "personal", "freelance"];

/** Client-side filterable portfolio gallery. */
export function PortfolioGallery({ items }: { items: PortfolioItem[] }) {
  const { dict } = useI18n();
  const [active, setActive] = useState<Filter>("all");

  const visible =
    active === "all" ? items : items.filter((item) => item.type === active);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-2 rounded-2xl border border-border bg-surface-2/40 p-1.5 backdrop-blur sm:inline-flex">
        {filterValues.map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setActive(value)}
            aria-pressed={active === value}
            className={cn(
              "rounded-xl px-4 py-1.5 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60",
              active === value
                ? "bg-gradient-to-r from-primary to-accent text-white shadow-[0_10px_30px_-10px_rgba(79,124,255,0.7)]"
                : "text-muted hover:bg-surface-2/70 hover:text-foreground",
            )}
          >
            {dict.portfolio.filters[value]}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="text-sm text-faint">{dict.portfolio.emptyCat}</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((item) => (
            <PortfolioCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
