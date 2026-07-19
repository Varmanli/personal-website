import Link from "next/link";
import {
  FaGithub,
  FaLinkedinIn,
  FaTelegram,
  FaInstagram,
  FaXTwitter,
  FaDribbble,
  FaBehance,
  FaGlobe,
} from "react-icons/fa6";
import { SiNextdotjs, SiReact, SiNestjs, SiPostgresql } from "react-icons/si";
import { Container } from "@/components/ui/Container";
import { mainNav, type MainNavItem } from "@/lib/config";
import { getFooterSocialLinks } from "@/lib/contact-page";
import { getProfile } from "@/lib/data";
import { getI18n } from "@/lib/i18n/server";
import {
  getWebsiteMode,
  getWebsiteNavigation,
  shouldShowWebsiteLink,
} from "@/lib/website-mode";

const technologies = [
  { name: "Next.js", icon: <SiNextdotjs /> },
  { name: "React", icon: <SiReact /> },
  { name: "NestJS", icon: <SiNestjs /> },
  { name: "PostgreSQL", icon: <SiPostgresql /> },
];

const serviceLinks: MainNavItem[] = [
  { href: "/services", key: "services" },
  { href: "/projects", key: "projects" },
  { href: "/contact", key: "contact" },
];

function getSocialIcon(label: string) {
  const normalized = label.toLowerCase();

  if (normalized.includes("github")) return <FaGithub />;
  if (normalized.includes("linkedin")) return <FaLinkedinIn />;
  if (normalized.includes("telegram")) return <FaTelegram />;
  if (normalized.includes("instagram")) return <FaInstagram />;
  if (normalized.includes("twitter") || normalized.includes("x"))
    return <FaXTwitter />;
  if (normalized.includes("dribbble")) return <FaDribbble />;
  if (normalized.includes("behance")) return <FaBehance />;

  return <FaGlobe />;
}

/** Global site footer. */
export async function Footer() {
  const year = new Date().getFullYear();
  const { locale, dict } = await getI18n();
  const [profile, mode] = await Promise.all([
    getProfile(locale),
    getWebsiteMode(),
  ]);
  const f = dict.footer;
  const socialLinks = getFooterSocialLinks(profile);

  const brandName = profile.ownerName?.trim() || "Varmanli";
  const brandInitial = brandName.charAt(0) || "V";

  return (
    <footer className="relative mt-auto overflow-hidden border-t border-white/10 bg-[#050714] text-foreground">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/45 to-transparent"
      />
      <div
        aria-hidden
        className="absolute -bottom-48 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-primary/12 blur-[130px]"
      />

      <Container className="relative py-10 sm:py-12">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-5">
            <Link
              href="/"
              className="group inline-flex items-center gap-3"
              aria-label={brandName}
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/4.5 text-sm font-black text-white shadow-[0_0_24px_rgba(79,124,255,0.2)] transition-all group-hover:border-primary/40 group-hover:bg-primary/10 group-hover:text-primary-light">
                {brandInitial}
              </span>

              <span className="flex flex-col">
                <span className="text-lg font-black tracking-tight text-white">
                  {brandName}
                </span>
                <span className="text-xs font-medium text-faint">
                  Front-End Developer
                </span>
              </span>
            </Link>

            <p className="mt-4 max-w-md text-sm leading-7 text-muted">
              {f.brandText}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {technologies.map((tech) => (
                <span
                  key={tech.name}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 text-xs font-medium text-faint transition-colors hover:border-primary/35 hover:text-primary-light"
                >
                  <span className="text-sm text-primary-light">
                    {tech.icon}
                  </span>
                  {tech.name}
                </span>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-faint">
              {f.navigate}
            </h3>

            <ul className="mt-4 grid grid-cols-2 gap-x-5 gap-y-2.5">
              {getWebsiteNavigation(mode, mainNav).map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm font-medium text-muted transition-colors hover:text-white"
                  >
                    {dict.nav[link.key]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {shouldShowWebsiteLink(mode, "/services") && (
            <div className="lg:col-span-2">
              <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-faint">
                {f.services}
              </h3>

              <ul className="mt-4 space-y-2.5">
                {serviceLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm font-medium text-muted transition-colors hover:text-white"
                    >
                      {dict.nav[link.key]}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Connect */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-faint">
              {f.connect}
            </h3>

            {socialLinks.length ? (
              <ul className="mt-4 flex flex-wrap gap-2">
                {socialLinks.map((social) => (
                  <li key={social.url}>
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      title={social.label}
                      className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.035] text-base text-muted transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/10 hover:text-primary-light hover:shadow-[0_12px_34px_rgba(79,124,255,0.14)]"
                    >
                      {getSocialIcon(social.label)}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 max-w-xs text-sm leading-7 text-muted">
                {f.connectEmpty}
              </p>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-5 text-sm text-faint sm:flex-row">
          <p className="text-center sm:text-start">
            © {year} {brandName}. {f.rights}
          </p>

          <p className="inline-flex items-center gap-2 text-center sm:text-end">
            <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_14px_rgba(79,124,255,0.85)]" />
            {f.built}
          </p>
        </div>
      </Container>
    </footer>
  );
}
