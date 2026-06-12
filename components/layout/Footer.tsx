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
import { getProfile } from "@/lib/data";
import { getI18n } from "@/lib/i18n/server";

const technologies = [
  { name: "Next.js", icon: <SiNextdotjs /> },
  { name: "React", icon: <SiReact /> },
  { name: "NestJS", icon: <SiNestjs /> },
  { name: "PostgreSQL", icon: <SiPostgresql /> },
];

const serviceLinks: MainNavItem[] = [
  { href: "/services", key: "services" },
  { href: "/projects", key: "projects" },
  { href: "/portfolio", key: "portfolio" },
];

function getSocialIcon(label: string) {
  const normalized = label.toLowerCase();

  if (normalized.includes("github")) return <FaGithub />;
  if (normalized.includes("linkedin")) return <FaLinkedinIn />;
  if (normalized.includes("telegram")) return <FaTelegram />;
  if (normalized.includes("instagram")) return <FaInstagram />;
  if (normalized.includes("twitter") || normalized.includes("x")) {
    return <FaXTwitter />;
  }
  if (normalized.includes("dribbble")) return <FaDribbble />;
  if (normalized.includes("behance")) return <FaBehance />;

  return <FaGlobe />;
}

/** Global site footer. */
export async function Footer() {
  const year = new Date().getFullYear();
  const { locale, dict } = await getI18n();
  const profile = await getProfile(locale);
  const f = dict.footer;

  return (
    <footer className="relative mt-auto overflow-hidden border-t border-border bg-background">
      {/* Background effects */}
      <div
        aria-hidden
        className="absolute inset-0 grid-bg opacity-25 mask-[linear-gradient(to_top,black,transparent_78%)]"
      />
      <div
        aria-hidden
        className="absolute -bottom-36 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-primary/15 blur-[120px]"
      />
      <div
        aria-hidden
        className="absolute -right-40 top-10 h-72 w-72 rounded-full bg-accent/10 blur-[110px]"
      />

      <Container className="relative py-12 sm:py-14">
        <div className="grid gap-10 py-4 lg:grid-cols-12">
          {/* Brand */}
          <div className="lg:col-span-5">
            <Link
              href="/"
              className="inline-flex items-center gap-3 text-base font-bold text-foreground"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-linear-to-br from-primary to-accent text-sm font-bold text-white shadow-lg shadow-primary/30">
                {profile.ownerName.charAt(0)}
              </span>

              <span className="text-lg tracking-tight">
                {profile.ownerName}
              </span>
            </Link>

            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
              {f.brandText}
            </p>

            <div className="mt-5 grid max-w-md grid-cols-2 gap-2 sm:grid-cols-4">
              {technologies.map((tech) => (
                <span
                  key={tech.name}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border bg-surface-2/45 px-3 py-2 text-xs font-medium text-faint backdrop-blur transition-all hover:border-primary/40 hover:bg-primary/10 hover:text-primary-light"
                >
                  <span className="text-base text-primary-light">
                    {tech.icon}
                  </span>
                  {tech.name}
                </span>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-faint">
              {f.navigate}
            </h3>

            <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3">
              {mainNav.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-primary/50 opacity-0 shadow-[0_0_12px_rgba(79,124,255,0.7)] transition-opacity group-hover:opacity-100" />
                    {dict.nav[link.key]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-faint">
              {f.services}
            </h3>

            <ul className="mt-4 space-y-3">
              {serviceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted transition-colors hover:text-foreground"
                  >
                    {dict.nav[link.key]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-faint">
              {f.connect}
            </h3>

            {profile.socialLinks?.length ? (
              <ul className="mt-4 grid gap-2.5">
                {profile.socialLinks.map((social) => (
                  <li key={social.url}>
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex min-h-12 items-center gap-3 rounded-2xl border border-border bg-surface-2/45 px-3 py-2.5 text-sm text-muted backdrop-blur transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/10 hover:text-foreground hover:shadow-[0_14px_45px_rgba(79,124,255,0.12)]"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-border bg-background/60 text-base text-primary-light transition-colors group-hover:border-primary/40 group-hover:bg-primary/10">
                        {getSocialIcon(social.label)}
                      </span>

                      <span className="min-w-0 flex-1 truncate font-medium">
                        {social.label}
                      </span>

                      <span
                        aria-hidden
                        className="shrink-0 text-primary-light opacity-50 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
                      >
                        ↗
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
                {f.connectEmpty}
              </p>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-sm text-faint sm:flex-row">
          <p>
            © {year} {profile.ownerName}. {f.rights}
          </p>

          <p className="inline-flex items-center gap-2 text-center sm:text-right">
            <span className="h-1.5 w-1.5 rounded-full bg-linear-to-r from-primary to-accent shadow-[0_0_14px_rgba(166,107,255,0.8)]" />
            {f.built}
          </p>
        </div>
      </Container>
    </footer>
  );
}
