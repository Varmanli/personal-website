import type { Metadata } from "next";
import { Geist, Geist_Mono, Vazirmatn } from "next/font/google";
import "./globals.css";
import { dirFor } from "@/lib/i18n/config";
import { getI18n } from "@/lib/i18n/server";
import { I18nProvider } from "@/lib/i18n/context";
import { getProfile } from "@/lib/data";
import { siteConfig } from "@/lib/config";
import { absoluteUrl } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Persian/Arabic-script font; falls back gracefully for Latin text.
const vazirmatn = Vazirmatn({
  variable: "--font-vazir",
  subsets: ["arabic"],
});

export async function generateMetadata(): Promise<Metadata> {
  const { locale, dict } = await getI18n();
  const profile = await getProfile(locale);
  const name = profile.ownerName;
  const defaultTitle = `${name} — ${dict.meta.titleSuffix}`;
  const description = profile.headline ?? profile.bio ?? dict.meta.description;
  const ogImage = profile.heroImageUrl || profile.avatarUrl || null;

  // Favicon: an uploaded value wins, with a cache-busting version derived from
  // the settings' updatedAt so a new upload replaces the old tab icon. Falls
  // back to the static /public/favicon.ico when nothing is uploaded.
  const version = profile.updatedAt
    ? new Date(profile.updatedAt).getTime()
    : undefined;
  const faviconHref = profile.faviconUrl
    ? `${profile.faviconUrl}${version ? `?v=${version}` : ""}`
    : "/favicon.ico";

  return {
    metadataBase: new URL(siteConfig.url),
    applicationName: siteConfig.name,
    title: {
      default: defaultTitle,
      template: `%s · ${name}`,
    },
    description,
    alternates: { canonical: "/" },
    icons: {
      icon: faviconHref,
      shortcut: faviconHref,
      apple: faviconHref,
    },
    openGraph: {
      type: "website",
      url: siteConfig.url,
      siteName: name,
      title: defaultTitle,
      description,
      locale: locale === "fa" ? "fa_IR" : "en_US",
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
    twitter: {
      card: ogImage ? "summary_large_image" : "summary",
      title: defaultTitle,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
    robots: { index: true, follow: true },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { locale, dict } = await getI18n();
  const dir = dirFor(locale);
  const profile = await getProfile(locale);

  const sameAs = (profile.socialLinks ?? [])
    .map((link) => link?.url)
    .filter((url): url is string => Boolean(url));

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: siteConfig.name,
      url: siteConfig.url,
      description: profile.headline ?? profile.bio ?? dict.meta.description,
      inLanguage: locale === "fa" ? "fa-IR" : "en-US",
    },
    {
      "@context": "https://schema.org",
      "@type": "Person",
      name: profile.ownerName,
      url: siteConfig.url,
      ...(profile.headline ? { jobTitle: profile.headline } : {}),
      ...(profile.avatarUrl
        ? { image: absoluteUrl(profile.avatarUrl) }
        : {}),
      ...(profile.email ? { email: profile.email } : {}),
      ...(sameAs.length ? { sameAs } : {}),
    },
  ];

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${geistSans.variable} ${geistMono.variable} ${vazirmatn.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <JsonLd data={structuredData} />
        <I18nProvider value={{ locale, dir, dict }}>{children}</I18nProvider>
      </body>
    </html>
  );
}
