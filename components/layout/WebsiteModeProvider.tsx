"use client";

import { createContext, useContext } from "react";
import type { WebsiteMode } from "@/lib/website-mode-config";

const WebsiteModeContext = createContext<WebsiteMode>("freelance");

export function WebsiteModeProvider({ mode, children }: { mode: WebsiteMode; children: React.ReactNode }) {
  return <WebsiteModeContext.Provider value={mode}>{children}</WebsiteModeContext.Provider>;
}

export function useWebsiteMode() {
  return useContext(WebsiteModeContext);
}
