import { getSiteSettingsQueryResult } from "@/lib/site-settings";
import { normalizeWebsiteMode, type WebsiteMode } from "@/lib/website-mode-config";

export * from "@/lib/website-mode-config";

/** Reads the persisted global mode; missing/invalid values safely retain current behavior. */
export async function getWebsiteMode(): Promise<WebsiteMode> {
  const { settings } = await getSiteSettingsQueryResult();
  return normalizeWebsiteMode(settings?.websiteMode);
}
