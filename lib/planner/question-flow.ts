/**
 * Conditional planner question engine.
 *
 * After the user picks a project type, the next questions are built from this
 * config (no hardcoded wizard pages). Each option can carry an `estimateKey`
 * that maps to a duration rule in the estimator. Pure module — usable on the
 * server (validation + estimate) and the client (wizard rendering).
 */

export type QuestionType = "single" | "multi" | "number" | "boolean";

export interface PlannerQuestionOption {
  value: string;
  labelFa: string;
  labelEn: string;
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
  /** Per-unit estimate key for number questions; flat key for booleans. */
  estimateKey?: string;
  min?: number;
  default?: number;
  showIf?: { field: string; equals?: string; includes?: string };
}

/** Answers map keyed by question id. */
export type PlannerAnswerMap = Record<string, string | string[] | number>;

const yes = (estimateKey: string): PlannerQuestionOption[] => [
  { value: "yes", labelFa: "بله", labelEn: "Yes", icon: "zap", estimateKey },
  { value: "no", labelFa: "خیر", labelEn: "No", icon: "edit" },
];

/* ------------------------------ Per-type questions -------------------------- */

const LANDING: PlannerQuestion[] = [
  {
    id: "uiux", type: "single", labelFa: "طراحی UI/UX آماده است؟", labelEn: "Is the UI/UX design ready?",
    options: [
      { value: "ready", labelFa: "آماده است", labelEn: "UI/UX is ready", icon: "star" },
      { value: "needs", labelFa: "نیاز به طراحی دارد", labelEn: "Needs UI/UX design", icon: "pen", estimateKey: "uiux_needed" },
      { value: "redesign", labelFa: "نیاز به بازطراحی دارد", labelEn: "Needs redesign", icon: "layers", estimateKey: "uiux_redesign" },
      { value: "unsure", labelFa: "مطمئن نیستم", labelEn: "Not sure", icon: "help" },
    ],
  },
  {
    id: "animation", type: "single", labelFa: "سطح انیمیشن صفحه چقدر باشد؟", labelEn: "What animation level do you need?",
    options: [
      { value: "static", labelFa: "ساده / بدون انیمیشن", labelEn: "Static / simple", icon: "layout" },
      { value: "subtle", labelFa: "انیمیشن‌های ظریف", labelEn: "Subtle animations", icon: "activity", estimateKey: "animation_subtle" },
      { value: "advanced", labelFa: "موشن‌دیزاین پیشرفته", labelEn: "Advanced motion design", icon: "zap", estimateKey: "animation_advanced" },
      { value: "interactive", labelFa: "تعاملی و خلاقانه", labelEn: "Highly interactive", icon: "cpu", estimateKey: "animation_interactive" },
    ],
  },
  {
    id: "tech", type: "single", labelFa: "با چه تکنولوژی‌ای پیاده‌سازی شود؟", labelEn: "Which technology do you prefer?",
    options: [
      { value: "html", labelFa: "HTML / CSS / JS", labelEn: "HTML / CSS / JS", icon: "file" },
      { value: "tailwind", labelFa: "Tailwind CSS", labelEn: "Tailwind CSS", icon: "pen" },
      { value: "react", labelFa: "React", labelEn: "React", icon: "cpu", estimateKey: "tech_react" },
      { value: "nextjs", labelFa: "Next.js", labelEn: "Next.js", icon: "server", estimateKey: "tech_nextjs" },
      { value: "unsure", labelFa: "پیشنهاد بده", labelEn: "Recommend for me", icon: "help" },
    ],
  },
  {
    id: "sections", type: "number", labelFa: "چند سکشن یا صفحه نیاز دارید؟", labelEn: "How many sections or pages?",
    estimateKey: "landing_page_section", min: 1, default: 1,
  },
  {
    id: "forms", type: "single", labelFa: "فرم تماس یا دریافت اطلاعات نیاز دارید؟", labelEn: "Do you need forms?",
    options: [
      { value: "none", labelFa: "بدون فرم", labelEn: "No form", icon: "edit" },
      { value: "simple", labelFa: "فرم تماس ساده", labelEn: "Simple contact form", icon: "mail", estimateKey: "form_simple" },
      { value: "multi", labelFa: "فرم چند‌فیلدی", labelEn: "Multi-field lead form", icon: "file", estimateKey: "form_multi" },
      { value: "upload", labelFa: "فرم با آپلود فایل", labelEn: "Form with file upload", icon: "upload", estimateKey: "form_upload" },
      { value: "crm", labelFa: "فرم با اتصال CRM/ایمیل", labelEn: "Form with CRM/email", icon: "link", estimateKey: "form_crm" },
    ],
  },
  {
    id: "seo", type: "multi", labelFa: "سئو و کارایی", labelEn: "SEO / performance",
    options: [
      { value: "basic_seo", labelFa: "سئوی پایه", labelEn: "Basic SEO", icon: "search", estimateKey: "basic_seo" },
      { value: "advanced_seo", labelFa: "سئوی پیشرفته", labelEn: "Advanced SEO", icon: "trending", estimateKey: "advanced_seo" },
      { value: "speed", labelFa: "بهینه‌سازی سرعت", labelEn: "Speed optimization", icon: "zap", estimateKey: "speed_opt" },
      { value: "analytics", labelFa: "راه‌اندازی آنالیتیکس", labelEn: "Analytics setup", icon: "activity", estimateKey: "analytics_setup" },
    ],
  },
];

