import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { PlannerSettingsForm } from "@/components/admin/forms/PlannerSettingsForm";
import { EstimateRulesManager } from "@/components/admin/EstimateRulesManager";
import { getAllEstimateRules, getRawPlannerSettings } from "@/lib/planner/data";
import { getI18n } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getI18n();
  return { title: dict.admin.estimates.title };
}

export const dynamic = "force-dynamic";

export default async function AdminPlannerEstimatesPage() {
  const { dict } = await getI18n();
  const [rules, settings] = await Promise.all([
    getAllEstimateRules(),
    getRawPlannerSettings(),
  ]);
  const t = dict.admin.estimates;

  return (
    <>
      <AdminPageHeader title={t.title} description={t.description} />
      <div className="space-y-8">
        <PlannerSettingsForm initial={settings} />
        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-faint">
            {t.rulesTitle}
          </h2>
          <EstimateRulesManager rows={rules} />
        </div>
      </div>
    </>
  );
}
