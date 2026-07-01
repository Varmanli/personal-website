import type { NextConfig } from "next";

/**
 * Allow next/image to optimise images served from ArvanCloud Object Storage.
 * Covers all Arvan storage subdomains plus, if set, the host of
 * S3_PUBLIC_BASE_URL — so custom buckets/CDN domains work without edits.
 */
const remotePatterns: NonNullable<NextConfig["images"]>["remotePatterns"] = [
  { protocol: "https", hostname: "**.arvanstorage.ir" },
  { protocol: "https", hostname: "**.arvanstorage.com" },
];

const publicBase = process.env.S3_PUBLIC_BASE_URL;
if (publicBase) {
  try {
    const { hostname } = new URL(publicBase);
    if (!remotePatterns.some((p) => p.hostname === hostname)) {
      remotePatterns.push({ protocol: "https", hostname });
    }
  } catch {
    // Ignore an invalid S3_PUBLIC_BASE_URL — the wildcard patterns still apply.
  }
}

const nextConfig: NextConfig = {
  // Standalone output for Docker/Coolify deployments — bundles only the
  // production dependencies actually needed into .next/standalone.
  output: "standalone",
  images: { remotePatterns },
};

export default nextConfig;
