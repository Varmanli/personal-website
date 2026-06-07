import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  /** Optional eyebrow/label above the title. */
  eyebrow?: string;
  align?: "left" | "center";
  className?: string;
}

/** Reusable heading block for page and section intros. */
export function SectionHeader({
  title,
  subtitle,
  eyebrow,
  align = "left",
  className,
}: SectionHeaderProps) {
  const [titleStart, titleHighlight] = title
    .split("|")
    .map((part) => part.trim());

  return (
    <div
      className={cn(
        "relative space-y-4",
        align === "center" && "mx-auto max-w-3xl text-center",
        className,
      )}
    >
      {eyebrow && (
        <div
          className={cn(
            "flex",
            align === "center" ? "justify-center" : "justify-start",
          )}
        >
          <p className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-2/50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-primary-light backdrop-blur">
            <span
              aria-hidden
              className="h-1.5 w-1.5 rounded-full bg-linear-to-r from-primary to-accent shadow-[0_0_14px_rgba(166,107,255,0.75)]"
            />
            {eyebrow}
          </p>
        </div>
      )}

      <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
        {titleStart}
        {titleHighlight && (
          <>
            {" "}
            <span className="text-gradient">{titleHighlight}</span>
          </>
        )}
      </h2>

      {subtitle && (
        <p
          className={cn(
            "max-w-2xl text-base leading-relaxed text-muted sm:text-lg",
            align === "center" && "mx-auto",
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
