ALTER TABLE "site_settings"
ADD COLUMN IF NOT EXISTS "about_page_content" jsonb,
ADD COLUMN IF NOT EXISTS "about_page_content_fa" jsonb,
ADD COLUMN IF NOT EXISTS "about_page_content_en" jsonb;
