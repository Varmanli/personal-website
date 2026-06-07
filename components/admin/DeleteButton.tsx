"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { type ActionState, initialActionState } from "@/lib/form";
import { useI18n } from "@/lib/i18n/context";

function Inner({ label, confirmText }: { label: string; confirmText: string }) {
  const { pending } = useFormStatus();
  const { dict } = useI18n();
  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(e) => {
        if (!window.confirm(confirmText)) e.preventDefault();
      }}
      className="rounded-md px-2 py-1 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300 disabled:opacity-50"
    >
      {pending ? dict.admin.actions.deleting : label}
    </button>
  );
}

interface DeleteButtonProps {
  action: (prev: ActionState, form: FormData) => Promise<ActionState>;
  id: number;
  /** Which confirmation message to show. */
  entity: keyof ReturnType<typeof useI18n>["dict"]["admin"]["confirm"];
}

/** Guarded delete: confirm dialog + inline error if the write fails. */
export function DeleteButton({ action, id, entity }: DeleteButtonProps) {
  const { dict } = useI18n();
  const [state, formAction] = useActionState(action, initialActionState);

  return (
    <form action={formAction} className="inline-flex flex-col items-end">
      <input type="hidden" name="id" value={id} />
      <Inner
        label={dict.admin.actions.delete}
        confirmText={dict.admin.confirm[entity]}
      />
      {state.error && (
        <span className="mt-1 text-xs text-red-400">{state.error}</span>
      )}
    </form>
  );
}
