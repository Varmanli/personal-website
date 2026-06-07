import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { CtaBanner } from "@/components/ui/CtaBanner";
import { getProfile } from "@/lib/data";
import { getExperience, getTechStack } from "@/lib/content";
import { getI18n } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getI18n();
  return { title: dict.meta.pages.about };
}

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const { locale, dict } = await getI18n();
  const profile = await getProfile(locale);
  const t = dict.about;
  const experience = getExperience(locale);
  const techStack = getTechStack(locale);

  return (
    <div className="flex flex-col">
      {/* Hero — personal brand intro with avatar */}
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

        <Container className="relative grid items-center gap-12 py-16 lg:grid-cols-[1.5fr_1fr] lg:py-24">
          <div className="space-y-6">
            <SectionHeader
              eyebrow={t.eyebrow}
              title={profile.ownerName}
              subtitle={profile.headline ?? undefined}
            />

            {profile.bio && (
              <p className="max-w-xl leading-relaxed text-muted">
                {profile.bio}
              </p>
            )}
            <p className="max-w-xl leading-relaxed text-muted">
              {profile.aboutIntro ?? t.bio2}
            </p>

            <div className="flex flex-wrap gap-3 pt-1">
              <ButtonLink href="/contact" size="lg">
                {t.getInTouch}
              </ButtonLink>
              {profile.resumeUrl && (
                <ButtonLink
                  href={profile.resumeUrl}
                  external
                  variant="outline"
                  size="lg"
                >
                  {t.downloadResume}
                </ButtonLink>
              )}
            </div>

            {profile.skills && profile.skills.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {profile.skills.map((skill) => (
                  <Badge key={skill} tone="brand">
                    {skill}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Avatar */}
          <div className="relative mx-auto flex w-full max-w-xs items-center justify-center lg:max-w-sm">
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[112%] -translate-x-1/2 -translate-y-1/2 animate-orbit orbit-ring"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 h-3/4 w-3/4 -translate-x-1/2 -translate-y-1/2 animate-pulse-soft rounded-full bg-linear-to-br from-primary/40 to-accent/40 blur-3xl"
            />

            <div className="relative aspect-square w-full overflow-hidden rounded-3xl border border-border neon-card">
              <div aria-hidden className="absolute inset-0 grid-bg opacity-30" />
              {/* Prefer an uploaded avatar; otherwise the bundled portrait
                  (moved here from the old hero). */}
              <Image
                src={profile.avatarUrl || "/myimage.png"}
                alt={profile.ownerName}
                fill
                priority
                sizes="(max-width: 1024px) 80vw, 30vw"
                className={
                  profile.avatarUrl
                    ? "object-cover"
                    : "object-contain object-bottom"
                }
              />
            </div>

            {/* Detail chips */}
            <div className="float-card absolute -bottom-4 start-2 hidden sm:block">
              <div className="neon-card flex items-center gap-2 rounded-xl px-3 py-2 text-sm">
                <span className="h-2 w-2 animate-pulse-soft rounded-full bg-success" />
                <span className="font-medium text-foreground">
                  {dict.hero.available}
                </span>
              </div>
            </div>
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

        <div className="relative flex flex-col gap-20 py-20 lg:gap-24">
          {/* Contact details card */}
          {(profile.location || profile.email) && (
            <Container as="section">
              <div className="grid gap-4 sm:grid-cols-2">
                {profile.location && (
                  <div className="neon-card neon-hover rounded-2xl p-5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-faint">
                      {t.location}
                    </p>
                    <p className="mt-1.5 text-foreground">{profile.location}</p>
                  </div>
                )}
                {profile.email && (
                  <div className="neon-card neon-hover rounded-2xl p-5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-faint">
                      {t.email}
                    </p>
                    <p dir="ltr" className="mt-1.5 text-foreground">
                      {profile.email}
                    </p>
                  </div>
                )}
              </div>
            </Container>
          )}

          {/* Experience timeline */}
          <Container as="section" className="space-y-10">
            <SectionHeader
              eyebrow={t.experience.eyebrow}
              title={t.experience.title}
              subtitle={t.experience.subtitle}
            />
            <ol className="relative space-y-8 border-s border-border ps-6">
              {experience.map((entry) => (
                <li key={`${entry.period}-${entry.role}`} className="relative">
                  <span className="absolute -start-[1.72rem] top-1.5 h-3 w-3 rounded-full border-2 border-background bg-primary shadow-[0_0_12px_rgba(79,124,255,0.7)]" />
                  <p className="text-xs font-medium uppercase tracking-wide text-faint">
                    {entry.period}
                  </p>
                  <h3 className="mt-1 font-semibold text-foreground">
                    {entry.role}{" "}
                    <span className="font-normal text-muted">
                      · {entry.organization}
                    </span>
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted">
                    {entry.description}
                  </p>
                </li>
              ))}
            </ol>
          </Container>

          {/* Tools & technologies */}
          <Container as="section" className="space-y-10">
            <SectionHeader
              eyebrow={t.tools.eyebrow}
              title={t.tools.title}
              subtitle={t.tools.subtitle}
            />
            <div className="grid gap-6 sm:grid-cols-3">
              {techStack.map((group) => (
                <div
                  key={group.category}
                  className="neon-card neon-hover rounded-2xl p-6"
                >
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-faint">
                    {group.category}
                  </h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <Badge key={item}>{item}</Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Container>

          {/* Working style / values */}
          <Container as="section" className="space-y-10">
            <SectionHeader
              eyebrow={t.values.eyebrow}
              title={t.values.title}
              subtitle={t.values.subtitle}
            />
            <div className="grid gap-6 sm:grid-cols-2">
              {t.values.items.map((value) => (
                <div
                  key={value.title}
                  className="neon-card neon-hover rounded-2xl p-6"
                >
                  <h3 className="font-semibold text-foreground">
                    {value.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </Container>

          {/* CTA */}
          <Container as="section">
            <CtaBanner
              title={dict.home.cta.title}
              description={dict.home.cta.description}
              ctaLabel={dict.home.cta.cta}
              ctaHref="/contact"
            />
          </Container>
        </div>
      </main>
    </div>
  );
}
