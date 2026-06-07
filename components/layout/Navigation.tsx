"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { mainNav } from "@/lib/config";
import { useI18n } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";

/** Public nav links, highlighting the active route. */
export function Navigation({ className }: { className?: string }) {
  const pathname = usePathname();
  const { dict } = useI18n();

  return (
    <nav
      className={cn(
        "items-center gap-1 rounded-full border border-border bg-surface-2/40 px-1.5 py-1 backdrop-blur",
        className,
      )}
    >
      {mainNav.map((link) => {
        const isActive =
          link.href === "/"
            ? pathname === "/"
            : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "relative rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary/10 text-foreground"
                : "text-muted hover:text-foreground",
            )}
          >
            {dict.nav[link.key]}
            {isActive && (
              <span className="absolute -bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-gradient-to-r from-primary to-accent" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
