import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { HeroManagementForm } from "@/components/admin/forms/HeroManagementForm";
import { getHeroConfiguration } from "@/lib/hero-config";
import { getSiteSettingsQueryResult } from "@/lib/site-settings";
import { getI18n } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";

export default async function AdminHeroPage() {
  const [{ settings }, { dict }] = await Promise.all([getSiteSettingsQueryResult(), getI18n()]);
  const t = dict.admin.heroManagement;
  return (
    <>
      <AdminPageHeader
        title={t.title}
        description={t.description}
      />
      <HeroManagementForm initial={getHeroConfiguration(settings)} />
    </>
  );
}
