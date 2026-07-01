"use client";

import { useActionState, useState } from "react";
import {
  FiGlobe,
  FiInfo,
  FiLayers,
  FiMail,
  FiMessageSquare,
  FiPlus,
  FiShare2,
  FiTrash2,
} from "react-icons/fi";
import { Tabs } from "@/components/admin/ui/Tabs";
import {
  FieldError,
  FieldHint,
  FormError,
  FormSection,
  SubmitButton,
  TextInput,
} from "@/components/admin/forms/fields";
import { updateContactPageContent } from "@/lib/actions/contact-page";
import { useI18n } from "@/lib/i18n/context";
import { type ActionState, initialActionState } from "@/lib/form";
import type {
  ContactInfoItem,
  ContactPageContent,
  ContactProcessStep,
  ContactSettings,
} from "@/types";

type LocaleKey = "fa" | "en";

const labels = {
  fa: {
    localeHint:
      "هر زبان می‌تواند نسخه مستقل خودش را داشته باشد. اگر یکی خالی بماند، صفحه از زبان دیگر fallback می‌گیرد.",
    hero: "هیرو تماس",
    infoCard: "کارت اطلاعات و CTA",
    process: "فرآیند پاسخ",
    cta: "CTA پایانی",
    badge: "Badge",
    title: "عنوان",
    subtitle: "زیرعنوان",
    supportingText: "متن پشتیبان",
    itemTitle: "عنوان آیتم",
    description: "توضیح",
    icon: "کلید آیکن",
    order: "ترتیب",
    primaryLabel: "متن CTA اصلی",
    primaryHref: "لینک CTA اصلی",
    secondaryLabel: "متن CTA دوم",
    secondaryHref: "لینک CTA دوم",
    addItem: "افزودن آیتم",
    addStep: "افزودن مرحله",
    iconHint:
      "اختیاری. نمونه: clock, briefcase, message, send, search, help, zap",
  },
  en: {
    localeHint:
      "Each language can have its own version. Leaving one blank lets the public page fall back to the other locale.",
    hero: "Contact hero",
    infoCard: "Info card & CTA",
    process: "Response process",
    cta: "Final CTA",
    badge: "Badge",
    title: "Title",
    subtitle: "Subtitle",
    supportingText: "Supporting text",
    itemTitle: "Item title",
    description: "Description",
    icon: "Icon key",
    order: "Order",
    primaryLabel: "Primary CTA label",
    primaryHref: "Primary CTA href",
    secondaryLabel: "Secondary CTA label",
    secondaryHref: "Secondary CTA href",
    addItem: "Add item",
    addStep: "Add step",
    iconHint:
      "Optional. Examples: clock, briefcase, message, send, search, help, zap",
  },
} as const;

function updateAt<T>(items: T[], index: number, next: T): T[] {
  return items.map((item, i) => (i === index ? next : item));
}

function removeAt<T>(items: T[], index: number): T[] {
  return items.filter((_, i) => i !== index);
}

function IconActionButton({
  onClick,
  label,
}: {
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-red-500/20 text-red-400 transition-colors hover:border-red-500/40 hover:bg-red-500/10"
      aria-label={label}
    >
      <FiTrash2 />
    </button>
  );
}

function AddButton({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-xl border border-dashed border-border-strong bg-background/30 px-3.5 py-2 text-sm font-medium text-muted transition-all hover:border-primary/50 hover:bg-primary/5 hover:text-primary-light"
    >
      <FiPlus /> {children}
    </button>
  );
}

function ManagedInput({
  label,
  value,
  onChange,
  dir,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string | undefined;
  onChange: (value: string) => void;
  dir?: "rtl" | "ltr";
  type?: string;
  placeholder?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[0.8125rem] font-semibold tracking-tight text-foreground/90">
        {label}
      </label>
      <input
        type={type}
        dir={dir}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="field-control"
      />
    </div>
  );
}

function ManagedTextArea({
  label,
  value,
  onChange,
  dir,
  rows = 3,
  hint,
}: {
  label: string;
  value: string | undefined;
  onChange: (value: string) => void;
  dir?: "rtl" | "ltr";
  rows?: number;
  hint?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[0.8125rem] font-semibold tracking-tight text-foreground/90">
        {label}
      </label>
      <textarea
        dir={dir}
        rows={rows}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="field-control resize-y leading-relaxed"
      />
      {hint && <FieldHint>{hint}</FieldHint>}
    </div>
  );
}

