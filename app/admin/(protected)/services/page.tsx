import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import {
  AdminTable,
  StatusBadge,
  type Column,
} from "@/components/admin/AdminTable";
import { ButtonLink } from "@/components/ui/Button";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { getAllServices } from "@/lib/data";
import { deleteService } from "@/lib/actions/services";
import { formatPrice } from "@/lib/utils";
import { getI18n } from "@/lib/i18n/server";
import type { Service } from "@/types";

export const dynamic = "force-dynamic";

export default async function AdminServicesPage() {
  const { dict } = await getI18n();
  const services = await getAllServices();
  const t = dict.admin.services;
  const tbl = dict.admin.table;
  const act = dict.admin.actions;

  const columns: Column<Service>[] = [
    {
      header: tbl.name,
      cell: (s) => <span className="font-medium text-foreground">{s.name}</span>,
    },
    {
      header: tbl.price,
      cell: (s) => formatPrice(s.priceCents, s.currency, dict.card.contactQuote),
    },
    { header: tbl.period, cell: (s) => s.billingPeriod ?? "—" },
    { header: tbl.status, cell: (s) => <StatusBadge status={s.status} /> },
    { header: tbl.featured, cell: (s) => (s.isFeatured ? tbl.yes : "—") },
    {
      header: tbl.actions,
      className: "text-end",
      cell: (s) => (
        <div className="flex items-center justify-end gap-1">
          <ButtonLink
            href={`/admin/services/${s.id}/edit`}
            variant="ghost"
            size="sm"
          >
            {act.edit}
          </ButtonLink>
          <DeleteButton action={deleteService} id={s.id} entity="plan" />
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
          <ButtonLink href="/admin/services/new" size="sm">
            {t.newItem}
          </ButtonLink>
        }
      />
      <AdminTable
        columns={columns}
        rows={services}
        getRowKey={(s) => s.id}
        emptyMessage={t.empty}
      />
    </>
  );
}
