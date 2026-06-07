"use client";

import { useActionState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import {
  TextArea,
  TextInput,
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
import { Tabs } from "@/components/admin/ui/Tabs";
import { Collapsible } from "@/components/admin/ui/Collapsible";
import { FiFileText, FiSettings, FiImage, FiSliders } from "react-icons/fi";
import { type ActionState, initialActionState } from "@/lib/form";
import { getStatusOptions, getPortfolioTypeOptions } from "@/lib/admin/options";
import { useI18n } from "@/lib/i18n/context";
import type { PortfolioItem } from "@/types";

const L = {
  fa: { title: "عنوان نمونه‌کار", description: "توضیح نمونه‌کار" },
  en: { title: "Portfolio title", description: "Portfolio description" },
};

interface PortfolioFormProps {
  action: (prev: ActionState, form: FormData) => Promise<ActionState>;
  initial?: PortfolioItem;
  mode: "create" | "edit";
}

export function PortfolioForm({ action, initial, mode }: PortfolioFormProps) {
  const { dict } = useI18n();
  const f = dict.admin.forms;
  const [state, formAction] = useActionState(action, initialActionState);
  const fieldError = (name: string) => state.fieldErrors?.[name];
  const statusOptions = getStatusOptions(dict);
  const typeOptions = getPortfolioTypeOptions(dict);
  const coverDefault = initial?.coverImageUrl ?? initial?.imageUrl ?? null;

  const faPanel = (
    <div className="space-y-5" dir="rtl">
      <TextInput name="titleFa" label={L.fa.title} dir="rtl" defaultValue={initial?.titleFa ?? ""} error={fieldError("titleFa")} />
      <TextArea name="descriptionFa" label={L.fa.description} dir="rtl" defaultValue={initial?.descriptionFa ?? ""} />
    </div>
  );

  const enPanel = (
    <div className="space-y-5" dir="ltr">
      <TextInput name="titleEn" label={L.en.title} dir="ltr" defaultValue={initial?.titleEn ?? ""} error={fieldError("titleEn")} />
      <TextArea name="descriptionEn" label={L.en.description} dir="ltr" defaultValue={initial?.descriptionEn ?? ""} />
    </div>
  );

  return (
    <form action={formAction} className="space-y-5">
      <FormError message={state.error} />

      <FormSection title={f.gallery} description={f.mediaHint} icon={<FiImage />}>
        <FileUploadField name="coverImageUrl" label={f.coverImage} type="portfolio" shape="wide" preview="image" defaultValue={coverDefault} />
        <GalleryUploadField name="galleryImages" label={f.gallery} type="portfolio" defaultValue={initial?.galleryImages} />
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
          <SelectInput name="type" label={f.type} options={typeOptions} defaultValue={initial?.type ?? "personal"} />
          <SelectInput name="status" label={f.status} options={statusOptions} defaultValue={initial?.status ?? "draft"} />
        </FormGrid>
        <TechnologyPicker name="technologies" label={f.tech} defaultValue={initial?.technologies} />
        <SwitchField name="isFeatured" label={f.featured} description={f.featuredHint} defaultChecked={initial?.isFeatured ?? false} />
      </FormSection>

      <Collapsible title={f.advanced} description={f.advancedHint} icon={<FiSliders />}>
        <TextInput name="externalUrl" label={f.externalUrl} dir="ltr" type="url" defaultValue={initial?.externalUrl ?? ""} placeholder="https://…" />
        {mode === "edit" && initial?.slug && (
          <ReadonlySlug label={f.slugReadonly} hint={f.slugReadonlyHint} value={initial.slug} />
        )}
      </Collapsible>

      <div className="flex flex-wrap items-center gap-3 border-t border-border pt-5">
        <SubmitButton>
          {mode === "create" ? f.createPortfolio : f.savePortfolio}
        </SubmitButton>
        <ButtonLink href="/admin/portfolio" variant="outline">
          {f.cancel}
        </ButtonLink>
      </div>
    </form>
  );
}
