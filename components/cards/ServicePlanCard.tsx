"use client";

import type { Service } from "@/types";
import {
  FiCheckCircle,
  FiLayers,
  FiMonitor,
  FiServer,
  FiSettings,
  FiTrendingUp,
} from "react-icons/fi";
import { formatPrice, cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { PublicCtaLink } from "@/components/ui/PublicCtaLink";
import { useI18n } from "@/lib/i18n/context";

interface ServicePlanCardProps {
  service: Service;
}

function serviceIcon(service: Service) {
  const key = `${service.slug} ${service.name}`.toLowerCase();

  if (
    key.includes("dashboard") ||
    key.includes("admin") ||
    key.includes("panel") ||
    key.includes("داشبورد") ||
    key.includes("پنل")
  ) {
    return <FiLayers />;
  }

  if (
    key.includes("website") ||
    key.includes("landing") ||
    key.includes("site") ||
    key.includes("وب") ||
    key.includes("سایت")
  ) {
    return <FiMonitor />;
  }

  if (
    key.includes("optimiz") ||
    key.includes("seo") ||
    key.includes("growth") ||
    key.includes("بهینه") ||
    key.includes("سئو")
  ) {
    return <FiTrendingUp />;
  }

  if (
    key.includes("custom") ||
    key.includes("app") ||
    key.includes("platform") ||
    key.includes("saas") ||
    key.includes("اپ") ||
    key.includes("اختصاص")
  ) {
    return <FiServer />;
  }

  return <FiSettings />;
}

/** Clean premium service card. */
export function ServicePlanCard({ service }: ServicePlanCardProps) {
  const { dict } = useI18n();

  const isCustomPrice = service.priceCents == null;
  const icon = serviceIcon(service);

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-[1.6rem] border p-5 transition-all duration-300 sm:p-6",
        service.isFeatured
          ? "border-primary/35 bg-linear-to-br from-primary/14 via-surface/80 to-surface shadow-[0_24px_80px_rgba(79,124,255,0.16)]"
          : "border-border/65 bg-surface/55 shadow-[0_18px_60px_rgba(3,7,18,0.22)] hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_24px_80px_rgba(79,124,255,0.10)]",
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-6 top-0 h-px bg-linear-to-r from-transparent via-primary/35 to-transparent"
      />

      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute -inset-e-24 -top-24 h-52 w-52 rounded-full blur-3xl transition-opacity duration-300",
          service.isFeatured
            ? "bg-primary/18 opacity-100"
            : "bg-primary/12 opacity-0 group-hover:opacity-100",
        )}
      />

      {service.isFeatured ? (
        <div className="absolute inset-e-5 top-5 z-10">
          <Badge tone="brand">{dict.card.mostPopular}</Badge>
        </div>
      ) : null}

      <div className="relative flex flex-1 flex-col">
        {/* Header */}
        <header className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-xl text-primary-light shadow-[0_12px_34px_rgba(79,124,255,0.12)]">
              {icon}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-black leading-8 tracking-tight text-foreground">
              {service.name}
            </h3>

            {service.tagline ? (
              <p className="text-sm font-bold leading-7 text-primary-light">
                {service.tagline}
              </p>
            ) : null}

            {service.description ? (
              <p className="text-sm leading-7 text-muted">
                {service.description}
              </p>
            ) : null}
          </div>
        </header>

        {/* Price */}
        <div className="mt-6 rounded-2xl border border-border/55 bg-background/35 p-4">
          <p className="mb-2 text-xs font-bold text-faint">
            {isCustomPrice ? dict.card.contactQuote : dict.card.from}
          </p>

          <div className="flex items-end gap-2">
            <span className="text-3xl font-black leading-none tracking-tighter text-foreground sm:text-4xl">
              {formatPrice(
                service.priceCents,
                service.currency,
                dict.card.contactQuote,
              )}
            </span>

            {!isCustomPrice && service.billingPeriod ? (
              <span className="pb-1 text-sm font-medium text-faint">
                / {service.billingPeriod}
              </span>
            ) : null}
          </div>
        </div>

        {/* Features */}
        {service.features && service.features.length > 0 ? (
          <ul className="mt-6 flex-1 space-y-3">
            {service.features.slice(0, 7).map((feature) => (
              <li key={feature} className="flex items-start gap-3">
                <FiCheckCircle
                  size={18}
                  className="mt-1 shrink-0 text-primary-light"
                />
                <span className="text-sm font-medium leading-7 text-muted">
                  {feature}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex-1" />
        )}

        {/* CTA */}
        <footer className="mt-7 space-y-3 border-t border-border/55 pt-5">
          <PublicCtaLink
            href={`/start-project?service=${service.slug}`}
            variant={service.isFeatured ? "primary" : "outline"}
            className="w-full"
          >
            {service.ctaLabel ?? dict.planner.cta.start}
            <span aria-hidden>←</span>
          </PublicCtaLink>

          <ButtonLink
            href="/contact"
            variant="ghost"
            size="sm"
            className="w-full"
          >
            {dict.card.getStarted}
          </ButtonLink>
        </footer>
      </div>
    </article>
  );
}
