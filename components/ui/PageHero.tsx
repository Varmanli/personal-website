import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { cn } from "@/lib/utils";

interface PageHeroProps {
  eyebrow?: string;
  /** Use "|" to split the gradient highlight, matching SectionHeader. */
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  /** Optional content under the header (chips, stats, actions). */
  children?: React.ReactNode;
  className?: string;
}

/**
 * Shared hero/header band for public pages so About/Projects/Services/etc.
 * all share the homepage's dark/neon identity: grid texture, brand glows,
 * eyebrow pill, gradient title, and an optional row of chips/actions.
 */
export function PageHero({
  eyebrow,
  title,
  subtitle,
  align = "center",
  children,
  className,
}: PageHeroProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden border-b border-border",
        className,
      )}
    >
      {/* Grid texture + radial brand glows (decorative). */}
      <div
        aria-hidden
        className="absolute inset-0 grid-bg mask-[radial-gradient(ellipse_at_center,black,transparent_75%)] opacity-60"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-primary/20 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 top-0 h-80 w-80 rounded-full bg-accent-2/12 blur-[120px]"
      />

      <Container className="relative py-16 sm:py-20 lg:py-24">
        <SectionHeader
          align={align}
          eyebrow={eyebrow}
          title={title}
          subtitle={subtitle}
        />
        {children && (
          <div
            className={cn(
              "mt-8 flex flex-wrap items-center gap-3",
              align === "center" && "justify-center",
            )}
          >
            {children}
          </div>
        )}
      </Container>
    </section>
  );
}
