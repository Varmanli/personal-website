import type { Metadata } from "next";
import type { IconType } from "react-icons";
import {
  FiArrowUpRight,
  FiBriefcase,
  FiClock,
  FiHelpCircle,
  FiMail,
  FiMapPin,
  FiMessageSquare,
  FiPhone,
  FiSearch,
  FiSend,
  FiZap,
} from "react-icons/fi";
import {
  FaBehance,
  FaDribbble,
  FaGithub,
  FaInstagram,
  FaLinkedinIn,
  FaTelegram,
  FaWhatsapp,
  FaXTwitter,
} from "react-icons/fa6";
import { ContactForm } from "@/components/forms/ContactForm";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getContactLinkEntries } from "@/lib/contact-page";
import { getContactPageContent, getProfile } from "@/lib/data";
import { getI18n } from "@/lib/i18n/server";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getI18n();
  return buildMetadata({
    title: dict.meta.pages.contact,
    description: dict.contact.subtitle,
    path: "/contact",
  });
}

export const dynamic = "force-dynamic";

function isPublicEmail(value: string | null | undefined): value is string {
  if (!value) return false;
  return !/@example\.com$/i.test(value.trim());
}

function infoIconByKey(key: string | undefined): IconType {
  const normalized =
    key
      ?.trim()
      .toLowerCase()
      .replace(/[\s_-]+/g, "") ?? "";
  const map = {
    clock: FiClock,
    briefcase: FiBriefcase,
    message: FiMessageSquare,
    send: FiSend,
    search: FiSearch,
    help: FiHelpCircle,
    zap: FiZap,
  } as const;

  return map[normalized as keyof typeof map] ?? FiMessageSquare;
}

function contactIconByKey(key: string): IconType {
  const map = {
    email: FiMail,
    location: FiMapPin,
    phone: FiPhone,
    telegram: FaTelegram,
    whatsapp: FaWhatsapp,
    github: FaGithub,
    linkedin: FaLinkedinIn,
    instagram: FaInstagram,
    twitter: FaXTwitter,
    dribbble: FaDribbble,
    behance: FaBehance,
  } as const;

  return map[key as keyof typeof map] ?? FiArrowUpRight;
}

