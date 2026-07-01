/**
 * Default estimator rules + planner settings (code fallback). The estimator
 * prefers DB rows (admin-editable) and falls back to these so estimates always
 * work. `key`s must match the `estimateKey`s used in question-flow.ts.
 */

export interface EstimateRuleDef {
  key: string;
  group: string;
  durationDays: number;
  labelFa: string;
  labelEn: string;
}

const r = (
  key: string,
  group: string,
  durationDays: number,
  labelFa: string,
  labelEn: string,
): EstimateRuleDef => ({ key, group, durationDays, labelFa, labelEn });

export const DEFAULT_ESTIMATE_RULES: EstimateRuleDef[] = [
  // Base durations per project type
  r("landing_page_base", "landing_page", 2, "پایه صفحه فرود", "Landing page base"),
  r("corporate_website_base", "corporate_website", 4, "پایه سایت شرکتی", "Corporate website base"),
  r("personal_branding_base", "personal_branding", 3, "پایه سایت شخصی", "Personal site base"),
  r("cms_wordpress_base", "cms_wordpress", 2, "پایه وردپرس", "WordPress base"),
  r("ecommerce_base", "ecommerce", 14, "پایه فروشگاه", "E-commerce base"),
  r("marketplace_base", "marketplace", 25, "پایه مارکت‌پلیس", "Marketplace base"),
  r("admin_dashboard_base", "admin_dashboard", 7, "پایه داشبورد", "Admin dashboard base"),
  r("custom_web_app_base", "custom_web_app", 12, "پایه اپلیکیشن وب", "Custom web app base"),

  // Design
  r("uiux_needed", "design", 3, "طراحی UI/UX", "UI/UX design"),
  r("uiux_redesign", "design", 2, "بازطراحی UI/UX", "UI/UX redesign"),
  r("animation_subtle", "design", 1, "انیمیشن ظریف", "Subtle animation"),
  r("animation_advanced", "design", 3, "موشن پیشرفته", "Advanced motion"),
  r("animation_interactive", "design", 5, "تجربه تعاملی", "Interactive experience"),
  r("tech_react", "design", 1, "پیاده‌سازی با React", "React implementation"),
  r("tech_nextjs", "design", 1.5, "پیاده‌سازی با Next.js", "Next.js implementation"),

  // Forms
  r("form_simple", "common_features", 1, "فرم ساده", "Simple form"),
  r("form_multi", "common_features", 2, "فرم چندفیلدی", "Multi-field form"),
  r("form_upload", "common_features", 2, "فرم با آپلود", "Form with upload"),
  r("form_crm", "integrations", 3, "اتصال فرم به CRM", "Form CRM integration"),

  // SEO / performance
  r("basic_seo", "seo", 1, "سئوی پایه", "Basic SEO"),
  r("advanced_seo", "seo", 3, "سئوی پیشرفته", "Advanced SEO"),
  r("speed_opt", "seo", 2, "بهینه‌سازی سرعت", "Speed optimization"),
  r("analytics_setup", "seo", 0.5, "راه‌اندازی آنالیتیکس", "Analytics setup"),

  // Per-unit
  r("landing_page_section", "common_features", 0.5, "هر سکشن لندینگ", "Per landing section"),
  r("corporate_page", "common_features", 0.4, "هر صفحه", "Per page"),
  r("wordpress_page", "cms_wordpress", 0.3, "هر صفحه وردپرس", "Per WordPress page"),
  r("ecommerce_product_batch", "ecommerce", 0.02, "هر محصول", "Per product"),

  // Dashboard
  r("dash_content", "admin_dashboard", 2, "مدیریت محتوا", "Content management"),
  r("dash_products", "admin_dashboard", 3, "مدیریت محصول/سفارش", "Product/order management"),
  r("dash_users", "admin_dashboard", 2, "مدیریت کاربران", "User management"),
  r("dash_analytics", "admin_dashboard", 3, "گزارش و آنالیز", "Analytics/reporting"),
  r("dash_operations", "admin_dashboard", 3, "عملیات داخلی", "Internal operations"),
  r("dash_finance", "admin_dashboard", 4, "مالی/حسابداری", "Financial workflows"),
  r("role_permissions_basic", "admin_dashboard", 2, "دسترسی پایه", "Basic roles"),
  r("role_permissions_advanced", "admin_dashboard", 5, "دسترسی پیشرفته", "Advanced permissions"),
  r("crud_simple", "admin_dashboard", 1, "CRUD ساده", "Simple CRUD"),
  r("crud_multiple", "admin_dashboard", 3, "چند موجودیت", "Multiple entities"),
  r("crud_filters", "admin_dashboard", 2, "فیلتر/جستجو", "Filters/search"),
  r("crud_workflows", "admin_dashboard", 4, "فرایندهای پیچیده", "Complex workflows"),
  r("crud_reports", "admin_dashboard", 3, "گزارش/خروجی", "Reports/export"),
  r("rbac", "admin_dashboard", 2, "دسترسی نقش‌محور", "Role-based access"),
  r("twofa", "admin_dashboard", 2, "احراز هویت دو مرحله‌ای", "Two-factor auth"),
  r("audit_logs", "admin_dashboard", 2, "لاگ ممیزی", "Audit logs"),

  // Integrations
  r("online_payment", "integrations", 2, "پرداخت آنلاین", "Online payment"),
  r("sms_integration", "integrations", 1, "پیامک", "SMS integration"),
  r("email_integration", "integrations", 1, "ایمیل", "Email integration"),
  r("file_upload", "integrations", 2, "آپلود فایل", "File upload"),
  r("custom_api", "integrations", 4, "API اختصاصی", "Custom API"),
  r("notifications", "integrations", 2, "اعلان‌ها", "Notifications"),

  // E-commerce
  r("digital_products", "ecommerce", 2, "محصولات دیجیتال", "Digital products"),
  r("shipping_system", "ecommerce", 2, "سیستم ارسال", "Shipping system"),
  r("coupons", "ecommerce", 1, "کد تخفیف", "Coupons"),
  r("inventory", "ecommerce", 3, "مدیریت موجودی", "Inventory"),
  r("woocommerce", "cms_wordpress", 7, "ووکامرس", "WooCommerce"),
  r("custom_ecommerce", "ecommerce", 10, "فروشگاه اختصاصی", "Custom store"),
  r("multivendor", "marketplace", 15, "چندفروشنده", "Multi-vendor"),

  // Marketplace
  r("vendor_accounts", "marketplace", 5, "حساب فروشندگان", "Vendor accounts"),
  r("commission", "marketplace", 3, "کمیسیون", "Commission"),
  r("payouts", "marketplace", 4, "تسویه", "Payouts"),
  r("approval_workflow", "marketplace", 3, "تأیید محصول", "Approval workflow"),
  r("subscriptions", "marketplace", 5, "اشتراک", "Subscriptions"),
  r("wallet", "marketplace", 5, "کیف پول", "Wallet"),
  r("disputes", "marketplace", 3, "اختلافات", "Disputes"),
  r("advanced_search", "marketplace", 3, "جستجوی پیشرفته", "Advanced search"),

  // Common / app
  r("auth", "common_features", 3, "حساب کاربری", "User accounts"),
  r("blog", "common_features", 2, "بلاگ", "Blog"),
  r("multilingual", "common_features", 3, "چندزبانه", "Multilingual"),
  r("cms_editing", "common_features", 3, "پنل ویرایش محتوا", "CMS editing"),
  r("section_resume", "common_features", 1, "بخش رزومه", "Resume section"),
  r("section_projects", "common_features", 2, "بخش پروژه‌ها", "Projects section"),
  r("realtime", "custom_web_app", 5, "قابلیت لحظه‌ای", "Real-time"),
  r("scale_medium", "custom_web_app", 3, "مقیاس متوسط", "Medium scale"),
  r("scale_large", "custom_web_app", 8, "مقیاس بزرگ", "Large scale"),

  // CMS / WordPress
  r("wordpress_ready_theme", "cms_wordpress", 2, "قالب آماده", "Ready theme"),
  r("wordpress_page_builder", "cms_wordpress", 4, "صفحه‌ساز", "Page builder"),
  r("wordpress_custom_theme", "cms_wordpress", 8, "قالب اختصاصی", "Custom theme"),
  r("wordpress_plugin_setup", "cms_wordpress", 2, "نصب افزونه", "Plugin setup"),
  r("wordpress_custom_plugin", "cms_wordpress", 10, "افزونه اختصاصی", "Custom plugin"),
  r("wp_optimization", "cms_wordpress", 3, "بهینه‌سازی و امنیت", "Optimization & security"),
  r("wp_migration", "cms_wordpress", 4, "مهاجرت/بازطراحی", "Migration / redesign"),
];

export interface PlannerSettingsDef {
  weeklyRate: number;
  currency: string;
  minimumProjectPrice: number | null;
  priceRounding: string;
  isEstimateEnabled: boolean;
  showPriceToUser: boolean;
}

export const DEFAULT_PLANNER_SETTINGS: PlannerSettingsDef = {
  weeklyRate: 15000000,
  currency: "تومان",
  minimumProjectPrice: null,
  priceRounding: "nearest_1m",
  isEstimateEnabled: true,
  showPriceToUser: true,
};

/** Estimate-rule groups (for the admin management UI). */
export const ESTIMATE_GROUPS = [
  "landing_page",
  "admin_dashboard",
  "ecommerce",
  "marketplace",
  "corporate_website",
  "personal_branding",
  "custom_web_app",
  "cms_wordpress",
  "common_features",
  "design",
  "seo",
  "integrations",
];
