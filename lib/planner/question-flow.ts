/**
 * Planner question engine.
 *
 * The public wizard is a short, fixed "smart brief": after the user picks a
 * project type (step 0, rendered from option data), the same five topical
 * questions are asked for every project type. The estimator
 * (`lib/planner/estimate.ts`) reads these answers by id, so the flow stays
 * declarative and the calculation lives in one place. Pure module — usable on
 * the server (validation + estimate) and the client (wizard rendering).
 */

export type QuestionType = "single" | "multi" | "number" | "boolean";

export interface PlannerQuestionOption {
  value: string;
  labelFa: string;
  labelEn: string;
  descriptionFa?: string;
  descriptionEn?: string;
  /** Optional small badge shown next to the title (e.g. "۱ ماهه"). */
  badgeFa?: string;
  badgeEn?: string;
  /** Optional bullet list of what's included. */
  itemsFa?: string[];
  itemsEn?: string[];
  icon?: string;
  estimateKey?: string;
}

export interface PlannerQuestion {
  id: string;
  type: QuestionType;
  labelFa: string;
  labelEn: string;
  descriptionFa?: string;
  descriptionEn?: string;
  placeholderFa?: string;
  placeholderEn?: string;
  options?: PlannerQuestionOption[];
  required?: boolean;
  min?: number;
  max?: number;
  default?: number;
  showIf?: { field: string; equals?: string; includes?: string };
}

/** Answers map keyed by question id. */
export type PlannerAnswerMap = Record<string, string | string[] | number>;

/* ------------------------------ Unified flow -------------------------------- */

/** Step 2 — scope. */
const PAGES: PlannerQuestion = {
  id: "pages",
  type: "number",
  labelFa: "حدوداً چند صفحه یا بخش نیاز داری؟",
  labelEn: "Roughly how many pages or sections do you need?",
  min: 1,
  max: 50,
  default: 1,
};

/** Step 3 — design level. */
const DESIGN_LEVEL: PlannerQuestion = {
  id: "designLevel",
  type: "single",
  labelFa: "سطح طراحی موردنظرت چقدر است؟",
  labelEn: "What level of design do you want?",
  options: [
    {
      value: "simple",
      icon: "layout",
      labelFa: "ساده و تمیز",
      labelEn: "Simple & clean",
      descriptionFa: "طراحی استاندارد، سریع و کاربردی.",
      descriptionEn: "Standard, fast and functional design.",
    },
    {
      value: "professional",
      icon: "pen",
      labelFa: "حرفه‌ای و اختصاصی",
      labelEn: "Professional & tailored",
      descriptionFa: "طراحی شبیه صفحات همین سایت، با جزئیات و polish بیشتر.",
      descriptionEn: "A polished, detailed design like the pages of this site.",
    },
    {
      value: "custom",
      icon: "award",
      labelFa: "کاملاً سفارشی و برندمحور",
      labelEn: "Fully custom & brand-driven",
      descriptionFa:
        "طراحی خاص، چندین حالت، جزئیات رابط کاربری (UI) و تجربه کاربری (UX) دقیق.",
      descriptionEn: "Bespoke design with multiple states and refined UI/UX detail.",
    },
  ],
};

