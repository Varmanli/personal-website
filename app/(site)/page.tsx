import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ButtonLink } from "@/components/ui/Button";
import { Hero } from "@/components/sections/Hero";
import { CaseStudyCard } from "@/components/cards/CaseStudyCard";
import { TestimonialCard } from "@/components/cards/TestimonialCard";
import { getFeaturedProjects, getProfile } from "@/lib/data";
import { getTechStack, getTestimonials } from "@/lib/content";
import { getI18n } from "@/lib/i18n/server";
import { buildMetadata } from "@/lib/seo";
import { getDisplayFirstName } from "@/lib/utils";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { FaNodeJs } from "react-icons/fa";
import {
  FiCode,
  FiGitBranch,
  FiRefreshCw,
  FiLayers,
  FiSearch,
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

export async function generateMetadata(): Promise<Metadata> {
  const { locale, dict } = await getI18n();
  const profile = await getProfile(locale);
  return buildMetadata({
    description: profile.headline ?? profile.bio ?? dict.meta.description,
    path: "/",
    image: profile.heroImageUrl ?? profile.avatarUrl,
  });
}

// Render at request time so admin content changes appear without a rebuild.
export const dynamic = "force-dynamic";

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
                  <CaseStudyCard
                    key={project.id}
                    project={project}
                    ctaLabel={t.featured.details}
                    caseStudyLabel={locale === "fa" ? "مطالعه موردی" : "Case study"}
                    detailLabel={
                      locale === "fa" ? "جزئیات بیشتر پروژه" : "Project details"
                    }
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
