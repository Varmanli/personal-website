import { cn } from "@/lib/utils";

type BadgeTone = "neutral" | "brand" | "accent" | "success" | "muted";

const tones: Record<BadgeTone, string> = {
  neutral: "bg-surface-2 text-muted border border-border",
  brand: "bg-primary/10 text-primary-light border border-primary/20",
  accent: "bg-accent/10 text-accent border border-accent/20",
  success: "bg-success/10 text-success border border-success/20",
  muted: "bg-surface-2 text-faint border border-border",
};

interface BadgeProps {
  children: React.ReactNode;
  tone?: BadgeTone;
  className?: string;
}

/** Small pill label used for tags, tech chips, statuses, and badges. */
export function Badge({ children, tone = "neutral", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
