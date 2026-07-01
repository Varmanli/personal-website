import type { Metadata } from "next";
import { siteConfig } from "@/lib/config";

/** Resolve a path or relative URL to an absolute URL against the site base. */
export function absoluteUrl(path = "/"): string {
  if (/^https?:\/\//i.test(path)) return path;
  const base = siteConfig.url.replace(/\/$/, "");
  return `${base}${path.startsWith("/") ? "" : "/"}${path}`;
}

interface BuildMetadataInput {
  /** Page title without the site name (the root template appends it). */
  title?: string;
  description?: string | null;
  /** Path relative to the site root, e.g. "/projects". */
  path?: string;
  /** OG/Twitter image (absolute or relative). */
  image?: string | null;
  type?: "website" | "article" | "profile";
}

/**
 * Build a consistent Metadata object for a public page: canonical URL plus
 * Open Graph and Twitter cards, falling back to the site description/name.
 */
export function buildMetadata({
  title,
  description,
  path = "/",
  image,
  type = "website",
}: BuildMetadataInput): Metadata {
  const url = absoluteUrl(path);
  const desc = description?.trim() || siteConfig.description;
  const images = image ? [absoluteUrl(image)] : undefined;

  return {
    ...(title ? { title } : {}),
    description: desc,
    alternates: { canonical: url },
    openGraph: {
      type,
      url,
      siteName: siteConfig.name,
      ...(title ? { title } : {}),
      description: desc,
      ...(images ? { images } : {}),
    },
    twitter: {
      card: images ? "summary_large_image" : "summary",
      ...(title ? { title } : {}),
      description: desc,
      ...(images ? { images } : {}),
    },
  };
}
