import type { Testimonial } from "@/types";

/** A single client testimonial quote card. */
export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const initials = testimonial.author
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <figure className="neon-card group relative flex h-full flex-col overflow-hidden rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_24px_80px_rgba(79,124,255,0.14)]">
      {/* Background glow */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-20 -top-20 h-44 w-44 rounded-full bg-primary/15 blur-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-accent/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />

      <div className="relative flex flex-1 flex-col">
        {/* Quote mark */}
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-background/50 text-3xl font-serif leading-none text-primary-light backdrop-blur transition-colors group-hover:border-primary/40 group-hover:bg-primary/10">
          &ldquo;
        </div>

        {/* Quote */}
        <blockquote className="flex-1 text-sm leading-7 text-muted sm:text-[15px]">
          {testimonial.quote}
        </blockquote>

        {/* Author */}
        <figcaption className="mt-6 flex items-center gap-3 border-t border-border/80 pt-5">
          <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-primary to-accent text-xs font-bold text-white shadow-lg shadow-primary/25">
            <span
              aria-hidden
              className="absolute inset-0 rounded-2xl bg-white/10"
            />
            <span className="relative">{initials}</span>
          </span>

          <span className="min-w-0 text-sm">
            <span className="block truncate font-semibold text-foreground">
              {testimonial.author}
            </span>

            <span className="mt-0.5 block truncate text-xs text-faint">
              {testimonial.role}
              {testimonial.company ? ` · ${testimonial.company}` : ""}
            </span>
          </span>
        </figcaption>
      </div>
    </figure>
  );
}
