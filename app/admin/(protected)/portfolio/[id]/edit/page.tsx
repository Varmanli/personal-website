import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { PortfolioForm } from "@/components/admin/forms/PortfolioForm";
import { getPortfolioItemById } from "@/lib/data";
import { updatePortfolioItem } from "@/lib/actions/portfolio";
import { getI18n } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getI18n();
  return { title: dict.admin.forms.pagePortfolioEdit };
}

export const dynamic = "force-dynamic";

export default async function EditPortfolioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numId = Number(id);
  if (Number.isNaN(numId)) notFound();

  const { dict } = await getI18n();
  const item = await getPortfolioItemById(numId);
  if (!item) notFound();

  const action = updatePortfolioItem.bind(null, numId);

  return (
    <>
      <AdminPageHeader
        title={dict.admin.forms.pagePortfolioEdit}
        description={item.title}
      />
      <div className="mt-6">
        <PortfolioForm action={action} initial={item} mode="edit" />
      </div>
    </>
  );
}
