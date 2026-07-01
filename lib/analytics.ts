import { sql } from "drizzle-orm";
import { db } from "@/db";
import { pageViews, type NewPageView } from "@/db/schema";

/**
 * Lightweight, privacy-friendly visitor analytics.
 *
 * One row per recorded visit. `visitorId` is an opaque random id from an
 * httpOnly cookie — no personal data is stored. All functions swallow DB errors
 * so analytics can never break a public request or the admin dashboard.
 */

export interface VisitorStats {
  pageViews: number;
  uniqueVisitors: number;
  uniqueToday: number;
}

const EMPTY_STATS: VisitorStats = {
  pageViews: 0,
  uniqueVisitors: 0,
  uniqueToday: 0,
};

/** Insert a single page view. Never throws. */
export async function recordPageView(view: NewPageView): Promise<void> {
  try {
    await db.insert(pageViews).values(view);
  } catch (error) {
    console.warn(
      "[analytics] recordPageView skipped:",
      error instanceof Error ? error.message : error,
    );
  }
}

/** Aggregate totals for the admin dashboard. Returns zeros when DB is down. */
export async function getVisitorStats(): Promise<VisitorStats> {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const [row] = await db
      .select({
        pageViews: sql<number>`count(*)`,
        uniqueVisitors: sql<number>`count(distinct ${pageViews.visitorId})`,
        uniqueToday: sql<number>`count(distinct ${pageViews.visitorId}) filter (where ${pageViews.createdAt} >= ${startOfToday})`,
      })
      .from(pageViews);

    return {
      pageViews: Number(row?.pageViews ?? 0),
      uniqueVisitors: Number(row?.uniqueVisitors ?? 0),
      uniqueToday: Number(row?.uniqueToday ?? 0),
    };
  } catch (error) {
    console.warn(
      "[analytics] getVisitorStats unavailable:",
      error instanceof Error ? error.message : error,
    );
    return EMPTY_STATS;
  }
}
