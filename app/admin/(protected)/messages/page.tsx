import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import {
  AdminTable,
  StatusBadge,
  type Column,
} from "@/components/admin/AdminTable";
import { MessageActions } from "@/components/admin/MessageActions";
import { getMessages } from "@/lib/data";
import { formatDate } from "@/lib/utils";
import { getI18n } from "@/lib/i18n/server";
import type { ContactMessage } from "@/types";

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
  const { dict } = await getI18n();
  const messages = await getMessages();
  const t = dict.admin.messages;
  const tbl = dict.admin.table;

  const columns: Column<ContactMessage>[] = [
    {
      header: tbl.from,
      cell: (m) => (
        <div>
          <span className="block font-medium text-foreground">{m.name}</span>
          <span dir="ltr" className="block text-xs text-faint">
            {m.email}
          </span>
        </div>
      ),
    },
    {
      header: tbl.message,
      cell: (m) => (
        <div className="max-w-xs">
          {m.subject && (
            <span className="block font-medium text-foreground">
              {m.subject}
            </span>
          )}
          {(m.projectType || m.budgetRange || m.timeline) && (
            <div className="mb-2 flex flex-wrap gap-1.5">
              {m.projectType && (
                <span className="rounded-full border border-border bg-surface-2/50 px-2 py-1 text-[11px] text-faint">
                  {m.projectType}
                </span>
              )}
              {m.budgetRange && (
                <span className="rounded-full border border-border bg-surface-2/50 px-2 py-1 text-[11px] text-faint">
                  {m.budgetRange}
                </span>
              )}
              {m.timeline && (
                <span className="rounded-full border border-border bg-surface-2/50 px-2 py-1 text-[11px] text-faint">
                  {m.timeline}
                </span>
              )}
            </div>
          )}
          <span className="block truncate text-muted">{m.message}</span>
        </div>
      ),
    },
    { header: tbl.status, cell: (m) => <StatusBadge status={m.status} /> },
    { header: tbl.received, cell: (m) => formatDate(m.createdAt) },
    {
      header: tbl.actions,
      className: "text-end",
      cell: (m) => <MessageActions message={m} />,
    },
  ];

  return (
    <>
      <AdminPageHeader title={t.title} description={t.description} />
      <AdminTable
        columns={columns}
        rows={messages}
        getRowKey={(m) => m.id}
        emptyMessage={t.empty}
      />
    </>
  );
}
