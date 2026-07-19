"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { useI18n } from "@/lib/i18n/context";
import type { Project } from "@/types";
import { getProjectPrimaryImage } from "@/lib/project-images";

interface ProjectCardProps {
  project: Project;
}

/** Premium neon project preview used in grids; links to the case-study detail page. */
export function ProjectCard({ project }: ProjectCardProps) {
  const { dict } = useI18n();
  const image = getProjectPrimaryImage(project);
  return (
    <article className="neon-card group relative flex h-full flex-col overflow-hidden rounded-3xl transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_24px_90px_rgba(79,124,255,0.16)]">
      {/* Glow border on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-3xl bg-linear-to-br from-primary/20 via-transparent to-accent/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />

      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden border-b border-border bg-surface-2">
        {image ? (
          <Image
            src={image}
            alt={project.title}
            fill
            quality={90}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1536px) 33vw, 480px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="absolute inset-0 grid-bg opacity-35" />
            <div className="absolute left-1/2 top-1/2 h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-3xl" />
            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-background/60 text-lg font-bold text-primary-light backdrop-blur">
              {project.title.charAt(0)}
            </div>
          </div>
        )}

        {/* Image overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-background/85 via-background/10 to-transparent opacity-80" />
        <div className="absolute inset-0 bg-linear-to-br from-primary/15 via-transparent to-accent/15 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Featured badge */}
        {project.isFeatured && (
          <div className="absolute left-4 top-4">
            <Badge tone="brand">{dict.card.featured}</Badge>
          </div>
        )}

        {/* Year/client badge */}
        {(project.year || project.client) && (
          <div className="absolute bottom-4 left-4 max-w-[calc(100%-2rem)]">
            <span className="inline-flex max-w-full items-center gap-2 rounded-full border border-border bg-background/55 px-3 py-1.5 text-xs font-medium text-muted backdrop-blur">
              {project.year && <span>{project.year}</span>}
              {project.year && project.client && (
                <span className="h-1 w-1 rounded-full bg-primary/70" />
              )}
              {project.client && (
                <span className="truncate">{project.client}</span>
              )}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="relative flex flex-1 flex-col gap-4 p-5">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold tracking-tight text-foreground">
            <Link
              href={`/projects/${project.slug}`}
              className="after:absolute after:inset-0 group-hover:text-primary-light"
            >
              {project.title}
            </Link>
          </h3>

          {project.shortDescription && (
            <p className="line-clamp-2 text-sm leading-relaxed text-muted">
              {project.shortDescription}
            </p>
          )}
        </div>

        {/* Project tags */}
        {project.tags && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {project.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} tone="accent">
                {tag}
              </Badge>
            ))}

            {project.tags.length > 3 && (
              <Badge tone="muted">+{project.tags.length - 3}</Badge>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-auto flex items-end justify-between gap-3 border-t border-border/80 pt-4">
          <div className="flex min-w-0 flex-wrap gap-1.5">
            {project.technologies?.slice(0, 3).map((tech) => (
              <Badge key={tech} tone="neutral">
                {tech}
              </Badge>
            ))}

            {project.technologies && project.technologies.length > 3 && (
              <Badge tone="muted">+{project.technologies.length - 3}</Badge>
            )}
          </div>

          <span className="relative z-10 shrink-0 rounded-full border border-border bg-surface-2/60 px-3 py-1.5 text-xs font-semibold text-primary-light backdrop-blur transition-all group-hover:border-primary/50 group-hover:bg-primary/10">
            {project.liveUrl ? dict.card.live : dict.card.caseStudy}
          </span>
        </div>
      </div>
    </article>
  );
}
