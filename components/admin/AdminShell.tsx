"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiGrid,
  FiUser,
  FiFolder,
  FiLayers,
  FiMail,
  FiInbox,
  FiSliders,
  FiDollarSign,
  FiSettings,
  FiMenu,
  FiX,
  FiChevronsLeft,
  FiChevronsRight,
  FiLogOut,
  FiExternalLink,
  FiChevronDown,
  FiPlus,
  FiFileText,
  FiClipboard,
} from "react-icons/fi";
import { adminNavigation, type AdminNavLink } from "@/lib/config";
import { logout } from "@/lib/actions/auth";
import { useI18n } from "@/lib/i18n/context";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { cn } from "@/lib/utils";
import type { AdminSession } from "@/lib/auth";

const icons: Record<string, React.ReactNode> = {
  dashboard: <FiGrid />,
  about: <FiUser />,
  contactPage: <FiMail />,
  projects: <FiFolder />,
  services: <FiLayers />,
  messages: <FiMail />,
  projectRequests: <FiInbox />,
  plannerOptions: <FiSliders />,
  plannerEstimates: <FiDollarSign />,
  settings: <FiSettings />,
  backToSite: <FiExternalLink />,
  logout: <FiLogOut />,
  add: <FiPlus />,
  content: <FiFileText />,
  hero: <FiGrid />,
  planning: <FiClipboard />,
};

