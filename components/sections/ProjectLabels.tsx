/**
 * Premium tag / responsibility-label cloud shown beneath the tabbed content.
 * Pure presentational — renders nothing when there are no labels.
 *
 * No title, no counter. Each label is rendered as a compact button-like chip.
 */
export function ProjectLabels({ labels }: { labels: string[] }) {
  const items = Array.from(
    new Set(
      labels
        .flatMap((label) =>
          label
            .split(/[،,]/)
            .map((part) => part.trim())
            .filter(Boolean),
        )
        .filter((label) => label.length > 1),
    ),
  );

  if (items.length === 0) return null;

  return (
    <section className="mt-8">
      <ul className="flex flex-wrap gap-2.5 sm:gap-3">
        {items.map((label) => (
          <li key={label}>
            <span className="group relative inline-flex overflow-hidden rounded-full border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.025))] p-px shadow-[0_10px_34px_rgba(2,6,23,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_44px_rgba(79,124,255,0.16)]">
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_0%,rgba(79,124,255,0.30),transparent_58%),radial-gradient(circle_at_90%_100%,rgba(166,107,255,0.24),transparent_62%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />

              <span className="relative inline-flex items-center gap-2 rounded-full bg-background/50 px-4 py-2 text-sm font-bold leading-6 text-muted backdrop-blur-xl transition-colors duration-300 group-hover:text-foreground">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-linear-to-br from-primary to-accent shadow-[0_0_12px_rgba(79,124,255,0.75)]" />
                {label}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
