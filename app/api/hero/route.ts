import { NextResponse } from "next/server";
import { getHeroConfiguration } from "@/lib/hero-config";
import { getSiteSettingsQueryResult } from "@/lib/site-settings";

/** Public runtime Hero configuration for clients or future integrations. */
export async function GET() {
  const { settings } = await getSiteSettingsQueryResult();
  return NextResponse.json({ ok: true, data: getHeroConfiguration(settings) });
}
