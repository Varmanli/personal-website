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
  const [options, rules, settings] = await Promise.all([
    getPublicPlannerOptions(locale),
    getEstimateRules(),
    getPlannerSettings(),
  ]);

  const hinted = service ? SERVICE_TO_TYPE[service] : undefined;
  const initialProjectType =
    hinted && validValues("projectType").has(hinted) ? hinted : "";

  return (
    <div className="flex flex-col">
      <PageHero
        eyebrow={dict.planner.ui.recommendation}
        title={dict.planner.hero.title}
        subtitle={dict.planner.hero.subtitle}
      />
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
          />
        </Container>
      </main>
    </div>
  );
}