function CtaFields({
  value,
  onChange,
  dir,
  localeKey,
}: {
  value: {
    primaryCta: { label: string; href: string };
    secondaryCta: { label: string; href: string };
  };
  onChange: (next: typeof value) => void;
  dir: "rtl" | "ltr";
  localeKey: LocaleKey;
}) {
  const l = labels[localeKey];
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <ManagedInput
        label={l.primaryLabel}
        value={value.primaryCta.label}
        onChange={(label) =>
          onChange({
            ...value,
            primaryCta: { ...value.primaryCta, label },
          })
        }
        dir={dir}
      />
      <ManagedInput
        label={l.primaryHref}
        value={value.primaryCta.href}
        onChange={(href) =>
          onChange({
            ...value,
            primaryCta: { ...value.primaryCta, href },
          })
        }
        dir="ltr"
      />
      <ManagedInput
        label={l.secondaryLabel}
        value={value.secondaryCta.label}
        onChange={(label) =>
          onChange({
            ...value,
            secondaryCta: { ...value.secondaryCta, label },
          })
        }
        dir={dir}
      />
      <ManagedInput
        label={l.secondaryHref}
        value={value.secondaryCta.href}
        onChange={(href) =>
          onChange({
            ...value,
            secondaryCta: { ...value.secondaryCta, href },
          })
        }
        dir="ltr"
      />
    </div>
  );
}

function InfoItemsEditor({
  items,
  onChange,
  dir,
  localeKey,
}: {
  items: ContactInfoItem[];
  onChange: (items: ContactInfoItem[]) => void;
  dir: "rtl" | "ltr";
  localeKey: LocaleKey;
}) {
  const l = labels[localeKey];
  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div
          key={index}
          className="space-y-3 rounded-2xl border border-border bg-background/35 p-4"
        >
          <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)_120px_auto]">
            <ManagedInput
              label={l.itemTitle}
              value={item.title}
              onChange={(title) =>
                onChange(updateAt(items, index, { ...item, title }))
              }
              dir={dir}
            />
            <ManagedInput
              label={l.icon}
              value={item.icon}
              onChange={(icon) =>
                onChange(updateAt(items, index, { ...item, icon }))
              }
              dir="ltr"
              placeholder="clock"
            />
            <ManagedInput
              label={l.order}
              value={String(item.order)}
              type="number"
              onChange={(order) =>
                onChange(
                  updateAt(items, index, {
                    ...item,
                    order: Number(order) || 0,
                  }),
                )
              }
              dir="ltr"
            />
            <div className="pt-6 md:pt-7">
              <IconActionButton
                onClick={() => onChange(removeAt(items, index))}
                label="remove item"
              />
            </div>
          </div>
          <ManagedTextArea
            label={l.description}
            value={item.description}
            onChange={(description) =>
              onChange(updateAt(items, index, { ...item, description }))
            }
            dir={dir}
            rows={3}
            hint={l.iconHint}
          />
        </div>
      ))}
      <AddButton
        onClick={() =>
          onChange([
            ...items,
            { title: "", description: "", icon: "", order: items.length },
          ])
        }
      >
        {l.addItem}
      </AddButton>
    </div>
  );
}

function ProcessStepsEditor({
  items,
  onChange,
  dir,
  localeKey,
}: {
  items: ContactProcessStep[];
  onChange: (items: ContactProcessStep[]) => void;
  dir: "rtl" | "ltr";
  localeKey: LocaleKey;
}) {
  const l = labels[localeKey];
  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div
          key={index}
          className="space-y-3 rounded-2xl border border-border bg-background/35 p-4"
        >
          <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)_120px_auto]">
            <ManagedInput
              label={l.itemTitle}
              value={item.title}
              onChange={(title) =>
                onChange(updateAt(items, index, { ...item, title }))
              }
              dir={dir}
            />
            <ManagedInput
              label={l.icon}
              value={item.icon}
              onChange={(icon) =>
                onChange(updateAt(items, index, { ...item, icon }))
              }
              dir="ltr"
              placeholder="search"
            />
            <ManagedInput
              label={l.order}
              value={String(item.order)}
              type="number"
              onChange={(order) =>
                onChange(
                  updateAt(items, index, {
                    ...item,
                    order: Number(order) || 0,
                  }),
                )
              }
              dir="ltr"
            />
            <div className="pt-6 md:pt-7">
              <IconActionButton
                onClick={() => onChange(removeAt(items, index))}
                label="remove step"
              />
            </div>
          </div>
          <ManagedTextArea
            label={l.description}
            value={item.description}
            onChange={(description) =>
              onChange(updateAt(items, index, { ...item, description }))
            }
            dir={dir}
            rows={3}
            hint={l.iconHint}
          />
        </div>
      ))}
      <AddButton
        onClick={() =>
          onChange([
            ...items,
            { title: "", description: "", icon: "", order: items.length },
          ])
        }
      >
        {l.addStep}
      </AddButton>
    </div>
  );
}

