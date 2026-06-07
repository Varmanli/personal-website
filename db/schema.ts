import {
  pgTable,
  serial,
  integer,
  text,
  varchar,
  boolean,
  timestamp,
  jsonb,
  pgEnum,
  index,
  uniqueIndex,
  doublePrecision,
} from "drizzle-orm/pg-core";

/** One line of an estimate breakdown, snapshotted onto a request. */
export interface EstimateBreakdownItem {
  key: string;
  labelFa: string;
  labelEn: string;
  durationDays: number;
  priceImpact?: number;
}

/**
 * Shared enums.
 * Keep these small and explicit so the admin UI can map over them safely.
 */
export const contentStatusEnum = pgEnum("content_status", [
  "draft",
  "published",
  "archived",
]);

export const messageStatusEnum = pgEnum("message_status", [
  "new",
  "read",
  "archived",
]);

export const portfolioTypeEnum = pgEnum("portfolio_type", [
  "commercial",
  "personal",
  "freelance",
]);

/**
 * Projects
 * Core showcase items. Each project has a detail page reachable by `slug`.
 */
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  // Base/legacy display fields — kept as the final fallback. New content is
  // written to the localized *Fa / *En columns below.
  title: varchar("title", { length: 200 }).notNull(),
  slug: varchar("slug", { length: 220 }).notNull().unique(),
  shortDescription: varchar("short_description", { length: 320 }),
  description: text("description"),
  thumbnailUrl: text("thumbnail_url"),
  // Primary cover image (shown on cards + detail hero) and an ordered gallery
  // of additional images. Nullable/defaulted so the change is non-destructive;
  // `thumbnailUrl`/`media` are kept as fallbacks for existing rows.
  coverImageUrl: text("cover_image_url"),
  galleryImages: jsonb("gallery_images").$type<string[]>().default([]),
  // Free-form media gallery (image/video URLs).
  media: jsonb("media").$type<string[]>().default([]),
  // Tech stack used on the project (rendered as chips). Shared across locales.
  technologies: jsonb("technologies").$type<string[]>().default([]),
  // Short categorisation tags, e.g. "SaaS", "E-commerce", "Internal tool".
  tags: jsonb("tags").$type<string[]>().default([]),
  // Engagement metadata for the case-study detail page.
  role: varchar("role", { length: 160 }),
  client: varchar("client", { length: 200 }),
  year: varchar("year", { length: 16 }),
  // Case-study narrative sections (all optional).
  challenge: text("challenge"),
  solution: text("solution"),
  outcome: text("outcome"),
  // Localized content (Persian + English).
  titleFa: varchar("title_fa", { length: 200 }),
  titleEn: varchar("title_en", { length: 200 }),
  shortDescriptionFa: varchar("short_description_fa", { length: 320 }),
  shortDescriptionEn: varchar("short_description_en", { length: 320 }),
  descriptionFa: text("description_fa"),
  descriptionEn: text("description_en"),
  roleFa: varchar("role_fa", { length: 160 }),
  roleEn: varchar("role_en", { length: 160 }),
  clientFa: varchar("client_fa", { length: 200 }),
  clientEn: varchar("client_en", { length: 200 }),
  challengeFa: text("challenge_fa"),
  challengeEn: text("challenge_en"),
  // Multiple challenges (localized). Nullable/defaulted; the legacy single
  // challenge* columns are kept and mirrored for backward compatibility.
  challengesFa: jsonb("challenges_fa").$type<string[]>().default([]),
  challengesEn: jsonb("challenges_en").$type<string[]>().default([]),
  solutionFa: text("solution_fa"),
  solutionEn: text("solution_en"),
  outcomeFa: text("outcome_fa"),
  outcomeEn: text("outcome_en"),
  tagsFa: jsonb("tags_fa").$type<string[]>().default([]),
  tagsEn: jsonb("tags_en").$type<string[]>().default([]),
  liveUrl: text("live_url"),
  repoUrl: text("repo_url"),
  status: contentStatusEnum("status").notNull().default("draft"),
  isFeatured: boolean("is_featured").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/**
 * Services / Plans
 * Commercial offerings shown on the pricing page.
 */
