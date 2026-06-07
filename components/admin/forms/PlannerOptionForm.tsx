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
import { FiSliders } from "react-icons/fi";
import { type ActionState, initialActionState } from "@/lib/form";
import { PLANNER_GROUPS } from "@/lib/planner/options";
import { PLANNER_ICON_KEYS, plannerIcon } from "@/lib/planner/icons";
import { useI18n } from "@/lib/i18n/context";
import type { PlannerOption } from "@/types";

interface PlannerOptionFormProps {
  action: (prev: ActionState, form: FormData) => Promise<ActionState>;
  initial?: PlannerOption;
  mode: "create" | "edit";
}

export function PlannerOptionForm({ action, initial, mode }: PlannerOptionFormProps) {
  const { dict } = useI18n();
  const t = dict.admin.plannerOpts;
  const [state, formAction] = useActionState(action, initialActionState);

  const groupOptions = PLANNER_GROUPS.map((g) => ({ value: g, label: g }));
  const iconOptions = PLANNER_ICON_KEYS.map((k) => ({
    value: k,
    label: k,
    icon: plannerIcon(k),
  }));

  return (
    <form action={formAction} className="space-y-5">
      <FormError message={state.error} />

      <FormSection title={t.title} description={t.description} icon={<FiSliders />}>
        <FormGrid>
          <SelectInput name="group" label={t.group} options={groupOptions} defaultValue={initial?.group ?? "feature"} />
          {mode === "edit" && initial ? (
            <ReadonlySlug label={t.value} hint={t.valueHint} value={initial.value} />
          ) : (
            <TextInput name="value" label={t.value} dir="ltr" hint={t.valueHint} placeholder="ready_theme" />
          )}
        </FormGrid>
        <FormGrid>
          <TextInput name="labelFa" label={t.labelFa} dir="rtl" defaultValue={initial?.labelFa ?? ""} />
          <TextInput name="labelEn" label={t.labelEn} dir="ltr" defaultValue={initial?.labelEn ?? ""} />
        </FormGrid>
        <FormGrid>
          <TextArea name="descriptionFa" label={t.descFa} dir="rtl" rows={2} defaultValue={initial?.descriptionFa ?? ""} />
          <TextArea name="descriptionEn" label={t.descEn} dir="ltr" rows={2} defaultValue={initial?.descriptionEn ?? ""} />
        </FormGrid>
        <FormGrid cols={3}>
          <SelectInput name="icon" label={t.icon} options={iconOptions} defaultValue={initial?.icon ?? "layout"} />
          <TextInput name="weight" label={t.weight} dir="ltr" type="number" defaultValue={String(initial?.weight ?? 0)} />
          <TextInput name="sortOrder" label={t.sortOrder} dir="ltr" type="number" defaultValue={String(initial?.sortOrder ?? 0)} />
        </FormGrid>
        <SwitchField name="isActive" label={t.active} defaultChecked={initial?.isActive ?? true} />
      </FormSection>

      <div className="flex flex-wrap items-center gap-3 border-t border-border pt-5">
        <SubmitButton>{mode === "create" ? t.create : t.save}</SubmitButton>
        <ButtonLink href="/admin/planner-options" variant="outline">
          {dict.admin.forms.cancel}
        </ButtonLink>
      </div>
    </form>
  );
}
