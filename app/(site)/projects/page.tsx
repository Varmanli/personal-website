import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ButtonLink } from "@/components/ui/Button";
import { ProjectsArchive } from "@/components/sections/ProjectsArchive";
import { getPublishedProjects } from "@/lib/data";
import { getI18n } from "@/lib/i18n/server";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getI18n();
  return buildMetadata({
    title: dict.meta.pages.projects,
    description: dict.projects.subtitle,
    path: "/projects",
  });
}

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const { locale, dict } = await getI18n();
  const projects = await getPublishedProjects(locale);
  const t = dict.projects;

  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden border-b border-border">
        <div
          aria-hidden
          className="absolute inset-0 grid-bg mask-[radial-gradient(ellipse_at_center,black,transparent_76%)] opacity-60"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-primary/20 blur-[120px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 top-0 h-80 w-80 rounded-full bg-accent/12 blur-[120px]"
        />

        <Container className="relative py-16 sm:py-18 lg:py-20">
          <div className="space-y-5">
            <SectionHeader
              eyebrow={t.eyebrow}
              title={t.title}
              subtitle={t.subtitle}
            />
            <p className="max-w-3xl text-sm leading-7 text-faint sm:text-base">
              {t.supporting}
            </p>
          </div>
        </Container>
      </section>

      <main className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-32 h-120 w-120 -translate-x-1/2 rounded-full bg-primary/10 blur-[150px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-40 bottom-40 h-110 w-110 rounded-full bg-accent/10 blur-[140px]"
        />

        <div className="relative flex flex-col gap-16 py-16 sm:py-20 lg:gap-20">
          <Container as="section">
            <ProjectsArchive
              projects={projects}
              labels={{
                all: t.filterAll,
                total: t.totalLabel,
                featured: t.featuredLabel,
                categories: t.categoriesLabel,
                technologies: t.technologiesLabel,
                details: t.details,
                caseStudy: t.caseStudy,
                detailLabel: t.detailLabel,
                emptyTitle: t.emptyTitle,
                emptyDescription: t.emptyDesc,
                emptySupport: t.emptySupport,
                emptyPrimary: t.emptyPrimary,
                emptySecondary: t.emptySecondary,
              }}
            />
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
                  <ButtonLink
                    href="/start-project"
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    {t.cta.primary}
                  </ButtonLink>
                  <ButtonLink
                    href="/contact"
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
    </div>
  );
}
