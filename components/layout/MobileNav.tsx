"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { mainNav } from "@/lib/config";
import { cn } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/Button";
import { useI18n } from "@/lib/i18n/context";

/** Collapsible mobile navigation menu (no dependencies). */
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { dict } = useI18n();

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={dict.common.menu}
        className={cn(
          "group relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl border border-border bg-surface-2/55 text-muted backdrop-blur transition-all duration-200",
          "hover:border-primary/40 hover:bg-primary/10 hover:text-foreground hover:shadow-[0_12px_35px_rgba(79,124,255,0.18)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          open &&
            "border-primary/50 bg-primary/10 text-foreground shadow-[0_12px_35px_rgba(79,124,255,0.2)]",
        )}
      >
        <span
          aria-hidden
          className="absolute inset-0 bg-linear-to-br from-primary/10 to-accent/10 opacity-0 transition-opacity group-hover:opacity-100"
        />

        <span className="relative flex h-4 w-5 flex-col justify-between">
          <span
            className={cn(
              "h-0.5 w-full rounded-full bg-current transition-transform duration-200",
              open && "translate-y-1.75 rotate-45",
            )}
          />
          <span
            className={cn(
              "h-0.5 w-full rounded-full bg-current transition-opacity duration-200",
              open && "opacity-0",
            )}
          />
          <span
            className={cn(
              "h-0.5 w-full rounded-full bg-current transition-transform duration-200",
              open && "-translate-y-1.75 -rotate-45",
            )}
          />
        </span>
      </button>

      {open && (
        <div className="absolute inset-x-3 top-20 z-50">
          <div className="neon-card relative overflow-hidden rounded-3xl p-2 shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
            <div
              aria-hidden
              className="absolute inset-0 grid-bg opacity-25 mask-[linear-gradient(to_bottom,black,transparent_90%)]"
            />
            <div
              aria-hidden
              className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-primary/20 blur-3xl"
            />
            <div
              aria-hidden
              className="absolute -bottom-20 left-8 h-44 w-44 rounded-full bg-accent/15 blur-3xl"
            />

            <nav className="relative flex flex-col gap-1">
              {mainNav.map((link) => {
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "group flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium transition-all",
                      isActive
                        ? "border border-primary/30 bg-primary/10 text-foreground shadow-[0_10px_30px_rgba(79,124,255,0.12)]"
                        : "text-muted hover:bg-surface-2/70 hover:text-foreground",
                    )}
                  >
                    <span className="flex items-center gap-2.5">
                      <span
                        className={cn(
                          "h-1.5 w-1.5 rounded-full transition-all",
                          isActive
                            ? "bg-linear-to-r from-primary to-accent shadow-[0_0_14px_rgba(166,107,255,0.8)]"
                            : "bg-border group-hover:bg-primary/60",
                        )}
                      />
                      {dict.nav[link.key]}
                    </span>

                    <span
                      aria-hidden
                      className={cn(
                        "text-primary-light opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100",
                        isActive && "opacity-100",
                      )}
                    >
                      →
                    </span>
                  </Link>
                );
              })}

              <div className="mt-2 border-t border-border/80 p-2">
                <ButtonLink
                  href="/start-project"
                  size="sm"
                  className="w-full justify-center"
                  onClick={() => setOpen(false)}
                >
                  {dict.common.startProject}
                  <span aria-hidden>→</span>
                </ButtonLink>
              </div>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
