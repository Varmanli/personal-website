import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ButtonLink } from "@/components/ui/Button";
import { Hero } from "@/components/sections/Hero";
import { TestimonialCard } from "@/components/cards/TestimonialCard";
import { getFeaturedProjects, getProfile } from "@/lib/data";
import { getTechStack, getTestimonials } from "@/lib/content";
import { getI18n } from "@/lib/i18n/server";
import type { LocalizedProject } from "@/lib/i18n/localize";
import { getDisplayFirstName } from "@/lib/utils";
import type { ReactNode } from "react";
import { getTechnology } from "@/lib/admin/technologies";
import { FaNodeJs } from "react-icons/fa";
import {
  FiArrowUpLeft,
  FiBarChart2,
  FiCheckCircle,
  FiCode,
  FiCreditCard,
  FiGitBranch,
  FiGlobe,
  FiImage,
  FiLayout,
  FiRefreshCw,
  FiLayers,
  FiSearch,
  FiSmartphone,
  FiServer,
  FiTool,
  FiZap,
} from "react-icons/fi";
import {
  SiDocker,
  SiGithubactions,
  SiNestjs,
  SiNextdotjs,
  SiNginx,
  SiPostgresql,
  SiPrisma,
  SiReact,
  SiRedis,
  SiTailwindcss,
  SiTypescript,
} from "react-icons/si";

// Render at request time so admin content changes appear without a rebuild.
export const dynamic = "force-dynamic";

// Icons by tech-stack group order (locale-independent).
const techIcons = [<FiLayers key="fe" />, <FiServer key="be" />, <FiTool key="tool" />];

const processIcons = [FiSearch, FiLayers, FiCode, FiZap];

const techBadgeIcons: Record<string, ReactNode> = {
  "Next.js": <SiNextdotjs className="text-[0.9rem] text-primary-light" />,
  React: <SiReact className="text-[0.9rem] text-primary-light" />,
  TypeScript: <SiTypescript className="text-[0.9rem] text-primary-light" />,
  "Tailwind CSS": <SiTailwindcss className="text-[0.9rem] text-primary-light" />,
  Redux: <FiLayers className="text-[0.9rem] text-primary-light" />,
  NestJS: <SiNestjs className="text-[0.9rem] text-primary-light" />,
  "Node.js": <FaNodeJs className="text-[0.9rem] text-primary-light" />,
  PostgreSQL: <SiPostgresql className="text-[0.9rem] text-primary-light" />,
  Prisma: <SiPrisma className="text-[0.9rem] text-primary-light" />,
  Redis: <SiRedis className="text-[0.9rem] text-primary-light" />,
  "REST API": <FiCode className="text-[0.9rem] text-primary-light" />,
  Docker: <SiDocker className="text-[0.9rem] text-primary-light" />,
  Nginx: <SiNginx className="text-[0.9rem] text-primary-light" />,
  VPS: <FiServer className="text-[0.9rem] text-primary-light" />,
  "CI/CD": <FiRefreshCw className="text-[0.9rem] text-primary-light" />,
  "GitHub Actions": <SiGithubactions className="text-[0.9rem] text-primary-light" />,
};

type ShowcaseProject = LocalizedProject;

