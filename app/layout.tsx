import type { Metadata } from "next";
import { Geist, Geist_Mono, Vazirmatn } from "next/font/google";
import "./globals.css";
import { dirFor } from "@/lib/i18n/config";
import { getI18n } from "@/lib/i18n/server";
import { I18nProvider } from "@/lib/i18n/context";
import { getProfile } from "@/lib/data";

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
  return {
    title: {
      default: `${name} — ${dict.meta.titleSuffix}`,
      template: `%s · ${name}`,
    },
    description: profile.headline ?? profile.bio ?? dict.meta.description,
    // Use an uploaded favicon when present; otherwise Next falls back to the
    // bundled app/favicon.ico automatically.
    ...(profile.faviconUrl
      ? { icons: { icon: profile.faviconUrl } }
      : {}),
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { locale, dict } = await getI18n();
  const dir = dirFor(locale);

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${geistSans.variable} ${geistMono.variable} ${vazirmatn.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <I18nProvider value={{ locale, dir, dict }}>{children}</I18nProvider>
      </body>
    </html>
  );
}
