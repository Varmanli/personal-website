"use client";

import { useActionState } from "react";
import Link from "next/link";
import { FiEye, FiEyeOff, FiDatabase } from "react-icons/fi";
import { useI18n } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { initialActionState } from "@/lib/form";
import {
  toggleEstimateRule,
  seedDefaultEstimateRules,
} from "@/lib/actions/planner-estimates";
import { ESTIMATE_GROUPS } from "@/lib/planner/estimate-rules";
import type { PlannerEstimateRule } from "@/types";

export function EstimateRulesManager({ rows }: { rows: PlannerEstimateRule[] }) {
  const { dict, locale } = useI18n();
  const t = dict.admin.estimates;

  if (rows.length === 0) {
    return <SeedEmpty />;
  }

  const groups = [
    ...ESTIMATE_GROUPS,
    ...Array.from(new Set(rows.map((r) => r.group))).filter(
      (g) => !ESTIMATE_GROUPS.includes(g),
    ),
  ];

  return (
    <div className="space-y-6">
      {groups.map((group) => {
        const groupRows = rows.filter((r) => r.group === group);
        if (groupRows.length === 0) return null;
        return (
          <section key={group} className="admin-section p-5">
            <h2 className="text-sm font-semibold text-foreground">{group}</h2>
            <ul className="mt-3 divide-y divide-border">
              {groupRows.map((row) => (
                <li key={row.id} className="flex flex-wrap items-center gap-3 py-3">
                  <div className="min-w-0 flex-1">
                    <span className="block text-sm font-medium text-foreground">
                      {locale === "fa" ? row.labelFa || row.key : row.labelEn || row.key}
                    </span>
                    <span dir="ltr" className="block text-xs text-faint">
                      {row.key} · {row.durationDays} {t.days}
                    </span>
                  </div>
                  <ToggleRule row={row} />
                  <Link
                    href={`/admin/planner-estimates/${row.id}/edit`}
                    className="rounded-lg border border-border px-2.5 py-1 text-xs font-medium text-muted transition-colors hover:border-primary/40 hover:text-foreground"
                  >
                    {t.edit}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

function ToggleRule({ row }: { row: PlannerEstimateRule }) {
  const { dict } = useI18n();
  const t = dict.admin.estimates;
  const [, action] = useActionState(toggleEstimateRule, initialActionState);
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
        {t.active}
      </button>
    </form>
  );
}

function SeedEmpty() {
  const { dict } = useI18n();
  const t = dict.admin.estimates;
  const [state, action] = useActionState(
    seedDefaultEstimateRules,
    initialActionState,
  );
  return (
    <div className="relative overflow-hidden rounded-3xl border border-dashed border-border-strong bg-surface/60 p-10 text-center backdrop-blur">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-background/55 text-2xl text-primary-light">
        <FiDatabase />
      </span>
      <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-muted">
        {t.emptyRules}
      </p>
      {state.error && (
        <p className="mt-3 text-sm text-red-400">{state.error}</p>
      )}
      <form action={action} className="mt-6">
        <Button type="submit">
          <FiDatabase /> {t.seed}
        </Button>
      </form>
    </div>
  );
}
