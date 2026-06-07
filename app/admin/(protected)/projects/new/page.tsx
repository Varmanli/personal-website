import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ProjectForm } from "@/components/admin/forms/ProjectForm";
import { createProject } from "@/lib/actions/projects";
import { getI18n } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getI18n();
  return { title: dict.admin.forms.pageProjectNew };
}

export default async function NewProjectPage() {
  const { dict } = await getI18n();
  return (
    <>
      <AdminPageHeader title={dict.admin.forms.pageProjectNew} />
      <div className="mt-6">
        <ProjectForm action={createProject} mode="create" />
      </div>
    </>
  );
}