const DASHBOARD: PlannerQuestion[] = [
  {
    id: "purpose", type: "multi", labelFa: "پنل مدیریت برای چه کاری است؟", labelEn: "What is the dashboard for?",
    options: [
      { value: "content", labelFa: "مدیریت محتوا", labelEn: "Content management", icon: "file", estimateKey: "dash_content" },
      { value: "products", labelFa: "مدیریت محصول/سفارش", labelEn: "Product/order management", icon: "cart", estimateKey: "dash_products" },
      { value: "users", labelFa: "مدیریت کاربران", labelEn: "User management", icon: "lock", estimateKey: "dash_users" },
      { value: "analytics", labelFa: "گزارش و آنالیز", labelEn: "Analytics/reporting", icon: "activity", estimateKey: "dash_analytics" },
      { value: "operations", labelFa: "عملیات داخلی", labelEn: "Internal operations", icon: "sliders", estimateKey: "dash_operations" },
      { value: "finance", labelFa: "مالی و حسابداری", labelEn: "Financial workflows", icon: "dollar", estimateKey: "dash_finance" },
    ],
  },
  {
    id: "roles", type: "single", labelFa: "چند سطح دسترسی نیاز دارید؟", labelEn: "How many user roles?",
    options: [
      { value: "single", labelFa: "فقط مدیر", labelEn: "Single admin", icon: "lock" },
      { value: "admin_staff", labelFa: "مدیر + کارمند", labelEn: "Admin + staff", icon: "lock", estimateKey: "role_permissions_basic" },
      { value: "multiple", labelFa: "چند نقش", labelEn: "Multiple roles", icon: "layers", estimateKey: "role_permissions_basic" },
      { value: "advanced", labelFa: "سیستم دسترسی پیشرفته", labelEn: "Advanced permissions", icon: "cpu", estimateKey: "role_permissions_advanced" },
    ],
  },
  {
    id: "crud", type: "single", labelFa: "حجم مدیریت داده چقدر است؟", labelEn: "How complex is the data management?",
    options: [
      { value: "simple", labelFa: "CRUD ساده", labelEn: "Simple CRUD", icon: "grid", estimateKey: "crud_simple" },
      { value: "multiple", labelFa: "چند موجودیت", labelEn: "Multiple entities", icon: "layers", estimateKey: "crud_multiple" },
      { value: "filters", labelFa: "فیلتر/جستجوی پیشرفته", labelEn: "Advanced filters/search", icon: "search", estimateKey: "crud_filters" },
      { value: "workflows", labelFa: "فرایندهای پیچیده", labelEn: "Complex workflows", icon: "sliders", estimateKey: "crud_workflows" },
      { value: "reports", labelFa: "گزارش‌ها و خروجی", labelEn: "Reports/export", icon: "file", estimateKey: "crud_reports" },
    ],
  },
  {
    id: "security", type: "multi", labelFa: "امنیت و احراز هویت", labelEn: "Auth / security",
    options: [
      { value: "simple_login", labelFa: "ورود ساده", labelEn: "Simple login", icon: "lock" },
      { value: "rbac", labelFa: "دسترسی نقش‌محور", labelEn: "Role-based access", icon: "lock", estimateKey: "rbac" },
      { value: "2fa", labelFa: "احراز هویت دو مرحله‌ای", labelEn: "Two-factor auth", icon: "lock", estimateKey: "twofa" },
      { value: "audit", labelFa: "لاگ ممیزی", labelEn: "Audit logs", icon: "file", estimateKey: "audit_logs" },
    ],
  },
  {
    id: "integrations", type: "multi", labelFa: "یکپارچه‌سازی‌ها", labelEn: "Integrations",
    options: [
      { value: "payment", labelFa: "پرداخت", labelEn: "Payment", icon: "card", estimateKey: "online_payment" },
      { value: "sms", labelFa: "پیامک", labelEn: "SMS", icon: "message", estimateKey: "sms_integration" },
      { value: "email", labelFa: "ایمیل", labelEn: "Email", icon: "mail", estimateKey: "email_integration" },
      { value: "file", labelFa: "ذخیره فایل", labelEn: "File storage", icon: "upload", estimateKey: "file_upload" },
      { value: "api", labelFa: "API خارجی", labelEn: "External API", icon: "link", estimateKey: "custom_api" },
    ],
  },
];

