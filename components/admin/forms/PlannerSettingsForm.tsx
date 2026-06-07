"use client";

import { useActionState } from "react";
import {
  TextInput,
  SelectInput,
  SwitchField,
  FormError,
  SubmitButton,
  FormSection,
  FormGrid,
} from "@/components/admin/forms/fields";
import { FiDollarSign } from "react-icons/fi";
import { type ActionState, initialActionState } from "@/lib/form";
import { updatePlannerSettings } from "@/lib/actions/planner-estimates";
import { useI18n } from "@/lib/i18n/context";
import type { PlannerSettings } from "@/types";

export function PlannerSettingsForm({
  initial,
}: {
  initial: PlannerSettings | null;
}) {
  const { dict } = useI18n();
  const t = dict.admin.estimates;
  const [state, formAction] = useActionState<ActionState, FormData>(
    updatePlannerSettings,
    initialActionState,
  );

  const roundingOptions = [
    { value: "nearest_500k", label: t.roundingNearest500k },
    { value: "nearest_1m", label: t.roundingNearest1m },
  ];

  return (
    <form action={formAction} className="space-y-5">
      <FormError message={state.error} />
      <FormSection title={t.settingsTitle} icon={<FiDollarSign />}>
        <FormGrid>
          <TextInput name="weeklyRate" label={t.weeklyRate} dir="ltr" type="number" min="0" defaultValue={String(initial?.weeklyRate ?? 15000000)} />
          <TextInput name="currency" label={t.currency} dir="ltr" defaultValue={initial?.currency ?? "تومان"} />
        </FormGrid>
        <FormGrid>
          <TextInput name="minimumProjectPrice" label={t.minPrice} dir="ltr" type="number" min="0" defaultValue={initial?.minimumProjectPrice != null ? String(initial.minimumProjectPrice) : ""} />
          <SelectInput name="priceRounding" label={t.rounding} options={roundingOptions} defaultValue={initial?.priceRounding ?? "nearest_1m"} />
        </FormGrid>
        <SwitchField name="isEstimateEnabled" label={t.estimateEnabled} defaultChecked={initial?.isEstimateEnabled ?? true} />
        <SwitchField name="showPriceToUser" label={t.showPrice} defaultChecked={initial?.showPriceToUser ?? true} />
      </FormSection>
      <div className="border-t border-border pt-5">
        <SubmitButton>{t.save}</SubmitButton>
      </div>
    </form>
  );
}
