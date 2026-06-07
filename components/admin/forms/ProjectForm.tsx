"use client";

import { useActionState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import {
  TextInput,
  TextArea,
  SelectInput,
  SwitchField,
  FormError,
  SubmitButton,
  FormSection,
  FormGrid,
  ReadonlySlug,
} from "@/components/admin/forms/fields";
import { FileUploadField } from "@/components/admin/forms/FileUploadField";
import { GalleryUploadField } from "@/components/admin/forms/GalleryUploadField";
import { TechnologyPicker } from "@/components/admin/forms/TechnologyPicker";
import { StringListField } from "@/components/admin/forms/StringListField";
import { Tabs } from "@/components/admin/ui/Tabs";
import { Collapsible } from "@/components/admin/ui/Collapsible";
import { FiFileText, FiSliders, FiSettings, FiImage } from "react-icons/fi";
import { type ActionState, initialActionState } from "@/lib/form";
import { getStatusOptions } from "@/lib/admin/options";
import { useI18n } from "@/lib/i18n/context";
import type { Project } from "@/types";

interface ProjectFormProps {
  action: (prev: ActionState, form: FormData) => Promise<ActionState>;
  initial?: Project;
  mode: "create" | "edit";
}

// Language-specific content labels — the English tab must read English even
// while the admin UI is Persian, and vice-versa.
const L = {
  fa: {
    title: "عنوان پروژه",
    excerpt: "توضیح کوتاه",
    description: "توضیح کامل",
    client: "مشتری",
    role: "نقش من",
    tags: "برچسب‌ها",
    challenges: "چالش‌های پروژه",
    solution: "راه‌حل",
    outcome: "نتیجه",
    challengePh: "مثلاً: ساخت پنل مدیریت قابل توسعه",
    addChallenge: "افزودن چالش",
  },
  en: {
    title: "Project title",
    excerpt: "Short description",
    description: "Full description",
    client: "Client",
    role: "My role",
    tags: "Tags",
    challenges: "Project challenges",
    solution: "Solution",
    outcome: "Outcome",
    challengePh: "Example: Building a scalable admin dashboard",
    addChallenge: "Add challenge",
  },
};

export function ProjectForm({ action, initial, mode }: ProjectFormProps) {
  const { dict } = useI18n();
  const f = dict.admin.forms;
  const [state, formAction] = useActionState(action, initialActionState);
  const fieldError = (name: string) => state.fieldErrors?.[name];
  const statusOptions = getStatusOptions(dict);
  const coverDefault = initial?.coverImageUrl ?? initial?.thumbnailUrl ?? null;

  const challengesFaDefault =
    initial?.challengesFa && initial.challengesFa.length
      ? initial.challengesFa
      : initial?.challengeFa;
  const challengesEnDefault =
    initial?.challengesEn && initial.challengesEn.length
      ? initial.challengesEn
      : initial?.challengeEn;

  const faPanel = (
    <div className="space-y-5" dir="rtl">
      <TextInput name="titleFa" label={L.fa.title} dir="rtl" defaultValue={initial?.titleFa ?? ""} error={fieldError("titleFa")} />
      <TextInput name="shortDescriptionFa" label={L.fa.excerpt} dir="rtl" defaultValue={initial?.shortDescriptionFa ?? ""} />
      <TextArea name="descriptionFa" label={L.fa.description} dir="rtl" rows={4} defaultValue={initial?.descriptionFa ?? ""} />
      <FormGrid>
        <TextInput name="clientFa" label={L.fa.client} dir="rtl" defaultValue={initial?.clientFa ?? ""} />
        <TextInput name="roleFa" label={L.fa.role} dir="rtl" defaultValue={initial?.roleFa ?? ""} />
      </FormGrid>
      <TextArea name="tagsFa" label={L.fa.tags} dir="rtl" rows={2} hint={f.listHint} defaultValue={(initial?.tagsFa ?? []).join("\n")} />
      <StringListField name="challengesFa" label={L.fa.challenges} dir="rtl" defaultValue={challengesFaDefault} placeholder={L.fa.challengePh} addLabel={L.fa.addChallenge} />
      <TextArea name="solutionFa" label={L.fa.solution} dir="rtl" defaultValue={initial?.solutionFa ?? ""} />
      <TextArea name="outcomeFa" label={L.fa.outcome} dir="rtl" defaultValue={initial?.outcomeFa ?? ""} />
    </div>
  );

  const enPanel = (
    <div className="space-y-5" dir="ltr">
      <TextInput name="titleEn" label={L.en.title} dir="ltr" defaultValue={initial?.titleEn ?? ""} error={fieldError("titleEn")} />
      <TextInput name="shortDescriptionEn" label={L.en.excerpt} dir="ltr" defaultValue={initial?.shortDescriptionEn ?? ""} />
      <TextArea name="descriptionEn" label={L.en.description} dir="ltr" rows={4} defaultValue={initial?.descriptionEn ?? ""} />
      <FormGrid>
        <TextInput name="clientEn" label={L.en.client} dir="ltr" defaultValue={initial?.clientEn ?? ""} />
        <TextInput name="roleEn" label={L.en.role} dir="ltr" defaultValue={initial?.roleEn ?? ""} />
      </FormGrid>
      <TextArea name="tagsEn" label={L.en.tags} dir="ltr" rows={2} hint={f.listHint} defaultValue={(initial?.tagsEn ?? []).join("\n")} />
      <StringListField name="challengesEn" label={L.en.challenges} dir="ltr" defaultValue={challengesEnDefault} placeholder={L.en.challengePh} addLabel={L.en.addChallenge} />
      <TextArea name="solutionEn" label={L.en.solution} dir="ltr" defaultValue={initial?.solutionEn ?? ""} />
      <TextArea name="outcomeEn" label={L.en.outcome} dir="ltr" defaultValue={initial?.outcomeEn ?? ""} />
    </div>
  );

  return (
    <form action={formAction} className="space-y-5">
      <FormError message={state.error} />

      <FormSection title={f.gallery} description={f.mediaHint} icon={<FiImage />}>
        <FileUploadField name="coverImageUrl" label={f.coverImage} type="project" shape="wide" preview="image" required defaultValue={coverDefault} error={fieldError("coverImageUrl")} />
        <GalleryUploadField name="galleryImages" label={f.gallery} type="project" defaultValue={initial?.galleryImages} />
      </FormSection>

      <FormSection title={f.content} description={f.contentHint} icon={<FiFileText />}>
        <Tabs
          items={[
            { id: "fa", label: f.persian, content: faPanel },
            { id: "en", label: f.english, content: enPanel },
          ]}
        />
      </FormSection>

      <FormSection title={f.essentials} description={f.essentialsHint} icon={<FiSettings />}>
        <FormGrid>
          <TextInput name="year" label={f.year} dir="ltr" defaultValue={initial?.year ?? ""} placeholder="2024" />
          <SelectInput name="status" label={f.status} options={statusOptions} defaultValue={initial?.status ?? "draft"} />
        </FormGrid>
        <TechnologyPicker name="technologies" label={f.tech} defaultValue={initial?.technologies} />
        <SwitchField name="isFeatured" label={f.featured} description={f.featuredHint} defaultChecked={initial?.isFeatured ?? false} />
      </FormSection>

      <Collapsible title={f.advanced} description={f.advancedHint} icon={<FiSliders />}>
        <FormGrid>
          <TextInput name="liveUrl" label={f.liveUrl} dir="ltr" type="url" defaultValue={initial?.liveUrl ?? ""} placeholder="https://…" />
          <TextInput name="repoUrl" label={f.repoUrl} dir="ltr" type="url" defaultValue={initial?.repoUrl ?? ""} placeholder="https://…" />
        </FormGrid>
        {mode === "edit" && initial?.slug && (
          <ReadonlySlug label={f.slugReadonly} hint={f.slugReadonlyHint} value={initial.slug} />
        )}
      </Collapsible>

      <div className="flex flex-wrap items-center gap-3 border-t border-border pt-5">
        <SubmitButton>
          {mode === "create" ? f.createProject : f.saveProject}
        </SubmitButton>
        <ButtonLink href="/admin/projects" variant="outline">
          {f.cancel}
        </ButtonLink>
      </div>
    </form>
  );
}
