"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import {
  FiCheck,
  FiArrowLeft,
  FiArrowRight,
  FiSend,
  FiMinus,
  FiPlus,
  FiDownload,
} from "react-icons/fi";
import { useI18n } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";
import { Button, ButtonLink } from "@/components/ui/Button";
import { plannerIcon } from "@/lib/planner/icons";
import { calculateProjectEstimate } from "@/lib/planner/estimate";
import {
  getPlannerFlow,
  type PlannerAnswerMap,
  type PlannerQuestion,
  type PlannerQuestionOption,
} from "@/lib/planner/question-flow";
import { createProjectRequest } from "@/lib/actions/project-requests";
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
  badge?: string;
  items?: string[];
}

interface SubmittedSnapshot {
  contact: {
    name: string;
    email: string;
    phone: string;
    company: string;
    description: string;
    methodLabel: string | null;
  };
  estimate: ReturnType<typeof calculateProjectEstimate>;
  projectType: string;
  projectTypeLabel: string | null;
  pages: number | null;
  designLabel: string | null;
  featureLabels: string[];
  timelineTight: boolean;
  supportValue: string | null;
  supportPlan: string;
  supportOngoing: boolean;
  supportDescription: string | null;
  complexityText: string;
  timelineText: string;
  timelinePrefLabel: string | null;
  priceText: string;
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
  settings,
  initialProjectType = "",
  brandName = "Varmanli",
}: {
  options: PlannerOptionMap;
  rules: EstimateRuleLite[];
  settings: EstimateSettingsLite;
  initialProjectType?: string;
  brandName?: string;
}) {
  const { dict, locale } = useI18n();
  const p = dict.planner;
  const fa = locale === "fa";

  const [answers, setAnswers] = useState<PlannerAnswerMap>(
    initialProjectType ? { projectType: initialProjectType } : {},
  );
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pdfStatus, setPdfStatus] = useState<"idle" | "loading" | "error">(
    "idle",
  );
  const [submittedSnapshot, setSubmittedSnapshot] =
    useState<SubmittedSnapshot | null>(null);

  // Controlled submit. We deliberately do NOT use <form action={...}>: that
  // path let the browser fall back to a native GET navigation
  // (`GET /start-project?`) and raced React 19's uncontrolled-form reset against
  // the success-state unmount, throwing "Node.removeChild: The node to be
  // removed is not a child of this node". Calling the server action by hand and
  // preventing the default keeps everything in React's control, and the form
  // stays mounted after success to avoid any submit-time subtree removal race.
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting || showSuccess) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const formData = new FormData(event.currentTarget);
      const snapshot = buildSubmittedSnapshot(formData);
      const result = await createProjectRequest({}, formData);
      if (!result.ok) {
        setError(result.error ?? p.form.errorGeneric);
        return;
      }
      setSubmittedSnapshot(snapshot);
    } catch {
      setError(p.form.errorGeneric);
    } finally {
      setIsSubmitting(false);
    }
  }

  const projectType =
    typeof answers.projectType === "string" ? answers.projectType : "";
  const projectTypeLabel =
    options.projectType.find((o) => o.value === projectType)?.label ?? null;
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
    () => calculateProjectEstimate({ projectType, answers }, settings),
    [projectType, answers, settings],
  );

  const tl = (o: { labelFa: string; labelEn: string }) =>
    fa ? o.labelFa : o.labelEn;

  // Localized summary pieces for the estimate card.
  const optionLabelById = (questionId: string, value: string): string | null => {
    const q = flow.find((item) => item.id === questionId);
    const opt = q?.options?.find((o) => o.value === value);
    return opt ? tl(opt) : null;
  };
  const pagesValue = typeof answers.pages === "number" ? answers.pages : null;
  const designLabel =
    typeof answers.designLevel === "string"
      ? optionLabelById("designLevel", answers.designLevel)
      : null;
  const selectedFeatures = Array.isArray(answers.features)
    ? (answers.features as string[])
    : [];
  const featureLabels = selectedFeatures
    .map((v) => optionLabelById("features", v))
    .filter((v): v is string => Boolean(v));
  // Warn when the chosen timeline is tighter than the calculated effort.
  const TIMELINE_TARGET_WEEKS: Record<string, number> = {
    flexible: 99,
    "1-2-months": 8,
    "3-4-weeks": 4,
    "under-3-weeks": 3,
    urgent: 2,
  };
  const chosenTimeline =
    typeof answers.timeline === "string" ? answers.timeline : "";
  const timelineTight =
    Boolean(projectType) &&
    chosenTimeline in TIMELINE_TARGET_WEEKS &&
    est.estimatedWeeks > TIMELINE_TARGET_WEEKS[chosenTimeline];

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
    (opts ?? []).map((o) => ({
      value: o.value,
      label: tl(o),
      icon: o.icon,
      description: fa ? o.descriptionFa : o.descriptionEn,
      badge: fa ? o.badgeFa : o.badgeEn,
      items: fa ? o.itemsFa : o.itemsEn,
    }));

  // Localized estimate text used by both the card and the PDF.
  const complexityText = est.needsReview
    ? p.result.needsReview
    : p.complexity[est.complexityKey];
  const timelineText = p.timelines[est.timelineKey];
  const timelinePrefLabel = chosenTimeline
    ? optionLabelById("timeline", chosenTimeline)
    : null;
  const priceText = est.needsReview
    ? p.result.needsReview
    : est.priceLow === est.priceHigh
      ? `${p.result.priceFrom} ${fmtNum(est.priceLow, fa)} ${est.currency}`
      : `${fmtNum(est.priceLow, fa)} ${p.result.to} ${fmtNum(est.priceHigh, fa)} ${est.currency}`;

  // Post-launch support — display label (title + badge), description, effect.
  const supportPlan =
    typeof answers.supportPlan === "string" ? answers.supportPlan : "";
  const supportOption = flow
    .find((q) => q.id === "supportPlan")
    ?.options?.find((o) => o.value === supportPlan);
  const supportBadge = supportOption
    ? fa
      ? supportOption.badgeFa
      : supportOption.badgeEn
    : undefined;
  const supportLabel = supportOption
    ? `${tl(supportOption)}${supportBadge ? ` — ${supportBadge}` : ""}`
    : null;
  const supportDesc = supportOption
    ? fa
      ? supportOption.descriptionFa
      : supportOption.descriptionEn
    : null;
  const supportOngoing = supportPlan === "ongoing";
  const serializedAnswers = useMemo(() => JSON.stringify(answers), [answers]);
  const showSuccess = submittedSnapshot !== null;

  /**
   * Build a self-contained, print-ready RTL/LTR HTML pre-invoice from the
   * just-submitted data. We render to HTML (not a PDF lib) so the browser's own
   * text engine shapes Persian correctly; the user saves it as PDF via print.
   */
  function buildInvoiceHtml(): string {
    if (!submittedSnapshot) return "";
    const dir = fa ? "rtl" : "ltr";
    const align = fa ? "right" : "left";
    const pdf = p.pdf;
    const dash = pdf.none;
    const dateText = new Intl.DateTimeFormat(fa ? "fa-IR" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date());
    const { contact, projectTypeLabel, pages, designLabel, featureLabels } =
      submittedSnapshot;
    const pagesText =
      pages != null ? `${fmtNum(pages, fa)} ${p.result.pagesUnit}` : dash;
    const featuresText =
      featureLabels.length > 0 ? featureLabels.join("، ") : p.result.noFeatures;

    const esc = (v: string | null | undefined) =>
      String(v ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");

    const row = (label: string, value: string | null) =>
      value && value !== dash
        ? `<tr><th>${esc(label)}</th><td>${esc(value)}</td></tr>`
        : "";

    const clientRows = [
      row(pdf.name, contact?.name || dash),
      row(pdf.email, contact?.email || null),
      row(pdf.phone, contact?.phone || null),
      row(pdf.company, contact?.company || null),
      row(pdf.contactMethod, contact.methodLabel),
    ].join("");

    const projectRows = [
      row(pdf.projectType, projectTypeLabel),
      row(pdf.designLevel, designLabel),
      row(pdf.pages, pagesText),
      row(pdf.features, featuresText),
      row(pdf.timelinePref, submittedSnapshot.timelinePrefLabel),
      row(pdf.description, contact?.description || null),
    ].join("");

    const estimateRows = [
      row(pdf.complexity, submittedSnapshot.complexityText),
      row(pdf.timeline, submittedSnapshot.timelineText),
      row(pdf.price, submittedSnapshot.priceText),
    ].join("");

    const supportEffects = pdf.supportEffects as Record<string, string>;
    const supportRows = submittedSnapshot.supportValue
      ? [
          row(pdf.supportType, submittedSnapshot.supportValue),
          row(pdf.supportDesc, submittedSnapshot.supportDescription),
          row(
            pdf.supportEffect,
            supportEffects[submittedSnapshot.supportPlan] ?? null,
          ),
        ].join("")
      : "";

    const titleSlug =
      brandName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") ||
      "varmanli";

    return `<!doctype html>
<html lang="${fa ? "fa" : "en"}" dir="${dir}">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>project-estimate-${titleSlug}</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;600;700&display=swap" rel="stylesheet" />
<style>
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; }
  body {
    font-family: 'Vazirmatn', Tahoma, 'Segoe UI', Arial, sans-serif;
    color: #1f2433; background: #fff; direction: ${dir}; text-align: ${align};
    padding: 32px; line-height: 1.7; font-size: 14px;
  }
  .wrap { max-width: 760px; margin: 0 auto; }
  header { display: flex; justify-content: space-between; align-items: flex-start;
    gap: 16px; border-bottom: 2px solid #6d4bd8; padding-bottom: 16px; }
  .brand { font-size: 20px; font-weight: 700; color: #4a2db5; }
  .doc-title { font-size: 18px; font-weight: 700; margin: 0; }
  .doc-sub { color: #5b6070; font-size: 12px; margin-top: 4px; max-width: 360px; }
  .meta { color: #5b6070; font-size: 12px; text-align: ${fa ? "left" : "right"}; }
  section { margin-top: 22px; }
  h2 { font-size: 13px; text-transform: uppercase; letter-spacing: .04em;
    color: #4a2db5; margin: 0 0 8px; }
  table { width: 100%; border-collapse: collapse; }
  th, td { padding: 8px 10px; border: 1px solid #e6e8ef; vertical-align: top; }
  th { width: 34%; background: #f6f5fc; font-weight: 600; color: #2b2f3c;
    text-align: ${align}; }
  td { color: #1f2433; }
  .price td { font-weight: 700; color: #4a2db5; }
  .notes { margin-top: 22px; background: #f8f9fc; border: 1px solid #e6e8ef;
    border-radius: 10px; padding: 14px 16px; }
  .notes p { margin: 0; color: #4a4f60; font-size: 12.5px; }
  .notes .contact-note { margin-top: 10px; color: #2b2f3c; font-weight: 600; }
  footer { margin-top: 24px; border-top: 1px solid #e6e8ef; padding-top: 12px;
    color: #8a90a2; font-size: 11px; text-align: center; }
  @media print { body { padding: 0; } @page { margin: 16mm; } }
</style>
</head>
<body>
  <div class="wrap">
    <header>
      <div>
        <div class="brand">${esc(brandName)}</div>
        <h1 class="doc-title">${esc(pdf.title)}</h1>
        <p class="doc-sub">${esc(pdf.subtitle)}</p>
      </div>
      <div class="meta">${esc(pdf.date)}: ${esc(dateText)}</div>
    </header>

    <section>
      <h2>${esc(pdf.client)}</h2>
      <table>${clientRows}</table>
    </section>

    <section>
      <h2>${esc(pdf.projectSummary)}</h2>
      <table>${projectRows}</table>
    </section>

    <section>
      <h2>${esc(pdf.estimateSummary)}</h2>
      <table class="price">${estimateRows}</table>
    </section>

    ${
      supportRows
        ? `<section>
      <h2>${esc(pdf.support)}</h2>
      <table>${supportRows}</table>
    </section>`
        : ""
    }

    <div class="notes">
      <h2>${esc(pdf.notesTitle)}</h2>
      <p>${esc(pdf.disclaimer)}</p>
      <p class="contact-note">${esc(pdf.contactNote)}</p>
    </div>

    <footer>${esc(brandName)} — ${esc(pdf.title)}</footer>
  </div>
  <script>
    window.addEventListener('load', function () {
      setTimeout(function () { window.focus(); window.print(); }, 350);
    });
  </script>
</body>
</html>`;
  }

  function handleDownloadPdf() {
    if (!submittedSnapshot) return;
    setPdfStatus("loading");
    try {
      const win = window.open("", "_blank", "width=900,height=1000");
      if (!win) {
        setPdfStatus("error");
        return;
      }
      win.document.open();
      win.document.write(buildInvoiceHtml());
      win.document.close();
      setPdfStatus("idle");
    } catch {
      setPdfStatus("error");
    }
  }

  function buildSubmittedSnapshot(formData: FormData): SubmittedSnapshot {
    const contactMethod = String(formData.get("preferredContactMethod") ?? "");
    return {
      contact: {
        name: String(formData.get("name") ?? ""),
        email: String(formData.get("email") ?? ""),
        phone: String(formData.get("phone") ?? ""),
        company: String(formData.get("companyName") ?? ""),
        description: String(formData.get("description") ?? ""),
        methodLabel:
          options.contactMethod.find((m) => m.value === contactMethod)?.label ?? null,
      },
      estimate: est,
      projectType,
      projectTypeLabel,
      pages: pagesValue,
      designLabel,
      featureLabels,
      timelineTight,
      supportValue: supportLabel,
      supportPlan,
      supportOngoing,
      supportDescription: supportDesc ?? null,
      complexityText,
      timelineText,
      timelinePrefLabel,
      priceText,
    };
  }

  // Render the interactive wizard on the client only. The server (and the
  // hydrating render) emit a matching skeleton, so there's no hydration step
  // for this input-heavy widget to mismatch on.
  const mounted = useMounted();
  if (!mounted) {
    return (
      <div
      className="grid gap-6 notranslate lg:grid-cols-[1.6fr_1fr]"
      translate="no"
    >
        <div className="neon-card h-[460px] animate-pulse rounded-3xl" />
        <div className="neon-card h-[220px] animate-pulse rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-5 notranslate" translate="no">
      <section hidden={!showSuccess} aria-hidden={!showSuccess}>
        {submittedSnapshot && (
          <div className="mx-auto max-w-2xl space-y-5">
            <div className="neon-card rounded-3xl p-6 text-center sm:p-8">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success/15 text-2xl text-success">
                <FiCheck />
              </span>
              <h2 className="mt-5 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                {p.success.title}
              </h2>
              <p className="mx-auto mt-2 max-w-xl text-sm leading-7 text-muted">
                {p.success.subtitle}
              </p>
            </div>

            <EstimateCard
              est={submittedSnapshot.estimate}
              settings={settings}
              dict={p}
              fa={fa}
              projectType={submittedSnapshot.projectType}
              projectTypeLabel={submittedSnapshot.projectTypeLabel}
              pages={submittedSnapshot.pages}
              designLabel={submittedSnapshot.designLabel}
              featureLabels={submittedSnapshot.featureLabels}
              timelineTight={submittedSnapshot.timelineTight}
              supportValue={submittedSnapshot.supportValue}
              supportPlan={submittedSnapshot.supportPlan}
              supportOngoing={submittedSnapshot.supportOngoing}
            />

            <p className="text-center text-xs leading-6 text-faint">
              {p.success.note}
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button
                type="button"
                onClick={handleDownloadPdf}
                disabled={pdfStatus === "loading"}
                className="w-full sm:w-auto"
              >
                <FiDownload />
                {pdfStatus === "loading"
                  ? p.success.downloading
                  : p.success.downloadPdf}
              </Button>
              <ButtonLink
                href="/projects"
                variant="outline"
                className="w-full sm:w-auto"
              >
                {p.success.viewProjects}
              </ButtonLink>
              <ButtonLink href="/" variant="ghost" className="w-full sm:w-auto">
                {p.success.backHome}
              </ButtonLink>
            </div>

            {pdfStatus === "error" && (
              <p role="alert" className="text-center text-xs text-red-300">
                {p.success.downloadError}
              </p>
            )}
          </div>
        )}
      </section>

      <section hidden={showSuccess} aria-hidden={showSuccess}>
        <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <form onSubmit={handleSubmit} className="neon-card rounded-3xl p-6 sm:p-8">
        {/* honeypot + serialized payload */}
        <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
        <input type="hidden" name="locale" value={locale} />
        <input type="hidden" name="projectType" value={projectType} />
        <input type="hidden" name="answers" value={serializedAnswers} />

        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs text-faint">
            <span>
              {p.ui.step} {fmtNum(step + 1, fa)} {p.ui.of} {fmtNum(totalSteps, fa)}
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
          {onTypeStep
            ? p.ui.typeHelper
            : question?.type === "single"
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
            <PageCountField
              value={
                typeof answers[question.id] === "number"
                  ? (answers[question.id] as number)
                  : (question.default ?? question.min ?? 1)
              }
              min={question.min ?? 1}
              max={question.max ?? 50}
              presets={p.pages.presets}
              helper={p.pages.helper}
              maxNote={p.pages.maxNote}
              fa={fa}
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

        {error && (
          <p role="alert" className="mt-4 rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-300">
            {error}
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
            <Button
              type="submit"
              disabled={isSubmitting || showSuccess}
            >
              <FiSend />{" "}
              {isSubmitting || showSuccess
                ? p.ui.submitting
                : p.ui.submit}
            </Button>
          ) : (
            <Button
              type="button"
              disabled={!canNext}
              onClick={() =>
                canNext && setStep((s) => Math.min(totalSteps - 1, s + 1))
              }
            >
              {p.ui.next} <FiArrowRight className="rtl:rotate-180" />
            </Button>
          )}
        </div>
      </form>

      {/* Aside: live estimate + recommendation */}
      <aside className="space-y-4 max-lg:order-last">
        <EstimateCard
          est={est}
          settings={settings}
          dict={p}
          fa={fa}
          projectType={projectType}
          projectTypeLabel={projectTypeLabel}
          pages={pagesValue}
          designLabel={designLabel}
          featureLabels={featureLabels}
          timelineTight={timelineTight}
          supportValue={supportLabel}
          supportPlan={supportPlan}
          supportOngoing={supportOngoing}
        />
      </aside>
        </div>
      </section>
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
            aria-pressed={active}
            onClick={() => onPick(o.value)}
            className={cn(
              "group flex items-center gap-3 rounded-2xl border p-3.5 text-start transition-all duration-200",
              o.description ? "items-start" : "items-center",
              active
                ? "border-primary/55 bg-primary/10 shadow-[0_12px_32px_-14px_rgba(79,124,255,0.55)]"
                : "border-border bg-background/40 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/5 hover:shadow-[0_12px_32px_-18px_rgba(79,124,255,0.4)]",
            )}
          >
            <span
              className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border text-lg transition-colors",
                active
                  ? "border-primary/40 bg-primary/15 text-primary-light"
                  : "border-border bg-surface-2/60 text-muted group-hover:border-primary/30 group-hover:text-primary-light",
              )}
            >
              {plannerIcon(o.icon)}
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="break-words text-sm font-medium leading-snug text-foreground">
                  {o.label}
                </span>
                {o.badge && (
                  <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[0.65rem] font-semibold text-primary-light">
                    {o.badge}
                  </span>
                )}
              </span>
              {o.description && (
                <span className="mt-0.5 block text-xs leading-relaxed text-faint">{o.description}</span>
              )}
              {o.items && o.items.length > 0 && (
                <ul className="mt-2 grid gap-1">
                  {o.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-1.5 text-xs text-muted"
                    >
                      <FiCheck className="shrink-0 text-primary-light/70" />
                      <span className="min-w-0 break-words leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </span>
            <FiCheck
              className={cn(
                "shrink-0 transition-opacity",
                active ? "text-primary-light opacity-100" : "opacity-0",
              )}
            />
            {multi && <span className="sr-only">{active ? "selected" : ""}</span>}
          </button>
        );
      })}
    </div>
  );
}

