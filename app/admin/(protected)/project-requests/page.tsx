import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ProjectRequestsTable } from "@/components/admin/ProjectRequestsTable";
import { getProjectRequests } from "@/lib/planner/data";
import { getI18n } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getI18n();
  return { title: dict.admin.requests.title };
}

export const dynamic = "force-dynamic";

export default async function AdminProjectRequestsPage() {
  const { dict } = await getI18n();
  const rows = await getProjectRequests();
  const t = dict.admin.requests;

  return (
    <>
      <AdminPageHeader title={t.title} description={t.description} />
      <ProjectRequestsTable rows={rows} />
    </>
  );
}
