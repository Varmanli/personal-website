import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { StatPill } from "@/components/ui/StatPill";
import { EmptyState } from "@/components/ui/EmptyState";
import { ButtonLink } from "@/components/ui/Button";
import { ProjectCard } from "@/components/cards/ProjectCard";
import { getPublishedProjects } from "@/lib/data";
import { getI18n } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getI18n();
  return { title: dict.meta.pages.projects };
}

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const { locale, dict } = await getI18n();
  const projects = await getPublishedProjects(locale);
  const t = dict.projects;
  const featured = projects.filter((p) => p.isFeatured);
  const others = projects.filter((p) => !p.isFeatured);

  return (
    <div className="flex flex-col">
      <PageHero eyebrow={t.eyebrow} title={t.title} subtitle={t.subtitle}>
        {projects.length > 0 && (
          <StatPill value={projects.length} label={dict.nav.projects} />
        )}
      </PageHero>

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
          {projects.length === 0 ? (
            <Container as="section">
              <EmptyState
                title={t.emptyTitle}
                description={t.emptyDesc}
                action={<ButtonLink href="/contact">{t.emptyCta}</ButtonLink>}
              />
            </Container>
          ) : (
            <>
              {featured.length > 0 && (
                <Container as="section">
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {featured.map((project) => (
                      <ProjectCard key={project.id} project={project} />
                    ))}
                  </div>
                </Container>
              )}

              {others.length > 0 && (
                <Container as="section" className="space-y-6">
                  <h2 className="text-lg font-semibold text-foreground">
                    {t.more}
                  </h2>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {others.map((project) => (
                      <ProjectCard key={project.id} project={project} />
                    ))}
                  </div>
                </Container>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
