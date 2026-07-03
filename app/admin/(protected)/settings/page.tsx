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
  const errorMessages: Record<string, string> = {
    tableMissing: dict.admin.errors.tableMissing,
    schemaDrift: dict.admin.errors.schemaDrift,
    permission: dict.admin.errors.permission,
    connection: dict.admin.errors.db,
    unknown: dict.admin.errors.unknown,
  };
  const loadError = result.errorKind ? errorMessages[result.errorKind] : undefined;

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
