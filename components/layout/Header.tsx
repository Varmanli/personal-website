import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Navigation } from "@/components/layout/Navigation";
import { MobileNav } from "@/components/layout/MobileNav";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { ButtonLink } from "@/components/ui/Button";
import { getI18n } from "@/lib/i18n/server";
import { getProfile } from "@/lib/data";

/** Global site header with brand, centered nav, language switch, and a CTA. */
export async function Header() {
  const { locale, dict } = await getI18n();
  const profile = await getProfile(locale);
  const brand = "Varmanli";
  // Prefer an uploaded résumé for the CV button; fall back to the contact page.
  const cvHref = profile.resumeUrl || "/contact";

  return (
    <header className="sticky top-0 z-40 border-b border-border glass backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between gap-4">
        {/* Logo — uploaded logo if present, otherwise the brand letter-mark. */}
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-bold tracking-tight text-foreground"
        >
          {profile.logoUrl ? (
            <Image
              src={profile.logoUrl}
              alt={brand}
              width={40}
              height={40}
              className="h-10 w-auto object-contain"
              priority
            />
          ) : (
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 text-lg font-extrabold text-white shadow-md">
              {brand.charAt(0)}
            </span>
          )}
          <span className="text-xl font-semibold">{brand}</span>
        </Link>

        {/* Centered desktop nav */}
        <Navigation className="absolute left-1/2 hidden -translate-x-1/2 md:flex" />

        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageSwitcher />
          <ButtonLink
            href={cvHref}
            external={Boolean(profile.resumeUrl)}
            size="sm"
            className="hidden sm:inline-flex"
          >
            {dict.common.downloadCv}
          </ButtonLink>
          <MobileNav />
        </div>
      </Container>
    </header>
  );
}
