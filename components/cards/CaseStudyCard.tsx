import Image from "next/image";
import { FiArrowUpLeft } from "react-icons/fi";

import { ButtonLink } from "@/components/ui/Button";
import { TechBadge } from "@/components/sections/TechStack";
import { cn } from "@/lib/utils";
import { getProjectPrimaryImage } from "@/lib/project-images";
import type { LocalizedProject } from "@/lib/i18n/localize";

export function CaseStudyCard({
  project,
  ctaLabel,
  caseStudyLabel,
  detailLabel,
  className,
}: {
  project: LocalizedProject;
  ctaLabel: string;
  caseStudyLabel: string;
  detailLabel: string;
  className?: string;
}) {
  const image = getProjectPrimaryImage(project);
  const technologies = project.technologies ?? [];

  return (
    <article
      className={cn(
        `
        group
        overflow-hidden
        rounded-3xl
        border
        border-border
        bg-surface
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-primary/40
        `,
        className,
      )}
    >
      {/* Image */}

      <div
        className="
        relative
        aspect-[16/10]
        overflow-hidden
        bg-surface-2
        "
      >
        {image ? (
          <Image
            src={image}
            alt={project.title}
            fill
            quality={90}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1536px) 33vw, 480px"
            className="
            object-cover
            transition-transform
            duration-500
            group-hover:scale-105
            "
          />
        ) : (
          <div
            className="
            flex
            h-full
            items-center
            justify-center
            text-sm
            text-muted
            "
          >
            No preview
          </div>
        )}
      </div>

      {/* Content */}

      <div className="p-5">
        {project.projectType && (
          <span
            className="
            text-xs
            font-medium
            text-primary-light
            "
          >
            {project.projectType}
          </span>
        )}

        <h3
          className="
          mt-3
          text-xl
          font-bold
          tracking-tight
          "
        >
          {project.title}
        </h3>

        {technologies.length > 0 && (
          <div
            className="
            mt-5
            flex
            flex-wrap
            gap-2
            "
          >
            {technologies.slice(0, 4).map((tech) => (
              <TechBadge key={tech} value={tech} />
            ))}
          </div>
        )}

        <div
          className="
          mt-6
          flex
          items-center
          justify-between
          border-t
          border-border
          pt-4
          "
        >
          <span
            className="
            text-xs
            text-faint
            "
          >
            {detailLabel}
          </span>

          <ButtonLink
            href={`/projects/${project.slug}`}
            variant="ghost"
            className="
            gap-1
            px-0
            text-primary-light
            hover:bg-transparent
            "
          >
            {ctaLabel}
            <FiArrowUpLeft />
          </ButtonLink>
        </div>
      </div>
    </article>
  );
}
