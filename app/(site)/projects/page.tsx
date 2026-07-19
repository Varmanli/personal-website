import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ButtonLink } from "@/components/ui/Button";
import { PublicCtaLink } from "@/components/ui/PublicCtaLink";
import { FreelanceOnly } from "@/components/layout/WebsiteModeContent";
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
      {/* Projects Grid */}
      <main>
        <Container className="py-16 sm:py-20 lg:py-24">
          <ProjectsArchive
            projects={projects}
            labels={{
              details: t.details,
              caseStudy: t.caseStudy,
              detailLabel: t.detailLabel,
              emptyTitle: t.emptyTitle,
              emptyDescription: t.emptyDesc,
              emptySupport: t.emptySupport,
            }}
          />
        </Container>

        {/* Freelance CTA */}
        <FreelanceOnly>
          <Container className="pb-20 lg:pb-28">
            <section
              className="
              flex
              flex-col
              gap-6
              rounded-3xl
              border
              border-border
              bg-surface
              p-8
              sm:p-10
              lg:flex-row
              lg:items-center
              lg:justify-between
              "
            >
              <div className="max-w-xl">
                <h2
                  className="
                  text-2xl
                  font-bold
                  tracking-tight
                  sm:text-3xl
                  "
                >
                  {t.cta.title}
                </h2>

                <p
                  className="
                  mt-3
                  leading-7
                  text-muted
                  "
                >
                  {t.cta.description}
                </p>
              </div>

              <div
                className="
                flex
                flex-col
                gap-3
                sm:flex-row
                "
              >
                <PublicCtaLink href="/start-project" size="lg">
                  {t.cta.primary}
                </PublicCtaLink>

                <ButtonLink href="/contact" size="lg" variant="outline">
                  {t.cta.secondary}
                </ButtonLink>
              </div>
            </section>
          </Container>
        </FreelanceOnly>
      </main>
    </div>
  );
}
