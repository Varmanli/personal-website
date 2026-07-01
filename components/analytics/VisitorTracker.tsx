"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Fire-and-forget visitor ping. Records one page view per path per browser
 * session (guarded by sessionStorage), so refreshes don't spam the table. The
 * request is non-blocking and failures are ignored — it never affects UX.
 */
export function VisitorTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;

    const key = `vt:${pathname}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {
      // sessionStorage unavailable (private mode) — still ping once.
    }

    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path: pathname,
        referrer: typeof document !== "undefined" ? document.referrer : "",
      }),
      keepalive: true,
    }).catch(() => {
      // Ignore network/analytics errors.
    });
  }, [pathname]);

  return null;
}
