"use client";

import { useActionState } from "react";
import { FiArchive } from "react-icons/fi";
import { useI18n } from "@/lib/i18n/context";
import { CustomSelect } from "@/components/admin/forms/CustomSelect";
import { FormError, SubmitButton } from "@/components/admin/forms/fields";
import { Button } from "@/components/ui/Button";
import { initialActionState, type ActionState } from "@/lib/form";
import {
  updateProjectRequestStatus,
  updateProjectRequestAdminNote,
  archiveProjectRequest,
} from "@/lib/actions/project-requests";
import { REQUEST_STATUSES } from "@/lib/planner/request-status";
import type { ProjectRequest } from "@/types";

export function RequestControls({ request }: { request: ProjectRequest }) {
  const { dict } = useI18n();
  const d = dict.admin.requests.detail;

  const [statusState, statusAction] = useActionState(
    updateProjectRequestStatus,
    initialActionState,
  );
  const [noteState, noteAction] = useActionState(
    updateProjectRequestAdminNote,
    initialActionState,
  );
  const [, archiveAction] = useActionState<ActionState, FormData>(
    archiveProjectRequest,
    initialActionState,
  );

  const statusOptions = REQUEST_STATUSES.map((s) => ({
    value: s,
    label: (dict.admin.status as Record<string, string>)[s] ?? s,
  }));

  return (
    <div className="space-y-5">
      {/* Status */}
      <form action={statusAction} className="admin-section space-y-3 p-5">
        <h3 className="text-sm font-semibold text-foreground">{d.status}</h3>
        <FormError message={statusState.error} />
        <input type="hidden" name="id" value={request.id} />
        <CustomSelect
          name="status"
          options={statusOptions}
          defaultValue={request.status}
        />
        <SubmitButton>{dict.admin.forms.saveProject}</SubmitButton>
      </form>

      {/* Admin note */}
      <form action={noteAction} className="admin-section space-y-3 p-5">
        <h3 className="text-sm font-semibold text-foreground">{d.note}</h3>
        <p className="text-xs text-faint">{d.noteHint}</p>
        <FormError message={noteState.error} />
        <input type="hidden" name="id" value={request.id} />
        <textarea
          name="adminNote"
          rows={4}
          dir="rtl"
          defaultValue={request.adminNote ?? ""}
          className="field-control"
        />
        <SubmitButton>{d.saveNote}</SubmitButton>
      </form>

      {/* Archive */}
      {request.status !== "archived" && (
        <form action={archiveAction}>
          <input type="hidden" name="id" value={request.id} />
          <Button type="submit" variant="outline" className="w-full">
            <FiArchive /> {d.archive}
          </Button>
        </form>
      )}
    </div>
  );
}