const ECOMMERCE: PlannerQuestion[] = [
  { id: "products", type: "number", labelFa: "چند محصول دارید؟", labelEn: "Number of products", estimateKey: "ecommerce_product_batch", min: 1, default: 10 },
  {
    id: "product_types", type: "multi", labelFa: "نوع محصولات", labelEn: "Product types",
    options: [
      { value: "physical", labelFa: "فیزیکی", labelEn: "Physical", icon: "cart" },
      { value: "digital", labelFa: "دیجیتال", labelEn: "Digital", icon: "file", estimateKey: "digital_products" },
      { value: "services", labelFa: "خدمات", labelEn: "Services", icon: "sliders" },
    ],
  },
  { id: "payment", type: "single", labelFa: "درگاه پرداخت نیاز دارید؟", labelEn: "Payment gateway required?", options: yes("online_payment") },
  { id: "shipping", type: "single", labelFa: "سیستم ارسال نیاز دارید؟", labelEn: "Shipping system?", options: yes("shipping_system") },
  { id: "coupons", type: "single", labelFa: "کد تخفیف نیاز دارید؟", labelEn: "Discount/coupon?", options: yes("coupons") },
  { id: "inventory", type: "single", labelFa: "مدیریت موجودی نیاز دارید؟", labelEn: "Inventory management?", options: yes("inventory") },
  {
    id: "platform", type: "single", labelFa: "ووکامرس یا اختصاصی؟", labelEn: "WooCommerce or custom?",
    options: [
      { value: "woocommerce", labelFa: "ووکامرس", labelEn: "WooCommerce", icon: "cart", estimateKey: "woocommerce" },
      { value: "custom", labelFa: "اختصاصی", labelEn: "Custom", icon: "cpu", estimateKey: "custom_ecommerce" },
    ],
  },
  { id: "multivendor", type: "single", labelFa: "چندفروشنده (مارکت‌پلیس) نیاز دارید؟", labelEn: "Multi-vendor needed?", options: yes("multivendor") },
];