export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  slug: varchar("slug", { length: 220 }).notNull().unique(),
  tagline: varchar("tagline", { length: 320 }),
  description: text("description"),
  // Price stored in cents to avoid float issues; null = "contact for quote".
  priceCents: integer("price_cents"),
  currency: varchar("currency", { length: 3 }).notNull().default("USD"),
  // Billing interval label, e.g. "one-time", "monthly", "project".
  billingPeriod: varchar("billing_period", { length: 50 }),
  // Bullet-point feature list rendered in the pricing card.
  features: jsonb("features").$type<string[]>().default([]),
  ctaLabel: varchar("cta_label", { length: 80 }).default("Get started"),
  // Localized content (Persian + English).
  nameFa: varchar("name_fa", { length: 200 }),
  nameEn: varchar("name_en", { length: 200 }),
  taglineFa: varchar("tagline_fa", { length: 320 }),
  taglineEn: varchar("tagline_en", { length: 320 }),
  descriptionFa: text("description_fa"),
  descriptionEn: text("description_en"),
  featuresFa: jsonb("features_fa").$type<string[]>().default([]),
  featuresEn: jsonb("features_en").$type<string[]>().default([]),
  ctaLabelFa: varchar("cta_label_fa", { length: 80 }),
  ctaLabelEn: varchar("cta_label_en", { length: 80 }),
  status: contentStatusEnum("status").notNull().default("draft"),
  isFeatured: boolean("is_featured").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/**
 * Portfolio items
 * Lighter-weight gallery/work-sample entries, filterable by type.
 */
