"use client";

import { useActionState, useMemo, useState, useSyncExternalStore } from "react";
import {
  FiCheck,
  FiArrowLeft,
  FiArrowRight,
  FiSend,
  FiMinus,
  FiPlus,
} from "react-icons/fi";
import { useI18n } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { plannerIcon } from "@/lib/planner/icons";
import { recommend } from "@/lib/planner/recommend";
import { calculateProjectEstimate } from "@/lib/planner/estimate";
import {
  getPlannerFlow,
  type PlannerAnswerMap,
  type PlannerQuestion,
  type PlannerQuestionOption,
} from "@/lib/planner/question-flow";
import {
  createProjectRequest,
  type PlannerSubmitState,
} from "@/lib/actions/project-requests";
import type { PlannerOptionMap } from "@/lib/planner/data";
import type {
  EstimateRuleLite,
  EstimateSettingsLite,
} from "@/lib/planner/estimate";

interface OptionLite {
  value: string;
  label: string;
  description?: string;
  icon?: string | null;
}

// Hydration-safe "are we on the client" flag. Uses the server snapshot (false)
// for the hydrating render, then flips to true — without setState-in-effect.
const emptySubscribe = () => () => {};
function useMounted(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

export function PlannerWizard({
  options,
  rules,
  settings,
  initialProjectType = "",
}: {
  options: PlannerOptionMap;
  rules: EstimateRuleLite[];
  settings: EstimateSettingsLite;
  initialProjectType?: string;
}) {
  const { dict, locale } = useI18n();
  const p = dict.planner;
  const fa = locale === "fa";

  const [answers, setAnswers] = useState<PlannerAnswerMap>(
    initialProjectType ? { projectType: initialProjectType } : {},
  );
  const [step, setStep] = useState(0);
  const [state, formAction, isPending] = useActionState<
    PlannerSubmitState,
    FormData
  >(createProjectRequest, {});

  const projectType =
    typeof answers.projectType === "string" ? answers.projectType : "";
  const flow = useMemo(
    () => (projectType ? getPlannerFlow(projectType, answers) : []),
    [projectType, answers],
  );
  const totalSteps = 1 + flow.length + 1; // type + flow + contact
  const onTypeStep = step === 0;
  const onContactStep = step === flow.length + 1;
  const question: PlannerQuestion | null =
    !onTypeStep && !onContactStep ? flow[step - 1] : null;
  const progress = Math.round(((step + 1) / totalSteps) * 100);

  const est = useMemo(
    () => calculateProjectEstimate({ projectType, answers }, rules, settings),
    [projectType, answers, rules, settings],
  );
  const rec = useMemo(() => {
    const features = Object.values(answers)
      .filter(Array.isArray)
      .flat()
      .filter((v): v is string => typeof v === "string");
    return recommend({
      projectType,
      cmsSolutionType:
        typeof answers.cmsSolutionType === "string"
          ? answers.cmsSolutionType
          : null,
      goals: [],
      features,
      designLevel: typeof answers.design === "string" ? answers.design : null,
      currentStage:
        typeof answers.currentStage === "string" ? answers.currentStage : null,
      timeline: typeof answers.timeline === "string" ? answers.timeline : null,
      budgetLevel:
        typeof answers.budgetLevel === "string" ? answers.budgetLevel : null,
    });
  }, [projectType, answers]);

  const tl = (o: { labelFa: string; labelEn: string }) =>
    fa ? o.labelFa : o.labelEn;

  function pickType(value: string) {
    // Changing project type prunes all dependent answers.
    setAnswers((a): PlannerAnswerMap =>
      a.projectType === value ? {} : { projectType: value },
    );
  }
  function setSingle(id: string, value: string) {
    setAnswers((a) => ({ ...a, [id]: a[id] === value ? "" : value }));
  }
  function toggleMulti(id: string, value: string) {
    setAnswers((a) => {
      const arr = Array.isArray(a[id]) ? (a[id] as string[]) : [];
      return {
        ...a,
        [id]: arr.includes(value)
          ? arr.filter((v) => v !== value)
          : [...arr, value],
      };
    });
  }
  function setNumber(id: string, value: number, min: number) {
    setAnswers((a) => ({ ...a, [id]: Math.max(min, value) }));
  }

  const canNext = (() => {
    if (onTypeStep) return Boolean(projectType);
    if (question?.required) {
      const v = answers[question.id];
      return Array.isArray(v) ? v.length > 0 : Boolean(v);
    }
    return true;
  })();

  // Question options localized for OptionGrid.
  const qOptions = (opts?: PlannerQuestionOption[]): OptionLite[] =>
    (opts ?? []).map((o) => ({ value: o.value, label: tl(o), icon: o.icon }));

  // Render the interactive wizard on the client only. The server (and the
  // hydrating render) emit a matching skeleton, so there's no hydration step
  // for this input-heavy widget to mismatch on.
  const mounted = useMounted();
  if (!mounted) {
    return (
      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="neon-card h-[460px] animate-pulse rounded-3xl" />
        <div className="neon-card h-[220px] animate-pulse rounded-2xl" />
      </div>
    );
  }

  if (state.ok) {
    return (
      <div className="neon-card rounded-3xl p-8 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success/15 text-2xl text-success">
          <FiCheck />
        </span>
        <p className="mt-5 text-lg font-semibold text-foreground">{p.form.success}</p>
        <div className="mx-auto mt-6 max-w-md">
          <EstimateCard est={est} rec={rec} settings={settings} dict={p} fa={fa} />
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
      <form action={formAction} className="neon-card rounded-3xl p-6 sm:p-8">
        {/* honeypot + serialized payload */}
        <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
        <input type="hidden" name="locale" value={locale} />
        <input type="hidden" name="projectType" value={projectType} />
        <input type="hidden" name="answers" value={JSON.stringify(answers)} />

        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs text-faint">
            <span>
              {p.ui.step} {step + 1} {p.ui.of} {totalSteps}
            </span>
            <span>{progress}%</span>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          {onTypeStep
            ? p.steps.projectType
            : onContactStep
              ? p.steps.contact
              : question
                ? tl(question)
                : ""}
        </h2>
        {question?.descriptionFa && (
          <p className="mt-1 text-sm text-faint">
            {fa ? question.descriptionFa : question.descriptionEn}
          </p>
        )}
        <p className="mt-1 text-sm text-faint">
          {onTypeStep || question?.type === "single"
            ? p.ui.selectOne
            : question?.type === "multi"
              ? p.ui.selectMany
              : ""}
        </p>

        {/* Body */}
        <div className="mt-5">
          {onTypeStep && (
            <OptionGrid
              options={options.projectType.map((o) => ({
                value: o.value,
                label: o.label,
                icon: o.icon,
              }))}
              selected={[projectType]}
              onPick={pickType}
            />
          )}

          {question && question.type === "single" && (
            <OptionGrid
              options={qOptions(question.options)}
              selected={[(answers[question.id] as string) ?? ""]}
              onPick={(v) => setSingle(question.id, v)}
            />
          )}
          {question && question.type === "boolean" && (
            <OptionGrid
              options={qOptions(question.options)}
              selected={[(answers[question.id] as string) ?? ""]}
              onPick={(v) => setSingle(question.id, v)}
            />
          )}
          {question && question.type === "multi" && (
            <OptionGrid
              options={qOptions(question.options)}
              selected={(answers[question.id] as string[]) ?? []}
              onPick={(v) => toggleMulti(question.id, v)}
              multi
            />
          )}
          {question && question.type === "number" && (
            <NumberField
              value={
                typeof answers[question.id] === "number"
                  ? (answers[question.id] as number)
                  : (question.default ?? question.min ?? 1)
              }
              min={question.min ?? 1}
              onChange={(n) => setNumber(question.id, n, question.min ?? 1)}
            />
          )}

          {onContactStep && (
            <ContactStep
              dict={p}
              fa={fa}
              locale={locale}
              methodOptions={options.contactMethod}
            />
          )}
        </div>

        {/* WordPress positioning note */}
        {question?.id === "cmsSolutionType" && (
          <p className="mt-4 rounded-xl border border-border bg-surface-2/40 p-3 text-xs leading-relaxed text-muted">
            {p.cmsNote}
          </p>
        )}

        {state.error && (
          <p role="alert" className="mt-4 rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-300">
            {state.error}
          </p>
        )}

        {/* Nav */}
        <div className="mt-7 flex items-center justify-between gap-3 border-t border-border pt-5">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-muted transition-colors hover:text-foreground disabled:opacity-40"
          >
            <FiArrowLeft className="rtl:rotate-180" /> {p.ui.back}
          </button>

          {onContactStep ? (
            <Button type="submit" disabled={isPending}>
              <FiSend /> {isPending ? p.ui.submitting : p.ui.submit}
            </Button>
          ) : (
            <Button
              type="button"
              onClick={() =>
                canNext && setStep((s) => Math.min(totalSteps - 1, s + 1))
              }
              className={cn(!canNext && "pointer-events-none opacity-50")}
            >
              {p.ui.next} <FiArrowRight className="rtl:rotate-180" />
            </Button>
          )}
        </div>
      </form>

      {/* Aside: live estimate + recommendation */}
      <aside className="space-y-4">
        <EstimateCard est={est} rec={rec} settings={settings} dict={p} fa={fa} />
      </aside>
    </div>
  );
}

/* ------------------------------- Sub-components ------------------------------ */

function OptionGrid({
  options,
  selected,
  onPick,
  multi,
}: {
  options: OptionLite[];
  selected: string[];
  onPick: (value: string) => void;
  multi?: boolean;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {options.map((o) => {
        const active = selected.includes(o.value);
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onPick(o.value)}
            className={cn(
              "group flex items-start gap-3 rounded-2xl border p-3.5 text-start transition-all",
              active
                ? "border-primary/50 bg-primary/10 shadow-[0_10px_30px_-12px_rgba(79,124,255,0.5)]"
                : "border-border bg-background/40 hover:border-primary/40 hover:bg-primary/5",
            )}
          >
            <span
              className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border text-lg",
                active
                  ? "border-primary/40 bg-primary/15 text-primary-light"
                  : "border-border bg-surface-2/60 text-muted",
              )}
            >
              {plannerIcon(o.icon)}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-medium text-foreground">{o.label}</span>
              {o.description && (
                <span className="mt-0.5 block text-xs leading-relaxed text-faint">{o.description}</span>
              )}
            </span>
            {active && <FiCheck className="shrink-0 text-primary-light" />}
            {multi && <span className="sr-only">{active ? "selected" : ""}</span>}
          </button>
        );
      })}
    </div>
  );
}

