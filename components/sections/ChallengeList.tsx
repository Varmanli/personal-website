import { FiTarget } from "react-icons/fi";
import type { ProjectChallenge } from "@/types";

/**
 * Renders project challenges as a list of dark-glass cards. Hidden entirely
 * when there are no valid challenges.
 */
export function ChallengeList({
  challenges,
}: {
  challenges: ProjectChallenge[];
}) {
  const items = (challenges ?? []).filter(
    (item) => item.title.trim() && item.description.trim(),
  );
  if (items.length === 0) return null;

  return (
    <ul className="grid gap-4 lg:grid-cols-2">
      {items.map((challenge, i) => (
        <li
          key={`${i}-${challenge.title.slice(0, 12)}`}
          className="neon-card group relative overflow-hidden rounded-[1.75rem] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_24px_80px_rgba(79,124,255,0.14)] sm:p-6"
        >
          <span
            aria-hidden
            className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary/12 blur-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          />
          <div className="relative flex items-start gap-4">
            <div className="flex flex-col items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-border bg-background/55 text-primary-light backdrop-blur">
                <FiTarget />
              </span>
              <span className="h-full w-px bg-linear-to-b from-primary/60 via-accent/20 to-transparent" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[11px] font-semibold tracking-[0.24em] text-faint">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-2 text-lg font-semibold tracking-tight text-foreground">
                {challenge.title}
              </h3>
              <p className="mt-2 text-sm leading-7 text-muted sm:text-[0.95rem]">
                {challenge.description}
              </p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
