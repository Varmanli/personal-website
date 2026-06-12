CREATE TYPE "public"."content_status" AS ENUM('draft', 'published', 'archived');--> statement-breakpoint
CREATE TYPE "public"."message_status" AS ENUM('new', 'read', 'archived');--> statement-breakpoint
CREATE TYPE "public"."portfolio_type" AS ENUM('commercial', 'personal', 'freelance');--> statement-breakpoint
CREATE TYPE "public"."project_request_status" AS ENUM('new', 'reviewed', 'contacted', 'in_progress', 'converted', 'rejected', 'archived');--> statement-breakpoint
CREATE TABLE "admin_users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(320) NOT NULL,
	"password_hash" text NOT NULL,
	"name" varchar(200),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "admin_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "contact_messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(200) NOT NULL,
	"email" varchar(320) NOT NULL,
	"subject" varchar(200),
	"message" text NOT NULL,
	"status" "message_status" DEFAULT 'new' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "planner_estimate_rules" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" varchar(80) NOT NULL,
	"group" varchar(40) NOT NULL,
	"label_fa" varchar(200),
	"label_en" varchar(200),
	"description_fa" text,
	"description_en" text,
	"duration_days" double precision DEFAULT 0 NOT NULL,
	"price_multiplier" double precision,
	"fixed_price" integer,
	"is_active" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "planner_options" (
	"id" serial PRIMARY KEY NOT NULL,
	"group" varchar(40) NOT NULL,
	"value" varchar(60) NOT NULL,
	"label_fa" varchar(200),
	"label_en" varchar(200),
	"description_fa" text,
	"description_en" text,
	"icon" varchar(40),
	"weight" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "planner_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"weekly_rate" integer DEFAULT 15000000 NOT NULL,
	"currency" varchar(10) DEFAULT 'تومان' NOT NULL,
	"minimum_project_price" integer,
	"price_rounding" varchar(20) DEFAULT 'nearest_1m' NOT NULL,
	"is_estimate_enabled" boolean DEFAULT true NOT NULL,
	"show_price_to_user" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "portfolio_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(200) NOT NULL,
	"slug" varchar(220) NOT NULL,
	"description" text,
	"image_url" text,
	"cover_image_url" text,
	"gallery_images" jsonb DEFAULT '[]'::jsonb,
	"technologies" jsonb DEFAULT '[]'::jsonb,
	"type" "portfolio_type" DEFAULT 'personal' NOT NULL,
	"title_fa" varchar(200),
	"title_en" varchar(200),
	"description_fa" text,
	"description_en" text,
	"external_url" text,
	"status" "content_status" DEFAULT 'draft' NOT NULL,
	"is_featured" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "portfolio_items_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "project_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(200) NOT NULL,
	"email" varchar(320),
	"phone" varchar(50),
	"company_name" varchar(200),
	"preferred_contact_method" varchar(40),
	"locale" varchar(5) DEFAULT 'fa' NOT NULL,
	"project_type" varchar(60) NOT NULL,
	"cms_solution_type" varchar(60),
	"goals" jsonb DEFAULT '[]'::jsonb,
	"features" jsonb DEFAULT '[]'::jsonb,
	"design_level" varchar(60),
	"current_stage" varchar(60),
	"timeline" varchar(60),
	"budget_level" varchar(60),
	"description" text,
	"suggested_plan" varchar(80),
	"estimated_complexity" varchar(40),
	"estimated_timeline" varchar(80),
	"score" integer DEFAULT 0,
	"estimated_days" double precision,
	"estimated_weeks" double precision,
	"estimated_price" integer,
	"currency" varchar(10),
	"weekly_rate_snapshot" integer,
	"estimate_breakdown" jsonb DEFAULT '[]'::jsonb,
	"dynamic_answers" jsonb DEFAULT '{}'::jsonb,
	"status" "project_request_status" DEFAULT 'new' NOT NULL,
	"admin_note" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(200) NOT NULL,
	"slug" varchar(220) NOT NULL,
	"short_description" varchar(320),
	"description" text,
	"thumbnail_url" text,
	"cover_image_url" text,
	"gallery_images" jsonb DEFAULT '[]'::jsonb,
	"media" jsonb DEFAULT '[]'::jsonb,
	"technologies" jsonb DEFAULT '[]'::jsonb,
	"tags" jsonb DEFAULT '[]'::jsonb,
	"role" varchar(160),
	"client" varchar(200),
	"year" varchar(16),
	"project_type" varchar(120),
	"preview_image_url" text,
	"is_featured_on_home" boolean DEFAULT false NOT NULL,
	"home_order" integer DEFAULT 0 NOT NULL,
	"home_metrics" jsonb DEFAULT '[]'::jsonb,
	"technical_highlights" jsonb DEFAULT '[]'::jsonb,
	"challenge" text,
	"solution" text,
	"outcome" text,
	"title_fa" varchar(200),
	"title_en" varchar(200),
	"short_description_fa" varchar(320),
	"short_description_en" varchar(320),
	"description_fa" text,
	"description_en" text,
	"role_fa" varchar(160),
	"role_en" varchar(160),
	"client_fa" varchar(200),
	"client_en" varchar(200),
	"project_type_fa" varchar(120),
	"project_type_en" varchar(120),
	"home_metrics_fa" jsonb DEFAULT '[]'::jsonb,
	"home_metrics_en" jsonb DEFAULT '[]'::jsonb,
	"technical_highlights_fa" jsonb DEFAULT '[]'::jsonb,
	"technical_highlights_en" jsonb DEFAULT '[]'::jsonb,
	"challenge_fa" text,
	"challenge_en" text,
	"challenges_fa" jsonb DEFAULT '[]'::jsonb,
	"challenges_en" jsonb DEFAULT '[]'::jsonb,
	"solution_fa" text,
	"solution_en" text,
	"outcome_fa" text,
	"outcome_en" text,
	"tags_fa" jsonb DEFAULT '[]'::jsonb,
	"tags_en" jsonb DEFAULT '[]'::jsonb,
	"live_url" text,
	"repo_url" text,
	"status" "content_status" DEFAULT 'draft' NOT NULL,
	"is_featured" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "projects_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "services" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(200) NOT NULL,
	"slug" varchar(220) NOT NULL,
	"tagline" varchar(320),
	"description" text,
	"price_cents" integer,
	"currency" varchar(3) DEFAULT 'USD' NOT NULL,
	"billing_period" varchar(50),
	"features" jsonb DEFAULT '[]'::jsonb,
	"cta_label" varchar(80) DEFAULT 'Get started',
	"name_fa" varchar(200),
	"name_en" varchar(200),
	"tagline_fa" varchar(320),
	"tagline_en" varchar(320),
	"description_fa" text,
	"description_en" text,
	"features_fa" jsonb DEFAULT '[]'::jsonb,
	"features_en" jsonb DEFAULT '[]'::jsonb,
	"cta_label_fa" varchar(80),
	"cta_label_en" varchar(80),
	"status" "content_status" DEFAULT 'draft' NOT NULL,
	"is_featured" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "services_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "site_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"owner_name" varchar(200) NOT NULL,
	"headline" varchar(320),
	"bio" text,
	"avatar_url" text,
	"resume_url" text,
	"logo_url" text,
	"favicon_url" text,
	"hero_image_url" text,
	"email" varchar(320),
	"location" varchar(200),
	"skills" jsonb DEFAULT '[]'::jsonb,
	"owner_name_fa" varchar(200),
	"owner_name_en" varchar(200),
	"headline_fa" varchar(320),
	"headline_en" varchar(320),
	"bio_fa" text,
	"bio_en" text,
	"location_fa" varchar(200),
	"location_en" varchar(200),
	"skills_fa" jsonb DEFAULT '[]'::jsonb,
	"skills_en" jsonb DEFAULT '[]'::jsonb,
	"about_intro" text,
	"about_intro_fa" text,
	"about_intro_en" text,
	"social_links" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "planner_estimate_rules_key_idx" ON "planner_estimate_rules" USING btree ("key");--> statement-breakpoint
CREATE INDEX "planner_estimate_rules_group_idx" ON "planner_estimate_rules" USING btree ("group");--> statement-breakpoint
CREATE INDEX "planner_options_group_idx" ON "planner_options" USING btree ("group");--> statement-breakpoint
CREATE UNIQUE INDEX "planner_options_group_value_idx" ON "planner_options" USING btree ("group","value");--> statement-breakpoint
CREATE INDEX "project_requests_status_idx" ON "project_requests" USING btree ("status");--> statement-breakpoint
CREATE INDEX "project_requests_created_at_idx" ON "project_requests" USING btree ("created_at");