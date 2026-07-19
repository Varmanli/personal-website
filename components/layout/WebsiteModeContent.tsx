"use client";

import { useWebsiteMode } from "@/components/layout/WebsiteModeProvider";
import { isFreelanceMode } from "@/lib/website-mode-config";

/** Renders project/client-oriented content only in Freelance Mode. */
export function FreelanceOnly({ children }: { children: React.ReactNode }) {
  return isFreelanceMode(useWebsiteMode()) ? <>{children}</> : null;
}

/** Reserved counterpart for future hiring-specific presentation blocks. */
export function HiringOnly({ children }: { children: React.ReactNode }) {
  return !isFreelanceMode(useWebsiteMode()) ? <>{children}</> : null;
}
