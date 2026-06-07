"use client";

import { useActionState } from "react";
import Link from "next/link";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useI18n } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";
import { plannerIcon } from "@/lib/planner/icons";
import { PLANNER_GROUPS } from "@/lib/planner/options";
import { initialActionState } from "@/lib/form";
import {
  togglePlannerOption,
  deletePlannerOption,
} from "@/lib/actions/planner-options";
import type { PlannerOption } from "@/types";

export function PlannerOptionsManager({ rows }: { rows: PlannerOption[] }) {
  const { dict } = useI18n();
  const t = dict.admin.plannerOpts;

  return (
    <div className="space-y-6">
      <p className="rounded-xl border border-border bg-surface-2/40 p-3 text-xs text-muted">
        {t.fallbackNote}
      </p>

      {PLANNER_GROUPS.map((group) => {
        const groupRows = rows.filter((r) => r.group === group);
        if (groupRows.length === 0) return null;
        return (
          <section key={group} className="admin-section p-5">
            <h2 className="text-sm font-semibold text-foreground">{group}</h2>
            <ul className="mt-3 divide-y divide-border">
              {groupRows.map((row) => (
                <li
                  key={row.id}
                  className="flex flex-wrap items-center gap-3 py-3"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border bg-surface-2/60 text-primary-light">
                    {plannerIcon(row.icon)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <span className="block text-sm font-medium text-foreground">
                      {row.labelFa || row.labelEn || row.value}
                    </span>
                    <span dir="ltr" className="block text-xs text-faint">
                      {row.value} · w{row.weight}
                    </span>
                  </div>
                  {!row.isActive && (
                    <span className="rounded-full bg-surface-2 px-2 py-0.5 text-xs text-faint">
                      {t.deactivate}
                    </span>
                  )}
                  <ToggleButton row={row} />
                  <Link
                    href={`/admin/planner-options/${row.id}/edit`}
                    className="rounded-lg border border-border px-2.5 py-1 text-xs font-medium text-muted transition-colors hover:border-primary/40 hover:text-foreground"
                  >
                    {t.edit}
                  </Link>
                  <DeleteOptionButton id={row.id} confirmText={t.confirmDelete} />
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

function ToggleButton({ row }: { row: PlannerOption }) {
  const { dict } = useI18n();
  const t = dict.admin.plannerOpts;
  const [, action] = useActionState(togglePlannerOption, initialActionState);
  return (
    <form action={action}>
      <input type="hidden" name="id" value={row.id} />
      <input type="hidden" name="isActive" value={row.isActive ? "false" : "true"} />
      <button
        type="submit"
        className={cn(
          "inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors",
          row.isActive
            ? "border-success/30 text-success hover:bg-success/10"
            : "border-border text-faint hover:border-primary/40 hover:text-foreground",
        )}
      >
        {row.isActive ? <FiEye /> : <FiEyeOff />}
        {row.isActive ? t.deactivate : t.activate}
      </button>
    </form>
  );
}

function DeleteOptionButton({
  id,
  confirmText,
}: {
  id: number;
  confirmText: string;
}) {
  const { dict } = useI18n();
  const [, action] = useActionState(deletePlannerOption, initialActionState);
  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        onClick={(e) => {
          if (!window.confirm(confirmText)) e.preventDefault();
        }}
        className="rounded-lg border border-red-500/20 px-2.5 py-1 text-xs font-medium text-red-400 transition-colors hover:border-red-500/40 hover:bg-red-500/10"
      >
        {dict.admin.actions.delete}
      </button>
    </form>
  );
}
