import { NextResponse } from "next/server";
import { getHeroConfiguration, getHeroContent } from "@/lib/hero-config";
import { getSiteSettingsQueryResult } from "@/lib/site-settings";
import { getLocale } from "@/lib/i18n/server";

/** Public runtime Hero configuration for clients or future integrations. */
export async function GET() {
  const [result, locale] = await Promise.all([getSiteSettingsQueryResult(), getLocale()]);
  const config = getHeroConfiguration(result.settings);
  const mode = config.activeMode;
  return NextResponse.json({
    ok: true,
    data: { mode, locale, content: getHeroContent(config, { mode, locale }) },
  });
}