function NumberField({
  value,
  min,
  onChange,
}: {
  value: number;
  min: number;
  onChange: (n: number) => void;
}) {
  return (
    <div className="inline-flex items-center gap-3 rounded-2xl border border-border bg-background/40 p-2">
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-border text-muted hover:border-primary/40 hover:text-foreground"
      >
        <FiMinus />
      </button>
      <input
        type="number"
        min={min}
        value={value}
        onChange={(e) => onChange(Number(e.target.value) || min)}
        className="field-control w-24 text-center"
        dir="ltr"
      />
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-border text-muted hover:border-primary/40 hover:text-foreground"
      >
        <FiPlus />
      </button>
    </div>
  );
}

function ContactStep({
  dict: p,
  fa,
  locale,
  methodOptions,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dict: any;
  fa: boolean;
  locale: string;
  methodOptions: { value: string; label: string; icon?: string | null }[];
}) {
  const c = p.contact;
  const [method, setMethod] = useState("");
  const cls = "field-control";
  const dir = fa ? "rtl" : "ltr";
  return (
    <div className="space-y-4">
      <input type="hidden" name="preferredContactMethod" value={method} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Labeled label={c.name}>
          <input name="name" required className={cls} dir={dir} />
        </Labeled>
        <Labeled label={c.company}>
          <input name="companyName" className={cls} dir={dir} />
        </Labeled>
        <Labeled label={c.email}>
          <input name="email" type="email" dir="ltr" className={cls} placeholder="you@example.com" />
        </Labeled>
        <Labeled label={c.phone}>
          <input name="phone" type="tel" dir="ltr" className={cls} />
        </Labeled>
      </div>
      <div>
        <span className="mb-2 block text-[0.8125rem] font-semibold text-foreground/90">{c.method}</span>
        <OptionGrid
          options={methodOptions.map((m) => ({ value: m.value, label: m.label, icon: m.icon }))}
          selected={[method]}
          onPick={(v) => setMethod((cur) => (cur === v ? "" : v))}
        />
      </div>
      <Labeled label={c.description}>
        <textarea name="description" rows={3} className={cls} placeholder={c.descriptionPlaceholder} dir={dir} />
      </Labeled>
      <p className="text-xs leading-relaxed text-faint">
        {locale === "fa" ? p.result.disclaimer : p.result.disclaimer}
      </p>
    </div>
  );
}

