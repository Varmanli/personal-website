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
      <main className="relative overflow-hidden">
        <div
          aria-hidden
          className="
      pointer-events-none
      absolute
      left-1/2
      top-0
      h-96
      w-96
      -translate-x-1/2
      rounded-full
      bg-primary/10
      blur-[140px]
      "
        />

        <div className="relative py-12 sm:py-16 lg:py-20">
          <Container>
            <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
              {/* Form */}

              <section
                className="
            rounded-[2rem]
            border
            border-border
            bg-surface
            p-6
            sm:p-8
            "
              >
                <div className="mb-8 space-y-2">
                  <p
                    className="
                text-xs
                font-semibold
                uppercase
                tracking-[0.18em]
                text-primary-light
                "
                  >
                    Contact
                  </p>

                  <h1
                    className="
                text-3xl
                font-bold
                tracking-tight
                "
                  >
                    بیا صحبت کنیم
                  </h1>

                  <p
                    className="
                text-sm
                leading-7
                text-muted
                "
                  >
                    اگر ایده‌ای دارید یا می‌خواهید درباره یک پروژه صحبت کنیم،
                    خوشحال می‌شوم بشنوم.
                  </p>
                </div>

                <ContactForm />
              </section>

              {/* Contact Methods */}

              <aside
                className="
            space-y-6
            "
              >
                {methods.length > 0 && (
                  <section
                    className="
                rounded-[2rem]
                border
                border-border
                bg-surface
                p-6
                sm:p-8
                "
                  >
                    <div className="space-y-2">
                      <h2
                        className="
                    text-xl
                    font-bold
                    tracking-tight
                    "
                      >
                        راه‌های ارتباطی
                      </h2>

                      <p
                        className="
                    text-sm
                    leading-6
                    text-muted
                    "
                      >
                        از هر روشی که راحت‌تر هستید پیام بدهید.
                      </p>
                    </div>

                    <div className="mt-6 space-y-3">
                      {methods.map((item) => {
                        const Icon = contactIconByKey(item.key);

                        const content = (
                          <>
                            <span
                              className="
                          flex
                          h-11
                          w-11
                          shrink-0
                          items-center
                          justify-center
                          rounded-2xl
                          bg-primary/10
                          text-primary-light
                          "
                            >
                              <Icon />
                            </span>

                            <span>
                              <span
                                className="
                            block
                            text-xs
                            text-faint
                            "
                              >
                                {item.label}
                              </span>

                              <span
                                className="
                            mt-1
                            block
                            text-sm
                            font-medium
                            "
                              >
                                {item.value}
                              </span>
                            </span>
                          </>
                        );

                        if (!item.href) {
                          return (
                            <div
                              key={item.key}
                              className="
                          flex
                          items-center
                          gap-4
                          rounded-2xl
                          bg-surface-2
                          p-4
                          "
                            >
                              {content}
                            </div>
                          );
                        }

                        return (
                          <a
                            key={item.key}
                            href={item.href}
                            target={
                              item.href.startsWith("http")
                                ? "_blank"
                                : undefined
                            }
                            rel="noopener noreferrer"
                            className="
                        flex
                        items-center
                        gap-4
                        rounded-2xl
                        bg-surface-2
                        p-4
                        transition
                        hover:-translate-y-1
                        hover:bg-primary/10
                        "
                          >
                            {content}
                          </a>
                        );
                      })}
                    </div>
                  </section>
                )}
              </aside>
            </div>
          </Container>
        </div>
      </main>
    </div>
  );
}
