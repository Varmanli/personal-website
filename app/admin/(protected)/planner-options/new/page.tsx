import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { PlannerOptionForm } from "@/components/admin/forms/PlannerOptionForm";
import { createPlannerOption } from "@/lib/actions/planner-options";
import { getI18n } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getI18n();
  return { title: dict.admin.plannerOpts.pageNew };
}

export default async function NewPlannerOptionPage() {
  const { dict } = await getI18n();
  return (
    <>
      <AdminPageHeader title={dict.admin.plannerOpts.pageNew} />
      <div className="mt-6">
        <PlannerOptionForm action={createPlannerOption} mode="create" />
      </div>
    </>
  );
}
