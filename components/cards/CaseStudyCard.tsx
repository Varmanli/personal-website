import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { TechBadge } from "@/components/sections/TechStack";
import { cn } from "@/lib/utils";
import type { LocalizedProject } from "@/lib/i18n/localize";
import {
  FiArrowUpLeft,
  FiBarChart2,
  FiCheckCircle,
  FiCreditCard,
  FiGlobe,
  FiImage,
  FiLayout,
  FiSmartphone,
} from "react-icons/fi";

export function CaseStudyCard({
  project,
  ctaLabel,
  caseStudyLabel,
  detailLabel,
  featured = false,
  className,
}: {
  project: LocalizedProject;
  ctaLabel: string;
  caseStudyLabel: string;
  detailLabel: string;
  featured?: boolean;
  className?: string;
}) {
  const metrics = (project.homeMetrics ?? []).slice(0, featured ? 4 : 2);
  const highlights = (project.technicalHighlights ?? []).slice(
    0,
    featured ? 5 : 3,
  );
  const techs = project.technologies ?? [];
  const projectType = project.projectType;

  return (
    <article
      className={cn(
        "neon-card group relative overflow-hidden rounded-[1.9rem] p-4 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_24px_90px_rgba(79,124,255,0.14)] sm:p-5",
        featured && "lg:p-6",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-14 -top-14 h-40 w-40 rounded-full bg-primary/12 blur-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />

      <div className="relative flex h-full flex-col">
        <ProjectPreview project={project} featured={featured} />

        <div className="mt-5 flex items-center justify-between gap-3">
          {projectType ? (
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-2/70 px-3 py-1 text-[11px] font-semibold tracking-[0.16em] text-primary-light">
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              {projectType}
            </span>
          ) : (
            <span />
          )}

          <span className="text-xs text-faint">{caseStudyLabel}</span>
        </div>

        <div className="mt-4">
          <h3
            className={cn(
              "font-semibold tracking-tight text-foreground",
              featured ? "text-2xl sm:text-[1.75rem]" : "text-xl",
            )}
          >
            {project.title}
          </h3>
          {project.shortDescription && (
            <p
              className={cn(
                "mt-3 text-muted",
                featured ? "text-sm leading-7 sm:text-base" : "text-sm leading-7",
              )}
            >
              {project.shortDescription}
            </p>
          )}
        </div>

        {metrics.length > 0 && (
          <div
            className={cn(
              "mt-5 grid gap-2",
              featured ? "grid-cols-2 xl:grid-cols-4" : "grid-cols-2",
            )}
          >
            {metrics.map((metric) => (
              <div
                key={`${metric.label}-${metric.value}`}
                className="rounded-2xl border border-border bg-surface-2/55 px-3 py-3 backdrop-blur"
              >
                <div className="text-[11px] text-faint">{metric.label}</div>
                <div className="mt-1.5 text-sm font-semibold text-foreground">
                  {metric.value}
                </div>
              </div>
            ))}
          </div>
        )}

        {highlights.length > 0 && (
          <ul
            className={cn(
              "mt-5",
              featured
                ? "grid gap-2.5 sm:grid-cols-2"
                : "space-y-2.5",
            )}
          >
            {highlights.map((highlight) => (
              <li
                key={highlight}
                className="flex items-start gap-2.5 text-sm leading-6 text-muted"
              >
                <span className="mt-1 shrink-0 text-primary-light">
                  <FiCheckCircle size={14} />
                </span>
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        )}

        {techs.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {techs.slice(0, featured ? 8 : 6).map((tech) => (
              <TechBadge key={tech} value={tech} />
            ))}
            {techs.length > (featured ? 8 : 6) && (
              <span className="inline-flex items-center rounded-full border border-border bg-surface-2/50 px-3 py-1.5 text-xs font-medium text-faint backdrop-blur">
                +{techs.length - (featured ? 8 : 6)}
              </span>
            )}
          </div>
        )}

        <div className="mt-6 flex items-center justify-between border-t border-border/80 pt-4">
          <span className="text-sm text-faint">{detailLabel}</span>
          <ButtonLink
            href={`/projects/${project.slug}`}
            variant="ghost"
            className="relative z-10 px-0 text-primary-light hover:bg-transparent"
          >
            {ctaLabel}
            <FiArrowUpLeft />
          </ButtonLink>
        </div>
      </div>
    </article>
  );
}

function ProjectPreview({
  project,
  featured,
}: {
  project: LocalizedProject;
  featured?: boolean;
}) {
  const image =
    project.previewImageUrl || project.coverImageUrl || project.thumbnailUrl;
  if (image) {
    return (
      <div
        className={cn(
          "relative overflow-hidden rounded-[1.5rem] border border-border bg-background/60",
          featured ? "aspect-[16/9]" : "aspect-[16/10]",
        )}
      >
        <Image
          src={image}
          alt={`پیش‌نمایش پروژه ${project.title}`}
          fill
          sizes={
            featured
              ? "(max-width: 1024px) 100vw, 66vw"
              : "(max-width: 768px) 100vw, 33vw"
          }
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-linear-to-t from-background/85 via-background/18 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-br from-primary/12 via-transparent to-accent/12" />
      </div>
    );
  }

  const previewTone = inferPreviewTone(project);
  if (previewTone === "marketplace") {
    return (
      <div className="relative aspect-[16/10] overflow-hidden rounded-[1.5rem] border border-border bg-background/65 p-4">
        <div className="absolute inset-0 bg-linear-to-br from-primary/16 via-transparent to-accent/12" />
        <div className="relative h-full rounded-[1.1rem] border border-border/80 bg-surface/75 p-3">
          <div className="flex items-center justify-between">
            <span className="rounded-full border border-border bg-surface-2/70 px-3 py-1 text-[10px] font-semibold text-primary-light">
              Marketplace
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-2xl border border-border bg-background/70 text-primary-light">
              <FiCreditCard size={15} />
            </span>
          </div>
          <div className="mt-4 grid grid-cols-[1.2fr_0.8fr] gap-3">
            <div className="space-y-3">
              <div className="rounded-2xl border border-border bg-background/55 p-3">
                <div className="mb-2 h-2 w-24 rounded-full bg-primary/30" />
                <div className="grid grid-cols-3 gap-2">
                  <span className="h-12 rounded-xl bg-surface-2/80" />
                  <span className="h-12 rounded-xl bg-surface-2/65" />
                  <span className="h-12 rounded-xl bg-surface-2/50" />
                </div>
              </div>
              <div className="rounded-2xl border border-border bg-background/55 p-3">
                <div className="mb-2 h-2 w-16 rounded-full bg-accent/35" />
                <div className="grid grid-cols-2 gap-2">
                  <span className="h-10 rounded-xl bg-surface-2/80" />
                  <span className="h-10 rounded-xl bg-surface-2/60" />
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-background/55 p-3">
              <div className="mb-2 h-2 w-14 rounded-full bg-primary/30" />
              <div className="space-y-2">
                <span className="block h-9 rounded-xl bg-surface-2/75" />
                <span className="block h-16 rounded-xl bg-surface-2/55" />
                <span className="block h-9 rounded-xl bg-surface-2/75" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (previewTone === "brand") {
    return (
      <div className="relative aspect-[16/10] overflow-hidden rounded-[1.5rem] border border-border bg-background/65 p-4">
        <div className="absolute inset-0 bg-linear-to-br from-accent/16 via-transparent to-primary/12" />
        <div className="relative h-full rounded-[1.1rem] border border-border/80 bg-surface/75 p-3">
          <div className="rounded-[1rem] border border-border bg-background/60 p-3">
            <div className="flex items-center justify-between gap-3">
              <div className="space-y-2">
                <span className="block h-2 w-24 rounded-full bg-primary/30" />
                <span className="block h-2 w-[4.5rem] rounded-full bg-accent/30" />
              </div>
              <span className="flex h-9 w-9 items-center justify-center rounded-2xl border border-border bg-surface-2/75 text-primary-light">
                <FiGlobe size={15} />
              </span>
            </div>
            <div className="mt-4 rounded-[1rem] border border-border bg-linear-to-br from-surface-2/90 to-background/90 p-4">
              <div className="space-y-2">
                <span className="block h-3 w-[7.5rem] rounded-full bg-primary/35" />
                <span className="block h-3 w-24 rounded-full bg-foreground/15" />
                <span className="block h-10 rounded-2xl bg-surface-2/70" />
              </div>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-3">
            <div className="rounded-2xl border border-border bg-background/55 p-3">
              <FiLayout className="text-primary-light" size={15} />
              <div className="mt-3 h-2 w-12 rounded-full bg-primary/30" />
            </div>
            <div className="rounded-2xl border border-border bg-background/55 p-3">
              <FiImage className="text-primary-light" size={15} />
              <div className="mt-3 h-2 w-10 rounded-full bg-accent/30" />
            </div>
            <div className="rounded-2xl border border-border bg-background/55 p-3">
              <FiSmartphone className="text-primary-light" size={15} />
              <div className="mt-3 h-2 w-14 rounded-full bg-primary/30" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative aspect-[16/10] overflow-hidden rounded-[1.5rem] border border-border bg-background/65 p-4">
      <div className="absolute inset-0 bg-linear-to-br from-primary/14 via-transparent to-accent/12" />
      <div className="relative h-full rounded-[1.1rem] border border-border/80 bg-surface/75 p-3">
        <div className="flex items-center justify-between">
          <span className="rounded-full border border-border bg-surface-2/70 px-3 py-1 text-[10px] font-semibold text-primary-light">
            Admin Suite
          </span>
          <span className="flex h-8 w-8 items-center justify-center rounded-2xl border border-border bg-background/70 text-primary-light">
            <FiBarChart2 size={15} />
          </span>
        </div>
        <div className="mt-4 grid grid-cols-[0.7fr_1.3fr] gap-3">
          <div className="rounded-2xl border border-border bg-background/55 p-3">
            <div className="mb-2 h-2 w-12 rounded-full bg-primary/30" />
            <div className="space-y-2">
              <span className="block h-8 rounded-xl bg-surface-2/75" />
              <span className="block h-8 rounded-xl bg-surface-2/55" />
              <span className="block h-8 rounded-xl bg-surface-2/75" />
            </div>
          </div>
          <div className="space-y-3">
            <div className="rounded-2xl border border-border bg-background/55 p-3">
              <div className="mb-2 h-2 w-20 rounded-full bg-accent/35" />
              <div className="h-[4.5rem] rounded-2xl bg-surface-2/70" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="h-10 rounded-xl border border-border bg-background/55" />
              <span className="h-10 rounded-xl border border-border bg-background/55" />
              <span className="h-10 rounded-xl border border-border bg-background/55" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function inferPreviewTone(project: {
  projectType?: string | null;
  slug: string;
  title: string;
}) {
  const haystack =
    `${project.projectType ?? ""} ${project.slug} ${project.title}`.toLowerCase();
  if (
    haystack.includes("market") ||
    haystack.includes("مارکت") ||
    haystack.includes("نگاره")
  ) {
    return "marketplace" as const;
  }
  if (
    haystack.includes("brand") ||
    haystack.includes("case study") ||
    haystack.includes("شخصی")
  ) {
    return "brand" as const;
  }
  return "admin" as const;
}
