import { FiInbox } from "react-icons/fi";

interface EmptyStateProps {
  title: string;
  description?: string;
  /** Optional action (e.g. a button/link). */
  action?: React.ReactNode;
  /** Optional custom icon; defaults to an inbox glyph. */
  icon?: React.ReactNode;
}

/** Friendly placeholder shown when a query returns no rows. */
export function EmptyState({ title, description, action, icon }: EmptyStateProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-dashed border-border-strong bg-surface/60 p-12 text-center backdrop-blur">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-40 w-40 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
      />
      <div className="relative">
        <span
          aria-hidden
          className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-background/55 text-2xl text-primary-light backdrop-blur"
        >
          {icon ?? <FiInbox />}
        </span>
        <p className="mt-5 text-base font-semibold text-foreground">{title}</p>
        {description && (
          <p className="mx-auto mt-1.5 max-w-md text-sm leading-relaxed text-muted">
            {description}
          </p>
        )}
        {action && <div className="mt-6 flex justify-center">{action}</div>}
      </div>
    </div>
  );
}
