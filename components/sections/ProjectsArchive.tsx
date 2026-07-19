"use client";

import { FiBriefcase } from "react-icons/fi";

import { CaseStudyCard } from "@/components/cards/CaseStudyCard";
import { EmptyState } from "@/components/ui/EmptyState";

import type { LocalizedProject } from "@/lib/i18n/localize";

export function ProjectsArchive({
  projects,
  labels,
}: {
  projects: LocalizedProject[];
  labels: {
    details: string;
    caseStudy: string;
    detailLabel: string;
    emptyTitle: string;
    emptyDescription: string;
    emptySupport: string;
  };
}) {
  if (!projects.length) {
    return (
      <EmptyState
        title={labels.emptyTitle}
        description={`${labels.emptyDescription} ${labels.emptySupport}`}
        icon={<FiBriefcase />}
      />
    );
  }

  return (
    <section
      className="
      grid
      gap-6
      sm:grid-cols-2
      xl:grid-cols-3
      "
    >
      {projects.map((project) => (
        <CaseStudyCard
          key={project.id}
          project={project}
          ctaLabel={labels.details}
          caseStudyLabel={labels.caseStudy}
          detailLabel={labels.detailLabel}
        />
      ))}
    </section>
  );
}
