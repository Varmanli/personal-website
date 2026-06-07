import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { SettingsForm } from "@/components/admin/forms/SettingsForm";
import { getRawProfile } from "@/lib/data";
import { getI18n } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getI18n();
  return { title: dict.admin.settings.title };
}

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const { dict } = await getI18n();
  const settings = await getRawProfile();
  const t = dict.admin.settings;

  return (
    <>
      <AdminPageHeader title={t.title} description={t.description} />
      <div className="mt-6">
        <SettingsForm initial={settings} />
      </div>
    </>
  );
}
