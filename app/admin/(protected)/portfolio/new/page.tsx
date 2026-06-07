import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { PortfolioForm } from "@/components/admin/forms/PortfolioForm";
import { createPortfolioItem } from "@/lib/actions/portfolio";
import { getI18n } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getI18n();
  return { title: dict.admin.forms.pagePortfolioNew };
}

export default async function NewPortfolioPage() {
  const { dict } = await getI18n();
  return (
    <>
      <AdminPageHeader title={dict.admin.forms.pagePortfolioNew} />
      <div className="mt-6">
        <PortfolioForm action={createPortfolioItem} mode="create" />
      </div>
    </>
  );
}
