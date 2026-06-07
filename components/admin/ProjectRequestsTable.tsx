"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { FiSearch } from "react-icons/fi";
import { useI18n } from "@/lib/i18n/context";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { CustomSelect } from "@/components/admin/forms/CustomSelect";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatDate } from "@/lib/utils";
import { DEFAULT_PLANNER_OPTIONS } from "@/lib/planner/options";
import { REQUEST_STATUSES } from "@/lib/planner/request-status";
import type { ProjectRequest } from "@/types";

export function ProjectRequestsTable({ rows }: { rows: ProjectRequest[] }) {
  const { dict, locale } = useI18n();
  const t = dict.admin.requests;
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");

  const typeLabels = useMemo(() => {
    const map: Record<string, string> = {};
    for (const o of DEFAULT_PLANNER_OPTIONS) {
      if (o.group === "projectType") {
        map[o.value] = locale === "fa" ? o.labelFa : o.labelEn;
      }
    }
    return map;
  }, [locale]);

  const statusOptions = useMemo(
    () => [
      { value: "", label: t.allStatuses },
      ...REQUEST_STATUSES.map((s) => ({
        value: s,
        label: (dict.admin.status as Record<string, string>)[s] ?? s,
      })),
    ],
    [dict, t.allStatuses],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      if (status && r.status !== status) return false;
      if (!q) return true;
      return [r.name, r.email, r.phone, r.companyName]
        .filter(Boolean)
        .some((v) => v!.toLowerCase().includes(q));
    });
  }, [rows, query, status]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <FiSearch className="pointer-events-none absolute start-3.5 top-1/2 -translate-y-1/2 text-faint" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="field-control ps-10"
          />
        </div>
        <div className="sm:w-56">
          <CustomSelect
            name="statusFilter"
            options={statusOptions}
            defaultValue=""
            placeholder={t.allStatuses}
            onValueChange={setStatus}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title={t.empty} />
      ) : (
        <div className="neon-card overflow-x-auto rounded-xl">
          <table className="w-full text-start text-sm">
            <thead className="border-b border-border bg-surface-2 text-xs uppercase tracking-wide text-faint">
              <tr>
                <th className="px-4 py-3 font-medium text-start">{t.cols.name}</th>
                <th className="px-4 py-3 font-medium text-start">{t.cols.type}</th>
                <th className="px-4 py-3 font-medium text-start">{t.cols.plan}</th>
                <th className="px-4 py-3 font-medium text-start">{t.cols.complexity}</th>
                <th className="px-4 py-3 font-medium text-start">{t.cols.status}</th>
                <th className="px-4 py-3 font-medium text-start">{t.cols.created}</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((r) => (
                <tr key={r.id} className="transition-colors hover:bg-surface-2">
                  <td className="px-4 py-3">
                    <span className="block font-medium text-foreground">{r.name}</span>
                    {r.companyName && (
                      <span className="block text-xs text-faint">{r.companyName}</span>
                    )}
                    <span dir="ltr" className="block text-xs text-faint">
                      {r.email || r.phone}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {typeLabels[r.projectType] ?? r.projectType}
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {r.suggestedPlan
                      ? (dict.planner.plans as Record<string, string>)[r.suggestedPlan] ??
                        r.suggestedPlan
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {r.estimatedComplexity
                      ? (dict.planner.complexity as Record<string, string>)[
                          r.estimatedComplexity
                        ] ?? r.estimatedComplexity
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="px-4 py-3 text-muted">{formatDate(r.createdAt)}</td>
                  <td className="px-4 py-3 text-end">
                    <Link
                      href={`/admin/project-requests/${r.id}`}
                      className="text-sm font-medium text-primary-light hover:underline"
                    >
                      {dict.admin.actions.view}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