const MARKETPLACE: PlannerQuestion[] = [
  {
    id: "mp_features", type: "multi", labelFa: "قابلیت‌های مارکت‌پلیس", labelEn: "Marketplace features",
    options: [
      { value: "vendor_accounts", labelFa: "حساب فروشندگان", labelEn: "Seller accounts", icon: "lock", estimateKey: "vendor_accounts" },
      { value: "commission", labelFa: "کمیسیون/تقسیم درآمد", labelEn: "Commission split", icon: "dollar", estimateKey: "commission" },
      { value: "payouts", labelFa: "مدیریت تسویه", labelEn: "Payout management", icon: "card", estimateKey: "payouts" },
      { value: "approval", labelFa: "تأیید محصولات", labelEn: "Product approval", icon: "sliders", estimateKey: "approval_workflow" },
      { value: "subscriptions", labelFa: "سیستم اشتراک", labelEn: "Subscription/plans", icon: "star", estimateKey: "subscriptions" },
      { value: "wallet", labelFa: "کیف پول/تقسیم پرداخت", labelEn: "Wallet/payment split", icon: "card", estimateKey: "wallet" },
      { value: "disputes", labelFa: "مدیریت اختلافات", labelEn: "Disputes/support", icon: "message", estimateKey: "disputes" },
      { value: "search", labelFa: "جستجوی پیشرفته", labelEn: "Advanced search", icon: "search", estimateKey: "advanced_search" },
      { value: "analytics", labelFa: "آنالیز مدیریتی", labelEn: "Admin analytics", icon: "activity", estimateKey: "dash_analytics" },
    ],
  },
];

const CORPORATE: PlannerQuestion[] = [
  { id: "pages", type: "number", labelFa: "چند صفحه نیاز دارید؟", labelEn: "Number of pages", estimateKey: "corporate_page", min: 1, default: 5 },
  { id: "blog", type: "single", labelFa: "بلاگ/اخبار نیاز دارید؟", labelEn: "Need blog/news?", options: yes("blog") },
  { id: "multilingual", type: "single", labelFa: "چندزبانه نیاز دارید؟", labelEn: "Need multilingual?", options: yes("multilingual") },
  { id: "cms", type: "single", labelFa: "پنل ویرایش محتوا نیاز دارید؟", labelEn: "Need CMS/admin editing?", options: yes("cms_editing") },
  { id: "forms", type: "single", labelFa: "فرم تماس نیاز دارید؟", labelEn: "Need contact forms?", options: yes("form_simple") },
  { id: "seo", type: "single", labelFa: "سئو نیاز دارید؟", labelEn: "Need SEO setup?", options: yes("basic_seo") },
  {
    id: "design", type: "single", labelFa: "طراحی اختصاصی یا قالبی؟", labelEn: "Custom or template design?",
    options: [
      { value: "template", labelFa: "قالبی", labelEn: "Template-like", icon: "layout" },
      { value: "custom", labelFa: "اختصاصی", labelEn: "Custom design", icon: "pen", estimateKey: "uiux_needed" },
    ],
  },
];

const PERSONAL: PlannerQuestion[] = [
  {
    id: "sections", type: "multi", labelFa: "بخش‌های سایت", labelEn: "Sections",
    options: [
      { value: "resume", labelFa: "رزومه", labelEn: "Resume / CV", icon: "file", estimateKey: "section_resume" },
      { value: "portfolio", labelFa: "نمونه‌کارها", labelEn: "Portfolio", icon: "grid", estimateKey: "section_portfolio" },
      { value: "blog", labelFa: "بلاگ", labelEn: "Blog / articles", icon: "book", estimateKey: "blog" },
      { value: "contact", labelFa: "فرم تماس", labelEn: "Contact form", icon: "mail", estimateKey: "form_simple" },
      { value: "download", labelFa: "دانلود رزومه", labelEn: "Download resume", icon: "upload" },
    ],
  },
  {
    id: "animation", type: "single", labelFa: "سطح انیمیشن", labelEn: "Animation level",
    options: [
      { value: "static", labelFa: "ساده", labelEn: "Static", icon: "layout" },
      { value: "subtle", labelFa: "ظریف", labelEn: "Subtle", icon: "activity", estimateKey: "animation_subtle" },
      { value: "advanced", labelFa: "پیشرفته", labelEn: "Advanced", icon: "zap", estimateKey: "animation_advanced" },
    ],
  },
  { id: "pages", type: "number", labelFa: "چند صفحه؟", labelEn: "Number of pages", estimateKey: "corporate_page", min: 1, default: 3 },
];

