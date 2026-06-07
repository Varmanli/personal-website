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
import { Tabs } from "@/components/admin/ui/Tabs";
import { Collapsible } from "@/components/admin/ui/Collapsible";
import { FiFileText, FiSettings, FiDollarSign } from "react-icons/fi";
import {
  type ActionState,
  initialActionState,
  linesValue,
  centsToDollars,
} from "@/lib/form";
import { getStatusOptions, getCurrencyOptions } from "@/lib/admin/options";
import { useI18n } from "@/lib/i18n/context";
import type { Service } from "@/types";

interface ServiceFormProps {
  action: (prev: ActionState, form: FormData) => Promise<ActionState>;
  initial?: Service;
  mode: "create" | "edit";
}

const L = {
  fa: { name: "عنوان خدمت", tagline: "توضیح کوتاه", description: "توضیحات", features: "ویژگی‌ها", cta: "متن دکمه فراخوان" },
  en: { name: "Service title", tagline: "Short description", description: "Description", features: "Features", cta: "CTA label" },
};

export function ServiceForm({ action, initial, mode }: ServiceFormProps) {
  const { dict } = useI18n();
  const f = dict.admin.forms;
  const [state, formAction] = useActionState(action, initialActionState);
  const fieldError = (name: string) => state.fieldErrors?.[name];
  const statusOptions = getStatusOptions(dict);
  const currencyOptions = getCurrencyOptions();

  const faPanel = (
    <div className="space-y-5" dir="rtl">
      <TextInput name="nameFa" label={L.fa.name} dir="rtl" defaultValue={initial?.nameFa ?? ""} error={fieldError("nameFa")} />
      <TextInput name="taglineFa" label={L.fa.tagline} dir="rtl" defaultValue={initial?.taglineFa ?? ""} />
      <TextArea name="descriptionFa" label={L.fa.description} dir="rtl" defaultValue={initial?.descriptionFa ?? ""} />
      <TextArea name="featuresFa" label={L.fa.features} dir="rtl" rows={4} hint={f.listHint} defaultValue={linesValue(initial?.featuresFa)} />
      <TextInput name="ctaLabelFa" label={L.fa.cta} dir="rtl" defaultValue={initial?.ctaLabelFa ?? ""} />
    </div>
  );

  const enPanel = (
    <div className="space-y-5" dir="ltr">
      <TextInput name="nameEn" label={L.en.name} dir="ltr" defaultValue={initial?.nameEn ?? ""} error={fieldError("nameEn")} />
      <TextInput name="taglineEn" label={L.en.tagline} dir="ltr" defaultValue={initial?.taglineEn ?? ""} />
      <TextArea name="descriptionEn" label={L.en.description} dir="ltr" defaultValue={initial?.descriptionEn ?? ""} />
      <TextArea name="featuresEn" label={L.en.features} dir="ltr" rows={4} hint={f.listHint} defaultValue={linesValue(initial?.featuresEn)} />
      <TextInput name="ctaLabelEn" label={L.en.cta} dir="ltr" defaultValue={initial?.ctaLabelEn ?? ""} />
    </div>
  );

  return (
    <form action={formAction} className="space-y-5">
      <FormError message={state.error} />

      <FormSection title={f.content} description={f.contentHint} icon={<FiFileText />}>
        <Tabs
          items={[
            { id: "fa", label: f.persian, content: faPanel },
            { id: "en", label: f.english, content: enPanel },
          ]}
        />
      </FormSection>

      <FormSection title={f.essentials} description={f.essentialsHint} icon={<FiSettings />}>
        <SelectInput name="status" label={f.status} options={statusOptions} defaultValue={initial?.status ?? "draft"} wrapperClassName="sm:max-w-xs" />
        <SwitchField name="isFeatured" label={f.featured} description={f.featuredHint} defaultChecked={initial?.isFeatured ?? false} />
      </FormSection>

      {/* Pricing (collapsed) */}
      <Collapsible title={f.pricing} description={f.pricingHint} icon={<FiDollarSign />}>
        <FormGrid cols={3}>
          <TextInput name="price" label={f.price} dir="ltr" type="number" min="0" step="1" hint={f.priceHint} defaultValue={centsToDollars(initial?.priceCents)} placeholder="999" />
          <TextInput name="billingPeriod" label={f.billingPeriod} dir="ltr" defaultValue={initial?.billingPeriod ?? ""} placeholder="one-time" />
          <SelectInput name="currency" label={f.currency} dir="ltr" options={currencyOptions} defaultValue={initial?.currency ?? "USD"} />
        </FormGrid>
        {mode === "edit" && initial?.slug && (
          <ReadonlySlug label={f.slugReadonly} hint={f.slugReadonlyHint} value={initial.slug} />
        )}
      </Collapsible>

      <div className="flex flex-wrap items-center gap-3 border-t border-border pt-5">
        <SubmitButton>
          {mode === "create" ? f.createService : f.saveService}
        </SubmitButton>
        <ButtonLink href="/admin/services" variant="outline">
          {f.cancel}
        </ButtonLink>
      </div>
    </form>
  );
}
