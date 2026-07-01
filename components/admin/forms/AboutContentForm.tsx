"use client";

import { useActionState, useState } from "react";
import {
  FiActivity,
  FiBriefcase,
  FiCode,
  FiHelpCircle,
  FiImage,
  FiLayers,
  FiPlus,
  FiTarget,
  FiTrash2,
} from "react-icons/fi";
import { FileUploadField } from "@/components/admin/forms/FileUploadField";
import { StringListField } from "@/components/admin/forms/StringListField";
import { TechnologyPicker } from "@/components/admin/forms/TechnologyPicker";
import { Tabs } from "@/components/admin/ui/Tabs";
import {
  FieldError,
  FieldHint,
  FieldLabel,
  FormError,
  FormSection,
  SubmitButton,
} from "@/components/admin/forms/fields";
import { useI18n } from "@/lib/i18n/context";
import { updateAboutPageContent } from "@/lib/actions/about-page";
import { type ActionState, initialActionState } from "@/lib/form";
import type {
  AboutCardItem,
  AboutExperienceItem,
  AboutPageContent,
  AboutStatItem,
  AboutTechnologyGroup,
} from "@/types";

type LocaleKey = "fa" | "en";

const labels = {
  fa: {
    hero: "هیرو درباره",
    stats: "آمارها",
    experience: "تجربه‌ها",
    technologies: "تکنولوژی‌ها",
    philosophy: "نگاه کاری",
    help: "خدمات و همکاری",
    cta: "CTA پایانی",
    badge: "Badge",
    name: "نام کامل",
    headline: "تیتر جداگانه",
    subtitle: "زیرعنوان",
    description: "توضیح",
    imageUrl: "آدرس تصویر پرتره",
    statusBadge: "Badge وضعیت",
    chips: "چیپ‌ها",
    primaryLabel: "متن CTA اصلی",
    primaryHref: "لینک CTA اصلی",
    secondaryLabel: "متن CTA دوم",
    secondaryHref: "لینک CTA دوم",
    value: "مقدار",
    itemLabel: "عنوان",
    itemDescription: "توضیح",
    order: "ترتیب",
    dateRange: "بازه زمانی",
    title: "عنوان",
    role: "Context / role",
    tags: "تگ‌ها",
    technologiesList: "تکنولوژی‌ها",
    icon: "کلید آیکن",
    addStat: "افزودن آمار",
    addExperience: "افزودن تجربه",
    addGroup: "افزودن گروه",
    addCard: "افزودن کارت",
    listHint: "هر مورد را در خط جدا یا با کاما وارد کنید.",
    iconHint:
      "اختیاری. نمونه: code, message, target, shield, monitor, layers, server, trending",
    localeHint:
      "هر زبان می‌تواند نسخه مستقل خودش را داشته باشد. اگر یکی را خالی بگذاری، صفحه از زبان دیگر fallback می‌گیرد.",
    sectionBadge: "Badge بخش",
    sectionTitle: "عنوان بخش",
    sectionSubtitle: "زیرعنوان بخش",
  },
  en: {
    hero: "About hero",
    stats: "Stats",
    experience: "Experience",
    technologies: "Technologies",
    philosophy: "Work philosophy",
    help: "Services & help",
    cta: "Final CTA",
    badge: "Badge",
    name: "Full name",
    headline: "Separate headline",
    subtitle: "Subtitle",
    description: "Description",
    imageUrl: "Portrait image URL",
    statusBadge: "Status badge",
    chips: "Floating chips",
    primaryLabel: "Primary CTA label",
    primaryHref: "Primary CTA href",
    secondaryLabel: "Secondary CTA label",
    secondaryHref: "Secondary CTA href",
    value: "Value",
    itemLabel: "Label",
    itemDescription: "Description",
    order: "Order",
    dateRange: "Date range",
    title: "Title",
    role: "Context / role",
    tags: "Tags",
    technologiesList: "Technologies",
    icon: "Icon key",
    addStat: "Add stat",
    addExperience: "Add experience",
    addGroup: "Add group",
    addCard: "Add card",
    listHint: "Enter one item per line or separate with commas.",
    iconHint:
      "Optional. Examples: code, message, target, shield, monitor, layers, server, trending",
    localeHint:
      "Each language can have its own version. Leaving one blank lets the public page fall back to the other locale.",
    sectionBadge: "Section badge",
    sectionTitle: "Section title",
    sectionSubtitle: "Section subtitle",
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
      <FieldLabel>{label}</FieldLabel>
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
      <FieldLabel>{label}</FieldLabel>
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

function SectionHeadingFields({
  content,
  onChange,
  dir,
  localeKey,
}: {
  content: { badge: string; title: string; subtitle: string };
  onChange: (next: { badge: string; title: string; subtitle: string }) => void;
  dir: "rtl" | "ltr";
  localeKey: LocaleKey;
}) {
  const l = labels[localeKey];
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <ManagedInput
        label={l.sectionBadge}
        value={content.badge}
        onChange={(badge) => onChange({ ...content, badge })}
        dir={dir}
      />
      <ManagedInput
        label={l.sectionTitle}
        value={content.title}
        onChange={(title) => onChange({ ...content, title })}
        dir={dir}
      />
      <div className="md:col-span-2">
        <ManagedTextArea
          label={l.sectionSubtitle}
          value={content.subtitle}
          onChange={(subtitle) => onChange({ ...content, subtitle })}
          dir={dir}
          rows={3}
        />
      </div>
    </div>
  );
}

function StatsEditor({
  items,
  onChange,
  dir,
  localeKey,
}: {
  items: AboutStatItem[];
  onChange: (items: AboutStatItem[]) => void;
  dir: "rtl" | "ltr";
  localeKey: LocaleKey;
}) {
  const l = labels[localeKey];
  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div
          key={index}
          className="grid gap-3 rounded-2xl border border-border bg-background/35 p-4 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)_minmax(0,1.2fr)_90px_auto]"
        >
          <ManagedInput
            label={l.value}
            value={item.value}
            onChange={(value) =>
              onChange(updateAt(items, index, { ...item, value }))
            }
            dir={dir}
          />
          <ManagedInput
            label={l.itemLabel}
            value={item.label}
            onChange={(label) =>
              onChange(updateAt(items, index, { ...item, label }))
            }
            dir={dir}
          />
          <ManagedInput
            label={l.itemDescription}
            value={item.description}
            onChange={(description) =>
              onChange(updateAt(items, index, { ...item, description }))
            }
            dir={dir}
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
              label="remove stat"
            />
          </div>
        </div>
      ))}
      <AddButton
        onClick={() =>
          onChange([
            ...items,
            { label: "", value: "", description: "", order: items.length },
          ])
        }
      >
        {l.addStat}
      </AddButton>
    </div>
  );
}