const CUSTOM_APP: PlannerQuestion[] = [
  {
    id: "app_features", type: "multi", labelFa: "قابلیت‌های اپلیکیشن", labelEn: "Application features",
    options: [
      { value: "auth", labelFa: "حساب کاربری", labelEn: "User accounts", icon: "lock", estimateKey: "auth" },
      { value: "roles", labelFa: "نقش‌ها/دسترسی", labelEn: "Roles/permissions", icon: "lock", estimateKey: "role_permissions_advanced" },
      { value: "dashboard", labelFa: "داشبورد", labelEn: "Dashboard", icon: "grid", estimateKey: "admin_dashboard_base" },
      { value: "payments", labelFa: "پرداخت", labelEn: "Payments", icon: "card", estimateKey: "online_payment" },
      { value: "subscriptions", labelFa: "اشتراک", labelEn: "Subscriptions", icon: "star", estimateKey: "subscriptions" },
      { value: "notifications", labelFa: "اعلان‌ها", labelEn: "Notifications", icon: "message", estimateKey: "notifications" },
      { value: "uploads", labelFa: "آپلود فایل", labelEn: "File uploads", icon: "upload", estimateKey: "file_upload" },
      { value: "realtime", labelFa: "قابلیت لحظه‌ای", labelEn: "Real-time", icon: "activity", estimateKey: "realtime" },
      { value: "api", labelFa: "اتصال API", labelEn: "API integrations", icon: "link", estimateKey: "custom_api" },
      { value: "analytics", labelFa: "آنالیز", labelEn: "Analytics", icon: "activity", estimateKey: "dash_analytics" },
    ],
  },
  {
    id: "scale", type: "single", labelFa: "مقیاس مورد انتظار", labelEn: "Expected scale",
    options: [
      { value: "small", labelFa: "کوچک", labelEn: "Small", icon: "layout" },
      { value: "medium", labelFa: "متوسط", labelEn: "Medium", icon: "layers", estimateKey: "scale_medium" },
      { value: "large", labelFa: "بزرگ/مقیاس‌پذیر", labelEn: "Large / scalable", icon: "server", estimateKey: "scale_large" },
    ],
  },
];

const CMS_WORDPRESS: PlannerQuestion[] = [
  {
    id: "cmsSolutionType", type: "single", labelFa: "نوع راهکار وردپرس", labelEn: "WordPress solution type",
    options: [
      { value: "ready_theme", labelFa: "قالب آماده", labelEn: "Ready-made theme", icon: "layout", estimateKey: "wordpress_ready_theme" },
      { value: "page_builder", labelFa: "صفحه‌ساز", labelEn: "Page builder", icon: "sliders", estimateKey: "wordpress_page_builder" },
      { value: "custom_theme", labelFa: "قالب اختصاصی", labelEn: "Custom theme", icon: "pen", estimateKey: "wordpress_custom_theme" },
      { value: "plugin_setup", labelFa: "نصب و تنظیم افزونه", labelEn: "Plugin setup", icon: "package", estimateKey: "wordpress_plugin_setup" },
      { value: "custom_plugin", labelFa: "افزونه اختصاصی", labelEn: "Custom plugin", icon: "package", estimateKey: "wordpress_custom_plugin" },
      { value: "woocommerce", labelFa: "ووکامرس", labelEn: "WooCommerce", icon: "cart", estimateKey: "woocommerce" },
      { value: "wp_optimization_security", labelFa: "بهینه‌سازی و امنیت", labelEn: "Optimization & security", icon: "lock", estimateKey: "wp_optimization" },
      { value: "wp_redesign_migration", labelFa: "بازطراحی/مهاجرت", labelEn: "Redesign / migration", icon: "layers", estimateKey: "wp_migration" },
    ],
    required: true,
  },
  { id: "pages", type: "number", labelFa: "چند صفحه؟", labelEn: "Number of pages", estimateKey: "wordpress_page", min: 1, default: 5 },
  { id: "products", type: "number", labelFa: "چند محصول؟", labelEn: "Number of products", estimateKey: "ecommerce_product_batch", min: 1, default: 10, showIf: { field: "cmsSolutionType", equals: "woocommerce" } },
  { id: "multilingual", type: "single", labelFa: "چندزبانه نیاز دارید؟", labelEn: "Need multilingual?", options: yes("multilingual") },
  { id: "blog", type: "single", labelFa: "بلاگ نیاز دارید؟", labelEn: "Need blog?", options: yes("blog") },
  { id: "seo", type: "single", labelFa: "سئو نیاز دارید؟", labelEn: "Need SEO?", options: yes("basic_seo") },
  { id: "speed_security", type: "single", labelFa: "بهینه‌سازی سرعت/امنیت؟", labelEn: "Speed/security optimization?", options: yes("wp_optimization") },
];