/** Step 4 — features (multi-select). */
const FEATURES: PlannerQuestion = {
  id: "features",
  type: "multi",
  labelFa: "چه امکاناتی لازم داری؟",
  labelEn: "Which features do you need?",
  options: [
    { value: "contact_form", icon: "mail", labelFa: "فرم تماس / ثبت درخواست", labelEn: "Contact / request form" },
    { value: "cms_blog", icon: "book", labelFa: "وبلاگ یا مدیریت محتوا (CMS)", labelEn: "Blog / content management (CMS)" },
    { value: "auth", icon: "lock", labelFa: "ورود و ثبت‌نام کاربران", labelEn: "User login & signup" },
    { value: "admin_panel", icon: "grid", labelFa: "پنل مدیریت (Admin Panel)", labelEn: "Admin panel" },
    { value: "roles", icon: "sliders", labelFa: "نقش‌ها و سطح دسترسی", labelEn: "Roles & permissions" },
    { value: "payments", icon: "card", labelFa: "پرداخت آنلاین", labelEn: "Online payments" },
    { value: "wallet", icon: "dollar", labelFa: "کیف پول", labelEn: "Wallet" },
    { value: "subscription", icon: "star", labelFa: "اشتراک یا پلن عضویت", labelEn: "Subscription / membership plans" },
    { value: "upload", icon: "upload", labelFa: "آپلود فایل", labelEn: "File upload" },
    { value: "search", icon: "search", labelFa: "جستجو و فیلتر پیشرفته", labelEn: "Advanced search & filtering" },
    { value: "reporting", icon: "activity", labelFa: "داشبورد و گزارش‌گیری", labelEn: "Dashboard & reporting" },
    { value: "notifications", icon: "message", labelFa: "اعلان، ایمیل یا پیامک", labelEn: "Notifications, email or SMS" },
    { value: "multilingual", icon: "globe2", labelFa: "چندزبانه", labelEn: "Multilingual" },
    { value: "external_api", icon: "link", labelFa: "اتصال به سرویس خارجی (API)", labelEn: "External service (API) integration" },
    { value: "advanced_seo", icon: "trending", labelFa: "سئو پیشرفته (SEO)", labelEn: "Advanced SEO" },
    { value: "performance", icon: "zap", labelFa: "کش، بهینه‌سازی و عملکرد", labelEn: "Caching, optimization & performance" },
  ],
};

/** Step 5 — content / data / admin need. */
const CONTENT_NEED: PlannerQuestion = {
  id: "contentNeed",
  type: "single",
  labelFa: "محتوا و مدیریت سایت چطور باشد؟",
  labelEn: "How should content & management work?",
  options: [
    { value: "static", icon: "file", labelFa: "محتوا ثابت است و زیاد تغییر نمی‌کند", labelEn: "Content is static and rarely changes" },
    { value: "editable", icon: "edit", labelFa: "می‌خواهم از پنل، محتوا را تغییر بدهم", labelEn: "I want to edit content from a panel" },
    { value: "multiple_entities", icon: "layers", labelFa: "چند نوع داده دارم، مثل محصول، مقاله، کاربر، سفارش", labelEn: "Multiple data types (products, articles, users, orders)" },
    { value: "complex_model", icon: "cpu", labelFa: "ساختار داده پیچیده و قابل توسعه لازم دارم", labelEn: "I need a complex, scalable data model" },
  ],
};

/** Step 6 — timeline / urgency. */
const TIMELINE: PlannerQuestion = {
  id: "timeline",
  type: "single",
  labelFa: "چه زمانی می‌خواهی پروژه آماده شود؟",
  labelEn: "When do you want the project ready?",
  options: [
    { value: "flexible", icon: "calendar", labelFa: "عجله ندارم", labelEn: "No rush" },
    { value: "1-2-months", icon: "calendar", labelFa: "۱ تا ۲ ماه", labelEn: "1–2 months" },
    { value: "3-4-weeks", icon: "clock", labelFa: "۳ تا ۴ هفته", labelEn: "3–4 weeks" },
    { value: "under-3-weeks", icon: "clock", labelFa: "کمتر از ۳ هفته", labelEn: "Under 3 weeks" },
    { value: "urgent", icon: "zap", labelFa: "فوری", labelEn: "Urgent" },
  ],
};