function Labeled({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="space-y-1.5">
      <span className="block text-[0.8125rem] font-semibold text-foreground/90">{label}</span>
      {children}
    </label>
  );
}

function EstimateCard({
  est,
  rec,
  settings,
  dict: p,
  fa,
}: {
  est: ReturnType<typeof calculateProjectEstimate>;
  rec: ReturnType<typeof recommend>;
  settings: EstimateSettingsLite;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dict: any;
  fa: boolean;
}) {
  const showPrice = settings.isEstimateEnabled && settings.showPriceToUser;
  const showEstimate = settings.isEstimateEnabled;
  return (
    <div className="neon-card rounded-2xl p-5">
      <h3 className="text-sm font-semibold text-faint">{p.result.title}</h3>
      <dl className="mt-3 space-y-2.5 text-sm">
        <Row label={p.result.plan} value={p.plans[rec.plan]} strong />
        <Row label={p.result.complexity} value={p.complexity[rec.complexity]} />
        {showEstimate && (
          <Row
            label={p.result.duration}
            value={`${fmtNum(est.estimatedWeeks, fa)} ${p.result.weeksUnit}`}
          />
        )}
        {showPrice && (
          <Row
            label={p.result.price}
            value={`${fmtNum(est.estimatedPrice, fa)} ${est.currency}`}
            strong
          />
        )}
      </dl>

      {showEstimate && est.breakdown.length > 0 && (
        <details className="mt-3 border-t border-border pt-3">
          <summary className="cursor-pointer text-xs font-medium text-primary-light">
            {p.result.breakdown}
          </summary>
          <ul className="mt-2 space-y-1.5">
            {est.breakdown.map((b, i) => (
              <li key={`${b.key}-${i}`} className="flex items-center justify-between gap-2 text-xs text-muted">
                <span>{fa ? b.labelFa : b.labelEn}</span>
                <span className="text-faint">+{fmtNum(b.durationDays, fa)}</span>
              </li>
            ))}
          </ul>
        </details>
      )}

      <p className="mt-3 text-[0.7rem] leading-relaxed text-faint">{p.result.disclaimer}</p>
    </div>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-faint">{label}</dt>
      <dd className={cn("text-end", strong ? "font-semibold text-primary-light" : "text-foreground")}>
        {value}
      </dd>
    </div>
  );
}

const FA_DIGITS = "۰۱۲۳۴۵۶۷۸۹";
/**
 * Deterministic number formatting. We always group with the well-supported
 * "en-US" locale (identical on Node + browser) and map to Persian digits with a
 * pure string replace — avoiding the SSR/client hydration mismatch that
 * `Intl.NumberFormat("fa-IR")` can cause when ICU data differs.
 */
function fmtNum(n: number, fa: boolean): string {
  const s = new Intl.NumberFormat("en-US").format(n);
  return fa ? s.replace(/\d/g, (d) => FA_DIGITS[Number(d)]) : s;
}
