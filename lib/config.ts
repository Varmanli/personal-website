import type { Dictionary } from "@/lib/i18n/dictionaries";

/** A public nav item whose label comes from the translation dictionary. */
export interface MainNavItem {
  /** Key into dict.nav for the translated label. */
  key: keyof Dictionary["nav"];
  href: string;
}

/** An admin nav item whose label comes from dict.admin.nav. */
export interface AdminNavItem {
  key: keyof Dictionary["admin"]["nav"];
  href: string;
}

/** Global site metadata. Replace with real branding later. */
export const siteConfig = {
  name: "Your Name",
  title: "Your Name — Portfolio & Services",
  description:
    "Personal portfolio and commercial services. Projects, work samples, and plans.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
};

/** Primary public navigation. Labels are translated via dict.nav[key]. */
export const mainNav: MainNavItem[] = [
  { key: "home", href: "/" },
  { key: "about", href: "/about" },
  { key: "projects", href: "/projects" },
  { key: "services", href: "/services" },
  { key: "portfolio", href: "/portfolio" },
  { key: "contact", href: "/contact" },
];

/** Admin sidebar navigation. Labels are translated via dict.admin.nav[key]. */
export const adminNav: AdminNavItem[] = [
  { key: "dashboard", href: "/admin" },
  { key: "projects", href: "/admin/projects" },
  { key: "services", href: "/admin/services" },
  { key: "portfolio", href: "/admin/portfolio" },
  { key: "messages", href: "/admin/messages" },
  { key: "projectRequests", href: "/admin/project-requests" },
  { key: "plannerOptions", href: "/admin/planner-options" },
  { key: "plannerEstimates", href: "/admin/planner-estimates" },
  { key: "settings", href: "/admin/settings" },
];
