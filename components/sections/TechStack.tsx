import { FiCode } from "react-icons/fi";
import { getTechnology } from "@/lib/admin/technologies";
import { cn } from "@/lib/utils";

/** A single technology pill with its registry icon (or a code fallback). */
export function TechBadge({ value }: { value: string }) {
  const tech = getTechnology(value);
  return (
    <span className="group inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-2/50 px-3 py-1.5 text-xs font-medium text-muted backdrop-blur transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/10 hover:text-foreground">
      <span className={cn("text-sm", tech?.colorClass ?? "text-primary-light")}>
        {tech?.icon ?? <FiCode />}
      </span>
      {tech?.label ?? value}
    </span>
  );
}

/**
 * Technology list. On cards pass `limit` to cap visible badges and show `+N`;
 * detail pages show the full list.
 */
export function TechStack({
  technologies,
  limit,
  className,
}: {
  technologies: string[];
  limit?: number;
  className?: string;
}) {
  if (!technologies || technologies.length === 0) return null;
  const visible = limit ? technologies.slice(0, limit) : technologies;
  const rest = limit ? technologies.length - visible.length : 0;

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {visible.map((tech) => (
        <TechBadge key={tech} value={tech} />
      ))}
      {rest > 0 && (
        <span className="inline-flex items-center rounded-full border border-border bg-surface-2/50 px-3 py-1.5 text-xs font-medium text-faint backdrop-blur">
          +{rest}
        </span>
      )}
    </div>
  );
}
