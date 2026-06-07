import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { PlannerOptionsManager } from "@/components/admin/PlannerOptionsManager";
import { EmptyState } from "@/components/ui/EmptyState";
import { ButtonLink } from "@/components/ui/Button";
import { getAllPlannerOptions } from "@/lib/planner/data";
import { getI18n } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getI18n();
  return { title: dict.admin.plannerOpts.title };
}

export const dynamic = "force-dynamic";

export default async function AdminPlannerOptionsPage() {
  const { dict } = await getI18n();
  const rows = await getAllPlannerOptions();
  const t = dict.admin.plannerOpts;

  return (
    <>
      <AdminPageHeader
        title={t.title}
        description={t.description}
        action={
          <ButtonLink href="/admin/planner-options/new" size="sm">
            {t.newItem}
          </ButtonLink>
        }
      />
      {rows.length === 0 ? (
        <EmptyState
          title={t.empty}
          description={t.fallbackNote}
          action={
            <ButtonLink href="/admin/planner-options/new">{t.newItem}</ButtonLink>
          }
        />
      ) : (
        <PlannerOptionsManager rows={rows} />
      )}
    </>
  );
}
