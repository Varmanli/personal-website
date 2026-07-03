import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { SettingsForm } from "@/components/admin/forms/SettingsForm";
import { getI18n } from "@/lib/i18n/server";
import { getSiteSettingsQueryResult } from "@/lib/site-settings";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getI18n();
  return { title: dict.admin.settings.title };
}

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const { dict } = await getI18n();
  const result = await getSiteSettingsQueryResult();
  const t = dict.admin.settings;
  const loadError =
    result.errorKind === "schema"
      ? dict.admin.errors.schema
      : result.errorKind
        ? dict.admin.errors.db
        : undefined;

  return (
    <>
      <AdminPageHeader title={t.title} description={t.description} />
      <div className="mt-6">
        <SettingsForm
          initial={result.settings}
          missingRow={result.missingRow}
          loadError={loadError}
        />
      </div>
    </>
  );
}
