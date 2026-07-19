import type { MainNavItem } from "@/lib/config";

export const WEBSITE_MODES = ["freelance", "hiring"] as const;
export type WebsiteMode = (typeof WEBSITE_MODES)[number];

/**
 * The single public-site policy surface for mode-specific behavior. Extend
 * this object as modes begin to vary hero, resume, skills, or page content.
 */
export const websiteModeConfig = {
  freelance: { showCommercialContent: true, showFreelanceContent: true, showResume: true },
  hiring: { showCommercialContent: false, showFreelanceContent: false, showResume: true },
} as const;

export function normalizeWebsiteMode(value: unknown): WebsiteMode {
  return value === "hiring" ? "hiring" : "freelance";
}

export function getWebsiteModePolicy(mode: WebsiteMode) {
  return websiteModeConfig[mode];
}

export function isFreelanceMode(mode: WebsiteMode): boolean {
  return getWebsiteModePolicy(mode).showFreelanceContent;
}

export function isCommercialWebsiteHref(href: string): boolean {
  return href === "/services" || href.startsWith("/start-project");
}

export function shouldShowWebsiteLink(mode: WebsiteMode, href: string): boolean {
  return getWebsiteModePolicy(mode).showCommercialContent || !isCommercialWebsiteHref(href);
}

export function getWebsiteNavigation(mode: WebsiteMode, items: MainNavItem[]) {
  return items.filter((item) => shouldShowWebsiteLink(mode, item.href));
}
