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

function resolveSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (fromEnv) return fromEnv;

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "NEXT_PUBLIC_SITE_URL is not set. Set it to the production domain (e.g. https://your-domain.com) before starting the app.",
    );
  }

  return "http://localhost:3000";
}

/** Global site metadata. Replace with real branding later. */
export const siteConfig = {
  name: "Varmanli",
  title: "Varmanli — Projects & Services",
  description:
    "Commercial website, product, and service showcase with projects, case studies, and plans.",
  url: resolveSiteUrl(),
};

/** Primary public navigation. Labels are translated via dict.nav[key]. */
export const mainNav: MainNavItem[] = [
  { key: "home", href: "/" },
  { key: "about", href: "/about" },
  { key: "projects", href: "/projects" },
  { key: "services", href: "/services" },
  { key: "contact", href: "/contact" },
];

/** Admin sidebar navigation. Labels are translated via dict.admin.nav[key]. */
export const adminNav: AdminNavItem[] = [
  { key: "dashboard", href: "/admin" },
  { key: "about", href: "/admin/about" },
  { key: "contactPage", href: "/admin/contact" },
  { key: "projects", href: "/admin/projects" },
  { key: "services", href: "/admin/services" },
  { key: "messages", href: "/admin/messages" },
  { key: "projectRequests", href: "/admin/project-requests" },
  { key: "plannerOptions", href: "/admin/planner-options" },
  { key: "plannerEstimates", href: "/admin/planner-estimates" },
  { key: "settings", href: "/admin/settings" },
];
