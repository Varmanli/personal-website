"use client";

import { useState } from "react";
import { FiCheckCircle, FiCode } from "react-icons/fi";
import { cn } from "@/lib/utils";
import { getTechnology } from "@/lib/admin/technologies";
import type { ProjectChallenge } from "@/types";

interface ProjectTabsProps {
  overview?: string | null;
  outcome?: string | null;
  challenges: ProjectChallenge[];
  highlights: string[];
  technologies: string[];
  labels: {
    overview: string;
    challenges: string;
    highlights: string;
    highlightsText?: string;
    outcome: string;
    technologies: string;
  };
}

type TabKey = "overview" | "challenges" | "highlights" | "technologies";

/**
 * Tabbed main content for the case-study page: overview, challenges, and
 * technical highlights. Only tabs that have content are shown, and the whole
 * block renders nothing when there's no content at all. RTL-aware via the
 * inherited document direction.
 */
export function ProjectTabs({
  overview,
  outcome,
  challenges,
  highlights,
  technologies,
  labels,
}: ProjectTabsProps) {
  const tabs: Array<{ key: TabKey; label: string }> = [
    (overview || outcome) && {
      key: "overview" as const,
      label: labels.overview,
    },
    challenges.length > 0 && {
      key: "challenges" as const,
      label: labels.challenges,
    },
    highlights.length > 0 && {
      key: "highlights" as const,
      label: labels.highlights,
    },
    technologies.length > 0 && {
      key: "technologies" as const,
      label: labels.technologies,
    },
  ].filter(Boolean) as Array<{ key: TabKey; label: string }>;

  const [active, setActive] = useState<TabKey>(tabs[0]?.key ?? "overview");

  if (tabs.length === 0) return null;

  return (
    <div className="relative">
      {/* Tab bar */}
      <div className="relative mb-8 overflow-hidden rounded-2xl border border-border/55 bg-background/35 p-1.5 shadow-[0_18px_60px_rgba(4,7,20,0.24)] backdrop-blur">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-6 top-0 h-px bg-linear-to-r from-transparent via-primary/35 to-transparent"
        />

        <div
          role="tablist"
          aria-orientation="horizontal"
          className="relative flex gap-1.5 overflow-x-auto scrollbar-none [&::-webkit-scrollbar]:hidden"
        >
          {tabs.map((tab) => {
            const isActive = tab.key === active;

            return (
              <button
                key={tab.key}
                role="tab"
                type="button"
                aria-selected={isActive}
                onClick={() => setActive(tab.key)}
                className={cn(
                  "relative min-w-max flex-1 rounded-xl px-4 py-3 text-sm font-bold transition-all duration-300 sm:px-5",
                  isActive
                    ? "bg-linear-to-br from-primary/22 via-primary/12 to-accent/16 text-foreground shadow-[0_12px_34px_rgba(79,124,255,0.16)]"
                    : "text-faint hover:bg-surface/45 hover:text-muted",
                )}
              >
                <span className="relative z-10">{tab.label}</span>

                {isActive ? (
                  <>
                    <span
                      aria-hidden
                      className="absolute inset-x-4 bottom-1 h-0.5 rounded-full bg-linear-to-l from-primary via-accent to-primary-light"
                    />
                    <span
                      aria-hidden
                      className="absolute -top-10 inset-s-1/2 h-20 w-20 -translate-x-1/2 rounded-full bg-primary/20 blur-2xl"
                    />
                  </>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      {/* Panels */}
      <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-linear-to-br from-surface/55 via-surface/35 to-background/45 p-5 shadow-[0_22px_80px_rgba(4,7,20,0.25)] sm:p-7">
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-e-24 -top-24 h-56 w-56 rounded-full bg-primary/10 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-28 -inset-s-24 h-56 w-56 rounded-full bg-accent/10 blur-3xl"
        />

        <div className="relative">
          {active === "overview" ? (
            <div key="overview" className="animate-fade-in-up">
              <div className="mb-6 flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_18px_rgba(79,124,255,0.75)]" />
                <h2 className="text-xl font-black tracking-tight text-foreground sm:text-2xl">
                  {labels.overview}
                </h2>
              </div>

              <div className="space-y-8">
                {overview ? (
                  <div className="prose prose-invert max-w-none">
                    <p className="max-w-3xl whitespace-pre-line text-base leading-9 text-muted sm:text-lg sm:leading-[2.05]">
                      {overview}
                    </p>
                  </div>
                ) : null}

                {outcome ? (
                  <div className="relative max-w-3xl overflow-hidden rounded-2xl border border-primary/20 bg-primary/8 p-5 sm:p-6">
                    <div
                      aria-hidden
                      className="pointer-events-none absolute -inset-e-16 -top-16 h-36 w-36 rounded-full bg-primary/15 blur-3xl"
                    />

                    <div className="relative border-s-2 border-primary/55 ps-5 sm:ps-6">
                      <p className="text-xs font-black text-primary-light">
                        {labels.outcome}
                      </p>
                      <p className="mt-3 whitespace-pre-line text-base leading-9 text-muted sm:text-lg sm:leading-[2.05]">
                        {outcome}
                      </p>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}

          {active === "challenges" ? (
            <div key="challenges" className="animate-fade-in-up">
              <div className="mb-6 flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_18px_rgba(79,124,255,0.75)]" />
                <h2 className="text-xl font-black tracking-tight text-foreground sm:text-2xl">
                  {labels.challenges}
                </h2>
              </div>

              <ol className="grid gap-4">
                {challenges.map((challenge, index) => (
                  <li
                    key={`${index}-${challenge.title?.slice(0, 12)}`}
                    className="group relative overflow-hidden rounded-2xl border border-border/50 bg-background/30 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/35 hover:bg-surface/45 hover:shadow-[0_18px_55px_rgba(79,124,255,0.10)] sm:p-6"
                  >
                    <div
                      aria-hidden
                      className="pointer-events-none absolute -inset-e-16 -top-16 h-36 w-36 rounded-full bg-primary/10 opacity-0 blur-3xl transition-opacity duration-300 group-hover:opacity-100"
                    />

                    <div className="relative flex items-start gap-4">
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-primary/25 bg-primary/10 text-sm font-black tabular-nums text-primary-light shadow-[0_12px_34px_rgba(79,124,255,0.14)]">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <div className="min-w-0 flex-1">
                        {challenge.title ? (
                          <h3 className="text-base font-black leading-7 tracking-[-0.015em] text-foreground sm:text-lg">
                            {challenge.title}
                          </h3>
                        ) : null}

                        {challenge.description ? (
                          <p className="mt-2 whitespace-pre-line text-sm leading-8 text-muted sm:text-base sm:leading-8">
                            {challenge.description}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          ) : null}

          {active === "highlights" ? (
            <div key="highlights" className="animate-fade-in-up">
              <div className="mb-6 flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_18px_rgba(79,124,255,0.75)]" />
                <h2 className="text-xl font-black tracking-tight text-foreground sm:text-2xl">
                  {labels.highlights}
                </h2>
              </div>

              {labels.highlightsText ? (
                <p className="mb-6 max-w-2xl text-sm leading-8 text-muted sm:text-base sm:leading-8">
                  {labels.highlightsText}
                </p>
              ) : null}

              <ul className="grid gap-3 sm:grid-cols-2">
                {highlights.map((item) => (
                  <li
                    key={item}
                    className="group flex items-start gap-3 rounded-2xl border border-border/45 bg-background/30 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/35 hover:bg-surface/45"
                  >
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary-light">
                      <FiCheckCircle size={17} />
                    </span>

                    <span className="text-sm font-medium leading-7 text-muted transition-colors group-hover:text-foreground sm:text-[0.95rem]">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {active === "technologies" ? (
            <div key="technologies" className="animate-fade-in-up">
              <div className="mb-6 flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_18px_rgba(79,124,255,0.75)]" />
                <h2 className="text-xl font-black tracking-tight text-foreground sm:text-2xl">
                  {labels.technologies}
                </h2>
              </div>

              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {technologies.map((value) => {
                  const tech = getTechnology(value);
                  return (
                    <li
                      key={value}
                      className="group relative flex items-center gap-3 overflow-hidden rounded-2xl border border-border/45 bg-background/30 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/35 hover:bg-surface/45 hover:shadow-[0_18px_55px_rgba(79,124,255,0.10)]"
                    >
                      <span
                        aria-hidden
                        className="pointer-events-none absolute -inset-e-12 -top-12 h-28 w-28 rounded-full bg-primary/10 opacity-0 blur-3xl transition-opacity duration-300 group-hover:opacity-100"
                      />

                      <span
                        className={cn(
                          "relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-xl",
                          tech?.colorClass ?? "text-primary-light",
                        )}
                      >
                        {tech?.icon ?? <FiCode />}
                      </span>

                      <span className="relative truncate text-sm font-semibold text-foreground sm:text-[0.95rem]">
                        {tech?.label ?? value}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
