import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ProjectForm } from "@/components/admin/forms/ProjectForm";
import { getProjectById } from "@/lib/data";
import { updateProject } from "@/lib/actions/projects";
import { getI18n } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getI18n();
  return { title: dict.admin.forms.pageProjectEdit };
}

export const dynamic = "force-dynamic";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numId = Number(id);
  if (Number.isNaN(numId)) notFound();

  const { dict } = await getI18n();
  const project = await getProjectById(numId);
  if (!project) notFound();

  const action = updateProject.bind(null, numId);

  return (
    <>
      <AdminPageHeader
        title={dict.admin.forms.pageProjectEdit}
        description={project.title}
      />
      <div className="mt-6">
        <ProjectForm action={action} initial={project} mode="edit" />
      </div>
    </>
  );
}
