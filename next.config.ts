import type { NextConfig } from "next";

/**
 * Allow next/image to optimise externally-hosted legacy uploads. Current
 * uploads are served locally through `/uploads/...`, which needs no remote
 * image config, but old absolute URLs must keep working unchanged.
 */
const remotePatterns: NonNullable<NextConfig["images"]>["remotePatterns"] = [
  { protocol: "https", hostname: "**.arvanstorage.ir" },
  { protocol: "https", hostname: "**.arvanstorage.com" },
];

const externalUploadBase = process.env.NEXT_PUBLIC_UPLOAD_BASE_URL;
if (externalUploadBase?.startsWith("http")) {
  try {
    const { protocol, hostname } = new URL(externalUploadBase);
    if (!remotePatterns.some((p) => p.hostname === hostname)) {
      remotePatterns.push({ protocol: protocol.replace(":", "") as "http" | "https", hostname });
    }
  } catch {
    // Ignore an invalid NEXT_PUBLIC_UPLOAD_BASE_URL.
  }
}

const nextConfig: NextConfig = {
  // Standalone output for Docker/Coolify deployments — bundles only the
  // production dependencies actually needed into .next/standalone.
  output: "standalone",
  images: {
    remotePatterns,
    // Permit high-quality responsive variants for large portfolio screenshots.
    qualities: [75, 85, 90, 92, 95],
  },
};

export default nextConfig;
