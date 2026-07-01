"use client";

import { useActionState } from "react";
import {
  TextInput,
  TextArea,
  FormError,
  SubmitButton,
  FormSection,
  FormGrid,
} from "@/components/admin/forms/fields";
import { FileUploadField } from "@/components/admin/forms/FileUploadField";
import { Tabs } from "@/components/admin/ui/Tabs";
import { FiUser, FiImage } from "react-icons/fi";
import { type ActionState, initialActionState, linesValue } from "@/lib/form";
import { updateSettings } from "@/lib/actions/settings";
import { useI18n } from "@/lib/i18n/context";
import type { SiteSettings } from "@/types";

const L = {
  fa: { ownerName: "نام مالک", headline: "تیتر", bio: "بیوگرافی", aboutIntro: "معرفی صفحه درباره (پاراگراف دوم)", location: "موقعیت", skills: "مهارت‌ها" },
  en: { ownerName: "Owner name", headline: "Headline", bio: "Biography", aboutIntro: "About intro (second paragraph)", location: "Location", skills: "Skills" },
};

export function SettingsForm({ initial }: { initial: SiteSettings | null }) {
  const { dict } = useI18n();
  const f = dict.admin.forms;
  const s = dict.admin.settings;
  const [state, formAction] = useActionState(
    updateSettings as (
      prev: ActionState,
      form: FormData,
    ) => Promise<ActionState>,
    initialActionState,
  );
  const fieldError = (name: string) => state.fieldErrors?.[name];

  const faPanel = (
    <div className="space-y-5" dir="rtl">
      <TextInput name="ownerNameFa" label={L.fa.ownerName} dir="rtl" defaultValue={initial?.ownerNameFa ?? ""} error={fieldError("ownerNameFa")} />
      <TextInput name="headlineFa" label={L.fa.headline} dir="rtl" defaultValue={initial?.headlineFa ?? ""} />
      <TextArea name="bioFa" label={L.fa.bio} dir="rtl" rows={4} defaultValue={initial?.bioFa ?? ""} />
      <TextArea name="aboutIntroFa" label={L.fa.aboutIntro} dir="rtl" rows={3} defaultValue={initial?.aboutIntroFa ?? ""} />
      <TextInput name="locationFa" label={L.fa.location} dir="rtl" defaultValue={initial?.locationFa ?? ""} />
      <TextArea name="skillsFa" label={L.fa.skills} dir="rtl" rows={3} hint={f.listHint} defaultValue={linesValue(initial?.skillsFa)} />
    </div>
  );

  const enPanel = (
    <div className="space-y-5" dir="ltr">
      <TextInput name="ownerNameEn" label={L.en.ownerName} dir="ltr" defaultValue={initial?.ownerNameEn ?? ""} error={fieldError("ownerNameEn")} />
      <TextInput name="headlineEn" label={L.en.headline} dir="ltr" defaultValue={initial?.headlineEn ?? ""} />
      <TextArea name="bioEn" label={L.en.bio} dir="ltr" rows={4} defaultValue={initial?.bioEn ?? ""} />
      <TextArea name="aboutIntroEn" label={L.en.aboutIntro} dir="ltr" rows={3} defaultValue={initial?.aboutIntroEn ?? ""} />
      <TextInput name="locationEn" label={L.en.location} dir="ltr" defaultValue={initial?.locationEn ?? ""} />
      <TextArea name="skillsEn" label={L.en.skills} dir="ltr" rows={3} hint={f.listHint} defaultValue={linesValue(initial?.skillsEn)} />
    </div>
  );

  return (
    <form action={formAction} className="space-y-5">
      <FormError message={state.error} />
      {!initial && (
        <p className="flex items-start gap-2.5 rounded-2xl border border-primary/30 bg-primary/10 p-3.5 text-sm text-primary-light">
          <span aria-hidden className="mt-0.5">ℹ</span>
          <span className="leading-relaxed">{s.noticeFirst}</span>
        </p>
      )}

      <FormSection title={f.profile} description={f.profileHint} icon={<FiUser />}>
        <Tabs
          items={[
            { id: "fa", label: f.persian, content: faPanel },
            { id: "en", label: f.english, content: enPanel },
          ]}
        />
      </FormSection>

      <FormSection title={f.assets} description={f.assetsHint} icon={<FiImage />}>
        <FormGrid>
          <FileUploadField name="logoUrl" label={f.logo} type="logo" shape="wide" preview="image" defaultValue={initial?.logoUrl} />
          <FileUploadField name="heroImageUrl" label={f.heroImage} type="hero" shape="wide" preview="image" defaultValue={initial?.heroImageUrl} />
        </FormGrid>
        <FormGrid>
          <FileUploadField name="avatarUrl" label={f.avatar} type="profile" shape="avatar" preview="image" defaultValue={initial?.avatarUrl} />
          <FileUploadField name="faviconUrl" label={f.favicon} type="favicon" shape="favicon" preview="image" defaultValue={initial?.faviconUrl} />
        </FormGrid>
        <FileUploadField name="resumeUrl" label={f.resume} type="resume" shape="wide" preview="document" accept="application/pdf" defaultValue={initial?.resumeUrl} />
      </FormSection>

      <div className="flex flex-wrap items-center gap-3 border-t border-border pt-5">
        <SubmitButton>{s.save}</SubmitButton>
      </div>
    </form>
  );
}
