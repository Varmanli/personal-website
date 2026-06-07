import { FiChevronDown } from "react-icons/fi";

/** Styled, accessible disclosure (native details/summary) for advanced fields. */
export function Collapsible({
  title,
  description,
  icon,
  children,
  defaultOpen = false,
}: {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details
      open={defaultOpen}
      className="admin-section group [&[open]_.chev]:rotate-180"
    >
      <summary className="relative flex cursor-pointer list-none items-center gap-3 rounded-[1.25rem] px-5 py-4 transition-colors hover:bg-surface-2/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60">
        <span
          aria-hidden
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-background/55 text-lg text-primary-light backdrop-blur transition-colors group-hover:border-primary/40 group-hover:bg-primary/10"
        >
          {icon ?? <FiChevronDown />}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold text-foreground">
            {title}
          </span>
          {description && (
            <span className="mt-0.5 block text-xs leading-relaxed text-faint">
              {description}
            </span>
          )}
        </span>
        <FiChevronDown
          aria-hidden
          className="chev shrink-0 text-faint transition-transform duration-300"
        />
      </summary>
      <div className="relative space-y-5 border-t border-border/70 px-5 pb-5 pt-5">
        {children}
      </div>
    </details>
  );
}
