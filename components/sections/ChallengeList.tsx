import { FiTarget } from "react-icons/fi";

/**
 * Renders project challenges as a list of dark-glass cards with a numbered,
 * icon-led accent. Hidden entirely when there are no challenges.
 */
export function ChallengeList({ challenges }: { challenges: string[] }) {
  const items = (challenges ?? []).map((c) => c.trim()).filter(Boolean);
  if (items.length === 0) return null;

  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {items.map((challenge, i) => (
        <li
          key={`${i}-${challenge.slice(0, 12)}`}
          className="neon-card group relative overflow-hidden rounded-2xl p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40"
        >
          <span
            aria-hidden
            className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-primary/10 blur-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          />
          <div className="relative flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border bg-background/55 text-primary-light backdrop-blur">
              <FiTarget />
            </span>
            <div className="min-w-0 flex-1">
              <span className="text-xs font-semibold text-faint">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="mt-0.5 text-sm leading-relaxed text-muted">
                {challenge}
              </p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
