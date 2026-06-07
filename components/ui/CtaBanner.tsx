import { ButtonLink } from "@/components/ui/Button";

interface CtaBannerProps {
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
}

/** Reusable neon call-to-action banner with grid texture + glow. */
export function CtaBanner({
  title,
  description,
  ctaLabel,
  ctaHref,
}: CtaBannerProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-border bg-linear-to-br from-primary/15 via-surface to-accent/10 px-6 py-16 text-center sm:px-12">
      <div
        aria-hidden
        className="absolute inset-0 grid-bg mask-[radial-gradient(ellipse_at_center,black,transparent_75%)]"
      />
      <div className="relative space-y-4">
        <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
          {title}
        </h2>
        <p className="mx-auto max-w-xl text-muted">{description}</p>
        <div className="pt-2">
          <ButtonLink href={ctaHref} size="lg">
            {ctaLabel}
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
