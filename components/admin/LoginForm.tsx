"use client";

import { useActionState } from "react";
import {
  TextInput,
  CheckboxField,
  FormError,
  SubmitButton,
} from "@/components/admin/forms/fields";
import { login } from "@/lib/actions/auth";
import { initialActionState } from "@/lib/form";
import { useI18n } from "@/lib/i18n/context";

export function LoginForm() {
  const { dict } = useI18n();
  const t = dict.admin.auth;
  const [state, formAction] = useActionState(login, initialActionState);

  return (
    <form action={formAction} className="space-y-5">
      <FormError message={state.error} />

      <TextInput
        name="email"
        label={t.email}
        type="email"
        dir="ltr"
        autoComplete="email"
        required
        placeholder="you@example.com"
      />

      <TextInput
        name="password"
        label={t.password}
        type="password"
        dir="ltr"
        autoComplete="current-password"
        required
        placeholder="••••••••"
      />

      <CheckboxField
        name="remember"
        label={t.remember}
        description={t.rememberHint}
      />

      <SubmitButton>{t.signIn}</SubmitButton>
    </form>
  );
}