function isActive(pathname: string, href: string) {
  return href === "/admin" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminShell({
  admin,
  children,
}: {
  admin: AdminSession;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { dict, dir } = useI18n();
  const a = dict.admin;

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState<Set<string>>(
    () => new Set(adminNavigation.filter((item) => "children" in item && item.children.some((child) => isActive(pathname, child.href))).map((item) => item.id)),
  );

  const CollapseIcon = dir === "rtl" ? FiChevronsRight : FiChevronsLeft;

  const nav = (
    <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
      {adminNavigation.map((item) => {
        if ("children" in item) {
          const expanded = openGroups.has(item.id) || item.children.some((child) => isActive(pathname, child.href));
          const active = item.children.some((child) => isActive(pathname, child.href));
          return (
            <div key={item.id} className="space-y-1">
              <button
                type="button"
                onClick={() => setOpenGroups((current) => {
                  const next = new Set(current);
                  if (next.has(item.id)) next.delete(item.id); else next.add(item.id);
                  return next;
                })}
                title={collapsed ? item.label[dir === "rtl" ? "fa" : "en"] : undefined}
                aria-expanded={expanded}
                className={cn(
                  "group flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60",
                  active ? "text-foreground" : "text-muted hover:bg-surface-2/70 hover:text-foreground",
                  collapsed && "justify-center",
                )}
              >
                <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border text-base", active ? "border-primary/40 bg-primary/15 text-primary-light" : "border-border bg-background/40 text-muted group-hover:border-primary/30 group-hover:text-primary-light")}>{icons[item.icon]}</span>
                {!collapsed && <><span className="min-w-0 flex-1 text-start">{item.label[dir === "rtl" ? "fa" : "en"]}</span><FiChevronDown className={cn("transition-transform duration-300", expanded && "rotate-180")} /></>}
              </button>
              {!collapsed && (
                <div className={cn("grid overflow-hidden transition-[grid-template-rows,opacity] duration-300", expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}>
                  <div className="min-h-0 space-y-1 border-s border-border/70 ms-6 ps-2">
                    {item.children.map((link) => <NavLink key={link.id} link={link} active={isActive(pathname, link.href)} language={dir === "rtl" ? "fa" : "en"} onNavigate={() => setMobileOpen(false)} />)}
                  </div>
                </div>
              )}
            </div>
          );
        }
        const link = item;
        const active = isActive(pathname, link.href);
        return (
          <Link
            key={link.id}
            href={link.href}
            onClick={() => setMobileOpen(false)}
            title={collapsed ? link.label[dir === "rtl" ? "fa" : "en"] : undefined}
            aria-current={active ? "page" : undefined}
            className={cn(
              "group relative flex items-center gap-3 rounded-xl px-2.5 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60",
              active
                ? "bg-gradient-to-r from-primary/20 to-accent/12 text-foreground shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]"
                : "text-muted hover:bg-surface-2/70 hover:text-foreground",
              collapsed && "justify-center",
            )}
          >
            {active && (
              <span
                aria-hidden
                className="absolute inset-y-2 start-0 w-1 rounded-full bg-gradient-to-b from-primary to-accent shadow-[0_0_12px_rgba(79,124,255,0.7)]"
              />
            )}
            <span
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border text-base transition-colors",
                active
                  ? "border-primary/40 bg-primary/15 text-primary-light"
                  : "border-border bg-background/40 text-muted group-hover:border-primary/30 group-hover:text-primary-light",
              )}
            >
              {icons[link.icon]}
            </span>
            {!collapsed && <span>{link.label[dir === "rtl" ? "fa" : "en"]}</span>}
          </Link>
        );
      })}
    </nav>
  );

  const brand = (
    <div className="flex h-16 items-center gap-2 border-b border-border px-4">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent text-sm font-bold text-white shadow-lg shadow-primary/30">
        A
      </span>
      {!collapsed && (
        <span className="truncate font-bold text-foreground">{a.panel}</span>
      )}
    </div>
  );

  const footer = (
    <div className="border-t border-border p-3">
      <Link
        href="/"
        title={collapsed ? a.nav.backToSite : undefined}
        className={cn(
          "flex items-center gap-3 rounded-xl px-3 py-2 text-xs text-faint transition-colors hover:bg-surface-2 hover:text-foreground",
          collapsed && "justify-center",
        )}
      >
        <FiExternalLink className="text-base" />
        {!collapsed && <span>{a.nav.backToSite}</span>}
      </Link>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "sticky top-0 hidden h-screen shrink-0 flex-col border-e border-border bg-gradient-to-b from-surface/80 to-background/70 backdrop-blur transition-[width] duration-300 md:flex",
          collapsed ? "w-16" : "w-60",
        )}
      >
        {brand}
        {nav}
        {footer}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-hidden
          />
          <aside className="absolute inset-y-0 start-0 flex w-64 flex-col border-e border-border bg-surface shadow-2xl">
            <div className="flex h-16 items-center justify-between border-b border-border px-4">
              <span className="flex items-center gap-2 font-bold text-foreground">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent text-sm font-bold text-white">
                  A
                </span>
                {a.panel}
              </span>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label={a.nav.logout}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted hover:bg-surface-2 hover:text-foreground"
              >
                <FiX />
              </button>
            </div>
            {nav}
            {footer}
          </aside>
        </div>
      )}

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b border-border bg-background/70 px-4 backdrop-blur">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label={a.panel}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surface-2/40 text-muted backdrop-blur transition-colors hover:border-primary/40 hover:bg-primary/10 hover:text-foreground md:hidden"
          >
            <FiMenu />
          </button>
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            aria-label={a.panel}
            className="hidden h-9 w-9 items-center justify-center rounded-xl border border-border bg-surface-2/40 text-muted backdrop-blur transition-colors hover:border-primary/40 hover:bg-primary/10 hover:text-foreground md:flex"
          >
            <CollapseIcon />
          </button>

          <div className="ms-auto flex items-center gap-2 sm:gap-3">
            <LanguageSwitcher />

            <div className="flex items-center gap-2 rounded-full border border-border bg-surface-2/50 py-1 pe-1 ps-3 backdrop-blur">
              <span className="hidden max-w-[10rem] truncate text-xs text-muted sm:block">
                {admin.name ?? admin.email}
              </span>
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-xs font-bold text-white">
                {(admin.name ?? admin.email).charAt(0).toUpperCase()}
              </span>
              <form action={logout}>
                <button
                  type="submit"
                  title={a.nav.logout}
                  className="flex h-7 w-7 items-center justify-center rounded-full text-muted transition-colors hover:bg-red-500/10 hover:text-red-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                >
                  <FiLogOut className="text-sm" />
                </button>
              </form>
            </div>
          </div>
        </header>

        <main className="flex-1 p-5 sm:p-8">
          <div className="mx-auto max-w-5xl space-y-6">{children}</div>
        </main>
      </div>
    </div>
  );
}

function NavLink({ link, active, language, onNavigate }: { link: AdminNavLink; active: boolean; language: "fa" | "en"; onNavigate: () => void }) {
  return <Link href={link.href} onClick={onNavigate} aria-current={active ? "page" : undefined} className={cn("flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium transition-colors", active ? "bg-primary/15 text-foreground" : "text-faint hover:bg-surface-2/70 hover:text-foreground")}>
    <span className="text-sm text-primary-light">{icons[link.icon]}</span><span>{link.label[language]}</span>
  </Link>;
}
