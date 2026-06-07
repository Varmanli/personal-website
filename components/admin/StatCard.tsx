import Link from "next/link";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  href?: string;
  /** Optional trend, e.g. "+12%". Positive = success, negative = red. */
  trend?: string;
  trendUp?: boolean;
}

/** Neon-glass stat card with gradient icon, hover lift, and optional trend. */
export function StatCard({
  label,
  value,
  icon,
  href,
  trend,
  trendUp,
}: StatCardProps) {
  const inner = (
    <div className="neon-card group relative overflow-hidden rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_20px_60px_-15px_rgba(79,124,255,0.35)]">
      <div
        aria-hidden
        className="pointer-events-none absolute -end-12 -top-12 h-36 w-36 rounded-full bg-primary/15 blur-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
      <div className="relative flex items-start justify-between gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary/30 to-accent/30 text-lg text-primary-light ring-1 ring-inset ring-primary/20">
          {icon}
        </span>
        {trend && (
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-xs font-semibold",
              trendUp
                ? "bg-success/10 text-success"
                : "bg-red-500/10 text-red-400",
            )}
          >
            {trend}
          </span>
        )}
      </div>
      <p className="relative mt-4 text-3xl font-bold tracking-tight text-foreground">
        {value}
      </p>
      <p className="relative mt-0.5 text-sm text-muted">{label}</p>
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
      >
        {inner}
      </Link>
    );
  }
  return inner;
}