export const portfolioItems = pgTable("portfolio_items", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  slug: varchar("slug", { length: 220 }).notNull().unique(),
  description: text("description"),
  imageUrl: text("image_url"),
  // Cover image + ordered gallery (non-destructive; `imageUrl` is the fallback).
  coverImageUrl: text("cover_image_url"),
  galleryImages: jsonb("gallery_images").$type<string[]>().default([]),
  // Tools/technologies used (shared, same format as projects.technologies).
  technologies: jsonb("technologies").$type<string[]>().default([]),
  type: portfolioTypeEnum("type").notNull().default("personal"),
  // Localized content (Persian + English).
  titleFa: varchar("title_fa", { length: 200 }),
  titleEn: varchar("title_en", { length: 200 }),
  descriptionFa: text("description_fa"),
  descriptionEn: text("description_en"),
  // Optional link back to a full project or external work.
  externalUrl: text("external_url"),
  status: contentStatusEnum("status").notNull().default("draft"),
  isFeatured: boolean("is_featured").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/**
 * Contact messages
 * Submissions from the public contact form, managed in the admin inbox.
 */
export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  subject: varchar("subject", { length: 200 }),
  message: text("message").notNull(),
  status: messageStatusEnum("status").notNull().default("new"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/**
 * Site settings / profile
 * Single-row-ish table holding owner profile + global site config.
 */
export const siteSettings = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  ownerName: varchar("owner_name", { length: 200 }).notNull(),
  headline: varchar("headline", { length: 320 }),
  bio: text("bio"),
  avatarUrl: text("avatar_url"),
  resumeUrl: text("resume_url"),
  // Branding / hero assets (uploaded via the admin uploader). All nullable so
  // the change is non-destructive and falls back to existing defaults.
  logoUrl: text("logo_url"),
  faviconUrl: text("favicon_url"),
  heroImageUrl: text("hero_image_url"),
  email: varchar("email", { length: 320 }),
  location: varchar("location", { length: 200 }),
  // Skills list for the about page.
  skills: jsonb("skills").$type<string[]>().default([]),
  // Localized content (Persian + English). Shared: avatar, resume, email, social.
  ownerNameFa: varchar("owner_name_fa", { length: 200 }),
  ownerNameEn: varchar("owner_name_en", { length: 200 }),
  headlineFa: varchar("headline_fa", { length: 320 }),
  headlineEn: varchar("headline_en", { length: 320 }),
  bioFa: text("bio_fa"),
  bioEn: text("bio_en"),
  locationFa: varchar("location_fa", { length: 200 }),
  locationEn: varchar("location_en", { length: 200 }),
  skillsFa: jsonb("skills_fa").$type<string[]>().default([]),
  skillsEn: jsonb("skills_en").$type<string[]>().default([]),
  // About-page secondary intro paragraph (localized).
  aboutIntro: text("about_intro"),
  aboutIntroFa: text("about_intro_fa"),
  aboutIntroEn: text("about_intro_en"),
  // Social links as { label, url } pairs.
  socialLinks: jsonb("social_links")
    .$type<{ label: string; url: string }[]>()
    .default([]),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/**
 * Admin users
 * Credentials for the admin panel. Passwords are stored as scrypt hashes
 * (salt embedded), never in plain text. All admins have full access.
 */
export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: varchar("name", { length: 200 }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/**
 * Project planner requests
 * Submissions from the public "Start a project" wizard. The recommendation
 * (plan/complexity/timeline/score) is computed server-side and stored.
 */
export const projectRequestStatusEnum = pgEnum("project_request_status", [
  "new",
  "reviewed",
  "contacted",
  "in_progress",
  "converted",
  "rejected",
  "archived",
]);

export const projectRequests = pgTable(
  "project_requests",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 200 }).notNull(),
    email: varchar("email", { length: 320 }),
    phone: varchar("phone", { length: 50 }),
    companyName: varchar("company_name", { length: 200 }),
    preferredContactMethod: varchar("preferred_contact_method", { length: 40 }),
    locale: varchar("locale", { length: 5 }).notNull().default("fa"),
    // Planner answers (values are stable option `value`s).
    projectType: varchar("project_type", { length: 60 }).notNull(),
    // Only set when projectType === "cms_wordpress".
    cmsSolutionType: varchar("cms_solution_type", { length: 60 }),
    goals: jsonb("goals").$type<string[]>().default([]),
    features: jsonb("features").$type<string[]>().default([]),
    designLevel: varchar("design_level", { length: 60 }),
    currentStage: varchar("current_stage", { length: 60 }),
    timeline: varchar("timeline", { length: 60 }),
    budgetLevel: varchar("budget_level", { length: 60 }),
    description: text("description"),
    // Server-computed recommendation.
    suggestedPlan: varchar("suggested_plan", { length: 80 }),
    estimatedComplexity: varchar("estimated_complexity", { length: 40 }),
    estimatedTimeline: varchar("estimated_timeline", { length: 80 }),
    score: integer("score").default(0),
    // Estimate snapshot (computed at submission). All nullable for old rows.
    estimatedDays: doublePrecision("estimated_days"),
    estimatedWeeks: doublePrecision("estimated_weeks"),
    estimatedPrice: integer("estimated_price"),
    currency: varchar("currency", { length: 10 }),
    weeklyRateSnapshot: integer("weekly_rate_snapshot"),
    estimateBreakdown: jsonb("estimate_breakdown")
      .$type<EstimateBreakdownItem[]>()
      .default([]),
    // Full dynamic answer map from the conditional wizard (keyed by question id).
    dynamicAnswers: jsonb("dynamic_answers")
      .$type<Record<string, string | string[] | number>>()
      .default({}),
    // Admin workflow.
    status: projectRequestStatusEnum("status").notNull().default("new"),
    adminNote: text("admin_note"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    statusIdx: index("project_requests_status_idx").on(t.status),
    createdAtIdx: index("project_requests_created_at_idx").on(t.createdAt),
  }),
);

