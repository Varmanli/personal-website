import type { Locale } from "@/lib/i18n/config";

/**
 * Planner option fallback config. The public planner prefers DB `planner_options`
 * but falls back to these defaults so it always works. Option `value`s are the
 * stable identifiers stored on submitted requests — do not rename them.
 */

export type PlannerGroup =
  | "projectType"
  | "cmsSolutionType"
  | "goal"
  | "feature"
  | "designLevel"
  | "currentStage"
  | "timeline"
  | "budgetLevel"
  | "contactMethod";

export interface PlannerOptionDef {
  group: PlannerGroup;
  value: string;
  labelFa: string;
  labelEn: string;
  descriptionFa?: string;
  descriptionEn?: string;
  icon: string;
  weight: number;
}

/** Resolved option for a given locale (used by the UI). */
export interface LocalizedOption {
  value: string;
  label: string;
  description?: string;
  icon?: string | null;
  weight: number;
}

export const DEFAULT_PLANNER_OPTIONS: PlannerOptionDef[] = [
  // projectType
  { group: "projectType", value: "landing_page", icon: "layout", weight: 1, labelFa: "صفحه فرود (Landing Page)", labelEn: "Landing page" },
  { group: "projectType", value: "corporate_website", icon: "globe", weight: 2, labelFa: "وب‌سایت شرکتی", labelEn: "Corporate website" },
  { group: "projectType", value: "personal_branding", icon: "star", weight: 2, labelFa: "سایت شخصی / برندینگ", labelEn: "Personal / branding site" },
  { group: "projectType", value: "cms_wordpress", icon: "file", weight: 2, labelFa: "سایت وردپرسی (WordPress / CMS)", labelEn: "CMS / WordPress website" },
  { group: "projectType", value: "ecommerce", icon: "cart", weight: 6, labelFa: "فروشگاه اینترنتی", labelEn: "E-commerce" },
  { group: "projectType", value: "marketplace", icon: "layers", weight: 9, labelFa: "مارکت‌پلیس (Marketplace)", labelEn: "Marketplace" },
  { group: "projectType", value: "admin_dashboard", icon: "grid", weight: 5, labelFa: "داشبورد و پنل مدیریت (Admin Panel)", labelEn: "Admin dashboard" },
  { group: "projectType", value: "custom_web_app", icon: "cpu", weight: 7, labelFa: "اپلیکیشن وب اختصاصی (Web App)", labelEn: "Custom web application" },

  // cmsSolutionType (only when projectType === cms_wordpress)
  { group: "cmsSolutionType", value: "ready_theme", icon: "layout", weight: 1, labelFa: "قالب آماده", labelEn: "Ready-made theme", descriptionFa: "اقتصادی و سریع برای شروع.", descriptionEn: "Economical and fast to launch." },
  { group: "cmsSolutionType", value: "page_builder", icon: "sliders", weight: 2, labelFa: "صفحه‌ساز", labelEn: "Page builder", descriptionFa: "انعطاف بیشتر با هزینه‌ی متوسط.", descriptionEn: "More flexibility at a moderate cost." },
  { group: "cmsSolutionType", value: "woocommerce", icon: "cart", weight: 4, labelFa: "فروشگاه ووکامرس", labelEn: "WooCommerce store", descriptionFa: "فروشگاه مبتنی بر وردپرس.", descriptionEn: "WordPress-based online store." },
  { group: "cmsSolutionType", value: "custom_theme", icon: "pen", weight: 5, labelFa: "قالب اختصاصی", labelEn: "Custom theme", descriptionFa: "طراحی اختصاصی روی وردپرس.", descriptionEn: "Bespoke design on WordPress." },
  { group: "cmsSolutionType", value: "custom_plugin", icon: "package", weight: 7, labelFa: "افزونه اختصاصی", labelEn: "Custom plugin", descriptionFa: "قابلیت‌های سفارشی و پیچیده‌تر.", descriptionEn: "Custom, more complex functionality." },
  { group: "cmsSolutionType", value: "advanced_platform", icon: "cpu", weight: 10, labelFa: "پلتفرم پیشرفته", labelEn: "Advanced platform", descriptionFa: "برای نیازهای فراتر از وردپرس، توسعه اختصاصی پیشنهاد می‌شود.", descriptionEn: "Beyond WordPress — custom development recommended." },

  // goal (multi)
  { group: "goal", value: "branding", icon: "star", weight: 1, labelFa: "برندینگ", labelEn: "Branding" },
  { group: "goal", value: "lead_generation", icon: "trending", weight: 2, labelFa: "جذب مشتری", labelEn: "Lead generation" },
  { group: "goal", value: "online_sales", icon: "dollar", weight: 3, labelFa: "فروش آنلاین", labelEn: "Online sales" },
  { group: "goal", value: "automation", icon: "zap", weight: 3, labelFa: "اتوماسیون فرایندها", labelEn: "Process automation" },
  { group: "goal", value: "content_publishing", icon: "book", weight: 1, labelFa: "انتشار محتوا", labelEn: "Content publishing" },
  { group: "goal", value: "scalability", icon: "layers", weight: 4, labelFa: "مقیاس‌پذیری", labelEn: "Scalability" },

  // feature (multi) — must mirror the FEATURES question in question-flow.ts
  { group: "feature", value: "contact_form", icon: "mail", weight: 1, labelFa: "فرم تماس / ثبت درخواست", labelEn: "Contact / request form" },
  { group: "feature", value: "cms_blog", icon: "book", weight: 2, labelFa: "وبلاگ یا مدیریت محتوا (CMS)", labelEn: "Blog / content management (CMS)" },
  { group: "feature", value: "auth", icon: "lock", weight: 3, labelFa: "ورود و ثبت‌نام کاربران", labelEn: "User login & signup" },
  { group: "feature", value: "admin_panel", icon: "grid", weight: 4, labelFa: "پنل مدیریت (Admin Panel)", labelEn: "Admin panel" },
  { group: "feature", value: "roles", icon: "sliders", weight: 3, labelFa: "نقش‌ها و سطح دسترسی", labelEn: "Roles & permissions" },
  { group: "feature", value: "payments", icon: "card", weight: 4, labelFa: "پرداخت آنلاین", labelEn: "Online payments" },
  { group: "feature", value: "wallet", icon: "dollar", weight: 5, labelFa: "کیف پول", labelEn: "Wallet" },
  { group: "feature", value: "subscription", icon: "star", weight: 4, labelFa: "اشتراک یا پلن عضویت", labelEn: "Subscription / membership plans" },
  { group: "feature", value: "upload", icon: "upload", weight: 2, labelFa: "آپلود فایل", labelEn: "File upload" },
  { group: "feature", value: "search", icon: "search", weight: 3, labelFa: "جستجو و فیلتر پیشرفته", labelEn: "Advanced search & filtering" },
  { group: "feature", value: "reporting", icon: "activity", weight: 4, labelFa: "داشبورد و گزارش‌گیری", labelEn: "Dashboard & reporting" },
  { group: "feature", value: "notifications", icon: "message", weight: 3, labelFa: "اعلان، ایمیل یا پیامک", labelEn: "Notifications, email or SMS" },
  { group: "feature", value: "multilingual", icon: "globe2", weight: 2, labelFa: "چندزبانه", labelEn: "Multilingual" },
  { group: "feature", value: "external_api", icon: "link", weight: 3, labelFa: "اتصال به سرویس خارجی (API)", labelEn: "External service (API) integration" },
  { group: "feature", value: "advanced_seo", icon: "trending", weight: 2, labelFa: "سئو پیشرفته (SEO)", labelEn: "Advanced SEO" },
  { group: "feature", value: "performance", icon: "zap", weight: 2, labelFa: "کش، بهینه‌سازی و عملکرد", labelEn: "Caching, optimization & performance" },

  // designLevel — must mirror the DESIGN_LEVEL question in question-flow.ts
  { group: "designLevel", value: "simple", icon: "layout", weight: 1, labelFa: "ساده و تمیز", labelEn: "Simple & clean" },
  { group: "designLevel", value: "professional", icon: "pen", weight: 3, labelFa: "حرفه‌ای و اختصاصی", labelEn: "Professional & tailored" },
  { group: "designLevel", value: "custom", icon: "award", weight: 6, labelFa: "کاملاً سفارشی و برندمحور", labelEn: "Fully custom & brand-driven" },

  // currentStage
  { group: "currentStage", value: "idea", icon: "zap", weight: 0, labelFa: "فقط یک ایده", labelEn: "Just an idea" },
  { group: "currentStage", value: "has_content", icon: "file", weight: 1, labelFa: "محتوا آماده است", labelEn: "Content is ready" },
  { group: "currentStage", value: "has_design", icon: "pen", weight: 2, labelFa: "طراحی آماده است", labelEn: "Design is ready" },
  { group: "currentStage", value: "redesign", icon: "layers", weight: 2, labelFa: "بازطراحی پروژه‌ی موجود", labelEn: "Redesign an existing project" },

  // timeline — must mirror the TIMELINE question in question-flow.ts
  { group: "timeline", value: "flexible", icon: "calendar", weight: 0, labelFa: "عجله ندارم", labelEn: "No rush" },
  { group: "timeline", value: "1-2-months", icon: "calendar", weight: 1, labelFa: "۱ تا ۲ ماه", labelEn: "1–2 months" },
  { group: "timeline", value: "3-4-weeks", icon: "clock", weight: 2, labelFa: "۳ تا ۴ هفته", labelEn: "3–4 weeks" },
  { group: "timeline", value: "under-3-weeks", icon: "clock", weight: 3, labelFa: "کمتر از ۳ هفته", labelEn: "Under 3 weeks" },
  { group: "timeline", value: "urgent", icon: "zap", weight: 4, labelFa: "فوری", labelEn: "Urgent" },

  // budgetLevel
  { group: "budgetLevel", value: "economic", icon: "dollar", weight: 0, labelFa: "اقتصادی", labelEn: "Economic" },
  { group: "budgetLevel", value: "standard", icon: "dollar", weight: 1, labelFa: "استاندارد", labelEn: "Standard" },
  { group: "budgetLevel", value: "premium", icon: "star", weight: 3, labelFa: "ویژه", labelEn: "Premium" },
  { group: "budgetLevel", value: "enterprise", icon: "award", weight: 5, labelFa: "سازمانی", labelEn: "Enterprise" },

  // contactMethod
  { group: "contactMethod", value: "phone", icon: "phone", weight: 0, labelFa: "تماس تلفنی", labelEn: "Phone call" },
  { group: "contactMethod", value: "email", icon: "mail", weight: 0, labelFa: "ایمیل", labelEn: "Email" },
  { group: "contactMethod", value: "whatsapp", icon: "message", weight: 0, labelFa: "واتساپ", labelEn: "WhatsApp" },
  { group: "contactMethod", value: "telegram", icon: "send", weight: 0, labelFa: "تلگرام", labelEn: "Telegram" },
];

