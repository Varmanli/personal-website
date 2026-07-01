ALTER TABLE "contact_messages"
ADD COLUMN IF NOT EXISTS "project_type" varchar(80),
ADD COLUMN IF NOT EXISTS "budget_range" varchar(120),
ADD COLUMN IF NOT EXISTS "timeline" varchar(80);

ALTER TABLE "site_settings"
ADD COLUMN IF NOT EXISTS "contact_page_content" jsonb,
ADD COLUMN IF NOT EXISTS "contact_page_content_fa" jsonb,
ADD COLUMN IF NOT EXISTS "contact_page_content_en" jsonb,
ADD COLUMN IF NOT EXISTS "contact_settings" jsonb;
