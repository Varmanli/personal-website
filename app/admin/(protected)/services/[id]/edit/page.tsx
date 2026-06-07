import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ServiceForm } from "@/components/admin/forms/ServiceForm";
import { getServiceById } from "@/lib/data";
import { updateService } from "@/lib/actions/services";
import { getI18n } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getI18n();
  return { title: dict.admin.forms.pageServiceEdit };
}

export const dynamic = "force-dynamic";

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numId = Number(id);
  if (Number.isNaN(numId)) notFound();

  const { dict } = await getI18n();
  const service = await getServiceById(numId);
  if (!service) notFound();

  const action = updateService.bind(null, numId);

  return (
    <>
      <AdminPageHeader
        title={dict.admin.forms.pageServiceEdit}
        description={service.name}
      />
      <div className="mt-6">
        <ServiceForm action={action} initial={service} mode="edit" />
      </div>
    </>
  );
}
