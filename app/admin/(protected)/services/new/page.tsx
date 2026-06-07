import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ServiceForm } from "@/components/admin/forms/ServiceForm";
import { createService } from "@/lib/actions/services";
import { getI18n } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getI18n();
  return { title: dict.admin.forms.pageServiceNew };
}

export default async function NewServicePage() {
  const { dict } = await getI18n();
  return (
    <>
      <AdminPageHeader title={dict.admin.forms.pageServiceNew} />
      <div className="mt-6">
        <ServiceForm action={createService} mode="create" />
      </div>
    </>
  );
}