function LocaleEditor({
  localeKey,
  value,
  onChange,
}: {
  localeKey: LocaleKey;
  value: ContactPageContent;
  onChange: (value: ContactPageContent) => void;
}) {
  const l = labels[localeKey];
  const dir = localeKey === "fa" ? "rtl" : "ltr";

  return (
    <div className="space-y-5" dir={dir}>
      <FieldHint>{l.localeHint}</FieldHint>

      <FormSection
        title={l.hero}
        description={localeKey === "fa" ? "محتوای هیرو صفحه تماس" : "Top hero content for the Contact page"}
        icon={<FiMail />}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <ManagedInput
            label={l.badge}
            value={value.hero.badge}
            onChange={(badge) =>
              onChange({ ...value, hero: { ...value.hero, badge } })
            }
            dir={dir}
          />
          <ManagedInput
            label={l.title}
            value={value.hero.title}
            onChange={(title) =>
              onChange({ ...value, hero: { ...value.hero, title } })
            }
            dir={dir}
          />
          <div className="md:col-span-2">
            <ManagedTextArea
              label={l.subtitle}
              value={value.hero.subtitle}
              onChange={(subtitle) =>
                onChange({ ...value, hero: { ...value.hero, subtitle } })
              }
              dir={dir}
              rows={3}
            />
          </div>
          <div className="md:col-span-2">
            <ManagedTextArea
              label={l.supportingText}
              value={value.hero.supportingText}
              onChange={(supportingText) =>
                onChange({
                  ...value,
                  hero: { ...value.hero, supportingText },
                })
              }
              dir={dir}
              rows={3}
            />
          </div>
        </div>
      </FormSection>

      <FormSection title={l.infoCard} icon={<FiInfo />}>
        <div className="grid gap-4">
          <ManagedInput
            label={l.title}
            value={value.infoCard.title}
            onChange={(title) =>
              onChange({ ...value, infoCard: { ...value.infoCard, title } })
            }
            dir={dir}
          />
          <InfoItemsEditor
            items={value.infoCard.items}
            onChange={(items) =>
              onChange({ ...value, infoCard: { ...value.infoCard, items } })
            }
            dir={dir}
            localeKey={localeKey}
          />
          <CtaFields
            value={value.infoCard}
            onChange={(next) =>
              onChange({ ...value, infoCard: { ...value.infoCard, ...next } })
            }
            dir={dir}
            localeKey={localeKey}
          />
        </div>
      </FormSection>

      <FormSection title={l.process} icon={<FiLayers />}>
        <div className="grid gap-4 md:grid-cols-2">
          <ManagedInput
            label={l.badge}
            value={value.processSection.badge}
            onChange={(badge) =>
              onChange({
                ...value,
                processSection: { ...value.processSection, badge },
              })
            }
            dir={dir}
          />
          <ManagedInput
            label={l.title}
            value={value.processSection.title}
            onChange={(title) =>
              onChange({
                ...value,
                processSection: { ...value.processSection, title },
              })
            }
            dir={dir}
          />
          <div className="md:col-span-2">
            <ManagedTextArea
              label={l.subtitle}
              value={value.processSection.subtitle}
              onChange={(subtitle) =>
                onChange({
                  ...value,
                  processSection: { ...value.processSection, subtitle },
                })
              }
              dir={dir}
              rows={3}
            />
          </div>
          <div className="md:col-span-2">
            <ProcessStepsEditor
              items={value.processSection.steps}
              onChange={(steps) =>
                onChange({
                  ...value,
                  processSection: { ...value.processSection, steps },
                })
              }
              dir={dir}
              localeKey={localeKey}
            />
          </div>
        </div>
      </FormSection>

      <FormSection title={l.cta} icon={<FiMessageSquare />}>
        <div className="grid gap-4">
          <ManagedInput
            label={l.title}
            value={value.cta.title}
            onChange={(title) =>
              onChange({ ...value, cta: { ...value.cta, title } })
            }
            dir={dir}
          />
          <ManagedTextArea
            label={l.subtitle}
            value={value.cta.subtitle}
            onChange={(subtitle) =>
              onChange({ ...value, cta: { ...value.cta, subtitle } })
            }
            dir={dir}
            rows={3}
          />
          <CtaFields
            value={value.cta}
            onChange={(next) =>
              onChange({ ...value, cta: { ...value.cta, ...next } })
            }
            dir={dir}
            localeKey={localeKey}
          />
        </div>
      </FormSection>
    </div>
  );
}

