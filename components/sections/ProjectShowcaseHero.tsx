"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  FiArrowUpRight,
  FiChevronLeft,
  FiChevronRight,
  FiMaximize2,
  FiX,
} from "react-icons/fi";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import type { ProjectMetric } from "@/types";

interface HeroAction {
  href: string;
  label: string;
  external?: boolean;
}

interface ProjectShowcaseHeroProps {
  backHref: string;
  backLabel: string;
  locale: "fa" | "en";
  eyebrow: string;
  title: string;
  shortDescription?: string | null;
  projectType?: string | null;
  year?: string | null;
  badges?: string[];
  summaryPills?: string[];
  metrics?: ProjectMetric[];
  primaryAction: HeroAction;
  secondaryAction?: HeroAction | null;
  images: string[];
}

export function ProjectShowcaseHero({
  backHref,
  backLabel,
  locale,
  eyebrow,
  title,
  shortDescription,
  projectType,
  year,
  badges = [],
  summaryPills = [],
  metrics = [],
  primaryAction,
  secondaryAction,
  images,
}: ProjectShowcaseHeroProps) {
  const gallery = useMemo(
    () => Array.from(new Set(images.filter(Boolean))),
    [images],
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const currentIndex =
    gallery.length > 0 ? Math.min(activeIndex, gallery.length - 1) : 0;
  const activeImage = gallery[currentIndex] ?? null;

  const move = useCallback(
    (dir: number) => {
      if (gallery.length < 2) return;
      setActiveIndex((prev) => (prev + dir + gallery.length) % gallery.length);
    },
    [gallery.length],
  );

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
      if (event.key === "ArrowRight") move(locale === "fa" ? -1 : 1);
      if (event.key === "ArrowLeft") move(locale === "fa" ? 1 : -1);
    }
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [locale, move, open]);

  return (
    <section className="relative overflow-hidden rounded-[2.25rem] border border-border/70 bg-[linear-gradient(180deg,rgba(17,21,43,0.86),rgba(8,10,24,0.96))] px-5 py-6 shadow-[0_32px_120px_rgba(5,7,19,0.54)] sm:px-8 sm:py-8 lg:px-10 lg:py-10">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,rgba(79,124,255,0.18),transparent_22%),radial-gradient(circle_at_82%_14%,rgba(166,107,255,0.16),transparent_22%),linear-gradient(180deg,rgba(255,255,255,0.03),transparent_24%)]"
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 grid-bg opacity-50" />

      <div className="relative">
        <a
          href={backHref}
          className="mb-6 inline-flex items-center gap-2 text-sm text-primary-light transition-colors hover:text-foreground"
        >
          <FiChevronLeft
            className={cn("shrink-0", locale === "fa" && "rotate-180")}
          />
          {backLabel}
        </a>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-start">
          <div className="order-1 space-y-4">
            <div className="relative">
              <div className="absolute -inset-3 rounded-[2rem] bg-linear-to-br from-primary/20 via-transparent to-accent/18 blur-2xl" />
              <button
                type="button"
                onClick={() => activeImage && setOpen(true)}
                className="group relative block w-full overflow-hidden rounded-[1.9rem] border border-border/80 bg-background/55 shadow-[0_24px_90px_rgba(9,12,26,0.45)]"
              >
                <div className="relative aspect-[16/10]">
                  {activeImage ? (
                    <Image
                      src={activeImage}
                      alt={title}
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 52vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                    />
                  ) : (
                    <div className="grid-bg h-full w-full bg-background/60" />
                  )}
                  <span className="absolute inset-0 bg-linear-to-t from-background/88 via-background/18 to-transparent" />
                  <span className="absolute inset-0 bg-linear-to-br from-primary/15 via-transparent to-accent/15" />
                  <span className="absolute end-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-background/50 text-foreground/85 opacity-0 backdrop-blur transition-all duration-300 group-hover:opacity-100">
                    <FiMaximize2 size={16} />
                  </span>
                  {(projectType || year) && (
                    <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                      <div className="inline-flex flex-wrap items-center gap-2 rounded-full border border-white/10 bg-background/52 px-3 py-2 text-xs font-medium text-muted backdrop-blur">
                        {year ? <span>{year}</span> : null}
                        {projectType ? (
                          <>
                            {year ? <span className="text-faint">•</span> : null}
                            <span>{projectType}</span>
                          </>
                        ) : null}
                      </div>
                    </div>
                  )}
                </div>
              </button>
            </div>

            {gallery.length > 1 && (
              <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
                {gallery.map((src, index) => (
                  <button
                    key={`${src}-${index}`}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className={cn(
                      "group relative overflow-hidden rounded-2xl border bg-background/45 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40",
                      currentIndex === index
                        ? "border-primary/60 shadow-[0_12px_34px_rgba(79,124,255,0.18)]"
                        : "border-border/80",
                    )}
                  >
                    <div className="relative aspect-[4/3]">
                      <Image
                        src={src}
                        alt={`${title} ${index + 1}`}
                        fill
                        sizes="(max-width: 768px) 25vw, 10vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      />
                      <span
                        className={cn(
                          "absolute inset-0 bg-linear-to-t from-background/70 via-transparent to-transparent transition-opacity",
                          currentIndex === index ? "opacity-30" : "opacity-60",
                        )}
                      />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="order-2 flex flex-col justify-center space-y-6 lg:ps-2">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="brand" className="px-3 py-1 text-[11px] uppercase tracking-[0.22em]">
                  {eyebrow}
                </Badge>
                {projectType ? (
                  <Badge tone="accent" className="px-3 py-1 text-[11px] uppercase tracking-[0.18em]">
                    {projectType}
                  </Badge>
                ) : null}
              </div>

              {badges.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {badges.slice(0, 5).map((item, index) => (
                    <span
                      key={`${item}-${index}`}
                      className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-background/30 px-3 py-1.5 text-xs font-medium text-muted"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-primary-light" />
                      {item}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="max-w-2xl space-y-4">
              <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-5xl sm:leading-[1.05]">
                {title}
              </h1>
              {shortDescription ? (
                <p className="text-base leading-8 text-muted sm:text-lg">
                  {shortDescription}
                </p>
              ) : null}
            </div>

            {summaryPills.length > 0 && (
              <div className="flex flex-wrap gap-2.5">
                {summaryPills.slice(0, 4).map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center rounded-full border border-border/70 bg-surface-2/45 px-3 py-1.5 text-xs font-medium text-muted"
                  >
                    {item}
                  </span>
                ))}
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              <ButtonLink
                href={primaryAction.href}
                external={primaryAction.external}
                size="lg"
                className="shadow-[0_18px_40px_rgba(79,124,255,0.22)]"
              >
                {primaryAction.label}
                <FiArrowUpRight />
              </ButtonLink>
              {secondaryAction ? (
                <ButtonLink
                  href={secondaryAction.href}
                  external={secondaryAction.external}
                  variant="outline"
                  size="lg"
                >
                  {secondaryAction.label}
                </ButtonLink>
              ) : null}
            </div>

            {metrics.length > 0 && (
              <div className="grid gap-3 sm:grid-cols-3">
                {metrics.slice(0, 3).map((metric, index) => (
                  <div
                    key={`${metric.label}-${metric.value}-${index}`}
                    className="rounded-[1.45rem] border border-border/80 bg-background/28 px-4 py-4"
                  >
                    <p className="text-2xl font-semibold tracking-tight text-foreground sm:text-[1.95rem]">
                      {metric.value}
                    </p>
                    <p className="mt-1.5 text-sm font-medium text-primary-light">
                      {metric.label}
                    </p>
                    {metric.description ? (
                      <p className="mt-2 text-xs leading-6 text-muted">
                        {metric.description}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {open && activeImage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background/92 p-4 backdrop-blur-md"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close"
            className="absolute end-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface-2/70 text-foreground backdrop-blur transition-colors hover:border-primary/50"
          >
            <FiX />
          </button>

          <div
            className="relative h-[78vh] w-full max-w-6xl"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={activeImage}
              alt={title}
              fill
              sizes="100vw"
              className="object-contain"
              priority
            />
          </div>

          {gallery.length > 1 && (
            <>
              {[
                { dir: locale === "fa" ? 1 : -1, side: "start-4", Icon: FiChevronLeft },
                { dir: locale === "fa" ? -1 : 1, side: "end-4", Icon: FiChevronRight },
              ].map(({ dir, side, Icon }) => (
                <button
                  key={side}
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    move(dir);
                  }}
                  className={cn(
                    "absolute top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-surface-2/70 text-foreground backdrop-blur transition-colors hover:border-primary/50",
                    side,
                  )}
                >
                  <Icon />
                </button>
              ))}
              <span className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-border bg-surface-2/70 px-3 py-1 text-xs text-muted backdrop-blur">
                {currentIndex + 1} / {gallery.length}
              </span>
            </>
          )}
        </div>
      )}
    </section>
  );
}
