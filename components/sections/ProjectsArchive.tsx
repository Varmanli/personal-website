"use client";

import { useMemo, useState } from "react";
import { FiBriefcase, FiLayers } from "react-icons/fi";
import { CaseStudyCard } from "@/components/cards/CaseStudyCard";
import { StatPill } from "@/components/ui/StatPill";
import { ButtonLink } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { cn } from "@/lib/utils";
import type { LocalizedProject } from "@/lib/i18n/localize";

export function ProjectsArchive({
  projects,
  labels,
}: {
  projects: LocalizedProject[];
  labels: {
    all: string;
    total: string;
    featured: string;
    categories: string;
    technologies: string;
    details: string;
    caseStudy: string;
    detailLabel: string;
    emptyTitle: string;
    emptyDescription: string;
    emptySupport: string;
    emptyPrimary: string;
    emptySecondary: string;
  };
}) {
  const categories = useMemo(
    () =>
      Array.from(
        new Set(
          projects.map((project) => project.projectType?.trim()).filter(Boolean),
        ),
      ) as string[],
    [projects],
  );
  const technologies = useMemo(
    () =>
      Array.from(
        new Set(
          projects.flatMap((project) =>
            (project.technologies ?? []).map((tech) => tech.trim()).filter(Boolean),
          ),
        ),
      ),
    [projects],
  );

  const [activeCategory, setActiveCategory] = useState(labels.all);
  const filteredProjects = useMemo(() => {
    if (activeCategory === labels.all) return projects;
    return projects.filter((project) => project.projectType === activeCategory);
  }, [activeCategory, labels.all, projects]);

  const featuredProject =
    filteredProjects.length >= 3 ? filteredProjects[0] : null;
  const remainingProjects =
    filteredProjects.length >= 3 ? filteredProjects.slice(1) : filteredProjects;

  if (projects.length === 0) {
    return (
      <EmptyState
        title={labels.emptyTitle}
        description={`${labels.emptyDescription} ${labels.emptySupport}`}
        icon={<FiBriefcase />}
        action={
          <div className="flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/start-project">{labels.emptyPrimary}</ButtonLink>
            <ButtonLink href="/contact" variant="outline">
              {labels.emptySecondary}
            </ButtonLink>
          </div>
        }
      />
    );
  }

  return (
    <div className="space-y-8">
      <section className="neon-card rounded-[1.9rem] p-4 sm:p-5">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2.5">
            <StatPill value={projects.length} label={labels.total} />
            <StatPill
              value={projects.filter((project) => project.isFeatured).length}
              label={labels.featured}
            />
            <StatPill value={categories.length} label={labels.categories} />
            <StatPill value={technologies.length} label={labels.technologies} />
          </div>

          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {[labels.all, ...categories].map((category, index) => {
                const active = activeCategory === category;
                return (
                  <button
                    key={`${category}-${index}`}
                    type="button"
                    onClick={() => setActiveCategory(category)}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all",
                      active
                        ? "border-primary/35 bg-primary/12 text-primary-light shadow-[0_0_18px_rgba(79,124,255,0.14)]"
                        : "border-border bg-surface-2/45 text-muted hover:border-primary/30 hover:bg-primary/8 hover:text-foreground",
                    )}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-linear-to-r from-primary to-accent shadow-[0_0_12px_rgba(166,107,255,0.7)]" />
                    {category}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {filteredProjects.length === 0 ? (
        <EmptyState
          title={labels.emptyTitle}
          description={labels.emptyDescription}
          icon={<FiLayers />}
          action={
            <ButtonLink href="/projects" variant="outline">
              {labels.all}
            </ButtonLink>
          }
        />
      ) : (
        <section className="space-y-5">
          {featuredProject && (
            <CaseStudyCard
              project={featuredProject}
              ctaLabel={labels.details}
              caseStudyLabel={labels.caseStudy}
              detailLabel={labels.detailLabel}
              featured
            />
          )}

          <div
            className={cn(
              "grid gap-5",
              remainingProjects.length === 1
                ? "lg:grid-cols-1"
                : "md:grid-cols-2 xl:grid-cols-3",
            )}
          >
            {remainingProjects.map((project) => (
              <CaseStudyCard
                key={project.id}
                project={project}
                ctaLabel={labels.details}
                caseStudyLabel={labels.caseStudy}
                detailLabel={labels.detailLabel}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
