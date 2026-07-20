"use client";

import { useActionState, useState } from "react";
import { FiGlobe, FiLayers, FiSettings } from "react-icons/fi";
import {
  FormGrid,
  FormError,
  FormSection,
  SubmitButton,
  TextArea,
  TextInput,
} from "@/components/admin/forms/fields";
import { TechnologyPicker } from "@/components/admin/forms/TechnologyPicker";
import { updateHeroConfiguration } from "@/lib/actions/settings";
import { useI18n } from "@/lib/i18n/context";
import type { HeroConfiguration, HeroContent } from "@/types";

function ContentFields({
  prefix,
  content,
  language,
  labels,
}: {
  prefix: string;
  content: HeroContent;
  language: "fa" | "en";
  labels: ReturnType<typeof useI18n>["dict"]["admin"]["heroManagement"];
}) {
  const dir = language === "fa" ? "rtl" : "ltr";
  return (
    <div className="space-y-5" dir={dir}>
      <TextInput
        name={`${prefix}Greeting`}
        label={labels.greeting}
        dir={dir}
        defaultValue={content.greeting}
      />
      <TextInput
        name={`${prefix}HeadlineLead`}
        label={labels.mainTitle}
        dir={dir}
        defaultValue={content.headlineLead}
      />
      <TextInput
        name={`${prefix}HeadlineHighlight`}
        label={labels.highlightedTitle}
        dir={dir}
        defaultValue={content.headlineHighlight}
      />
      <TextArea
        name={`${prefix}Subtitle`}
        label={labels.descriptionLabel}
        dir={dir}
        rows={4}
        defaultValue={content.subtitle}
      />
      <FormGrid>
        <TextInput
          name={`${prefix}PrimaryCtaLabel`}
          label={`${labels.primaryCta} — ${labels.ctaLabel}`}
          dir={dir}
          defaultValue={content.primaryCta.label}
        />
        <TextInput
          name={`${prefix}PrimaryCtaHref`}
          label={`${labels.primaryCta} — ${labels.ctaLink}`}
          dir="ltr"
          defaultValue={content.primaryCta.href}
        />
        <TextInput
          name={`${prefix}SecondaryCtaLabel`}
          label={`${labels.secondaryCta} — ${labels.ctaLabel}`}
          dir={dir}
          defaultValue={content.secondaryCta.label}
        />
        <TextInput
          name={`${prefix}SecondaryCtaHref`}
          label={`${labels.secondaryCta} — ${labels.ctaLink}`}
          dir="ltr"
          defaultValue={content.secondaryCta.href}
        />
      </FormGrid>
    </div>
  );
}

export function HeroManagementForm({
  initial,
}: {
  initial: HeroConfiguration;
}) {
  const { dict, dir } = useI18n();
  const t = dict.admin.heroManagement;
  const [state, action] = useActionState(updateHeroConfiguration, {});
  const [selectedMode, setSelectedMode] = useState(initial.activeMode);
  const [selectedLanguage, setSelectedLanguage] = useState(initial.activeLanguage);
  const selectedKey = `${selectedMode}-${selectedLanguage}`;
  return (
    <form action={action} className="space-y-5" dir={dir}>
      <FormError message={state.error} />
      {state.success && (
        <p className="rounded-xl border border-success/30 bg-success/10 p-3 text-sm text-success">
          {t.saved}
        </p>
      )}
      <FormSection title={t.settingsTitle} description={t.settingsDescription} icon={<FiSettings />}>
      <FormGrid>
        <fieldset>
          <legend className="mb-2 text-sm font-semibold text-foreground">
            {t.activeMode}
          </legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {(["freelancer", "hiring"] as const).map((mode) => (
              <label
                key={mode}
                className="group flex cursor-pointer items-center gap-3 rounded-2xl border border-border bg-background/35 p-3.5 text-sm font-medium text-muted transition-colors hover:border-primary/40 hover:bg-primary/5 has-checked:border-primary/50 has-checked:bg-primary/10 has-checked:text-foreground"
              >
                <input
                  type="radio"
                  name="heroActiveMode"
                  value={mode}
                  defaultChecked={initial.activeMode === mode}
                  onChange={() => setSelectedMode(mode)}
                  className="me-2 accent-primary"
                />
                {mode === "freelancer" ? t.freelancerMode : t.hiringMode}
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend className="mb-2 text-sm font-semibold text-foreground">
            {t.activeLanguage}
          </legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {(["fa", "en"] as const).map((language) => (
              <label
                key={language}
                className="group flex cursor-pointer items-center gap-3 rounded-2xl border border-border bg-background/35 p-3.5 text-sm font-medium text-muted transition-colors hover:border-primary/40 hover:bg-primary/5 has-checked:border-primary/50 has-checked:bg-primary/10 has-checked:text-foreground"
              >
                <input
                  type="radio"
                  name="heroActiveLanguage"
                  value={language}
                  defaultChecked={initial.activeLanguage === language}
                  onChange={() => setSelectedLanguage(language)}
                  className="me-2 accent-primary"
                />
                {language === "fa" ? t.persian : t.english}
              </label>
            ))}
          </div>
        </fieldset>
      </FormGrid>
      </FormSection>
      <FormSection title={t.contentTitle} description={t.contentDescription} icon={<FiLayers />}>
        <div hidden={selectedKey !== "freelancer-fa"}><ContentFields prefix="freelancerFa" content={initial.content.freelancer.fa} language="fa" labels={t} /></div>
        <div hidden={selectedKey !== "freelancer-en"}><ContentFields prefix="freelancerEn" content={initial.content.freelancer.en} language="en" labels={t} /></div>
        <div hidden={selectedKey !== "hiring-fa"}><ContentFields prefix="hiringFa" content={initial.content.hiring.fa} language="fa" labels={t} /></div>
        <div hidden={selectedKey !== "hiring-en"}><ContentFields prefix="hiringEn" content={initial.content.hiring.en} language="en" labels={t} /></div>
      </FormSection>
      <FormSection title={t.technologiesTitle} description={t.technologiesDescription} icon={<FiGlobe />}>
        <div hidden={selectedKey !== "freelancer-fa"}><TechnologyPicker name="freelancerFaTechnologies" label={t.technologies} defaultValue={initial.content.freelancer.fa.technologies} dir="rtl" /></div>
        <div hidden={selectedKey !== "freelancer-en"}><TechnologyPicker name="freelancerEnTechnologies" label={t.technologies} defaultValue={initial.content.freelancer.en.technologies} dir="ltr" /></div>
        <div hidden={selectedKey !== "hiring-fa"}><TechnologyPicker name="hiringFaTechnologies" label={t.technologies} defaultValue={initial.content.hiring.fa.technologies} dir="rtl" /></div>
        <div hidden={selectedKey !== "hiring-en"}><TechnologyPicker name="hiringEnTechnologies" label={t.technologies} defaultValue={initial.content.hiring.en.technologies} dir="ltr" /></div>
      </FormSection>
      <div className="flex flex-wrap items-center gap-3 border-t border-border pt-5" dir={dir}><SubmitButton>{t.save}</SubmitButton></div>
    </form>
  );
}
