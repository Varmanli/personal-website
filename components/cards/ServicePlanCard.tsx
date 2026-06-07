"use client";

import type { Service } from "@/types";
import { formatPrice, cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { useI18n } from "@/lib/i18n/context";

interface ServicePlanCardProps {
  service: Service;
}

/** Premium pricing card for a single service/plan. */
export function ServicePlanCard({ service }: ServicePlanCardProps) {
  const { dict } = useI18n();
  const isCustomPrice = service.priceCents == null;

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-3xl p-6 transition-all duration-300",
        service.isFeatured
          ? "border border-primary/45 bg-linear-to-b from-primary/16 via-surface-2/80 to-surface shadow-[0_24px_90px_rgba(79,124,255,0.18)]"
          : "neon-card hover:-translate-y-1 hover:border-primary/35 hover:shadow-[0_24px_80px_rgba(79,124,255,0.12)]",
      )}
    >
      {/* Background glow */}
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100",
          service.isFeatured
            ? "bg-linear-to-br from-primary/18 via-transparent to-accent/18 opacity-100"
            : "bg-linear-to-br from-primary/12 via-transparent to-accent/12",
        )}
      />

      <span
        aria-hidden
        className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-primary/15 blur-3xl transition-opacity duration-300 group-hover:opacity-100"
      />

      {service.isFeatured && (
        <div className="absolute right-5 top-5 z-10">
          <Badge
            tone="brand"
            className="shadow-[0_0_28px_rgba(79,124,255,0.22)]"
          >
            {dict.card.mostPopular}
          </Badge>
        </div>
      )}

      <div className="relative flex flex-1 flex-col">
        {/* Header */}
        <div className="pr-24">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-background/50 text-primary-light backdrop-blur transition-colors group-hover:border-primary/40 group-hover:bg-primary/10">
            <span className="text-lg font-bold">{service.name.charAt(0)}</span>
          </div>

          <h3 className="text-xl font-bold tracking-tight text-foreground">
            {service.name}
          </h3>

          {service.tagline && (
            <p className="mt-2 text-sm font-medium text-primary-light">
              {service.tagline}
            </p>
          )}
        </div>

        {/* Price */}
        <div className="mt-6 rounded-2xl border border-border bg-background/35 p-4 backdrop-blur">
          <div className="flex items-end gap-1.5">
            {!isCustomPrice && (
              <span className="pb-1 text-xs font-medium uppercase tracking-wide text-faint">
                {dict.card.from}
              </span>
            )}

            <span className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {formatPrice(
                service.priceCents,
                service.currency,
                dict.card.contactQuote,
              )}
            </span>

            {!isCustomPrice && service.billingPeriod && (
              <span className="pb-1 text-sm text-faint">
                / {service.billingPeriod}
              </span>
            )}
          </div>

          {service.description && (
            <p className="mt-3 text-sm leading-relaxed text-muted">
              {service.description}
            </p>
          )}
        </div>

        {/* Features */}
        {service.features && service.features.length > 0 && (
          <ul className="mt-6 flex-1 space-y-3 text-sm text-muted">
            {service.features.map((feature) => (
              <li key={feature} className="flex items-start gap-3">
                <span
                  aria-hidden
                  className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-primary/25 bg-primary/10 text-[11px] font-bold text-primary-light shadow-[0_0_18px_rgba(79,124,255,0.12)]"
                >
                  ✓
                </span>

                <span className="leading-relaxed">{feature}</span>
              </li>
            ))}
          </ul>
        )}

        {/* CTA */}
        <div className="mt-7 border-t border-border/80 pt-5">
          <ButtonLink
            href="/contact"
            variant={service.isFeatured ? "primary" : "outline"}
            className="w-full"
          >
            {service.ctaLabel ?? dict.card.getStarted}
            <span aria-hidden>→</span>
          </ButtonLink>

          <ButtonLink
            href={`/start-project?service=${service.slug}`}
            variant="ghost"
            size="sm"
            className="mt-2 w-full"
          >
            {dict.planner.cta.start}
          </ButtonLink>

          <p className="mt-3 text-center text-xs leading-relaxed text-faint">
            {dict.card.customNote}
          </p>
        </div>
      </div>
    </article>
  );
}
