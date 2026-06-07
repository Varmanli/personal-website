import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { FiTarget } from "react-icons/fi";
import { getProjectBySlug } from "@/lib/data";
import { ImageGallery } from "@/components/sections/ImageGallery";
import { TechStack } from "@/components/sections/TechStack";
import { ChallengeList } from "@/components/sections/ChallengeList";
import { getI18n } from "@/lib/i18n/server";

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
  return {
    title: project?.title ?? dict.meta.pages.project,
    description: project?.shortDescription ?? undefined,
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const { locale, dict } = await getI18n();
  const project = await getProjectBySlug(slug, locale);

  if (!project) notFound();

  const t = dict.projectDetail;

  const meta = [
    project.role && { label: t.role, value: project.role },
    project.client && { label: t.client, value: project.client },
    project.year && { label: t.year, value: project.year },
  ].filter(Boolean) as { label: string; value: string }[];

  // Challenges render as their own card list; solution/outcome stay prose.
  const caseStudy = [
    { heading: t.solution, body: project.solution },
    { heading: t.outcome, body: project.outcome },
  ].filter((section) => section.body);

  return (
    <article className="py-16">
      <Container className="max-w-4xl space-y-10">
        {/* Header */}
        <div className="space-y-4">
          <Link
            href="/projects"
            className="text-sm text-primary-light transition-colors hover:text-foreground"
          >
            {t.back}
          </Link>
          {project.tags && project.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {project.tags.map((tag) => (
                <Badge key={tag} tone="accent">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {project.title}
          </h1>
          {project.shortDescription && (
            <p className="text-lg leading-relaxed text-muted">
              {project.shortDescription}
            </p>
          )}
          <div className="flex flex-wrap gap-3 pt-1">
            {project.liveUrl && (
              <ButtonLink href={project.liveUrl} external>
                {t.viewLive}
              </ButtonLink>
            )}
            {project.repoUrl && (
              <ButtonLink href={project.repoUrl} external variant="outline">
                {t.sourceCode}
              </ButtonLink>
            )}
          </div>
        </div>

        {/* Cover / media */}
        {(() => {
          const cover = project.coverImageUrl || project.thumbnailUrl;
          return (
            <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-surface-2 to-surface text-sm text-faint">
              {cover ? (
                <Image
                  src={cover}
                  alt={project.title}
                  fill
                  sizes="(max-width: 896px) 100vw, 896px"
                  priority
                  className="object-cover"
                />
              ) : (
                <>
                  <span className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
                  <span className="relative">{t.cover}</span>
                </>
              )}
            </div>
          );
        })()}

        {/* Gallery */}
        {project.galleryImages && project.galleryImages.length > 0 && (
          <ImageGallery images={project.galleryImages} alt={project.title} />
        )}

        {/* Meta + tech stack */}
        <div className="grid gap-8 neon-card rounded-2xl p-6 sm:grid-cols-3">
          {meta.length > 0 && (
            <dl className="space-y-3 sm:col-span-1">
              {meta.map((item) => (
                <div key={item.label}>
                  <dt className="text-xs font-medium uppercase tracking-wide text-faint">
                    {item.label}
                  </dt>
                  <dd className="text-sm text-foreground">{item.value}</dd>
                </div>
              ))}
            </dl>
          )}
          {project.technologies && project.technologies.length > 0 && (
            <div className="sm:col-span-2">
              <h2 className="text-xs font-medium uppercase tracking-wide text-faint">
                {t.techStack}
              </h2>
              <TechStack technologies={project.technologies} className="mt-2" />
            </div>
          )}
        </div>

        {/* Challenges */}
        {project.challenges.length > 0 && (
          <section className="space-y-4">
            <h2 className="flex items-center gap-2 text-xl font-semibold text-foreground">
              <FiTarget className="text-primary-light" />
              {t.challenge}
            </h2>
            <ChallengeList challenges={project.challenges} />
          </section>
        )}

        {/* Overview */}
        {project.description && (
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">
              {t.overview}
            </h2>
            <p className="leading-relaxed text-muted">{project.description}</p>
          </section>
        )}

        {/* Case-study sections */}
        {caseStudy.map((section) => (
          <section key={section.heading} className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">
              {section.heading}
            </h2>
            <p className="leading-relaxed text-muted">{section.body}</p>
          </section>
        ))}

        {/* Footer CTA */}
        <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/15 via-surface to-accent/10 p-8 text-center">
          <h2 className="text-lg font-semibold text-foreground">
            {t.ctaTitle}
          </h2>
          <p className="mt-1 text-sm text-muted">{t.ctaText}</p>
          <ButtonLink href="/contact" className="mt-5">
            {t.cta}
          </ButtonLink>
        </div>
      </Container>
    </article>
  );
}
