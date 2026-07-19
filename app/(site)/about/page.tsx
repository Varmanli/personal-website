import type { Metadata } from "next";
import Image from "next/image";
import type { ComponentType } from "react";
import {
  FiCheckCircle,
  FiCode,
  FiLayers,
  FiMessageSquare,
  FiMonitor,
  FiServer,
  FiShield,
  FiTarget,
  FiTrendingUp,
} from "react-icons/fi";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ButtonLink } from "@/components/ui/Button";
import { getAboutPageContent, getProfile } from "@/lib/data";
import { getI18n } from "@/lib/i18n/server";
import { buildMetadata } from "@/lib/seo";
import { TechBadge } from "@/components/sections/TechStack";
import { FreelanceOnly } from "@/components/layout/WebsiteModeContent";

export async function generateMetadata(): Promise<Metadata> {
  const { locale, dict } = await getI18n();
  const profile = await getProfile(locale);
  return buildMetadata({
    title: dict.meta.pages.about,
    description: profile.headline ?? profile.bio,
    path: "/about",
    image: profile.avatarUrl,
    type: "profile",
  });
}

export const dynamic = "force-dynamic";

const valueIcons = [FiCode, FiMessageSquare, FiTarget, FiShield];
const helpIcons = [FiMonitor, FiLayers, FiServer, FiTrendingUp];

function iconByKey(key: string | undefined, fallback: ComponentType) {
  const normalized = key?.trim().toLowerCase().replace(/[\s_-]+/g, "") ?? "";
  const iconMap = {
    code: FiCode,
    message: FiMessageSquare,
    messagesquare: FiMessageSquare,
    target: FiTarget,
    shield: FiShield,
    monitor: FiMonitor,
    website: FiMonitor,
    layers: FiLayers,
    panel: FiLayers,
    server: FiServer,
    backend: FiServer,
    trending: FiTrendingUp,
    growth: FiTrendingUp,
  } as const;

  return iconMap[normalized as keyof typeof iconMap] ?? fallback;
}