/** All planner groups in display order. */
export const PLANNER_GROUPS: PlannerGroup[] = [
  "projectType",
  "cmsSolutionType",
  "goal",
  "feature",
  "designLevel",
  "currentStage",
  "timeline",
  "budgetLevel",
  "contactMethod",
];

/** Multi-select groups. */
export const MULTI_GROUPS: PlannerGroup[] = ["goal", "feature"];

/** Fallback option defs for a group. */
export function fallbackOptions(group: PlannerGroup): PlannerOptionDef[] {
  return DEFAULT_PLANNER_OPTIONS.filter((o) => o.group === group);
}

/** Localize a fallback def for the UI. */
export function localizeOptionDef(
  o: PlannerOptionDef,
  locale: Locale,
): LocalizedOption {
  return {
    value: o.value,
    label: locale === "fa" ? o.labelFa : o.labelEn,
    description: locale === "fa" ? o.descriptionFa : o.descriptionEn,
    icon: o.icon,
    weight: o.weight,
  };
}

/** Map of value → weight for a group (used by scoring on the server). */
export function weightMap(group: PlannerGroup): Record<string, number> {
  const map: Record<string, number> = {};
  for (const o of fallbackOptions(group)) map[o.value] = o.weight;
  return map;
}

/** Valid option values for a group (for server-side validation). */
export function validValues(group: PlannerGroup): Set<string> {
  return new Set(fallbackOptions(group).map((o) => o.value));
}

/** Human label for a stored value (fallback config), localized. */
export function optionLabel(
  group: PlannerGroup,
  value: string | null | undefined,
  locale: Locale,
): string | null {
  if (!value) return null;
  const def = fallbackOptions(group).find((o) => o.value === value);
  if (!def) return value;
  return locale === "fa" ? def.labelFa : def.labelEn;
}
