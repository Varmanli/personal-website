import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FiUser, FiLayers, FiCpu, FiDollarSign, FiList } from "react-icons/fi";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { RequestControls } from "@/components/admin/RequestControls";
import { Badge } from "@/components/ui/Badge";
import { getProjectRequestById } from "@/lib/planner/data";
import { optionLabel } from "@/lib/planner/options";
import {
  getPlannerFlow,
  type PlannerAnswerMap,
} from "@/lib/planner/question-flow";
import { formatDate } from "@/lib/utils";
import { getI18n } from "@/lib/i18n/server";

export const metadata: Metadata = {
  title: "Project request",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function ProjectRequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numId = Number(id);
  if (Number.isNaN(numId)) notFound();

  const { locale, dict } = await getI18n();
  const r = await getProjectRequestById(numId);
  if (!r) notFound();

  const d = dict.admin.requests.detail;
  const nf = new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en-US");
  const u = dict.planner.result;
  const label = (group: Parameters<typeof optionLabel>[0], v: string | null) =>
    optionLabel(group, v, locale) ?? d.none;
  const hasEstimate = r.estimatedPrice != null || r.estimatedDays != null;

  // Resolve the dynamic wizard answers to readable label/value rows.
  const dynamic = (r.dynamicAnswers ?? {}) as PlannerAnswerMap;
  const flow = getPlannerFlow(r.projectType, dynamic);
  const qById = new Map(flow.map((q) => [q.id, q]));
  const answerRows = Object.entries(dynamic)
    .filter(([key]) => key !== "projectType")
    .map(([key, val]) => {
      const q = qById.get(key);
      const qLabel = q ? (locale === "fa" ? q.labelFa : q.labelEn) : key;
      const optLabel = (v: string) => {
        const o = q?.options?.find((opt) => opt.value === v);
        return o ? (locale === "fa" ? o.labelFa : o.labelEn) : v;
      };
      let value: string;
      if (Array.isArray(val)) value = val.map((v) => optLabel(String(v))).join("، ");
      else if (typeof val === "number") value = nf.format(val);
      else value = optLabel(String(val));
      return { key, label: qLabel, value };
    })
    .filter((row) => row.value);

  return (
    <>
      <Link
        href="/admin/project-requests"
        className="text-sm text-primary-light hover:underline"
      >
        {d.back}
      </Link>
      <AdminPageHeader
        title={r.name}
        description={`${formatDate(r.createdAt)}`}
      />

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          {/* Contact */}
          <Section icon={<FiUser />} title={d.contact}>
            <Grid>
              <Field label={d.email} value={r.email} dir="ltr" />
              <Field label={d.phone} value={r.phone} dir="ltr" />
              <Field label={d.company} value={r.companyName} />
              <Field
                label={d.method}
                value={label("contactMethod", r.preferredContactMethod)}
              />
            </Grid>
          </Section>

          {/* Project */}
          <Section icon={<FiLayers />} title={d.project}>
            <Grid>
              <Field label={d.project} value={label("projectType", r.projectType)} />
              {r.cmsSolutionType && (
                <Field label={d.cms} value={label("cmsSolutionType", r.cmsSolutionType)} />
              )}
              <Field label={d.design} value={label("designLevel", r.designLevel)} />
              <Field label={d.stage} value={label("currentStage", r.currentStage)} />
              <Field label={d.timeline} value={label("timeline", r.timeline)} />
              <Field label={d.budget} value={label("budgetLevel", r.budgetLevel)} />
            </Grid>
            {r.goals && r.goals.length > 0 && (
              <Chips label={d.goals} items={r.goals.map((g) => label("goal", g))} />
            )}
            {r.features && r.features.length > 0 && (
              <Chips
                label={d.features}
                items={r.features.map((f) => label("feature", f))}
              />
            )}
            {r.description && (
              <div className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-faint">
                  {d.description}
                </p>
                <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-muted">
                  {r.description}
                </p>
              </div>
            )}
          </Section>

          {/* Project-specific dynamic answers */}
          {answerRows.length > 0 && (
            <Section icon={<FiList />} title={d.dynamicAnswers}>
              <dl className="space-y-3">
                {answerRows.map((row) => (
                  <div
                    key={row.key}
                    className="flex flex-col gap-1 border-b border-border/60 pb-2 last:border-0 last:pb-0 sm:flex-row sm:items-start sm:justify-between sm:gap-4"
                  >
                    <dt className="text-sm font-medium text-foreground">
                      {row.label}
                    </dt>
                    <dd className="text-sm text-muted sm:text-end">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </Section>
          )}

          {/* Recommendation */}
          <Section icon={<FiCpu />} title={d.recommendation}>
            <Grid>
              <Field
                label={dict.planner.result.plan}
                value={
                  r.suggestedPlan
                    ? (dict.planner.plans as Record<string, string>)[r.suggestedPlan] ??
                      r.suggestedPlan
                    : d.none
                }
              />
              <Field
                label={dict.planner.result.complexity}
                value={
                  r.estimatedComplexity
                    ? (dict.planner.complexity as Record<string, string>)[
                        r.estimatedComplexity
                      ] ?? r.estimatedComplexity
                    : d.none
                }
              />
              <Field
                label={dict.planner.result.timeline}
                value={
                  r.estimatedTimeline
                    ? (dict.planner.timelines as Record<string, string>)[
                        r.estimatedTimeline
                      ] ?? r.estimatedTimeline
                    : d.none
                }
              />
              <Field label={d.score} value={`${r.score ?? 0}/100`} />
            </Grid>
          </Section>

          {/* Estimate */}
          <Section icon={<FiDollarSign />} title={d.estimate}>
            {hasEstimate ? (
              <>
                <Grid>
                  <Field
                    label={d.estDays}
                    value={
                      r.estimatedDays != null
                        ? `${nf.format(r.estimatedDays)} ${u.daysUnit}`
                        : d.none
                    }
                  />
                  <Field
                    label={d.estWeeks}
                    value={
                      r.estimatedWeeks != null
                        ? `${nf.format(r.estimatedWeeks)} ${u.weeksUnit}`
                        : d.none
                    }
                  />
                  <Field
                    label={d.estPrice}
                    value={
                      r.estimatedPrice != null
                        ? `${nf.format(r.estimatedPrice)} ${r.currency ?? ""}`
                        : d.none
                    }
                  />
                  <Field
                    label={d.weeklyRate}
                    value={
                      r.weeklyRateSnapshot != null
                        ? `${nf.format(r.weeklyRateSnapshot)} ${r.currency ?? ""}`
                        : d.none
                    }
                  />
                </Grid>
                {r.estimateBreakdown && r.estimateBreakdown.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-faint">
                      {d.breakdown}
                    </p>
                    <ul className="mt-2 space-y-1.5">
                      {r.estimateBreakdown.map((b, i) => (
                        <li
                          key={`${b.key}-${i}`}
                          className="flex items-center justify-between gap-2 text-sm text-muted"
                        >
                          <span>{locale === "fa" ? b.labelFa : b.labelEn}</span>
                          <span className="text-faint">
                            +{nf.format(b.durationDays)} {u.daysUnit}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <p className="mt-3 text-xs text-faint">{d.snapshotNote}</p>
              </>
            ) : (
              <p className="text-sm text-muted">{d.noEstimate}</p>
            )}
          </Section>
        </div>

        {/* Controls */}
        <div>
          <RequestControls request={r} />
        </div>
      </div>
    </>
  );
}

function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="admin-section p-5 sm:p-6">
      <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <span className="text-primary-light">{icon}</span>
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <dl className="grid gap-4 sm:grid-cols-2">{children}</dl>;
}

function Field({
  label,
  value,
  dir,
}: {
  label: string;
  value?: string | null;
  dir?: "ltr" | "rtl";
}) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-faint">
        {label}
      </dt>
      <dd dir={dir} className="mt-0.5 text-sm text-foreground">
        {value || "—"}
      </dd>
    </div>
  );
}

function Chips({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="mt-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-faint">
        {label}
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {items.map((item, i) => (
          <Badge key={`${i}-${item}`} tone="brand">
            {item}
          </Badge>
        ))}
      </div>
    </div>
  );
}
