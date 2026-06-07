import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { PlannerOptionForm } from "@/components/admin/forms/PlannerOptionForm";
import { getPlannerOptionById } from "@/lib/planner/data";
import { updatePlannerOption } from "@/lib/actions/planner-options";
import { getI18n } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getI18n();
  return { title: dict.admin.plannerOpts.pageEdit };
}

export const dynamic = "force-dynamic";

export default async function EditPlannerOptionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numId = Number(id);
  if (Number.isNaN(numId)) notFound();

  const { dict } = await getI18n();
  const option = await getPlannerOptionById(numId);
  if (!option) notFound();

  const action = updatePlannerOption.bind(null, numId);

  return (
    <>
      <AdminPageHeader
        title={dict.admin.plannerOpts.pageEdit}
        description={option.value}
      />
      <div className="mt-6">
        <PlannerOptionForm action={action} initial={option} mode="edit" />
      </div>
    </>
  );
}
