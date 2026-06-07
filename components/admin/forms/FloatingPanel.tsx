"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

interface FloatingPanelProps {
  anchorRef: RefObject<HTMLElement | null>;
  open: boolean;
  onClose: () => void;
  dir?: "rtl" | "ltr";
  className?: string;
  children: React.ReactNode;
}

/**
 * Renders a floating panel in a portal on `document.body`, anchored to a trigger
 * element. This escapes every parent stacking context / `overflow-hidden` /
 * `backdrop-blur` / `transform`, so dropdowns are never clipped or hidden behind
 * cards. Position tracks the anchor on scroll/resize, matches its width, flips
 * upward when there isn't room below, and closes on outside-click + Escape.
 */
export function FloatingPanel({
  anchorRef,
  open,
  onClose,
  dir,
  className,
  children,
}: FloatingPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<CSSProperties>({ visibility: "hidden" });

  useLayoutEffect(() => {
    if (!open) return;
    function update() {
      const el = anchorRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const spaceBelow = window.innerHeight - r.bottom;
      const spaceAbove = r.top;
      const openUp = spaceBelow < 280 && spaceAbove > spaceBelow;
      const maxHeight = Math.max(180, (openUp ? spaceAbove : spaceBelow) - 16);
      setStyle({
        position: "fixed",
        left: r.left,
        width: r.width,
        maxHeight,
        ...(openUp
          ? { bottom: window.innerHeight - r.top + 6 }
          : { top: r.bottom + 6 }),
      });
    }
    update();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [open, anchorRef]);

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      const target = e.target as Node;
      if (
        !panelRef.current?.contains(target) &&
        !anchorRef.current?.contains(target)
      ) {
        onClose();
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, anchorRef]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      ref={panelRef}
      dir={dir}
      style={style}
      className={cn(
        "z-[9999] overflow-auto rounded-2xl border border-border bg-surface/95 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.75)] backdrop-blur-xl",
        className,
      )}
    >
      {children}
    </div>,
    document.body,
  );
}
