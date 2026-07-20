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

export interface AdminNavLink {
  id: string;
  label: { en: string; fa: string };
  icon: string;
  href: string;
}

export interface AdminNavGroup {
  id: string;
  label: { en: string; fa: string };
  icon: string;
  children: AdminNavLink[];
}

export type AdminNavigationItem = AdminNavLink | AdminNavGroup;

/** Configuration-driven admin navigation. Add a link or group here, not in the sidebar UI. */
export const adminNavigation: AdminNavigationItem[] = [
  { id: "dashboard", label: { en: "Dashboard", fa: "داشبورد" }, icon: "dashboard", href: "/admin" },
  {
    id: "projects", label: { en: "Projects", fa: "پروژه‌ها" }, icon: "projects",
    children: [
      { id: "all-projects", label: { en: "All Projects", fa: "همه پروژه‌ها" }, icon: "projects", href: "/admin/projects" },
      { id: "new-project", label: { en: "Add Project", fa: "افزودن پروژه" }, icon: "add", href: "/admin/projects/new" },
    ],
  },
  {
    id: "services", label: { en: "Services", fa: "خدمات" }, icon: "services",
    children: [
      { id: "all-services", label: { en: "All Services", fa: "همه خدمات" }, icon: "services", href: "/admin/services" },
      { id: "new-service", label: { en: "Add Service", fa: "افزودن خدمت" }, icon: "add", href: "/admin/services/new" },
    ],
  },
  {
    id: "content", label: { en: "Content", fa: "محتوا" }, icon: "content",
    children: [
      { id: "hero", label: { en: "Hero Section", fa: "بخش هیرو" }, icon: "hero", href: "/admin/hero" },
      { id: "about", label: { en: "About Page", fa: "صفحه درباره" }, icon: "about", href: "/admin/about" },
      { id: "contact", label: { en: "Contact Page", fa: "صفحه تماس" }, icon: "contactPage", href: "/admin/contact" },
    ],
  },
  {
    id: "planning", label: { en: "Project Planning", fa: "برنامه‌ریزی پروژه" }, icon: "planning",
    children: [
      { id: "requests", label: { en: "Project Requests", fa: "درخواست‌های پروژه" }, icon: "projectRequests", href: "/admin/project-requests" },
      { id: "options", label: { en: "Planner Options", fa: "تنظیمات مشاور" }, icon: "plannerOptions", href: "/admin/planner-options" },
      { id: "estimates", label: { en: "Estimator Rules", fa: "قوانین برآورد" }, icon: "plannerEstimates", href: "/admin/planner-estimates" },
    ],
  },
  { id: "messages", label: { en: "Messages", fa: "پیام‌ها" }, icon: "messages", href: "/admin/messages" },
  {
    id: "settings", label: { en: "Settings", fa: "تنظیمات" }, icon: "settings",
    children: [
      { id: "general-settings", label: { en: "General Settings", fa: "تنظیمات عمومی" }, icon: "settings", href: "/admin/settings" },
    ],
  },
];
