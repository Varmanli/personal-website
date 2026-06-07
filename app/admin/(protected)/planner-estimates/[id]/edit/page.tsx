import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { EstimateRuleForm } from "@/components/admin/forms/EstimateRuleForm";
import { getEstimateRuleById } from "@/lib/planner/data";
import { getI18n } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getI18n();
  return { title: dict.admin.estimates.pageEdit };
}

export const dynamic = "force-dynamic";

export default async function EditEstimateRulePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numId = Number(id);
  if (Number.isNaN(numId)) notFound();

  const { dict } = await getI18n();
  const rule = await getEstimateRuleById(numId);
  if (!rule) notFound();

  return (
    <>
      <AdminPageHeader title={dict.admin.estimates.pageEdit} description={rule.key} />
      <div className="mt-6">
        <EstimateRuleForm initial={rule} />
      </div>
    </>
  );
}
