"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { cn } from "@/lib/utils";

/**
 * Image gallery with a thumbnail grid + lightbox. Click a thumbnail to open a
 * full-screen viewer with prev/next + keyboard navigation. Locale-agnostic.
 */
export function ImageGallery({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const show = useCallback(
    (i: number) => setIndex((i + images.length) % images.length),
    [images.length],
  );

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowRight") show(index + 1);
      if (e.key === "ArrowLeft") show(index - 1);
    }
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, index, show]);

  return (
    <section className="space-y-3">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {images.map((src, i) => (
          <button
            key={`${src}-${i}`}
            type="button"
            onClick={() => {
              setIndex(i);
              setOpen(true);
            }}
            className="group relative aspect-video overflow-hidden rounded-xl border border-border bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
          >
            <Image
              src={src}
              alt={`${alt} — ${i + 1}`}
              fill
              sizes="(max-width: 640px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          </button>
        ))}
      </div>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background/90 p-4 backdrop-blur-md"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close"
            className="absolute end-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface-2/70 text-foreground backdrop-blur transition-colors hover:border-primary/50"
          >
            <FiX />
          </button>

          <div
            className="relative h-[78vh] w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[index]}
              alt={`${alt} — ${index + 1}`}
              fill
              sizes="100vw"
              className="object-contain"
              priority
            />
          </div>

          {images.length > 1 && (
            <>
              {[
                { dir: -1, Icon: FiChevronLeft, side: "start-4" },
                { dir: 1, Icon: FiChevronRight, side: "end-4" },
              ].map(({ dir, Icon, side }) => (
                <button
                  key={side}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    show(index + dir);
                  }}
                  aria-label={dir === 1 ? "Next" : "Previous"}
                  className={cn(
                    "absolute top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-surface-2/70 text-foreground backdrop-blur transition-colors hover:border-primary/50",
                    side,
                  )}
                >
                  <Icon />
                </button>
              ))}
              <span className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-border bg-surface-2/70 px-3 py-1 text-xs text-muted backdrop-blur">
                {index + 1} / {images.length}
              </span>
            </>
          )}
        </div>
      )}
    </section>
  );
}
