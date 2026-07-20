"use client";

import { useActionState, useState } from "react";
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
import { FiUser, FiImage, FiBriefcase, FiLayout } from "react-icons/fi";
import { linesValue } from "@/lib/form";
import {
  updateSettings,
  type SettingsActionState,
} from "@/lib/actions/settings";
import { useI18n } from "@/lib/i18n/context";
import type { SiteSettings } from "@/types";
import type { HeroContent } from "@/types";
import { getHeroConfiguration } from "@/lib/hero-config";

const L = {
  fa: { ownerName: "نام مالک", headline: "تیتر", bio: "بیوگرافی", aboutIntro: "معرفی صفحه درباره (پاراگراف دوم)", location: "موقعیت", skills: "مهارت‌ها" },
  en: { ownerName: "Owner name", headline: "Headline", bio: "Biography", aboutIntro: "About intro (second paragraph)", location: "Location", skills: "Skills" },
};

const initialSettingsActionState: SettingsActionState = {};

export function SettingsForm({
  initial,
  missingRow,
  loadError,
}: {
  initial: SiteSettings | null;
  missingRow: boolean;
  loadError?: string;
}) {
  const { dict } = useI18n();
  const f = dict.admin.forms;
  const s = dict.admin.settings;
  const [assetUrls, setAssetUrls] = useState({
    logoUrl: initial?.logoUrl ?? "",
    heroImageUrl: initial?.heroImageUrl ?? "",
    avatarUrl: initial?.avatarUrl ?? "",
    faviconUrl: initial?.faviconUrl ?? "",
    resumeUrl: initial?.resumeUrl ?? "",
  });
  const [state, formAction] = useActionState(
    updateSettings as (
      prev: SettingsActionState,
      form: FormData,
    ) => Promise<SettingsActionState>,
    initialSettingsActionState,
  );
  const fieldError = (name: string) => state.fieldErrors?.[name];
  const heroConfig = getHeroConfiguration(initial);

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

  const heroPanel = (
    prefix: string,
    content: HeroContent,
    language: "fa" | "en",
  ) => {
    const isFa = language === "fa";
    const labels = isFa
      ? { greeting: "متن خوش‌آمد", lead: "بخش اول تیتر", highlight: "بخش برجسته تیتر", subtitle: "توضیح", primary: "دکمه اصلی", secondary: "دکمه دوم", label: "متن دکمه", link: "لینک دکمه" }
      : { greeting: "Greeting", lead: "Headline lead", highlight: "Headline highlight", subtitle: "Description", primary: "Primary button", secondary: "Secondary button", label: "Button label", link: "Button link" };
    return (
      <div className="space-y-5" dir={isFa ? "rtl" : "ltr"}>
        <TextInput name={`${prefix}Greeting`} label={labels.greeting} dir={isFa ? "rtl" : "ltr"} defaultValue={content.greeting} />
        <TextInput name={`${prefix}HeadlineLead`} label={labels.lead} dir={isFa ? "rtl" : "ltr"} defaultValue={content.headlineLead} />
        <TextInput name={`${prefix}HeadlineHighlight`} label={labels.highlight} dir={isFa ? "rtl" : "ltr"} defaultValue={content.headlineHighlight} />
        <TextArea name={`${prefix}Subtitle`} label={labels.subtitle} dir={isFa ? "rtl" : "ltr"} rows={3} defaultValue={content.subtitle} />
        <div className="rounded-2xl border border-border bg-surface-2/30 p-4">
          <p className="mb-3 text-sm font-semibold text-foreground">{labels.primary}</p>
          <FormGrid>
            <TextInput name={`${prefix}PrimaryCtaLabel`} label={labels.label} dir={isFa ? "rtl" : "ltr"} defaultValue={content.primaryCta.label} />
            <TextInput name={`${prefix}PrimaryCtaHref`} label={labels.link} dir="ltr" defaultValue={content.primaryCta.href} />
          </FormGrid>
        </div>
        <div className="rounded-2xl border border-border bg-surface-2/30 p-4">
          <p className="mb-3 text-sm font-semibold text-foreground">{labels.secondary}</p>
          <FormGrid>
            <TextInput name={`${prefix}SecondaryCtaLabel`} label={labels.label} dir={isFa ? "rtl" : "ltr"} defaultValue={content.secondaryCta.label} />
            <TextInput name={`${prefix}SecondaryCtaHref`} label={labels.link} dir="ltr" defaultValue={content.secondaryCta.href} />
          </FormGrid>
        </div>
      </div>
    );
  };

  return (
    <form action={formAction} className="space-y-5">
      <FormError message={state.error ?? loadError} />
      {state.success && !state.error ? (
        <div className="fixed end-4 top-4 z-50 max-w-sm rounded-2xl border border-success/30 bg-success/10 px-4 py-3 text-sm text-success shadow-[0_12px_40px_-18px_rgba(52,211,153,0.75)] backdrop-blur">
          {dict.admin.settings.saved}
        </div>
      ) : null}
      {missingRow && !state.success && !loadError && (
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
          <FileUploadField name="logoUrl" label={f.logo} type="logo" shape="wide" preview="image" value={assetUrls.logoUrl} onChange={(value) => setAssetUrls((current) => ({ ...current, logoUrl: value }))} />
          <FileUploadField name="heroImageUrl" label={f.heroImage} type="hero" shape="wide" preview="image" value={assetUrls.heroImageUrl} onChange={(value) => setAssetUrls((current) => ({ ...current, heroImageUrl: value }))} />
        </FormGrid>
        <FormGrid>
          <FileUploadField name="avatarUrl" label={f.avatar} type="profile" shape="avatar" preview="image" value={assetUrls.avatarUrl} onChange={(value) => setAssetUrls((current) => ({ ...current, avatarUrl: value }))} />
          <FileUploadField name="faviconUrl" label={f.favicon} type="favicon" shape="favicon" preview="image" value={assetUrls.faviconUrl} onChange={(value) => setAssetUrls((current) => ({ ...current, faviconUrl: value }))} />
        </FormGrid>
        <FileUploadField name="resumeUrl" label={f.resume} type="resume" shape="wide" preview="document" accept="application/pdf" value={assetUrls.resumeUrl} onChange={(value) => setAssetUrls((current) => ({ ...current, resumeUrl: value }))} />
      </FormSection>

      <FormSection
        title="Hero Section"
        description="Select the live Hero variation, then edit every Freelancer and Hiring version in Persian and English. Changes appear on the homepage immediately after saving."
        icon={<FiLayout />}
      >
        <FormGrid>
          <fieldset>
            <legend className="mb-2 text-sm font-semibold text-foreground">Active mode</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {(["freelancer", "hiring"] as const).map((mode) => (
                <label key={mode} className="flex cursor-pointer items-center gap-2 rounded-xl border border-border bg-surface-2/40 p-3 text-sm has-checked:border-primary/60 has-checked:bg-primary/10">
                  <input type="radio" name="heroActiveMode" value={mode} defaultChecked={heroConfig.activeMode === mode} className="accent-primary" />
                  {mode === "freelancer" ? "Freelancer" : "Hiring"}
                </label>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className="mb-2 text-sm font-semibold text-foreground">Active language</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {(["fa", "en"] as const).map((language) => (
                <label key={language} className="flex cursor-pointer items-center gap-2 rounded-xl border border-border bg-surface-2/40 p-3 text-sm has-checked:border-primary/60 has-checked:bg-primary/10">
                  <input type="radio" name="heroActiveLanguage" value={language} defaultChecked={heroConfig.activeLanguage === language} className="accent-primary" />
                  {language === "fa" ? "فارسی" : "English"}
                </label>
              ))}
            </div>
          </fieldset>
        </FormGrid>

        <div className="mt-6">
          <Tabs
            items={[
              { id: "freelancer-fa", label: "Freelancer · فارسی", content: heroPanel("freelancerFa", heroConfig.content.freelancer.fa, "fa") },
              { id: "freelancer-en", label: "Freelancer · EN", content: heroPanel("freelancerEn", heroConfig.content.freelancer.en, "en") },
              { id: "hiring-fa", label: "Hiring · فارسی", content: heroPanel("hiringFa", heroConfig.content.hiring.fa, "fa") },
              { id: "hiring-en", label: "Hiring · EN", content: heroPanel("hiringEn", heroConfig.content.hiring.en, "en") },
            ]}
          />
        </div>
      </FormSection>

      <FormSection
        title="Website Mode"
        description="The active Hero mode controls this setting when you save, keeping the public navigation and Hero aligned."
        icon={<FiBriefcase />}
      >
        <p className="rounded-2xl border border-border bg-surface-2/40 p-4 text-sm leading-relaxed text-muted">
          Current public mode: <span className="font-semibold text-foreground">{heroConfig.activeMode === "freelancer" ? "Freelance" : "Hiring"}</span>. Change the active Hero mode above to update it.
        </p>
      </FormSection>

      <div className="flex flex-wrap items-center gap-3 border-t border-border pt-5">
        <SubmitButton>{s.save}</SubmitButton>
      </div>
    </form>
  );
}