/**
 * Planner options
 * Admin-editable option sets for each planner question group. The public
 * planner uses these when present, otherwise falls back to code defaults.
 */
export const plannerOptions = pgTable(
  "planner_options",
  {
    id: serial("id").primaryKey(),
    group: varchar("group", { length: 40 }).notNull(),
    value: varchar("value", { length: 60 }).notNull(),
    labelFa: varchar("label_fa", { length: 200 }),
    labelEn: varchar("label_en", { length: 200 }),
    descriptionFa: text("description_fa"),
    descriptionEn: text("description_en"),
    icon: varchar("icon", { length: 40 }),
    weight: integer("weight").notNull().default(0),
    isActive: boolean("is_active").notNull().default(true),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    groupIdx: index("planner_options_group_idx").on(t.group),
    groupValueIdx: uniqueIndex("planner_options_group_value_idx").on(
      t.group,
      t.value,
    ),
  }),
);

/**
 * Planner estimate rules
 * Admin-editable duration contributions keyed by `key` (e.g. "landing_page_base",
 * "uiux_needed"). The estimator sums matched rules; code defaults are used when
 * the table is empty.
 */
export const plannerEstimateRules = pgTable(
  "planner_estimate_rules",
  {
    id: serial("id").primaryKey(),
    key: varchar("key", { length: 80 }).notNull(),
    group: varchar("group", { length: 40 }).notNull(),
    labelFa: varchar("label_fa", { length: 200 }),
    labelEn: varchar("label_en", { length: 200 }),
    descriptionFa: text("description_fa"),
    descriptionEn: text("description_en"),
    durationDays: doublePrecision("duration_days").notNull().default(0),
    priceMultiplier: doublePrecision("price_multiplier"),
    fixedPrice: integer("fixed_price"),
    isActive: boolean("is_active").notNull().default(true),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    keyIdx: uniqueIndex("planner_estimate_rules_key_idx").on(t.key),
    groupIdx: index("planner_estimate_rules_group_idx").on(t.group),
  }),
);

/**
 * Planner settings (single row) — global pricing/rounding config.
 */
export const plannerSettings = pgTable("planner_settings", {
  id: serial("id").primaryKey(),
  weeklyRate: integer("weekly_rate").notNull().default(15000000),
  currency: varchar("currency", { length: 10 }).notNull().default("تومان"),
  minimumProjectPrice: integer("minimum_project_price"),
  priceRounding: varchar("price_rounding", { length: 20 })
    .notNull()
    .default("nearest_1m"),
  isEstimateEnabled: boolean("is_estimate_enabled").notNull().default(true),
  showPriceToUser: boolean("show_price_to_user").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// Inferred row + insert types — import these instead of redefining shapes.
export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;

export type ProjectRequest = typeof projectRequests.$inferSelect;
export type NewProjectRequest = typeof projectRequests.$inferInsert;

export type PlannerOption = typeof plannerOptions.$inferSelect;
export type NewPlannerOption = typeof plannerOptions.$inferInsert;

export type PlannerEstimateRule = typeof plannerEstimateRules.$inferSelect;
export type NewPlannerEstimateRule = typeof plannerEstimateRules.$inferInsert;

export type PlannerSettings = typeof plannerSettings.$inferSelect;
export type NewPlannerSettings = typeof plannerSettings.$inferInsert;

export type Service = typeof services.$inferSelect;
export type NewService = typeof services.$inferInsert;

export type PortfolioItem = typeof portfolioItems.$inferSelect;
export type NewPortfolioItem = typeof portfolioItems.$inferInsert;

export type ContactMessage = typeof contactMessages.$inferSelect;
export type NewContactMessage = typeof contactMessages.$inferInsert;

export type SiteSettings = typeof siteSettings.$inferSelect;
export type NewSiteSettings = typeof siteSettings.$inferInsert;

export type AdminUser = typeof adminUsers.$inferSelect;
export type NewAdminUser = typeof adminUsers.$inferInsert;
