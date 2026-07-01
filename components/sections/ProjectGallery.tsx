"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  FiChevronLeft,
  FiChevronRight,
  FiMaximize2,
  FiX,
} from "react-icons/fi";
import { cn } from "@/lib/utils";

interface ProjectGalleryProps {
  images: string[];
  title: string;
  locale: "fa" | "en";
}

/**
 * Premium case-study gallery.
 *
 * Structure:
 * - One strong featured image
 * - One horizontal, non-wrapping, scrollable thumbnail rail
 * - Lightbox with keyboard navigation
 * - RTL/LTR aware controls
 */
export function ProjectGallery({ images, title, locale }: ProjectGalleryProps) {
  const isRtl = locale === "fa";

  const gallery = useMemo(() => {
    return Array.from(new Set(images.filter(Boolean)));
  }, [images]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const total = gallery.length;
  const safeIndex = total > 0 ? Math.min(activeIndex, total - 1) : 0;
  const activeImage = gallery[safeIndex] ?? null;
  const hasMany = total > 1;

  const goTo = useCallback(
    (nextIndex: number) => {
      if (total === 0) return;
      setActiveIndex((nextIndex + total) % total);
    },
    [total],
  );

  const goNext = useCallback(() => {
    goTo(safeIndex + 1);
  }, [goTo, safeIndex]);

  const goPrev = useCallback(() => {
    goTo(safeIndex - 1);
  }, [goTo, safeIndex]);

  useEffect(() => {
    if (!isLightboxOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsLightboxOpen(false);
        return;
      }

      if (!hasMany) return;

      if (event.key === "ArrowRight") {
        if (isRtl) goPrev();
        else goNext();
      }

      if (event.key === "ArrowLeft") {
        if (isRtl) goNext();
        else goPrev();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [goNext, goPrev, hasMany, isLightboxOpen, isRtl]);

  if (!activeImage) return null;

  return (
    <>
      <div className="min-w-0 space-y-3">
        {/* Featured image */}
        <div className="group relative">
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-3 rounded-4xl bg-[radial-gradient(circle_at_25%_10%,rgba(79,124,255,0.20),transparent_56%),radial-gradient(circle_at_82%_88%,rgba(166,107,255,0.18),transparent_58%)] blur-2xl"
          />

          <button
            type="button"
            onClick={() => setIsLightboxOpen(true)}
            aria-label={`${title} — مشاهده تصویر ${safeIndex + 1}`}
            className="relative block w-full overflow-hidden rounded-[1.45rem] border border-white/10 bg-background/65 shadow-[0_34px_90px_rgba(4,7,20,0.58)] outline-none transition-all duration-300 hover:border-primary/35 focus-visible:ring-2 focus-visible:ring-primary/60"
          >
            <div className="relative aspect-16/10 overflow-hidden sm:aspect-video">
              <Image
                key={activeImage}
                src={activeImage}
                alt={`${title} — تصویر ${safeIndex + 1}`}
                fill
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 48vw, 560px"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
              />

              {/* Premium overlays */}
              <span className="pointer-events-none absolute inset-0 bg-linear-to-t from-background/58 via-transparent to-transparent" />
              <span className="pointer-events-none absolute inset-0 bg-linear-to-br from-primary/8 via-transparent to-accent/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <span className="pointer-events-none absolute inset-0 rounded-[1.45rem] ring-1 ring-inset ring-white/5" />

              <span className="absolute inset-e-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-background/55 text-foreground/90 opacity-0 backdrop-blur transition-all duration-300 group-hover:opacity-100">
                <FiMaximize2 size={16} />
              </span>

              {hasMany ? (
                <span className="absolute bottom-4 inset-s-4 rounded-full border border-white/10 bg-background/55 px-3 py-1 text-xs font-medium text-foreground/85 backdrop-blur">
                  {safeIndex + 1} / {total}
                </span>
              ) : null}
            </div>
          </button>

          {hasMany ? (
            <>
              <FeaturedArrow
                position="start"
                isRtl={isRtl}
                onClick={isRtl ? goNext : goPrev}
              />
              <FeaturedArrow
                position="end"
                isRtl={isRtl}
                onClick={isRtl ? goPrev : goNext}
              />
            </>
          ) : null}
        </div>

        {/* One-row thumbnail rail */}
        {hasMany ? (
          <div
            dir={isRtl ? "rtl" : "ltr"}
            className="flex w-full flex-nowrap gap-3 overflow-x-auto overscroll-x-contain rounded-2xl border border-border/45 bg-background/30 p-2 scrollbar-none [&::-webkit-scrollbar]:hidden"
            aria-label={`${title} — گالری تصاویر`}
          >
            {gallery.map((src, index) => {
              const isActive = index === safeIndex;

              return (
                <button
                  key={`${src}-${index}`}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  aria-label={`${title} — نمایش تصویر ${index + 1}`}
                  aria-current={isActive ? "true" : undefined}
                  className={cn(
                    "group/thumb relative h-16 w-24 shrink-0 overflow-hidden rounded-xl border bg-surface/45 outline-none transition-all duration-300 sm:h-[4.6rem] sm:w-28",
                    isActive
                      ? "border-primary/70 shadow-[0_0_0_3px_rgba(79,124,255,0.14),0_14px_34px_rgba(79,124,255,0.22)]"
                      : "border-border/65 opacity-72 hover:-translate-y-0.5 hover:border-primary/40 hover:opacity-100",
                    "focus-visible:ring-2 focus-visible:ring-primary/60",
                  )}
                >
                  <Image
                    src={src}
                    alt={`${title} — بندانگشتی ${index + 1}`}
                    fill
                    sizes="120px"
                    className="object-cover transition-transform duration-500 group-hover/thumb:scale-105"
                  />

                  <span
                    className={cn(
                      "absolute inset-0 transition-colors duration-300",
                      isActive
                        ? "bg-transparent"
                        : "bg-background/45 group-hover/thumb:bg-background/15",
                    )}
                  />

                  {isActive ? (
                    <span className="absolute inset-x-3 bottom-1.5 h-0.5 rounded-full bg-primary shadow-[0_0_18px_rgba(79,124,255,0.65)]" />
                  ) : null}
                </button>
              );
            })}
          </div>
        ) : null}
      </div>

      {isLightboxOpen ? (
        <ProjectLightbox
          title={title}
          image={activeImage}
          index={safeIndex}
          total={total}
          hasMany={hasMany}
          isRtl={isRtl}
          onClose={() => setIsLightboxOpen(false)}
          onNext={goNext}
          onPrev={goPrev}
        />
      ) : null}
    </>
  );
}

function FeaturedArrow({
  position,
  isRtl,
  onClick,
}: {
  position: "start" | "end";
  isRtl: boolean;
  onClick: () => void;
}) {
  const Icon = position === "start" ? FiChevronLeft : FiChevronRight;

  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
      aria-label={position === "start" ? "Previous image" : "Next image"}
      className={cn(
        "absolute top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-background/60 text-foreground/90 opacity-0 shadow-[0_14px_34px_rgba(0,0,0,0.25)] backdrop-blur transition-all duration-300 hover:border-primary/50 hover:bg-primary/15 hover:text-foreground group-hover:opacity-100 sm:flex",
        position === "start" ? "inset-s-4" : "inset-e-4",
      )}
    >
      <Icon className={cn(isRtl && "rotate-180")} />
    </button>
  );
}

function ProjectLightbox({
  title,
  image,
  index,
  total,
  hasMany,
  isRtl,
  onClose,
  onNext,
  onPrev,
}: {
  title: string;
  image: string;
  index: number;
  total: number;
  hasMany: boolean;
  isRtl: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${title} — نمایش تصویر`}
      className="fixed inset-0 z-100 flex items-center justify-center bg-background/94 p-4 backdrop-blur-xl sm:p-6"
      onClick={onClose}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(79,124,255,0.18),transparent_34%),radial-gradient(circle_at_84%_84%,rgba(166,107,255,0.16),transparent_36%)]"
      />

      <button
        type="button"
        onClick={onClose}
        aria-label="بستن"
        className="absolute inset-e-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-border/70 bg-surface/70 text-foreground shadow-[0_16px_40px_rgba(0,0,0,0.32)] backdrop-blur transition-all hover:border-primary/50 hover:bg-primary/10"
      >
        <FiX />
      </button>

      <div
        className="relative z-10 h-[78vh] w-full max-w-6xl overflow-hidden rounded-2xl border border-border/60 bg-background/40 shadow-[0_35px_120px_rgba(0,0,0,0.45)]"
        onClick={(event) => event.stopPropagation()}
      >
        <Image
          key={image}
          src={image}
          alt={`${title} — تصویر ${index + 1}`}
          fill
          priority
          sizes="100vw"
          className="object-contain"
        />
      </div>

      {hasMany ? (
        <>
          <LightboxArrow
            position="start"
            isRtl={isRtl}
            onClick={isRtl ? onNext : onPrev}
          />
          <LightboxArrow
            position="end"
            isRtl={isRtl}
            onClick={isRtl ? onPrev : onNext}
          />

          <span className="absolute bottom-5 left-1/2 z-20 -translate-x-1/2 rounded-full border border-border/70 bg-surface/70 px-3.5 py-1.5 text-xs font-medium text-muted shadow-[0_12px_30px_rgba(0,0,0,0.24)] backdrop-blur">
            {index + 1} / {total}
          </span>
        </>
      ) : null}
    </div>
  );
}

function LightboxArrow({
  position,
  isRtl,
  onClick,
}: {
  position: "start" | "end";
  isRtl: boolean;
  onClick: () => void;
}) {
  const Icon = position === "start" ? FiChevronLeft : FiChevronRight;

  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
      aria-label={position === "start" ? "Previous image" : "Next image"}
      className={cn(
        "absolute top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border/70 bg-surface/70 text-foreground shadow-[0_16px_40px_rgba(0,0,0,0.32)] backdrop-blur transition-all hover:border-primary/50 hover:bg-primary/10 sm:h-12 sm:w-12",
        position === "start" ? "inset-s-4 sm:inset-s-6" : "inset-e-4 sm:inset-e-6",
      )}
    >
      <Icon className={cn(isRtl && "rotate-180")} />
    </button>
  );
}
