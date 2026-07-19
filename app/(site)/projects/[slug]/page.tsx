import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { PublicCtaLink } from "@/components/ui/PublicCtaLink";
import { HiringOnly } from "@/components/layout/WebsiteModeContent";
import { ProjectGallery } from "@/components/sections/ProjectGallery";
import { ProjectTabs } from "@/components/sections/ProjectTabs";
import { ProjectLabels } from "@/components/sections/ProjectLabels";
import { getProjectBySlug } from "@/lib/data";
import { getI18n } from "@/lib/i18n/server";
import { cn } from "@/lib/utils";
import { buildMetadata, absoluteUrl } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import type { ProjectMetric } from "@/types";
import { getProjectImageSources, getProjectPrimaryImage } from "@/lib/project-images";
import {
  FiArrowUpRight,
  FiChevronLeft,
  FiExternalLink,
  FiGithub,
} from "react-icons/fi";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { locale, dict } = await getI18n();
  const project = await getProjectBySlug(slug, locale);
  if (!project) return { title: dict.meta.pages.project };

  const image = getProjectPrimaryImage(project);

  return buildMetadata({
    title: project.title,
    description: project.shortDescription,
    path: `/projects/${slug}`,
    image,
    type: "article",
  });
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const { locale, dict } = await getI18n();
  const project = await getProjectBySlug(slug, locale);

  if (!project) notFound();

  const t = dict.projectDetail;
  const isRtl = locale === "fa";

  const tags = (project.tags ?? []).filter(Boolean);
  const technologies = (project.technologies ?? []).filter(Boolean);
  const metrics = normalizeMetrics(project.homeMetrics ?? []);
  const highlights = (project.technicalHighlights ?? []).filter(Boolean);
  const challenges = (project.challenges ?? []).filter(
    (c) => c.title?.trim() || c.description?.trim(),
  );

  const galleryImages = getProjectImageSources(project);
  const hasGallery = galleryImages.length > 0;

  // Reference facts for the meta sidebar.
  const facts = [
    project.client && { label: t.client, value: project.client },
    project.role && { label: t.role, value: project.role },
    project.projectType && { label: t.category, value: project.projectType },
    project.year && { label: t.year, value: project.year },
  ].filter(Boolean) as Array<{ label: string; value: string }>;

  const links = [
    project.liveUrl && {
      label: t.viewLive.replace(" ↗", ""),
      href: project.liveUrl,
      icon: <FiExternalLink size={15} />,
    },
    project.repoUrl && {
      label: t.sourceCode,
      href: project.repoUrl,
      icon: <FiGithub size={15} />,
    },
  ].filter(Boolean) as Array<{ label: string; href: string; icon: ReactNode }>;

  // Most prominent action for the hero ("مشاهده زنده" when a live URL exists).
  const heroAction = project.liveUrl
    ? {
        href: project.liveUrl,
        label: t.viewLive.replace(" ↗", ""),
        external: true,
      }
    : project.repoUrl
      ? { href: project.repoUrl, label: t.sourceCode, external: true }
      : { href: "/start-project", label: t.cta, external: false };

  const hasSidebar = facts.length > 0 || links.length > 0;

  const projectJsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    url: absoluteUrl(`/projects/${slug}`),
    ...(project.shortDescription
      ? { description: project.shortDescription }
      : {}),
    ...(galleryImages.length
      ? { image: galleryImages.map((src) => absoluteUrl(src)) }
      : {}),
    ...(project.year ? { dateCreated: project.year } : {}),
    ...(project.projectType ? { genre: project.projectType } : {}),
    ...(technologies.length ? { keywords: technologies.join(", ") } : {}),
    ...(project.client
      ? { creator: { "@type": "Organization", name: project.client } }
      : {}),
  };

  return (
    <article className="relative overflow-hidden pb-24 pt-6 sm:pt-10">
      <JsonLd data={projectJsonLd} />
      {/* Ambient brand glow anchored to the top of the page. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-176 bg-[radial-gradient(circle_at_18%_-4%,rgba(79,124,255,0.20),transparent_38%),radial-gradient(circle_at_82%_2%,rgba(166,107,255,0.16),transparent_34%),radial-gradient(circle_at_50%_22%,rgba(52,214,232,0.06),transparent_26%)]"
      />

      <Container className="relative max-w-6xl">
        {/* ========================================================= HERO */}
        <header
          className={cn(
            "grid items-center gap-10 lg:gap-14",
            hasGallery && "lg:grid-cols-2",
          )}
        >
          {/* Content (start side → right in RTL) */}
          <div className="space-y-6">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-sm text-primary-light transition-colors hover:text-foreground"
            >
              <FiChevronLeft
                className={cn("shrink-0", isRtl && "rotate-180")}
              />
              {t.back.replace("← ", "").replace("→ ", "")}
            </Link>

            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary-light/80">
              {t.cover}
            </p>

            <div className="space-y-5">
              <h1 className="text-4xl font-bold leading-[1.12] tracking-tight text-foreground sm:text-5xl lg:text-[3rem] lg:leading-[1.1]">
                {project.title}
              </h1>
              {project.shortDescription ? (
                <p className="max-w-xl text-lg leading-9 text-muted sm:text-lg sm:leading-[2.05]">
                  {project.shortDescription}
                </p>
              ) : null}
            </div>

            <div className="pt-1">
                    <PublicCtaLink
                href={heroAction.href}
                external={heroAction.external}
                size="lg"
                className="shadow-[0_18px_44px_rgba(79,124,255,0.24)]"
              >
                {heroAction.label}
                <FiArrowUpRight className={cn(isRtl && "rotate-180")} />
                    </PublicCtaLink>
            </div>
          </div>

          {/* Gallery (end side → left in RTL) */}
          {hasGallery ? (
            <ProjectGallery
              images={galleryImages}
              title={project.title}
              locale={locale}
            />
          ) : null}
        </header>

        {/* ====================================================== METRICS */}
        {metrics.length > 0 ? (
          <section className="relative mt-10 sm:mt-14">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-8 top-1/2 h-px bg-linear-to-r from-transparent via-primary/25 to-transparent"
            />

            <div
              className={cn(
                "relative grid gap-4",
                metricsGridClass(metrics.length),
              )}
            >
              {metrics.map((metric, index) => (
                <div
                  key={`${metric.label}-${index}`}
                  className="group relative overflow-hidden rounded-[1.6rem] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.075),rgba(255,255,255,0.025))] p-px shadow-[0_24px_80px_rgba(2,6,23,0.28)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_30px_100px_rgba(79,124,255,0.18)]"
                >
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-[radial-gradient(circle_at_80%_0%,rgba(79,124,255,0.25),transparent_34%),radial-gradient(circle_at_15%_100%,rgba(166,107,255,0.18),transparent_38%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  />

                  <div className="relative h-full overflow-hidden rounded-[1.55rem] bg-linear-to-br from-surface/90 via-surface/70 to-background/85 p-6 sm:p-7">
                    <div
                      aria-hidden
                      className="pointer-events-none absolute -inset-e-14 -top-14 h-36 w-36 rounded-full bg-primary/15 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
                    />
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-x-6 top-0 h-px bg-linear-to-r from-transparent via-white/25 to-transparent"
                    />

                    <div className="relative flex items-start justify-between gap-5">
                      <div className="min-w-0">
                        <div className="flex items-baseline gap-2">
                          <p className="mb-4 font-bold leading-6 text-primary-light lg:text-lg">
                            {metric.label}:
                          </p>{" "}
                          <p className=" font-black leading-none tracking-[-0.07em] text-foreground lg:text-lg">
                            {metric.value}
                          </p>
                        </div>

                        {metric.description ? (
                          <p className="mt-2 max-w-68 text-xs leading-6 text-muted sm:text-sm sm:leading-7">
                            {metric.description}
                          </p>
                        ) : null}
                      </div>
                    </div>

                    <div className="relative mt-6 h-1.5 overflow-hidden rounded-full bg-white/5">
                      <span
                        className="block h-full rounded-full bg-linear-to-l from-primary via-accent to-primary-light opacity-80 transition-all duration-700 group-hover:w-full"
                        style={{ width: `${Math.min(100, 52 + index * 14)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {/* ============================================ TABS + META SIDEBAR */}
        {hasSidebar ||
        challenges.length ||
        highlights.length ||
        technologies.length ||
        tags.length ||
        project.description ||
        project.outcome ? (
          <section className="mt-16 grid gap-10 sm:mt-20 lg:grid-cols-[18rem_minmax(0,1fr)] lg:gap-14">
            {/* Main content / tabs (left in RTL) */}
            <div className="min-w-0 lg:order-2">
              <ProjectTabs
                overview={project.description}
                outcome={project.outcome}
                challenges={challenges}
                highlights={highlights}
                technologies={technologies}
                labels={{
                  overview: t.overview,
                  challenges: t.challenge,
                  highlights: t.highlights,
                  highlightsText: t.highlightsText,
                  outcome: t.outcome,
                  technologies: t.techStack,
                }}
              />

              <ProjectLabels labels={tags} />
            </div>

            {/* Meta sidebar (right in RTL) */}
            {hasSidebar ? (
              <aside className="lg:order-1 lg:sticky lg:top-24 lg:self-start">
                <div className="group relative overflow-hidden rounded-[1.7rem] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.075),rgba(255,255,255,0.025))] p-px shadow-[0_24px_90px_rgba(2,6,23,0.36)]">
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -inset-e-20 -top-20 h-48 w-48 rounded-full bg-primary/18 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
                  />
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -bottom-24 -inset-s-20 h-52 w-52 rounded-full bg-accent/12 blur-3xl"
                  />

                  <div className="relative overflow-hidden rounded-[1.65rem] bg-linear-to-br from-surface/85 via-surface/60 to-background/80 p-5 backdrop-blur-xl sm:p-6">
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-x-6 top-0 h-px bg-linear-to-r from-transparent via-primary/40 to-transparent"
                    />

                    {/* Header */}
                    <div className="mb-5 flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs font-black text-primary-light">
                          {t.meta}
                        </p>
                        <p className="mt-1 text-xs leading-6 text-faint">
                          مشخصات کلیدی پروژه
                        </p>
                      </div>
                    </div>

                    {/* Facts */}
                    {facts.length ? (
                      <dl className="space-y-2.5">
                        {facts.map((fact) => (
                          <div
                            key={fact.label}
                            className="rounded-2xl border border-border/45 bg-background/28 px-4 py-3.5 transition-all duration-300 hover:border-primary/30 hover:bg-primary/8"
                          >
                            <dt className="text-[11px] font-bold leading-5 text-faint">
                              {fact.label}
                            </dt>
                            <dd className="mt-1 text-sm font-bold leading-7 text-foreground">
                              {fact.value}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    ) : null}

                    {/* Links */}
                    {links.length ? (
                      <div className="mt-6 border-t border-border/35 pt-5">
                        <p className="mb-3 text-xs font-black text-primary-light">
                          {t.links}
                        </p>

                        <div className="space-y-2.5">
                          {links.map((link) => (
                            <a
                              key={link.href}
                              href={link.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group/link flex items-center gap-3 rounded-2xl border border-border/50 bg-background/30 px-3.5 py-3 text-sm font-bold text-muted transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/10 hover:text-foreground hover:shadow-[0_14px_40px_rgba(79,124,255,0.12)]"
                            >
                              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary-light transition-colors group-hover/link:border-primary/45">
                                {link.icon}
                              </span>

                              <span className="min-w-0 flex-1 truncate">
                                {link.label}
                              </span>

                              <FiArrowUpRight
                                className={cn(
                                  "shrink-0 opacity-45 transition-all duration-300 group-hover/link:translate-x-0.5 group-hover/link:opacity-100",
                                  isRtl &&
                                    "rotate-180 group-hover/link:-translate-x-0.5",
                                )}
                                size={15}
                              />
                            </a>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              </aside>
            ) : null}
          </section>
        ) : null}

        {/* ========================================================== CTA */}
        <HiringOnly><section className="relative mt-20 overflow-hidden rounded-4xl border border-border/70 bg-linear-to-br from-primary/12 via-surface/85 to-accent/10 px-6 py-10 shadow-[0_24px_90px_rgba(11,14,32,0.45)] sm:mt-28 sm:px-10 sm:py-12">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_0%,rgba(79,124,255,0.20),transparent_30%),radial-gradient(circle_at_90%_100%,rgba(166,107,255,0.18),transparent_30%)]"
          />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl space-y-3">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                {t.ctaTitle}
              </h2>
              <p className="text-sm leading-7 text-muted sm:text-base">
                {t.ctaText}
              </p>
            </div>
            <PublicCtaLink href="/start-project" size="lg" className="shrink-0">
              {t.cta}
              <FiArrowUpRight className={cn(isRtl && "rotate-180")} />
            </PublicCtaLink>
          </div>
        </section></HiringOnly>
      </Container>
    </article>
  );
}

/** Choose a metrics grid that fills evenly for the given count. */
function metricsGridClass(count: number) {
  if (count <= 2) return "sm:grid-cols-2";
  if (count === 3) return "sm:grid-cols-3";
  return "grid-cols-2 lg:grid-cols-4";
}

function normalizeMetrics(metrics: ProjectMetric[]) {
  return metrics
    .filter((metric) => metric?.label?.trim() && metric?.value?.trim())
    .map((metric) => ({
      label: metric.label.trim(),
      value: metric.value.trim(),
      description: metric.description?.trim() || undefined,
    }));
}
