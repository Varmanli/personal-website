"use client";

import { ButtonLink } from "@/components/ui/Button";
import { useWebsiteMode } from "@/components/layout/WebsiteModeProvider";
import { shouldShowWebsiteLink } from "@/lib/website-mode-config";
import type { ComponentProps } from "react";

/** A mode-aware public CTA. Commercial destinations disappear in Hiring Mode. */
export function PublicCtaLink(props: ComponentProps<typeof ButtonLink>) {
  const mode = useWebsiteMode();
  if (!shouldShowWebsiteLink(mode, props.href)) return null;
  return <ButtonLink {...props} />;
}
