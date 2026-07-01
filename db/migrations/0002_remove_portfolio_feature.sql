-- Removes the deprecated separate portfolio feature.
-- Review before applying to shared or production databases because it drops data.
DROP TABLE IF EXISTS "portfolio_items";
DROP TYPE IF EXISTS "public"."portfolio_type";
