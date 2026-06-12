import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import {
  AdminTable,
  StatusBadge,
  type Column,
} from "@/components/admin/AdminTable";
import { ButtonLink } from "@/components/ui/Button";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { getAllProjects } from "@/lib/data";
import { deleteProject } from "@/lib/actions/projects";
import { formatDate } from "@/lib/utils";
import { getI18n } from "@/lib/i18n/server";
import type { Project } from "@/types";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const { dict } = await getI18n();
  const projects = await getAllProjects();
  const t = dict.admin.projects;
  const tbl = dict.admin.table;
  const act = dict.admin.actions;

  const columns: Column<Project>[] = [
    {
      header: tbl.title,
      cell: (p) => <span className="font-medium text-foreground">{p.title}</span>,
    },
    {
      header: tbl.slug,
      cell: (p) => (
        <code
          dir="ltr"
          className="rounded bg-surface-2 px-1.5 py-0.5 text-xs text-muted"
        >
          {p.slug}
        </code>
      ),
    },
    { header: tbl.status, cell: (p) => <StatusBadge status={p.status} /> },
    { header: tbl.featured, cell: (p) => (p.isFeatured ? tbl.yes : "—") },
    {
      header: tbl.homepage,
      cell: (p) =>
        p.isFeaturedOnHome
          ? `#${p.homeOrder || 0}`
          : "—",
    },
    { header: tbl.updated, cell: (p) => formatDate(p.updatedAt) },
    {
      header: tbl.actions,
      className: "text-end",
      cell: (p) => (
        <div className="flex items-center justify-end gap-1">
          <ButtonLink
            href={`/admin/projects/${p.id}/edit`}
            variant="ghost"
            size="sm"
          >
            {act.edit}
          </ButtonLink>
          <DeleteButton action={deleteProject} id={p.id} entity="project" />
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
          <ButtonLink href="/admin/projects/new" size="sm">
            {t.newItem}
          </ButtonLink>
        }
      />
      <AdminTable
        columns={columns}
        rows={projects}
        getRowKey={(p) => p.id}
        emptyMessage={t.empty}
      />
    </>
  );
}