/** Step 7 — post-launch support (before the contact step). */
const SUPPORT: PlannerQuestion = {
  id: "supportPlan",
  type: "single",
  labelFa: "بعد از تحویل به پشتیبانی نیاز داری؟",
  labelEn: "Do you need support after launch?",
  descriptionFa:
    "پشتیبانی کمک می‌کند بعد از انتشار پروژه، با خیال راحت‌تری مسیر اصلاحات، رفع خطا و بهبودهای اولیه را پیش ببری.",
  descriptionEn:
    "Support helps you handle fixes, bugs, and early improvements with peace of mind after launch.",
  options: [
    {
      value: "none",
      icon: "file",
      labelFa: "بدون پشتیبانی",
      labelEn: "No support",
      descriptionFa:
        "فقط تحویل نهایی پروژه انجام می‌شود و تغییرات بعدی به‌صورت جداگانه برآورد می‌شود.",
      descriptionEn:
        "Only final delivery; any later changes are estimated separately.",
    },
    {
      value: "basic_1_month",
      icon: "clock",
      labelFa: "پشتیبانی پایه",
      labelEn: "Basic support",
      badgeFa: "۱ ماهه",
      badgeEn: "1 month",
      descriptionFa:
        "مناسب برای رفع خطاهای احتمالی، پاسخ به سوالات اولیه و اصلاحات کوچک بعد از تحویل.",
      descriptionEn:
        "For possible bug fixes, early questions, and small tweaks after delivery.",
      itemsFa: [
        "رفع خطاهای مرتبط با تحویل",
        "پاسخ به سوالات اولیه",
        "اصلاحات کوچک",
        "بررسی عملکرد اولیه",
      ],
      itemsEn: [
        "Delivery-related bug fixes",
        "Answering early questions",
        "Small adjustments",
        "Initial performance check",
      ],
    },
    {
      value: "pro_3_months",
      icon: "activity",
      labelFa: "پشتیبانی حرفه‌ای",
      labelEn: "Professional support",
      badgeFa: "۳ ماهه",
      badgeEn: "3 months",
      descriptionFa:
        "مناسب برای پروژه‌هایی که بعد از انتشار نیاز به پایش، اصلاح، بهبود تجربه کاربری و تغییرات مرحله‌ای دارند.",
      descriptionEn:
        "For projects that need monitoring, fixes, UX improvements, and phased changes after launch.",
      itemsFa: [
        "رفع خطا و پایش اولیه",
        "بهبودهای کوچک UI/UX",
        "مشاوره فنی کوتاه",
        "اصلاحات مرحله‌ای محدود",
        "بررسی سرعت و پایداری",
      ],
      itemsEn: [
        "Bug fixing & initial monitoring",
        "Small UI/UX improvements",
        "Short technical consulting",
        "Limited phased adjustments",
        "Speed & stability checks",
      ],
    },
    {
      value: "ongoing",
      icon: "star",
      labelFa: "پشتیبانی بلندمدت",
      labelEn: "Ongoing support",
      badgeFa: "همراهی مستمر",
      badgeEn: "Continuous",
      descriptionFa:
        "مناسب برای محصولاتی که قرار است رشد کنند و بعد از انتشار به توسعه، بهینه‌سازی و تغییرات منظم نیاز دارند.",
      descriptionEn:
        "For products that will grow and need ongoing development, optimization, and regular changes.",
      itemsFa: [
        "پشتیبانی و توسعه مستمر",
        "بهینه‌سازی دوره‌ای",
        "بررسی عملکرد و خطاها",
        "توسعه امکانات جدید با برنامه‌ریزی",
        "اولویت بالاتر در رسیدگی",
      ],
      itemsEn: [
        "Continuous support & development",
        "Periodic optimization",
        "Performance & error review",
        "Planned new feature development",
        "Higher response priority",
      ],
    },
  ],
};

const UNIFIED_FLOW: PlannerQuestion[] = [
  PAGES,
  DESIGN_LEVEL,
  FEATURES,
  CONTENT_NEED,
  TIMELINE,
  SUPPORT,
];

/* --------------------------------- Helpers ---------------------------------- */

/** Topical questions for the brief (same for every project type). */
export function getQuestionsForProjectType(projectType: string): PlannerQuestion[] {
  return projectType ? UNIFIED_FLOW : [];
}

/** Evaluate a question's `showIf` against current answers. */
export function shouldShowQuestion(
  question: PlannerQuestion,
  answers: PlannerAnswerMap,
): boolean {
  const cond = question.showIf;
  if (!cond) return true;
  const v = answers[cond.field];
  if (cond.equals != null) return v === cond.equals;
  if (cond.includes != null) {
    return Array.isArray(v) ? v.includes(cond.includes) : v === cond.includes;
  }
  return true;
}

/**
 * Full ordered flow for a project type + current answers. The project-type
 * step (0) and the contact step (last) are handled by the wizard; this returns
 * the topical questions in between.
 */
export function getPlannerFlow(
  projectType: string,
  answers: PlannerAnswerMap,
): PlannerQuestion[] {
  return getQuestionsForProjectType(projectType).filter((q) =>
    shouldShowQuestion(q, answers),
  );
}

/** All question ids that belong to the flow (for pruning stale answers). */
export function questionIdsForType(projectType: string): string[] {
  return getQuestionsForProjectType(projectType).map((q) => q.id);
}
