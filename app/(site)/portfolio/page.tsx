import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/ui/PageHero";
import { StatPill } from "@/components/ui/StatPill";
import { EmptyState } from "@/components/ui/EmptyState";
import { PortfolioGallery } from "./PortfolioGallery";
import { getPublishedPortfolio } from "@/lib/data";
import { getI18n } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getI18n();
  return { title: dict.meta.pages.portfolio };
}

export const dynamic = "force-dynamic";

export default async function PortfolioPage() {
  const { locale, dict } = await getI18n();
  const items = await getPublishedPortfolio(locale);
  const t = dict.portfolio;

  return (
    <div className="flex flex-col">
      <PageHero eyebrow={t.eyebrow} title={t.title} subtitle={t.subtitle}>
        {items.length > 0 && (
          <StatPill value={items.length} label={dict.nav.portfolio} />
        )}
      </PageHero>

      <main className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-28 h-120 w-120 -translate-x-1/2 rounded-full bg-primary/10 blur-[150px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-40 bottom-48 h-110 w-110 rounded-full bg-accent/10 blur-[140px]"
        />

        <Container as="section" className="relative py-16 sm:py-20">
          {items.length === 0 ? (
            <EmptyState title={t.emptyTitle} description={t.emptyDesc} />
          ) : (
            <PortfolioGallery items={items} />
          )}
        </Container>
      </main>
    </div>
  );
}
