"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { updateMessageStatus, deleteMessage } from "@/lib/actions/messages";
import { initialActionState } from "@/lib/form";
import { useI18n } from "@/lib/i18n/context";
import type { ContactMessage } from "@/types";

function SmallButton({
  children,
  tone = "neutral",
  confirmText,
}: {
  children: React.ReactNode;
  tone?: "neutral" | "danger";
  confirmText?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(e) => {
        if (confirmText && !window.confirm(confirmText)) e.preventDefault();
      }}
      className={
        "rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors disabled:opacity-50 " +
        (tone === "danger"
          ? "border-red-500/20 text-red-400 hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-300"
          : "border-border text-muted hover:border-primary/40 hover:bg-surface-2 hover:text-foreground")
      }
    >
      {children}
    </button>
  );
}

function StatusForm({
  id,
  status,
  label,
}: {
  id: number;
  status: "read" | "archived" | "new";
  label: string;
}) {
  const [, formAction] = useActionState(updateMessageStatus, initialActionState);
  return (
    <form action={formAction} className="inline">
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="status" value={status} />
      <SmallButton>{label}</SmallButton>
    </form>
  );
}

/** Status + delete actions for a single contact message row. */
export function MessageActions({ message }: { message: ContactMessage }) {
  const { dict } = useI18n();
  const a = dict.admin.actions;
  const [deleteState, deleteAction] = useActionState(
    deleteMessage,
    initialActionState,
  );

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex flex-wrap items-center justify-end gap-1">
        {message.status !== "read" && (
          <StatusForm id={message.id} status="read" label={a.markRead} />
        )}
        {message.status !== "archived" ? (
          <StatusForm id={message.id} status="archived" label={a.archive} />
        ) : (
          <StatusForm id={message.id} status="new" label={a.reopen} />
        )}
        <form action={deleteAction} className="inline">
          <input type="hidden" name="id" value={message.id} />
          <SmallButton tone="danger" confirmText={dict.admin.confirm.message}>
            {a.delete}
          </SmallButton>
        </form>
      </div>
      {deleteState.error && (
        <span className="text-xs text-red-400">{deleteState.error}</span>
      )}
    </div>
  );
}
