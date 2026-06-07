import { cn } from "@/lib/utils";

interface StatPillProps {
  /** Leading value or icon (e.g. a count). Optional. */
  value?: React.ReactNode;
  label: string;
  className?: string;
}

/** Small glassy metadata chip used under page heroes. */
export function StatPill({ value, label, className }: StatPillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-border bg-surface-2/50 px-3.5 py-1.5 text-sm text-muted backdrop-blur",
        className,
      )}
    >
      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-primary to-accent shadow-[0_0_12px_rgba(166,107,255,0.7)]" />
      {value != null && (
        <span className="font-semibold text-foreground">{value}</span>
      )}
      <span>{label}</span>
    </span>
  );
}
