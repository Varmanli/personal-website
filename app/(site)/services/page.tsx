import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PageHero } from "@/components/ui/PageHero";
import { StatPill } from "@/components/ui/StatPill";
import { ButtonLink } from "@/components/ui/Button";
import { ServicePlanCard } from "@/components/cards/ServicePlanCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { CtaBanner } from "@/components/ui/CtaBanner";
import { getPublishedServices } from "@/lib/data";
import { getI18n } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getI18n();
  return { title: dict.meta.pages.services };
}

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const { locale, dict } = await getI18n();
  const services = await getPublishedServices(locale);
  const t = dict.services;

  return (
    <div className="flex flex-col">
      <PageHero eyebrow={t.eyebrow} title={t.title} subtitle={t.subtitle}>
        {services.length > 0 && (
          <StatPill value={services.length} label={dict.nav.services} />
        )}
      </PageHero>

      <main className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-24 h-120 w-120 -translate-x-1/2 rounded-full bg-primary/10 blur-[150px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -left-40 bottom-64 h-110 w-110 rounded-full bg-accent/10 blur-[140px]"
        />

        <div className="relative flex flex-col gap-20 py-16 sm:py-20 lg:gap-24">
          {/* Planner / estimate CTA */}
          <Container as="section">
            <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/15 via-surface to-accent/10 p-8 sm:p-10">
              <div
                aria-hidden
                className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/20 blur-3xl"
              />
              <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="max-w-2xl space-y-2">
                  <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                    {dict.planner.cta.servicesTitle}
                  </h2>
                  <p className="text-sm leading-relaxed text-muted">
                    {dict.planner.cta.servicesText}
                  </p>
                </div>
                <ButtonLink href="/start-project" size="lg" className="shrink-0">
                  {dict.planner.cta.servicesButton}
                  <span aria-hidden>→</span>
                </ButtonLink>
              </div>
            </div>
          </Container>

          <Container as="section" className="space-y-12">
            {services.length === 0 ? (
              <EmptyState
                title={t.emptyTitle}
                description={t.emptyDesc}
                action={<ButtonLink href="/contact">{t.emptyCta}</ButtonLink>}
              />
            ) : (
              <>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                  {services.map((service) => (
                    <ServicePlanCard key={service.id} service={service} />
                  ))}
                </div>
                <p className="text-center text-sm text-faint">{t.priceNote}</p>
              </>
            )}
          </Container>

          {/* FAQ */}
          <Container as="section" className="space-y-10">
            <SectionHeader
              align="center"
              eyebrow={t.faqEyebrow}
              title={t.faqTitle}
            />
            <div className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-2">
              {t.faqs.map((faq) => (
                <div
                  key={faq.q}
                  className="neon-card neon-hover rounded-2xl p-6"
                >
                  <h3 className="font-semibold text-foreground">{faq.q}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </Container>

          {/* CTA */}
          <Container as="section">
            <CtaBanner
              title={t.ctaTitle}
              description={t.ctaText}
              ctaLabel={t.cta}
              ctaHref="/contact"
            />
          </Container>
        </div>
      </main>
    </div>
  );
}
