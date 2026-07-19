ALTER TABLE "site_settings"
  ADD COLUMN IF NOT EXISTS "website_mode" varchar(20) NOT NULL DEFAULT 'freelance';
