"use client";

import { useActionState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import {
  TextInput,
  TextArea,
  SwitchField,
  FormError,
  SubmitButton,
  FormSection,
  FormGrid,
  ReadonlySlug,
} from "@/components/admin/forms/fields";
import { FiDollarSign } from "react-icons/fi";
import { type ActionState, initialActionState } from "@/lib/form";
import { updateEstimateRule } from "@/lib/actions/planner-estimates";
import { useI18n } from "@/lib/i18n/context";
import type { PlannerEstimateRule } from "@/types";

export function EstimateRuleForm({ initial }: { initial: PlannerEstimateRule }) {
  const { dict } = useI18n();
  const t = dict.admin.estimates;
  const action = updateEstimateRule.bind(null, initial.id);
  const [state, formAction] = useActionState<ActionState, FormData>(
    action,
    initialActionState,
  );

  return (
    <form action={formAction} className="space-y-5">
      <FormError message={state.error} />
      <FormSection title={t.pageEdit} icon={<FiDollarSign />}>
        <FormGrid>
          <ReadonlySlug label={t.ruleKey} value={initial.key} />
          <TextInput name="durationDays" label={t.durationDays} dir="ltr" type="number" step="0.1" min="0" defaultValue={String(initial.durationDays)} />
        </FormGrid>
        <FormGrid>
          <TextInput name="labelFa" label={t.labelFa} dir="rtl" defaultValue={initial.labelFa ?? ""} />
          <TextInput name="labelEn" label={t.labelEn} dir="ltr" defaultValue={initial.labelEn ?? ""} />
        </FormGrid>
        <FormGrid>
          <TextArea name="descriptionFa" label={t.descFa} dir="rtl" rows={2} defaultValue={initial.descriptionFa ?? ""} />
          <TextArea name="descriptionEn" label={t.descEn} dir="ltr" rows={2} defaultValue={initial.descriptionEn ?? ""} />
        </FormGrid>
        <FormGrid>
          <TextInput name="sortOrder" label={t.sortOrder} dir="ltr" type="number" defaultValue={String(initial.sortOrder)} />
        </FormGrid>
        <SwitchField name="isActive" label={t.active} defaultChecked={initial.isActive} />
      </FormSection>
      <div className="flex flex-wrap items-center gap-3 border-t border-border pt-5">
        <SubmitButton>{t.save}</SubmitButton>
        <ButtonLink href="/admin/planner-estimates" variant="outline">
          {dict.admin.forms.cancel}
        </ButtonLink>
      </div>
    </form>
  );
}
