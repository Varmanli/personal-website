import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import {
  AdminTable,
  StatusBadge,
  type Column,
} from "@/components/admin/AdminTable";
import { ButtonLink } from "@/components/ui/Button";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { getAllPortfolio } from "@/lib/data";
import { deletePortfolioItem } from "@/lib/actions/portfolio";
import { formatDate } from "@/lib/utils";
import { getI18n } from "@/lib/i18n/server";
import type { PortfolioItem } from "@/types";

export const dynamic = "force-dynamic";

export default async function AdminPortfolioPage() {
  const { dict } = await getI18n();
  const items = await getAllPortfolio();
  const t = dict.admin.portfolio;
  const tbl = dict.admin.table;
  const act = dict.admin.actions;

  const columns: Column<PortfolioItem>[] = [
    {
      header: tbl.title,
      cell: (p) => <span className="font-medium text-foreground">{p.title}</span>,
    },
    {
      header: tbl.type,
      cell: (p) => <span>{dict.card.types[p.type]}</span>,
    },
    { header: tbl.status, cell: (p) => <StatusBadge status={p.status} /> },
    { header: tbl.featured, cell: (p) => (p.isFeatured ? tbl.yes : "—") },
    { header: tbl.updated, cell: (p) => formatDate(p.updatedAt) },
    {
      header: tbl.actions,
      className: "text-end",
      cell: (p) => (
        <div className="flex items-center justify-end gap-1">
          <ButtonLink
            href={`/admin/portfolio/${p.id}/edit`}
            variant="ghost"
            size="sm"
          >
            {act.edit}
          </ButtonLink>
          <DeleteButton
            action={deletePortfolioItem}
            id={p.id}
            entity="portfolio"
          />
        </div>
      ),
    },
  ];

  return (
    <>
      <AdminPageHeader
        title={t.title}
        description={t.description}
        action={
          <ButtonLink href="/admin/portfolio/new" size="sm">
            {t.newItem}
          </ButtonLink>
        }
      />
      <AdminTable
        columns={columns}
        rows={items}
        getRowKey={(p) => p.id}
        emptyMessage={t.empty}
      />
    </>
  );
}
