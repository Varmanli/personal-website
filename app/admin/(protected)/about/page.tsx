import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AboutContentForm } from "@/components/admin/forms/AboutContentForm";
import { getRawAboutPageContent, getRawProfile } from "@/lib/data";
import { getI18n } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getI18n();
  return { title: dict.admin.about.title };
}

export const dynamic = "force-dynamic";

export default async function AdminAboutPage() {
  const { dict } = await getI18n();
  const [settings, initialFa, initialEn] = await Promise.all([
    getRawProfile(),
    getRawAboutPageContent("fa"),
    getRawAboutPageContent("en"),
  ]);
  const t = dict.admin.about;

  return (
    <>
      <AdminPageHeader title={t.title} description={t.description} />
      <div className="mt-6">
        <AboutContentForm
          initialFa={initialFa}
          initialEn={initialEn}
          hasSettings={Boolean(settings)}
        />
      </div>
    </>
  );
}
