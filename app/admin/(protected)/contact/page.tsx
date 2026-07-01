import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ContactContentForm } from "@/components/admin/forms/ContactContentForm";
import {
  getRawContactPageContent,
  getRawProfile,
} from "@/lib/data";
import { getI18n } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getI18n();
  return { title: dict.admin.contact.title };
}

export const dynamic = "force-dynamic";

export default async function AdminContactPage() {
  const { dict } = await getI18n();
  const [settings, initialFa, initialEn] = await Promise.all([
    getRawProfile(),
    getRawContactPageContent("fa"),
    getRawContactPageContent("en"),
  ]);
  const t = dict.admin.contact;

  return (
    <>
      <AdminPageHeader title={t.title} description={t.description} />
      <div className="mt-6">
        <ContactContentForm
          initialFa={initialFa}
          initialEn={initialEn}
          shared={{
            email: settings?.email ?? "",
            contactSettings: settings?.contactSettings ?? null,
          }}
          hasSettings={Boolean(settings)}
        />
      </div>
    </>
  );
}