function ExperienceEditor({
  items,
  onChange,
  dir,
  localeKey,
}: {
  items: AboutExperienceItem[];
  onChange: (items: AboutExperienceItem[]) => void;
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
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)_minmax(0,1fr)_90px_auto]">
            <ManagedInput
              label={l.dateRange}
              value={item.dateRange}
              onChange={(dateRange) =>
                onChange(updateAt(items, index, { ...item, dateRange }))
              }
              dir={dir}
            />
            <ManagedInput
              label={l.title}
              value={item.title}
              onChange={(title) =>
                onChange(updateAt(items, index, { ...item, title }))
              }
              dir={dir}
            />
            <ManagedInput
              label={l.role}
              value={item.role}
              onChange={(role) =>
                onChange(updateAt(items, index, { ...item, role }))
              }
              dir={dir}
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
                label="remove experience"
              />
            </div>
          </div>
          <ManagedTextArea
            label={l.itemDescription}
            value={item.description}
            onChange={(description) =>
              onChange(updateAt(items, index, { ...item, description }))
            }
            dir={dir}
            rows={3}
          />
          <StringListField
            name={`about-${localeKey}-experience-tags-${index}`}
            label={l.tags}
            value={item.tags}
            onChange={(tags) =>
              onChange(updateAt(items, index, { ...item, tags }))
            }
            dir={dir}
            hint={l.listHint}
            addLabel={l.tags}
          />
        </div>
      ))}
      <AddButton
        onClick={() =>
          onChange([
            ...items,
            {
              dateRange: "",
              title: "",
              role: "",
              description: "",
              tags: [],
              order: items.length,
            },
          ])
        }
      >
        {l.addExperience}
      </AddButton>
    </div>
  );
}

