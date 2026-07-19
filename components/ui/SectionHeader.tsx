import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  align?: "left" | "center";
  className?: string;
}

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
        "space-y-2",
        align === "center" && "mx-auto max-w-2xl text-center",
        className,
      )}
    >
      {eyebrow && (
        <p
          className={cn(
            "text-xs font-medium tracking-[0.18em] uppercase text-primary-light",
            align === "center" && "text-center",
          )}
        >
          {eyebrow}
        </p>
      )}

      <h2
        className="
        text-2xl
        font-bold
        tracking-tight
        text-foreground
        sm:text-3xl
        "
      >
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
          className="
          max-w-xl
          text-sm
          leading-6
          text-muted
          sm:text-base
          "
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
