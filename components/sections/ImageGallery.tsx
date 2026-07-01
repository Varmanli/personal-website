"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import {
  FiChevronLeft,
  FiChevronRight,
  FiMaximize2,
  FiX,
} from "react-icons/fi";
import { cn } from "@/lib/utils";

/**
 * Premium gallery with one featured preview and a responsive thumbnail grid.
 * Clicking any frame opens a lightbox with keyboard navigation.
 */
export function ImageGallery({
  images,
  alt,
  featuredImage,
  eyebrow,
  title,
  description,
}: {
  images: string[];
  alt: string;
  featuredImage?: string | null;
  eyebrow?: string;
  title?: string;
  description?: string;
}) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const allImages = [featuredImage, ...images].filter(Boolean) as string[];

  const show = useCallback(
    (i: number) => setIndex((i + allImages.length) % allImages.length),
    [allImages.length],
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

  if (allImages.length === 0) return null;

  const featured = allImages[0];
  const thumbnails = allImages.slice(1);

  return (
    <section className="space-y-5">
      {(eyebrow || title || description) && (
        <div className="max-w-2xl space-y-2">
          {eyebrow ? (
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary-light">
              {eyebrow}
            </p>
          ) : null}
          {title ? (
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {title}
            </h2>
          ) : null}
          {description ? (
            <p className="text-sm leading-7 text-muted sm:text-base">
              {description}
            </p>
          ) : null}
        </div>
      )}

      <div className="space-y-4">
        <GalleryButton
          src={featured}
          alt={`${alt} — 1`}
          priority
          onClick={() => {
            setIndex(0);
            setOpen(true);
          }}
          className="aspect-[16/9] rounded-[2rem] border border-border/80"
          sizes="(max-width: 1280px) 100vw, 1200px"
        />

        {thumbnails.length > 0 && (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {thumbnails.map((src, i) => (
              <GalleryButton
                key={`${src}-${i + 1}`}
                src={src}
                alt={`${alt} — ${i + 2}`}
                onClick={() => {
                  setIndex(i + 1);
                  setOpen(true);
                }}
                className="aspect-[16/10] rounded-[1.5rem]"
                sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
              />
            ))}
          </div>
        )}
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
            className="relative h-[78vh] w-full max-w-6xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={allImages[index]}
              alt={`${alt} — ${index + 1}`}
              fill
              sizes="100vw"
              className="object-contain"
              priority
            />
          </div>

          {allImages.length > 1 && (
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
                {index + 1} / {allImages.length}
              </span>
            </>
          )}
        </div>
      )}
    </section>
  );
}

function GalleryButton({
  src,
  alt,
  onClick,
  className,
  sizes,
  priority,
}: {
  src: string;
  alt: string;
  onClick: () => void;
  className?: string;
  sizes: string;
  priority?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative overflow-hidden border bg-surface-2/70 shadow-[0_24px_90px_rgba(10,12,24,0.42)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60",
        className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className="object-cover transition-transform duration-700 group-hover:scale-[1.035]"
      />
      <span className="absolute inset-0 bg-linear-to-t from-background/80 via-background/15 to-transparent" />
      <span className="absolute inset-0 bg-linear-to-br from-primary/15 via-transparent to-accent/15" />
      <span className="absolute inset-y-6 start-6 w-px bg-linear-to-b from-primary/0 via-primary/60 to-primary/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <span className="absolute end-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-background/50 text-foreground/85 opacity-0 backdrop-blur transition-all duration-300 group-hover:opacity-100">
        <FiMaximize2 size={16} />
      </span>
    </button>
  );
}
