import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Container";
import { PlannerWizard } from "@/components/planner/PlannerWizard";
import {
  getPublicPlannerOptions,
  getEstimateRules,
  getPlannerSettings,
} from "@/lib/planner/data";
import { validValues } from "@/lib/planner/options";
import { getProfile } from "@/lib/data";
import { getI18n } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getI18n();
  return { title: dict.planner.hero.title };
}

export const dynamic = "force-dynamic";

// Map a `?service=` hint to a planner projectType (best-effort preselect).
const SERVICE_TO_TYPE: Record<string, string> = {
  "web-development": "custom_web_app",
  "full-stack-website": "corporate_website",
  "landing-page": "landing_page",
  "admin-dashboard": "admin_dashboard",
  "custom-web-application": "custom_web_app",
  ecommerce: "ecommerce",
  wordpress: "cms_wordpress",
};

export default async function StartProjectPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const { locale, dict } = await getI18n();
  const { service } = await searchParams;
  const [options, rules, settings, profile] = await Promise.all([
    getPublicPlannerOptions(locale),
    getEstimateRules(),
    getPlannerSettings(),
    getProfile(locale),
  ]);
  const brandName = profile.ownerName?.trim() || "Varmanli";

  const hinted = service ? SERVICE_TO_TYPE[service] : undefined;
  const initialProjectType =
    hinted && validValues("projectType").has(hinted) ? hinted : "";

  return (
    <div className="flex flex-col">
      <PageHero
        eyebrow={dict.planner.hero.badge}
        title={dict.planner.hero.title}
        subtitle={dict.planner.hero.subtitle}
      >
        <p className="max-w-2xl text-sm leading-7 text-faint">
          {dict.planner.hero.supporting}
        </p>
      </PageHero>
      <main className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-24 h-120 w-120 -translate-x-1/2 rounded-full bg-primary/10 blur-[150px]"
        />
        <Container as="section" className="relative py-12 sm:py-16">
          <PlannerWizard
            options={options}
            rules={rules}
            settings={settings}
            initialProjectType={initialProjectType}
            brandName={brandName}
          />
        </Container>
      </main>
    </div>
  );
}