/** Representative page count each preset chip selects. */
const PAGE_PRESET_VALUES = [3, 7, 12, 20, 25];

function PageCountField({
  value,
  min,
  max,
  presets,
  helper,
  maxNote,
  fa,
  onChange,
}: {
  value: number;
  min: number;
  max: number;
  presets: string[];
  helper: string;
  maxNote: string;
  fa: boolean;
  onChange: (n: number) => void;
}) {
  const clamp = (n: number) => Math.min(max, Math.max(min, n));
  return (
    <div className="space-y-4">
      <p className="text-sm leading-relaxed text-faint">{helper}</p>

      <div className="flex flex-wrap gap-2">
        {presets.map((label, i) => {
          const presetValue = PAGE_PRESET_VALUES[i] ?? min;
          const active = value === presetValue;
          return (
            <button
              key={label}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(clamp(presetValue))}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all",
                active
                  ? "border-primary/55 bg-primary/15 text-primary-light"
                  : "border-border bg-surface-2/50 text-muted hover:border-primary/40 hover:text-foreground",
              )}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div className="inline-flex items-center gap-2 rounded-2xl border border-border bg-background/40 p-2">
        <button
          type="button"
          aria-label="-"
          onClick={() => onChange(clamp(value - 1))}
          disabled={value <= min}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-border text-muted transition-colors hover:border-primary/40 hover:text-foreground disabled:opacity-40"
        >
          <FiMinus />
        </button>
        <input
          type="number"
          inputMode="numeric"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(clamp(Number(e.target.value) || min))}
          className="field-control w-20 text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          dir="ltr"
        />
        <button
          type="button"
          aria-label="+"
          onClick={() => onChange(clamp(value + 1))}
          disabled={value >= max}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-border text-muted transition-colors hover:border-primary/40 hover:text-foreground disabled:opacity-40"
        >
          <FiPlus />
        </button>
      </div>

      {value > 20 && (
        <p className="rounded-xl border border-amber-400/30 bg-amber-400/10 p-3 text-xs leading-relaxed text-amber-200/90">
          {maxNote}
        </p>
      )}
      <span className="sr-only">{fmtNum(value, fa)}</span>
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
  settings,
  dict: p,
  fa,
  projectType,
  projectTypeLabel,
  pages,
  designLabel,
  featureLabels,
  timelineTight,
  supportValue,
  supportPlan,
  supportOngoing,
}: {
  est: ReturnType<typeof calculateProjectEstimate>;
  settings: EstimateSettingsLite;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dict: any;
  fa: boolean;
  projectType: string;
  projectTypeLabel: string | null;
  pages: number | null;
  designLabel: string | null;
  featureLabels: string[];
  timelineTight: boolean;
  supportValue: string | null;
  supportPlan: string;
  supportOngoing: boolean;
}) {
  const showPrice = settings.isEstimateEnabled && settings.showPriceToUser;
  const showEstimate = settings.isEstimateEnabled;
  // Until a project type is chosen, the estimate is meaningless — show a
  // neutral zero/empty state instead of a phantom minimum price.
  const hasType = Boolean(projectType);
  const dash = p.ui.none;

  const complexityValue = est.needsReview
    ? p.result.needsReview
    : p.complexity[est.complexityKey];

  const priceValue = !hasType
    ? `${fmtNum(0, fa)} ${est.currency}`
    : est.needsReview
      ? p.result.needsReview
      : est.priceLow === est.priceHigh
        ? `${p.result.priceFrom} ${fmtNum(est.priceLow, fa)} ${est.currency}`
        : `${fmtNum(est.priceLow, fa)} ${p.result.to} ${fmtNum(est.priceHigh, fa)} ${est.currency}`;

  return (
    <div className="neon-card rounded-2xl p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-foreground">{p.result.title}</h3>
          {hasType && (
            <p className="mt-0.5 text-[0.7rem] leading-relaxed text-faint">
              {p.result.basis}
            </p>
          )}
        </div>
        <span className="shrink-0 rounded-full border border-border bg-surface-2/50 px-2.5 py-0.5 text-[0.7rem] font-medium text-primary-light">
          {p.result.previewBadge}
        </span>
      </div>

      {!hasType && (
        <p className="mt-3 text-xs leading-relaxed text-faint">
          {p.result.empty}
        </p>
      )}

      <div className="mt-4 space-y-2">
        <SummaryRow
          label={p.result.projectType}
          value={hasType ? (projectTypeLabel ?? dash) : p.result.notSelected}
          accent={hasType}
        />
        <SummaryRow
          label={p.result.complexity}
          value={hasType ? complexityValue : dash}
        />
        {hasType && pages != null && (
          <SummaryRow
            label={p.result.pagesLabel}
            value={`${fmtNum(pages, fa)} ${p.result.pagesUnit}`}
          />
        )}
        {showEstimate && (
          <SummaryRow
            label={p.result.duration}
            value={hasType ? p.timelines[est.timelineKey] : dash}
          />
        )}
        {showPrice && (
          <SummaryRow label={p.result.price} value={priceValue} accent />
        )}
        {hasType && (
          <SummaryRow
            label={p.result.featuresLabel}
            value={
              featureLabels.length > 0
                ? featureLabels.join("، ")
                : p.result.noFeatures
            }
          />
        )}
        {hasType && (
          <SummaryRow
            label={p.result.supportLabel}
            value={supportValue ?? p.result.notSelected}
          />
        )}
      </div>

      {hasType && timelineTight && (
        <p className="mt-3 rounded-xl border border-amber-400/30 bg-amber-400/10 p-3 text-xs leading-relaxed text-amber-200/90">
          {p.result.urgencyWarning}
        </p>
      )}

      {hasType && supportOngoing && (
        <p className="mt-3 text-xs leading-relaxed text-faint">
          {p.result.supportOngoingNote}
        </p>
      )}

      {hasType && showEstimate && (
        <details className="mt-3 border-t border-border pt-3">
          <summary className="cursor-pointer text-xs font-medium text-primary-light">
            {p.result.calcTitle}
          </summary>
          <ul className="mt-2 space-y-1.5 text-xs text-muted">
            <li>
              {p.result.projectType}: {projectTypeLabel ?? dash}
            </li>
            {pages != null && (
              <li>
                {p.result.pagesLabel}: {fmtNum(pages, fa)} {p.result.pagesUnit}
              </li>
            )}
            {designLabel && (
              <li>
                {p.result.designLabel}: {designLabel}
              </li>
            )}
            {featureLabels.length > 0 && (
              <li>
                {p.result.featuresLabel}: {featureLabels.join("، ")}
              </li>
            )}
            {supportValue && supportPlan && supportPlan !== "none" && (
              <li>
                {p.result.supportDetailPrefix}: {supportValue}
              </li>
            )}
          </ul>
        </details>
      )}

      <p className="mt-3 text-[0.7rem] leading-relaxed text-faint">{p.result.priceNote}</p>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background/35 px-3.5 py-2.5">
      <span className="shrink-0 text-xs text-faint">{label}</span>
      <span
        className={cn(
          "min-w-0 break-words text-end text-sm font-semibold leading-snug",
          accent ? "text-primary-light" : "text-foreground",
        )}
      >
        {value}
      </span>
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
