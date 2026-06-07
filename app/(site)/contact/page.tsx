import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { CtaBanner } from "@/components/ui/CtaBanner";
import { ContactForm } from "@/components/forms/ContactForm";
import { getProfile } from "@/lib/data";
import { getI18n } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getI18n();
  return { title: dict.meta.pages.contact };
}

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const { locale, dict } = await getI18n();
  const profile = await getProfile(locale);
  const t = dict.contact;

  return (
    <div className="flex flex-col">
      <PageHero eyebrow={t.eyebrow} title={t.title} subtitle={t.subtitle} />

      <main className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-20 h-120 w-120 -translate-x-1/2 rounded-full bg-primary/10 blur-[150px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-40 bottom-40 h-110 w-110 rounded-full bg-accent/10 blur-[140px]"
        />

        <Container as="section" className="relative py-16 sm:py-20">
          <div className="grid gap-8 lg:grid-cols-5">
            {/* Contact info */}
            <div className="space-y-4 lg:col-span-2">
              {profile.email && (
                <div className="neon-card neon-hover rounded-2xl p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-faint">
                    {t.email}
                  </p>
                  <a
                    href={`mailto:${profile.email}`}
                    dir="ltr"
                    className="mt-1.5 block text-foreground transition-colors hover:text-primary-light"
                  >
                    {profile.email}
                  </a>
                </div>
              )}

              {profile.location && (
                <div className="neon-card neon-hover rounded-2xl p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-faint">
                    {t.location}
                  </p>
                  <p className="mt-1.5 text-foreground">{profile.location}</p>
                </div>
              )}

              {profile.socialLinks && profile.socialLinks.length > 0 && (
                <div className="neon-card rounded-2xl p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-faint">
                    {t.elsewhere}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2.5">
                    {profile.socialLinks.map((link) => (
                      <a
                        key={link.url}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg border border-border bg-surface-2/45 px-3 py-1.5 text-sm font-medium text-muted backdrop-blur transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/10 hover:text-foreground"
                      >
                        {link.label} ↗
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Form */}
            <div className="neon-card relative overflow-hidden rounded-3xl p-6 sm:p-8 lg:col-span-3">
              <div
                aria-hidden
                className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-primary/15 blur-3xl"
              />
              <div className="relative">
                <ContactForm />
              </div>
            </div>
          </div>

          <div className="mt-10">
            <CtaBanner
              title={dict.planner.cta.homeTitle}
              description={dict.planner.cta.homeText}
              ctaLabel={dict.planner.cta.start}
              ctaHref="/start-project"
            />
          </div>
        </Container>
      </main>
    </div>
  );
}