export default async function HomePage() {
  const { locale, dict } = await getI18n();
  const [profile, featuredProjects] = await Promise.all([
    getProfile(locale),
    getFeaturedProjects(3, locale),
  ]);

  const firstName = getDisplayFirstName(profile.ownerName);
  const techStack = getTechStack(locale);
  const testimonials = getTestimonials(locale);
  const t = dict.home;
  const showcaseProjects = featuredProjects;

  return (
    <>
      <Hero firstName={firstName} />

      <main className="relative overflow-hidden">
        {/* Background glows */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-40 h-130 w-130 -translate-x-1/2 rounded-full bg-primary/10 blur-[150px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-48 top-168 h-110 w-110 rounded-full bg-accent/10 blur-[140px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -left-48 bottom-96 h-105 w-105 rounded-full bg-primary/10 blur-[140px]"
        />

        <div className="relative flex flex-col gap-18 py-18 sm:gap-20 lg:gap-24 lg:py-22">
          <Container as="section" className="space-y-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <SectionHeader
                eyebrow={t.featured.eyebrow}
                title={t.featured.title}
                subtitle={t.featured.subtitle}
              />

              <ButtonLink href="/projects" variant="outline" className="w-fit">
                {t.featured.all}
                <span aria-hidden>→</span>
              </ButtonLink>
            </div>

            <div className="grid gap-5 lg:grid-cols-3">
              {showcaseProjects.length > 0 ? (
                showcaseProjects.map((project) => (
                  <ShowcaseProjectCard
                    key={project.id}
                    project={project}
                    locale={locale}
                    ctaLabel={t.featured.details}
                  />
                ))
              ) : (
                <div className="neon-card rounded-[1.75rem] p-6 text-sm text-muted lg:col-span-3">
                  {locale === "fa"
                    ? "هنوز پروژه‌ای برای نمایش در صفحه اصلی انتخاب نشده است."
                    : "No homepage projects have been selected yet."}
                </div>
              )}
            </div>
          </Container>

          {/* Tech stack */}
          <Container as="section" className="space-y-8">
            <SectionHeader
              eyebrow={t.skills.eyebrow}
              title={t.skills.title}
              subtitle={t.skills.subtitle}
            />

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {techStack.map((group, i) => (
                <article
                  key={group.category}
                  className="neon-card group relative overflow-hidden rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_24px_80px_rgba(79,124,255,0.14)]"
                >
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-primary/15 blur-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  />
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-accent/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  />

                  <div className="relative">
                    <div className="mb-5 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-background/55 text-xl text-primary-light backdrop-blur transition-colors group-hover:border-primary/40 group-hover:bg-primary/10">
                          {techIcons[i] ?? <FiCode />}
                        </span>

                        <div>
                          <h3 className="text-base font-semibold tracking-tight text-foreground">
                            {group.category}
                          </h3>
                          <p className="mt-0.5 text-xs text-faint">
                            {group.items.length} {t.skills.tools}
                          </p>
                        </div>
                      </div>

                      <span className="h-2 w-2 rounded-full bg-linear-to-r from-primary to-accent shadow-[0_0_16px_rgba(166,107,255,0.75)]" />
                    </div>

                    {group.description && (
                      <p className="mb-5 text-sm leading-7 text-muted">
                        {group.description}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-2">
                      {group.items.map((item) => (
                        <span
                          key={item}
                          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-2/45 px-3 py-1.5 text-xs font-medium text-muted backdrop-blur transition-all hover:border-primary/40 hover:bg-primary/10 hover:text-primary-light"
                        >
                          {techBadgeIcons[item] ?? (
                            <FiGitBranch className="text-[0.9rem] text-primary-light" />
                          )}
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </Container>

          {/* Process */}
          <Container as="section" className="space-y-8">
            <SectionHeader
              eyebrow={t.process.eyebrow}
              title={t.process.title}
              subtitle={t.process.subtitle}
            />

            <ol className="relative grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <span
                aria-hidden
                className="pointer-events-none absolute left-0 top-12 hidden h-px w-full bg-linear-to-r from-transparent via-border-strong to-transparent lg:block"
              />

              {t.process.steps.map((step, index) => {
                const Icon = processIcons[index] ?? FiCode;

                return (
                  <li
                    key={step.title}
                    className="neon-card group relative overflow-hidden rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_24px_80px_rgba(79,124,255,0.14)]"
                  >
                    <div
                      aria-hidden
                      className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary/15 blur-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    />
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-accent/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    />

                    <div className="relative">
                      <div className="mb-6 flex items-center justify-between">
                        <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-background/55 text-xl text-primary-light backdrop-blur transition-colors group-hover:border-primary/40 group-hover:bg-primary/10">
                          <Icon />
                        </span>

                        <span className="rounded-full border border-primary/20 bg-primary/8 px-3 py-1 text-xs font-semibold text-primary-light backdrop-blur">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>

                      <h3 className="text-lg font-semibold tracking-tight text-foreground">
                        {step.title}
                      </h3>

                      <p className="mt-2 text-sm leading-relaxed text-muted">
                        {step.description}
                      </p>

                      <div className="mt-5 h-px w-full bg-linear-to-r from-primary/50 via-accent/40 to-transparent opacity-60" />
                    </div>
                  </li>
                );
              })}
            </ol>
          </Container>

          {/* Testimonials */}
          <Container as="section" className="space-y-8">
            <SectionHeader
              eyebrow={t.testimonials.eyebrow}
              title={t.testimonials.title}
              subtitle={t.testimonials.subtitle}
            />

            <div className="grid gap-6 md:grid-cols-3">
              {testimonials.map((testimonial) => (
                <TestimonialCard
                  key={testimonial.author}
                  testimonial={testimonial}
                />
              ))}
            </div>
          </Container>

          <Container as="section">
            <div className="neon-card relative overflow-hidden rounded-[2rem] p-6 sm:p-8 lg:p-10">
              <div
                aria-hidden
                className="absolute inset-0 bg-linear-to-br from-primary/14 via-transparent to-accent/14"
              />
              <div
                aria-hidden
                className="absolute -left-10 bottom-0 h-44 w-44 rounded-full bg-primary/14 blur-3xl"
              />
              <div
                aria-hidden
                className="absolute -right-12 top-0 h-44 w-44 rounded-full bg-accent/14 blur-3xl"
              />

              <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-2xl space-y-3">
                  <p className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-2/60 px-3 py-1.5 text-xs font-semibold tracking-[0.16em] text-primary-light backdrop-blur">
                    <span className="h-1.5 w-1.5 rounded-full bg-success shadow-[0_0_14px_rgba(52,211,153,0.7)]" />
                    {dict.footer.available}
                  </p>
                  <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                    {t.cta.title}
                  </h2>
                  <p className="text-sm leading-7 text-muted sm:text-base">
                    {t.cta.description}
                  </p>
                </div>

                <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                  <ButtonLink href="/start-project" size="lg" className="w-full sm:w-auto">
                    {t.cta.cta}
                  </ButtonLink>
                  <ButtonLink
                    href="/projects"
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto"
                  >
                    {t.cta.secondary}
                  </ButtonLink>
                </div>
              </div>
            </div>
          </Container>
        </div>
      </main>
    </>
  );
}

function ShowcaseProjectCard({
  project,
  locale,
  ctaLabel,
}: {
  project: ShowcaseProject;
  locale: "fa" | "en";
  ctaLabel: string;
}) {
  const metrics = project.homeMetrics ?? [];
  const highlights = project.technicalHighlights ?? [];
  const techs = project.technologies ?? [];
  const projectType = project.projectType;

  return (
    <article className="neon-card group relative overflow-hidden rounded-[1.9rem] p-4 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_24px_90px_rgba(79,124,255,0.14)] sm:p-5">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-14 -top-14 h-40 w-40 rounded-full bg-primary/12 blur-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />

      <div className="relative flex h-full flex-col">
        <ProjectPreview project={project} />

        <div className="mt-5 flex items-center justify-between gap-3">
          {projectType ? (
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-2/70 px-3 py-1 text-[11px] font-semibold tracking-[0.16em] text-primary-light">
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              {projectType}
            </span>
          ) : (
            <span />
          )}

          <span className="text-xs text-faint">
            {locale === "fa" ? "مطالعه موردی" : "Case study"}
          </span>
        </div>

        <div className="mt-4">
          <h3 className="text-xl font-semibold tracking-tight text-foreground">
            {project.title}
          </h3>
          {project.shortDescription && (
            <p className="mt-3 text-sm leading-7 text-muted">
              {project.shortDescription}
            </p>
          )}
        </div>

        {metrics.length > 0 && (
          <div className="mt-5 grid grid-cols-2 gap-2">
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
          <ul className="mt-5 space-y-2.5">
            {highlights.map((highlight) => (
              <li key={highlight} className="flex items-start gap-2.5 text-sm leading-6 text-muted">
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
            {techs.map((tech) => {
              const techOption = getTechnology(tech);
              const icon = techOption ? (
                <span className={techOption.colorClass ?? "text-primary-light"}>
                  {techOption.icon}
                </span>
              ) : (
                techBadgeIcons[tech] ?? (
                  <FiGitBranch className="text-[0.85rem] text-primary-light" />
                )
              );

              return (
                <span
                  key={tech}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-2/45 px-3 py-1.5 text-xs font-medium text-muted"
                >
                  {icon}
                  {tech}
                </span>
              );
            })}
          </div>
        )}

        <div className="mt-6 flex items-center justify-between border-t border-border/80 pt-4">
          <span className="text-sm text-faint">
            {locale === "fa" ? "جزئیات بیشتر پروژه" : "Project details"}
          </span>
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
}: {
  project: ShowcaseProject;
}) {
  const image = project.previewImageUrl || project.coverImageUrl || project.thumbnailUrl;
  if (image) {
    return (
      <div className="relative aspect-[16/10] overflow-hidden rounded-[1.5rem] border border-border bg-background/60">
        <Image
          src={image}
          alt={`پیش‌نمایش پروژه ${project.title}`}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
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
  const haystack = `${project.projectType ?? ""} ${project.slug} ${project.title}`.toLowerCase();
  if (
    haystack.includes("market") ||
    haystack.includes("مارکت") ||
    haystack.includes("نگاره")
  ) {
    return "marketplace" as const;
  }
  if (
    haystack.includes("brand") ||
    haystack.includes("portfolio") ||
    haystack.includes("شخصی")
  ) {
    return "brand" as const;
  }
  return "admin" as const;
}