export default async function ContactPage() {
  const { locale, dict } = await getI18n();
  const [profile, content] = await Promise.all([
    getProfile(locale),
    getContactPageContent(locale),
  ]);
  const t = dict.contact;
  const email = isPublicEmail(profile.email) ? profile.email : null;

  const methods = [
    ...(email
      ? [
          {
            key: "email",
            label: t.email,
            value: email,
            href: `mailto:${email}`,
          },
        ]
      : []),
    ...(profile.location
      ? [
          {
            key: "location",
            label: t.location,
            value: profile.location,
            href: null,
          },
        ]
      : []),
    ...getContactLinkEntries(profile.contactSettings).map((item) => ({
      ...item,
      href: item.href,
    })),
  ];

  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden border-b border-border">
        <div
          aria-hidden
          className="absolute inset-0 grid-bg mask-[radial-gradient(ellipse_at_center,black,transparent_76%)] opacity-60"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-primary/15 blur-[120px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 top-0 h-72 w-72 rounded-full bg-accent/10 blur-[120px]"
        />

        <Container className="relative py-12 sm:py-14 lg:py-16">
          <div className="max-w-3xl space-y-4">
            <SectionHeader
              eyebrow={content.hero.badge}
              title={content.hero.title}
              subtitle={content.hero.subtitle}
            />
            <p className="text-sm leading-7 text-faint">
              {content.hero.supportingText}
            </p>
          </div>
        </Container>
      </section>

      <main className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-32 h-120 w-120 -translate-x-1/2 rounded-full bg-primary/8 blur-[150px]"
        />

        <div className="relative flex flex-col gap-12 py-12 sm:py-16 lg:gap-16">
          <Container as="section">
            <div className="grid gap-5 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
              <div className="neon-card rounded-[1.75rem] p-5 sm:p-6">
                <ContactForm />
              </div>

              <div className="space-y-5">
                {methods.length > 0 && (
                  <article className="neon-card rounded-[1.75rem] p-5 sm:p-6">
                    <div className="space-y-1.5">
                      <h2 className="text-lg font-semibold tracking-tight text-foreground">
                        {t.methodsTitle}
                      </h2>
                      <p className="text-sm leading-6 text-faint">
                        {t.methodsSubtitle}
                      </p>
                    </div>

                    <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
                      {methods.map((item) => {
                        const Icon = contactIconByKey(item.key);
                        const contentNode = (
                          <>
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border bg-background/55 text-sm text-primary-light backdrop-blur">
                              <Icon />
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-faint">
                                {item.label}
                              </span>
                              <span
                                className="mt-1 block truncate text-sm font-medium text-foreground"
                                dir={item.key === "email" ? "ltr" : undefined}
                              >
                                {item.value}
                              </span>
                            </span>
                            {item.href && (
                              <span
                                aria-hidden
                                className="shrink-0 text-primary-light opacity-70"
                              >
                                ↗
                              </span>
                            )}
                          </>
                        );

                        if (!item.href) {
                          return (
                            <div
                              key={`${item.key}-${item.value}`}
                              className="flex items-center gap-3 rounded-2xl border border-border bg-surface-2/45 px-3.5 py-2.5"
                            >
                              {contentNode}
                            </div>
                          );
                        }

                        return (
                          <a
                            key={`${item.key}-${item.value}`}
                            href={item.href}
                            target={
                              item.href.startsWith("http")
                                ? "_blank"
                                : undefined
                            }
                            rel={
                              item.href.startsWith("http")
                                ? "noopener noreferrer"
                                : undefined
                            }
                            className="group flex items-center gap-3 rounded-2xl border border-border bg-surface-2/45 px-3.5 py-2.5 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/10"
                          >
                            {contentNode}
                          </a>
                        );
                      })}
                    </div>
                  </article>
                )}
              </div>
            </div>
          </Container>

          {content.processSection.steps.length > 0 && (
            <Container as="section" className="space-y-6">
              <SectionHeader
                eyebrow={content.processSection.badge}
                title={content.processSection.title}
                subtitle={content.processSection.subtitle}
              />
              <div className="grid gap-4 md:grid-cols-3">
                {content.processSection.steps.map((step, index) => {
                  const Icon = infoIconByKey(step.icon);
                  return (
                    <article
                      key={`${step.order}-${step.title}`}
                      className="neon-card rounded-3xl p-5"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-3">
                          <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-background/55 text-sm text-primary-light backdrop-blur">
                            <Icon />
                          </span>
                          <span className="text-xs font-semibold tracking-[0.18em] text-faint">
                            0{index + 1}
                          </span>
                        </div>
                        <div className="space-y-1">
                          <h3 className="text-base font-semibold tracking-tight text-foreground">
                            {step.title}
                          </h3>
                          <p className="text-sm leading-6 text-muted">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </Container>
          )}

          <Container as="section">
            <div className="neon-card relative overflow-hidden rounded-[1.75rem] p-6 sm:p-8">
              <div
                aria-hidden
                className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-accent/10"
              />

              <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-2xl space-y-3">
                  <p className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-2/60 px-3 py-1.5 text-xs font-semibold tracking-[0.16em] text-primary-light backdrop-blur">
                    <span className="h-1.5 w-1.5 rounded-full bg-success shadow-[0_0_14px_rgba(52,211,153,0.7)]" />
                    {dict.footer.available}
                  </p>
                  <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                    {content.cta.title}
                  </h2>
                  <p className="text-sm leading-7 text-muted sm:text-base">
                    {content.cta.subtitle}
                  </p>
                </div>

                <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                  <ButtonLink
                    href={content.cta.primaryCta.href}
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    {content.cta.primaryCta.label}
                  </ButtonLink>
                  <ButtonLink
                    href={content.cta.secondaryCta.href}
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto"
                  >
                    {content.cta.secondaryCta.label}
                  </ButtonLink>
                </div>
              </div>
            </div>
          </Container>
        </div>
      </main>
    </div>
  );
}