export function ContactContentForm({
  initialFa,
  initialEn,
  shared,
  hasSettings,
}: {
  initialFa: ContactPageContent;
  initialEn: ContactPageContent;
  shared: { email: string; contactSettings: ContactSettings | null };
  hasSettings: boolean;
}) {
  const { dict } = useI18n();
  const [state, formAction] = useActionState(
    updateContactPageContent as (
      prev: ActionState,
      form: FormData,
    ) => Promise<ActionState>,
    initialActionState,
  );
  const [faContent, setFaContent] = useState(initialFa);
  const [enContent, setEnContent] = useState(initialEn);
  const t = dict.admin.contact;

  return (
    <form action={formAction} className="space-y-5">
      <FormError message={state.error} />
      {!hasSettings && (
        <p className="flex items-start gap-2.5 rounded-2xl border border-primary/30 bg-primary/10 p-3.5 text-sm text-primary-light">
          <span aria-hidden className="mt-0.5">ℹ</span>
          <span className="leading-relaxed">{t.noticeFirst}</span>
        </p>
      )}

      <input
        type="hidden"
        name="contactPageContentFa"
        value={JSON.stringify(faContent)}
      />
      <input
        type="hidden"
        name="contactPageContentEn"
        value={JSON.stringify(enContent)}
      />

      <FormSection
        title={t.sharedTitle}
        description={t.sharedDescription}
        icon={<FiShare2 />}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <TextInput
            name="email"
            label={dict.admin.forms.email}
            type="email"
            dir="ltr"
            defaultValue={shared.email}
            placeholder="hello@example.com"
          />
          <TextInput
            name="contactPhone"
            label={dict.admin.requests.detail.phone}
            dir="ltr"
            defaultValue={shared.contactSettings?.phone ?? ""}
            placeholder="+98..."
          />
          <TextInput
            name="contactTelegram"
            label="Telegram"
            dir="ltr"
            defaultValue={shared.contactSettings?.telegram ?? ""}
            placeholder="@username or https://t.me/..."
          />
          <TextInput
            name="contactWhatsapp"
            label="WhatsApp"
            dir="ltr"
            defaultValue={shared.contactSettings?.whatsapp ?? ""}
            placeholder="+989..."
          />
          <TextInput
            name="contactGithub"
            label="GitHub"
            dir="ltr"
            defaultValue={shared.contactSettings?.github ?? ""}
            placeholder="https://github.com/..."
          />
          <TextInput
            name="contactLinkedin"
            label="LinkedIn"
            dir="ltr"
            defaultValue={shared.contactSettings?.linkedin ?? ""}
            placeholder="https://linkedin.com/in/..."
          />
          <TextInput
            name="contactInstagram"
            label="Instagram"
            dir="ltr"
            defaultValue={shared.contactSettings?.instagram ?? ""}
            placeholder="https://instagram.com/..."
          />
          <TextInput
            name="contactTwitter"
            label="X / Twitter"
            dir="ltr"
            defaultValue={shared.contactSettings?.twitter ?? ""}
            placeholder="https://x.com/..."
          />
          <TextInput
            name="contactDribbble"
            label="Dribbble"
            dir="ltr"
            defaultValue={shared.contactSettings?.dribbble ?? ""}
            placeholder="https://dribbble.com/..."
          />
          <TextInput
            name="contactBehance"
            label="Behance"
            dir="ltr"
            defaultValue={shared.contactSettings?.behance ?? ""}
            placeholder="https://behance.net/..."
          />
        </div>
      </FormSection>

      <FormSection
        title={t.contentTitle}
        description={t.contentDescription}
        icon={<FiGlobe />}
      >
        <Tabs
          items={[
            {
              id: "fa",
              label: dict.admin.forms.persian,
              content: (
                <LocaleEditor
                  localeKey="fa"
                  value={faContent}
                  onChange={setFaContent}
                />
              ),
            },
            {
              id: "en",
              label: dict.admin.forms.english,
              content: (
                <LocaleEditor
                  localeKey="en"
                  value={enContent}
                  onChange={setEnContent}
                />
              ),
            },
          ]}
        />
      </FormSection>

      {state.fieldErrors?.contactPageContentFa && (
        <FieldError>{state.fieldErrors.contactPageContentFa}</FieldError>
      )}
      {state.fieldErrors?.contactPageContentEn && (
        <FieldError>{state.fieldErrors.contactPageContentEn}</FieldError>
      )}

      <div className="flex flex-wrap items-center gap-3 border-t border-border pt-5">
        <SubmitButton>{t.save}</SubmitButton>
      </div>
    </form>
  );
}