export default async function AboutPage() {
  const { locale, dict } = await getI18n();
  const [profile, aboutContent] = await Promise.all([
    getProfile(locale),
    getAboutPageContent(locale),
  ]);

  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden border-b border-border">
        <div
          aria-hidden
          className="absolute inset-0 grid-bg mask-[radial-gradient(ellipse_at_center,black,transparent_78%)] opacity-60"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -left-28 -top-20 h-96 w-96 rounded-full bg-primary/20 blur-[120px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 top-10 h-96 w-96 rounded-full bg-accent/15 blur-[120px]"
        />

        <Container className="relative py-16 lg:py-24">
          <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-14">
            <div className="space-y-6">
              <SectionHeader
                eyebrow={aboutContent.hero.badge}
                title={aboutContent.hero.name}
                subtitle={aboutContent.hero.subtitle}
              />

              <p className="max-w-2xl text-base leading-8 text-muted sm:text-lg">
                {aboutContent.hero.description}
              </p>

              <div className="flex flex-col gap-3 sm:flex-row">
                <FreelanceOnly><ButtonLink
                  href={aboutContent.hero.primaryCta.href}
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  {aboutContent.hero.primaryCta.label}
                </ButtonLink></FreelanceOnly>
                <ButtonLink
                  href={aboutContent.hero.secondaryCta.href}
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  {aboutContent.hero.secondaryCta.label}
                </ButtonLink>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {aboutContent.hero.chips.map((chip) => (
                  <TechBadge key={chip} value={chip} />
                ))}
              </div>
            </div>

            <div className="relative mx-auto flex w-full max-w-sm items-center justify-center lg:max-w-md">
              <div
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-1/2 h-[84%] w-[84%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-linear-to-br from-primary/30 to-accent/25 blur-3xl"
              />
              <div className="relative w-full rounded-[2rem] border border-border/80 bg-surface-2/35 p-3 shadow-[0_28px_90px_rgba(10,14,32,0.45)] backdrop-blur">
                <div className="relative aspect-[0.9] overflow-hidden rounded-[1.6rem] border border-white/8 bg-background/70">
                  <div
                    aria-hidden
                    className="absolute inset-0 grid-bg opacity-25"
                  />
                  <Image
                    src={
                      aboutContent.hero.imageUrl ||
                      profile.avatarUrl ||
                      "/myimage.png"
                    }
                    alt={aboutContent.hero.name || profile.ownerName}
                    fill
                    priority
                    sizes="(max-width: 1024px) 85vw, 32vw"
                    className={
                      aboutContent.hero.imageUrl || profile.avatarUrl
                        ? "object-cover"
                        : "object-contain object-bottom"
                    }
                  />
                </div>

                <div className="pointer-events-none absolute inset-x-6 top-6 flex items-start justify-between gap-3">
                  <div className="rounded-full border border-white/12 bg-background/75 px-3 py-1.5 text-xs font-semibold text-foreground backdrop-blur">
                    <span className="inline-flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-success shadow-[0_0_14px_rgba(52,211,153,0.7)]" />
                      {aboutContent.hero.statusBadge}
                    </span>
                  </div>
                  <div className="hidden flex-wrap justify-end gap-2 sm:flex">
                    {aboutContent.hero.chips.slice(0, 2).map((chip) => (
                      <div
                        key={chip}
                        className="rounded-full border border-white/10 bg-background/70 px-3 py-1 text-[11px] font-medium text-muted backdrop-blur"
                      >
                        {chip}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-3 sm:mt-10 sm:grid-cols-2 xl:grid-cols-4">
            {aboutContent.stats.map((item) => (
              <div
                key={`${item.order}-${item.label}`}
                className="neon-card rounded-2xl px-4 py-4 sm:px-5"
              >
                <p className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
                  {item.value}
                </p>
                <p className="mt-1 text-sm leading-6 text-muted">{item.label}</p>
                {item.description && (
                  <p className="mt-1 text-xs leading-5 text-faint">
                    {item.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </Container>
      </section>

      <main className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-40 h-120 w-120 -translate-x-1/2 rounded-full bg-primary/10 blur-[150px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-48 bottom-96 h-110 w-110 rounded-full bg-accent/10 blur-[140px]"
        />

        <div className="relative flex flex-col gap-18 py-18 sm:gap-20 lg:gap-24 lg:py-22">
          {aboutContent.experienceSection.items.length > 0 && (
            <Container as="section" className="space-y-8">
            <SectionHeader
              eyebrow={aboutContent.experienceSection.badge}
              title={aboutContent.experienceSection.title}
              subtitle={aboutContent.experienceSection.subtitle}
            />

            <ol className="relative space-y-5 border-s border-border/80 ps-5 sm:ps-6">
              {aboutContent.experienceSection.items.map((entry) => (
                <li key={`${entry.order}-${entry.title}`} className="relative">
                  <span className="absolute -start-[1.45rem] top-7 h-3 w-3 rounded-full border-2 border-background bg-primary shadow-[0_0_16px_rgba(79,124,255,0.75)] sm:-start-[1.72rem]" />
                  <article className="neon-card group rounded-[1.6rem] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_24px_80px_rgba(79,124,255,0.14)] sm:p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="space-y-2">
                        <p className="text-xs font-semibold tracking-[0.16em] text-primary-light uppercase">
                          {entry.dateRange}
                        </p>
                        <div>
                          <h3 className="text-lg font-semibold tracking-tight text-foreground">
                            {entry.title}
                          </h3>
                          {entry.role && (
                            <p className="mt-1 text-sm text-faint">
                              {entry.role}
                            </p>
                          )}
                        </div>
                      </div>
                      <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-border bg-background/55 text-lg text-primary-light backdrop-blur">
                        <FiTrendingUp />
                      </span>
                    </div>
                    <p className="mt-4 text-sm leading-7 text-muted">
                      {entry.description}
                    </p>
                    {!!entry.tags.length && (
                      <div className="mt-5 flex flex-wrap gap-2">
                        {entry.tags.map((tag) => (
                          <TechBadge key={tag} value={tag} />
                        ))}
                      </div>
                    )}
                  </article>
                </li>
              ))}
            </ol>
            </Container>
          )}

          {aboutContent.technologiesSection.groups.length > 0 && (
            <Container as="section" className="space-y-8">
            <SectionHeader
              eyebrow={aboutContent.technologiesSection.badge}
              title={aboutContent.technologiesSection.title}
              subtitle={aboutContent.technologiesSection.subtitle}
            />
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {aboutContent.technologiesSection.groups.map((group, index) => (
                <article
                  key={`${group.order}-${group.title}`}
                  className="neon-card group relative overflow-hidden rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_24px_80px_rgba(79,124,255,0.14)]"
                >
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-primary/15 blur-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  />
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-accent/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  />

                  <div className="relative">
                    <div className="mb-5 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-background/55 text-xl text-primary-light backdrop-blur transition-colors group-hover:border-primary/40 group-hover:bg-primary/10">
                          {index === 0 ? (
                            <FiMonitor />
                          ) : index === 1 ? (
                            <FiServer />
                          ) : (
                            <FiLayers />
                          )}
                        </span>

                        <div>
                          <h3 className="text-base font-semibold tracking-tight text-foreground">
                            {group.title}
                          </h3>
                          <p className="mt-0.5 text-xs text-faint">
                            {group.technologies.length} {dict.home.skills.tools}
                          </p>
                        </div>
                      </div>

                      <span className="h-2 w-2 rounded-full bg-linear-to-r from-primary to-accent shadow-[0_0_16px_rgba(166,107,255,0.75)]" />
                    </div>

                    {group.description && (
                      <p className="mb-5 text-sm leading-7 text-muted">
                        {group.description}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-2">
                      {group.technologies.map((item) => (
                        <TechBadge key={item} value={item} />
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
            </Container>
          )}

          <FreelanceOnly>{aboutContent.philosophySection.cards.length > 0 && (
            <Container as="section" className="space-y-8">
            <SectionHeader
              eyebrow={aboutContent.philosophySection.badge}
              title={aboutContent.philosophySection.title}
              subtitle={aboutContent.philosophySection.subtitle}
            />
            <div className="grid gap-5 sm:grid-cols-2">
              {aboutContent.philosophySection.cards.map((value, index) => {
                const Icon =
                  iconByKey(value.icon, valueIcons[index] ?? FiCheckCircle);
                return (
                  <article
                    key={`${value.order}-${value.title}`}
                    className="neon-card group rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_24px_80px_rgba(79,124,255,0.14)]"
                  >
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-background/55 text-xl text-primary-light backdrop-blur transition-colors group-hover:border-primary/40 group-hover:bg-primary/10">
                      <Icon />
                    </span>
                    <h3 className="mt-5 text-lg font-semibold tracking-tight text-foreground">
                      {value.title}
                    </h3>
                    <p className="mt-2 text-sm leading-7 text-muted">
                      {value.description}
                    </p>
                  </article>
                );
              })}
            </div>
            </Container>
          )}</FreelanceOnly>

          <FreelanceOnly>{aboutContent.helpSection.cards.length > 0 && (
            <Container as="section" className="space-y-8">
            <SectionHeader
              eyebrow={aboutContent.helpSection.badge}
              title={aboutContent.helpSection.title}
              subtitle={aboutContent.helpSection.subtitle}
            />
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {aboutContent.helpSection.cards.map((item, index) => {
                const Icon =
                  iconByKey(item.icon, helpIcons[index] ?? FiCheckCircle);
                return (
                  <article
                    key={`${item.order}-${item.title}`}
                    className="neon-card group rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_24px_80px_rgba(79,124,255,0.14)]"
                  >
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-background/55 text-xl text-primary-light backdrop-blur transition-colors group-hover:border-primary/40 group-hover:bg-primary/10">
                      <Icon />
                    </span>
                    <h3 className="mt-5 text-lg font-semibold tracking-tight text-foreground">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-7 text-muted">
                      {item.description}
                    </p>
                  </article>
                );
              })}
            </div>
            </Container>
          )}</FreelanceOnly>

          <FreelanceOnly><Container as="section">
            <div className="neon-card relative overflow-hidden rounded-[2rem] p-6 sm:p-8 lg:p-10">
              <div
                aria-hidden
                className="absolute inset-0 bg-linear-to-br from-primary/14 via-transparent to-accent/14"
              />
              <div
                aria-hidden
                className="absolute -left-10 bottom-0 h-44 w-44 rounded-full bg-primary/14 blur-3xl"
              />
              <div
                aria-hidden
                className="absolute -right-12 top-0 h-44 w-44 rounded-full bg-accent/14 blur-3xl"
              />

              <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-2xl space-y-3">
                  <p className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-2/60 px-3 py-1.5 text-xs font-semibold tracking-[0.16em] text-primary-light backdrop-blur">
                    <span className="h-1.5 w-1.5 rounded-full bg-success shadow-[0_0_14px_rgba(52,211,153,0.7)]" />
                    {aboutContent.cta.badge}
                  </p>
                  <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                    {aboutContent.cta.title}
                  </h2>
                  <p className="text-sm leading-7 text-muted sm:text-base">
                    {aboutContent.cta.subtitle}
                  </p>
                </div>

                <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                  <ButtonLink
                    href={aboutContent.cta.primaryCta.href}
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    {aboutContent.cta.primaryCta.label}
                  </ButtonLink>
                  <ButtonLink
                    href={aboutContent.cta.secondaryCta.href}
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto"
                  >
                    {aboutContent.cta.secondaryCta.label}
                  </ButtonLink>
                </div>
              </div>
            </div>
          </Container></FreelanceOnly>
        </div>
      </main>
    </div>
  );
}