function TechnologyGroupsEditor({
  items,
  onChange,
  dir,
  localeKey,
}: {
  items: AboutTechnologyGroup[];
  onChange: (items: AboutTechnologyGroup[]) => void;
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
          <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_120px_auto]">
            <ManagedInput
              label={l.title}
              value={item.title}
              onChange={(title) =>
                onChange(updateAt(items, index, { ...item, title }))
              }
              dir={dir}
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
                label="remove group"
              />
            </div>
          </div>
          <ManagedTextArea
            label={l.itemDescription}
            value={item.description}
            onChange={(description) =>
              onChange(updateAt(items, index, { ...item, description }))
            }
            dir={dir}
            rows={3}
          />
          <TechnologyPicker
            name={`about-${localeKey}-technologies-${index}`}
            label={l.technologiesList}
            value={item.technologies}
            onChange={(technologies) =>
              onChange(updateAt(items, index, { ...item, technologies }))
            }
            dir={dir}
            hint={l.listHint}
          />
        </div>
      ))}
      <AddButton
        onClick={() =>
          onChange([
            ...items,
            { title: "", description: "", technologies: [], order: items.length },
          ])
        }
      >
        {l.addGroup}
      </AddButton>
    </div>
  );
}

function CardsEditor({
  items,
  onChange,
  dir,
  localeKey,
  addLabel,
}: {
  items: AboutCardItem[];
  onChange: (items: AboutCardItem[]) => void;
  dir: "rtl" | "ltr";
  localeKey: LocaleKey;
  addLabel: string;
}) {
  const l = labels[localeKey];
  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div
          key={index}
          className="space-y-3 rounded-2xl border border-border bg-background/35 p-4"
        >
          <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)_120px_auto]">
            <ManagedInput
              label={l.title}
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
              placeholder="code"
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
                label="remove card"
              />
            </div>
          </div>
          <ManagedTextArea
            label={l.itemDescription}
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
        {addLabel}
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
  value: AboutPageContent;
  onChange: (value: AboutPageContent) => void;
}) {
  const l = labels[localeKey];
  const dir = localeKey === "fa" ? "rtl" : "ltr";

  return (
    <div className="space-y-5" dir={dir}>
      <FieldHint>{l.localeHint}</FieldHint>

      <FormSection
        title={l.hero}
        description={localeKey === "fa" ? "محتوای بخش اول صفحه درباره" : "Top hero content for the About page"}
        icon={<FiImage />}
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
            label={l.name}
            value={value.hero.name}
            onChange={(name) =>
              onChange({ ...value, hero: { ...value.hero, name } })
            }
            dir={dir}
          />
          <ManagedInput
            label={l.headline}
            value={value.hero.headline}
            onChange={(headline) =>
              onChange({ ...value, hero: { ...value.hero, headline } })
            }
            dir={dir}
          />
          <ManagedInput
            label={l.statusBadge}
            value={value.hero.statusBadge}
            onChange={(statusBadge) =>
              onChange({ ...value, hero: { ...value.hero, statusBadge } })
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
              label={l.description}
              value={value.hero.description}
              onChange={(description) =>
                onChange({ ...value, hero: { ...value.hero, description } })
              }
              dir={dir}
              rows={4}
            />
          </div>
          <div className="md:col-span-2">
            <FileUploadField
              name={`about-${localeKey}-hero-image`}
              label={l.imageUrl}
              defaultValue={value.hero.imageUrl}
              value={value.hero.imageUrl ?? ""}
              onChange={(imageUrl) =>
                onChange({ ...value, hero: { ...value.hero, imageUrl } })
              }
              type="profile"
              shape="avatar"
              preview="image"
              dir="ltr"
            />
          </div>
          <div className="md:col-span-2">
            <StringListField
              name={`about-${localeKey}-hero-chips`}
              label={l.chips}
              value={value.hero.chips}
              onChange={(chips) =>
                onChange({ ...value, hero: { ...value.hero, chips } })
              }
              dir={dir}
              hint={l.listHint}
              addLabel={l.chips}
            />
          </div>
          <ManagedInput
            label={l.primaryLabel}
            value={value.hero.primaryCta.label}
            onChange={(label) =>
              onChange({
                ...value,
                hero: {
                  ...value.hero,
                  primaryCta: { ...value.hero.primaryCta, label },
                },
              })
            }
            dir={dir}
          />
          <ManagedInput
            label={l.primaryHref}
            value={value.hero.primaryCta.href}
            onChange={(href) =>
              onChange({
                ...value,
                hero: {
                  ...value.hero,
                  primaryCta: { ...value.hero.primaryCta, href },
                },
              })
            }
            dir="ltr"
          />
          <ManagedInput
            label={l.secondaryLabel}
            value={value.hero.secondaryCta.label}
            onChange={(label) =>
              onChange({
                ...value,
                hero: {
                  ...value.hero,
                  secondaryCta: { ...value.hero.secondaryCta, label },
                },
              })
            }
            dir={dir}
          />
          <ManagedInput
            label={l.secondaryHref}
            value={value.hero.secondaryCta.href}
            onChange={(href) =>
              onChange({
                ...value,
                hero: {
                  ...value.hero,
                  secondaryCta: { ...value.hero.secondaryCta, href },
                },
              })
            }
            dir="ltr"
          />
        </div>
      </FormSection>

      <FormSection title={l.stats} icon={<FiActivity />}>
        <StatsEditor
          items={value.stats}
          onChange={(stats) => onChange({ ...value, stats })}
          dir={dir}
          localeKey={localeKey}
        />
      </FormSection>

      <FormSection title={l.experience} icon={<FiBriefcase />}>
        <SectionHeadingFields
          content={value.experienceSection}
          onChange={(experienceSection) =>
            onChange({ ...value, experienceSection: { ...value.experienceSection, ...experienceSection } })
          }
          dir={dir}
          localeKey={localeKey}
        />
        <ExperienceEditor
          items={value.experienceSection.items}
          onChange={(items) =>
            onChange({
              ...value,
              experienceSection: { ...value.experienceSection, items },
            })
          }
          dir={dir}
          localeKey={localeKey}
        />
      </FormSection>

      <FormSection title={l.technologies} icon={<FiCode />}>
        <SectionHeadingFields
          content={value.technologiesSection}
          onChange={(technologiesSection) =>
            onChange({
              ...value,
              technologiesSection: { ...value.technologiesSection, ...technologiesSection },
            })
          }
          dir={dir}
          localeKey={localeKey}
        />
        <TechnologyGroupsEditor
          items={value.technologiesSection.groups}
          onChange={(groups) =>
            onChange({
              ...value,
              technologiesSection: { ...value.technologiesSection, groups },
            })
          }
          dir={dir}
          localeKey={localeKey}
        />
      </FormSection>

      <FormSection title={l.philosophy} icon={<FiTarget />}>
        <SectionHeadingFields
          content={value.philosophySection}
          onChange={(philosophySection) =>
            onChange({
              ...value,
              philosophySection: { ...value.philosophySection, ...philosophySection },
            })
          }
          dir={dir}
          localeKey={localeKey}
        />
        <CardsEditor
          items={value.philosophySection.cards}
          onChange={(cards) =>
            onChange({
              ...value,
              philosophySection: { ...value.philosophySection, cards },
            })
          }
          dir={dir}
          localeKey={localeKey}
          addLabel={l.addCard}
        />
      </FormSection>

      <FormSection title={l.help} icon={<FiHelpCircle />}>
        <SectionHeadingFields
          content={value.helpSection}
          onChange={(helpSection) =>
            onChange({
              ...value,
              helpSection: { ...value.helpSection, ...helpSection },
            })
          }
          dir={dir}
          localeKey={localeKey}
        />
        <CardsEditor
          items={value.helpSection.cards}
          onChange={(cards) =>
            onChange({
              ...value,
              helpSection: { ...value.helpSection, cards },
            })
          }
          dir={dir}
          localeKey={localeKey}
          addLabel={l.addCard}
        />
      </FormSection>

      <FormSection title={l.cta} icon={<FiLayers />}>
        <SectionHeadingFields
          content={value.cta}
          onChange={(cta) => onChange({ ...value, cta: { ...value.cta, ...cta } })}
          dir={dir}
          localeKey={localeKey}
        />
        <div className="grid gap-4 md:grid-cols-2">
          <ManagedInput
            label={l.primaryLabel}
            value={value.cta.primaryCta.label}
            onChange={(label) =>
              onChange({
                ...value,
                cta: { ...value.cta, primaryCta: { ...value.cta.primaryCta, label } },
              })
            }
            dir={dir}
          />
          <ManagedInput
            label={l.primaryHref}
            value={value.cta.primaryCta.href}
            onChange={(href) =>
              onChange({
                ...value,
                cta: { ...value.cta, primaryCta: { ...value.cta.primaryCta, href } },
              })
            }
            dir="ltr"
          />
          <ManagedInput
            label={l.secondaryLabel}
            value={value.cta.secondaryCta.label}
            onChange={(label) =>
              onChange({
                ...value,
                cta: { ...value.cta, secondaryCta: { ...value.cta.secondaryCta, label } },
              })
            }
            dir={dir}
          />
          <ManagedInput
            label={l.secondaryHref}
            value={value.cta.secondaryCta.href}
            onChange={(href) =>
              onChange({
                ...value,
                cta: { ...value.cta, secondaryCta: { ...value.cta.secondaryCta, href } },
              })
            }
            dir="ltr"
          />
        </div>
      </FormSection>
    </div>
  );
}

export function AboutContentForm({
  initialFa,
  initialEn,
  hasSettings,
}: {
  initialFa: AboutPageContent;
  initialEn: AboutPageContent;
  hasSettings: boolean;
}) {
  const { dict } = useI18n();
  const [state, formAction] = useActionState(
    updateAboutPageContent as (
      prev: ActionState,
      form: FormData,
    ) => Promise<ActionState>,
    initialActionState,
  );
  const [faContent, setFaContent] = useState(initialFa);
  const [enContent, setEnContent] = useState(initialEn);
  const t = dict.admin.about;

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
        name="aboutPageContentFa"
        value={JSON.stringify(faContent)}
      />
      <input
        type="hidden"
        name="aboutPageContentEn"
        value={JSON.stringify(enContent)}
      />

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

      {state.fieldErrors?.aboutPageContentFa && (
        <FieldError>{state.fieldErrors.aboutPageContentFa}</FieldError>
      )}
      {state.fieldErrors?.aboutPageContentEn && (
        <FieldError>{state.fieldErrors.aboutPageContentEn}</FieldError>
      )}

      <div className="flex flex-wrap items-center gap-3 border-t border-border pt-5">
        <SubmitButton>{t.save}</SubmitButton>
      </div>
    </form>
  );
}
