"use client";

import Image from "next/image";
import type { PortfolioItem } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { TechStack } from "@/components/sections/TechStack";
import { useI18n } from "@/lib/i18n/context";

interface PortfolioCardProps {
  item: PortfolioItem;
}

const typeTone = {
  commercial: "brand",
  freelance: "accent",
  personal: "neutral",
} as const;

/** Gallery card for a portfolio / work-sample entry. */
export function PortfolioCard({ item }: PortfolioCardProps) {
  const { dict } = useI18n();
  const content = (
    <article className="neon-card neon-hover group flex h-full flex-col overflow-hidden rounded-2xl">
      <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden border-b border-border bg-gradient-to-br from-surface-2 to-surface text-sm text-faint">
        {item.coverImageUrl || item.imageUrl ? (
          <Image
            src={(item.coverImageUrl || item.imageUrl)!}
            alt={item.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <span className="absolute inset-0 grid-bg opacity-30" />
        )}
        <span className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        {!(item.coverImageUrl || item.imageUrl) && (
          <span className="relative">{dict.card.preview}</span>
        )}
        {item.isFeatured && (
          <span className="absolute left-3 top-3">
            <Badge tone="brand">{dict.card.featured}</Badge>
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-medium text-foreground group-hover:text-primary-light">
            {item.title}
          </h3>
          <Badge tone={typeTone[item.type]}>
            {dict.card.types[item.type]}
          </Badge>
        </div>
        {item.description && (
          <p className="line-clamp-2 text-sm leading-relaxed text-muted">
            {item.description}
          </p>
        )}
        {item.technologies && item.technologies.length > 0 && (
          <TechStack
            technologies={item.technologies}
            limit={3}
            className="pt-1"
          />
        )}
        {item.externalUrl && (
          <span className="mt-auto pt-2 text-xs font-medium text-primary-light">
            {dict.card.viewWork}
          </span>
        )}
      </div>
    </article>
  );

  if (item.externalUrl) {
    return (
      <a href={item.externalUrl} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  }
  return content;
}