const BY_TYPE: Record<string, PlannerQuestion[]> = {
  landing_page: LANDING,
  admin_dashboard: DASHBOARD,
  ecommerce: ECOMMERCE,
  marketplace: MARKETPLACE,
  corporate_website: CORPORATE,
  personal_branding: PERSONAL,
  custom_web_app: CUSTOM_APP,
  cms_wordpress: CMS_WORDPRESS,
};

/* --------------------------------- Common ----------------------------------- */

const COMMON: PlannerQuestion[] = [
  {
    id: "currentStage", type: "single", labelFa: "اکنون در چه مرحله‌ای هستید؟", labelEn: "Where are you right now?",
    options: [
      { value: "idea", labelFa: "فقط یک ایده", labelEn: "Just an idea", icon: "zap" },
      { value: "has_content", labelFa: "محتوا آماده است", labelEn: "Content is ready", icon: "file" },
      { value: "has_design", labelFa: "طراحی آماده است", labelEn: "Design is ready", icon: "pen" },
      { value: "redesign", labelFa: "بازطراحی موجود", labelEn: "Redesign existing", icon: "layers" },
    ],
  },
  {
    id: "timeline", type: "single", labelFa: "زمان‌بندی شما؟", labelEn: "What's your timeline?",
    options: [
      { value: "urgent", labelFa: "فوری (کمتر از ۱ ماه)", labelEn: "Urgent (under 1 month)", icon: "clock" },
      { value: "normal", labelFa: "معمولی (۱ تا ۳ ماه)", labelEn: "Normal (1–3 months)", icon: "calendar" },
      { value: "flexible", labelFa: "منعطف (۳ ماه به بالا)", labelEn: "Flexible (3+ months)", icon: "calendar" },
    ],
  },
  {
    id: "budgetLevel", type: "single", labelFa: "سطح بودجه؟", labelEn: "What's your budget level?",
    options: [
      { value: "economic", labelFa: "اقتصادی", labelEn: "Economic", icon: "dollar" },
      { value: "standard", labelFa: "استاندارد", labelEn: "Standard", icon: "dollar" },
      { value: "premium", labelFa: "ویژه", labelEn: "Premium", icon: "star" },
      { value: "enterprise", labelFa: "سازمانی", labelEn: "Enterprise", icon: "award" },
    ],
  },
];

/* --------------------------------- Helpers ---------------------------------- */

/** Project-type-specific questions (without common/contact steps). */
export function getQuestionsForProjectType(projectType: string): PlannerQuestion[] {
  return BY_TYPE[projectType] ?? [];
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
 * Full ordered flow for a project type + current answers: type-specific
 * questions (filtered by showIf) followed by the common questions.
 */
export function getPlannerFlow(
  projectType: string,
  answers: PlannerAnswerMap,
): PlannerQuestion[] {
  const specific = getQuestionsForProjectType(projectType).filter((q) =>
    shouldShowQuestion(q, answers),
  );
  return [...specific, ...COMMON];
}

/** All question ids that belong to a project type (for pruning stale answers). */
export function questionIdsForType(projectType: string): string[] {
  return [
    ...getQuestionsForProjectType(projectType).map((q) => q.id),
    ...COMMON.map((q) => q.id),
  ];
}
