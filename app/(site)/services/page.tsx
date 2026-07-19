import type { Metadata } from "next";
import type { IconType } from "react-icons";
import {
  FiArrowUpLeft,
  FiCode,
  FiLayers,
  FiLayout,
  FiLink,
  FiMonitor,
  FiPenTool,
  FiSearch,
  FiSend,
  FiServer,
  FiTrendingUp,
  FiZap,
} from "react-icons/fi";
import { ServicePlanCard } from "@/components/cards/ServicePlanCard";
import { ButtonLink } from "@/components/ui/Button";
import { PublicCtaLink } from "@/components/ui/PublicCtaLink";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatPill } from "@/components/ui/StatPill";
import { getPublishedServices } from "@/lib/data";
import { getI18n } from "@/lib/i18n/server";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getI18n();
  return buildMetadata({
    title: dict.meta.pages.services,
    description: dict.services.subtitle,
    path: "/services",
  });
}

export const dynamic = "force-dynamic";

interface MarketingCard {
  title: string;
  description: string;
  items: string[];
  icon: IconType;
}

interface MiniCard {
  title: string;
  description: string;
  icon: IconType;
}

const servicesPageContent = {
  fa: {
    serviceSection: {
      eyebrow: "خدمات",
      title: "چه چیزهایی می‌توانم بسازم؟",
      subtitle:
        "تمرکز من روی ساخت محصولاتی است که هم از نظر فنی قابل اعتماد باشند، هم از نظر تجربه کاربری و نتیجه تجاری ارزش ایجاد کنند.",
      cards: [
        {
          title: "طراحی و توسعه وب‌سایت",
          description:
            "وب‌سایت‌های سریع، ریسپانسیو، سئو محور و قابل مدیریت برای برند شخصی، شرکت، خدمات یا محصول.",
          items: [
            "طراحی رابط کاربری",
            "پیاده‌سازی فرانت‌اند",
            "سئو پایه",
            "پنل مدیریت محتوا",
            "فرم تماس و مسیر جذب مشتری",
          ],
          icon: FiMonitor,
        },
        {
          title: "ساخت پنل مدیریت",
          description:
            "داشبوردهای اختصاصی برای مدیریت کاربران، محتوا، سفارش‌ها، داده‌ها، گزارش‌ها و جریان‌های عملیاتی.",
          items: [
            "احراز هویت و نقش‌ها",
            "جدول‌ها و فیلترها",
            "فرم‌های پیشرفته",
            "گزارش‌گیری",
            "مدیریت وضعیت‌ها",
          ],
          icon: FiLayers,
        },
        {
          title: "توسعه وب‌اپلیکیشن",
          description:
            "پیاده‌سازی وب‌اپ‌های تعاملی با بک‌اند، دیتابیس، API، پرداخت، اشتراک و منطق‌های اختصاصی.",
          items: [
            "معماری فول‌استک",
            "API و دیتابیس",
            "پرداخت و کیف پول",
            "اعلان‌ها",
            "توسعه‌پذیری",
          ],
          icon: FiServer,
        },
        {
          title: "بهینه‌سازی پروژه موجود",
          description:
            "بهبود سرعت، UI/UX، سئو، ساختار کد، دیتابیس، دیپلوی و پایداری پروژه‌های فعلی.",
          items: [
            "بررسی فنی",
            "بهینه‌سازی عملکرد",
            "اصلاح UI/UX",
            "رفع باگ",
            "آماده‌سازی برای رشد",
          ],
          icon: FiTrendingUp,
        },
      ] satisfies MarketingCard[],
    },
    factorsSection: {
      eyebrow: "برآورد هزینه",
      title: "چه چیزهایی روی هزینه پروژه اثر می‌گذارند؟",
      subtitle:
        "هزینه پروژه فقط به تعداد صفحات وابسته نیست؛ امکانات، معماری، سطح طراحی و مسیر توسعه هم مهم‌اند.",
      cards: [
        {
          title: "تعداد صفحات و مسیرها",
          description:
            "هرچه ساختار صفحات و مسیرهای کاربر بیشتر باشد، زمان طراحی و پیاده‌سازی بیشتر می‌شود.",
          icon: FiLayout,
        },
        {
          title: "سطح طراحی و UI/UX",
          description:
            "طراحی اختصاصی، حالت‌های مختلف، انیمیشن‌ها و جزئیات تجربه کاربری روی هزینه اثر دارند.",
          icon: FiPenTool,
        },
        {
          title: "بک‌اند و منطق‌های اختصاصی",
          description:
            "احراز هویت، نقش‌ها، پرداخت، اشتراک، کیف پول، اعلان‌ها و داشبوردها پیچیدگی پروژه را بیشتر می‌کنند.",
          icon: FiServer,
        },
        {
          title: "اتصال به سرویس‌ها",
          description:
            "درگاه پرداخت، پیامک، ایمیل، نقشه، APIهای خارجی و اتوماسیون‌ها نیاز به زمان و تست دارند.",
          icon: FiLink,
        },
        {
          title: "سئو و عملکرد",
          description:
            "بهینه‌سازی سرعت، ساختار فنی، متادیتا، کش و تجربه موبایل بخشی از کیفیت نهایی پروژه است.",
          icon: FiZap,
        },
        {
          title: "پشتیبانی و توسعه آینده",
          description:
            "اگر پروژه قرار است رشد کند، معماری و ساختار آن باید از ابتدا قابل توسعه طراحی شود.",
          icon: FiCode,
        },
      ] satisfies MiniCard[],
    },
    processSection: {
      eyebrow: "فرآیند همکاری",
      title: "همکاری چطور شروع می‌شود؟",
      subtitle:
        "مسیر همکاری شفاف و مرحله‌به‌مرحله است؛ از بررسی اولیه تا تحویل و پشتیبانی.",
      cards: [
        {
          title: "ثبت درخواست",
          description:
            "توضیح کوتاهی از پروژه، هدف و امکانات موردنیاز ارسال می‌کنی.",
          icon: FiSend,
        },
        {
          title: "بررسی و پیشنهاد",
          description:
            "نیازها بررسی می‌شود و مسیر فنی، زمان‌بندی و حدود هزینه پیشنهاد می‌شود.",
          icon: FiSearch,
        },
        {
          title: "طراحی و پیاده‌سازی",
          description:
            "پروژه مرحله‌به‌مرحله با تمرکز روی کیفیت، سرعت و توسعه‌پذیری ساخته می‌شود.",
          icon: FiCode,
        },
        {
          title: "تحویل و پشتیبانی",
          description:
            "پروژه تست‌شده تحویل داده می‌شود و مسیر پشتیبانی یا توسعه بعدی مشخص می‌شود.",
          icon: FiArrowUpLeft,
        },
      ] satisfies MiniCard[],
    },
  },
  en: {
    serviceSection: {
      eyebrow: "Services",
      title: "What can I build?",
      subtitle:
        "I focus on building products that are technically reliable while also creating strong user experience and commercial value.",
      cards: [
        {
          title: "Website design and development",
          description:
            "Fast, responsive, SEO-aware, manageable websites for personal brands, companies, services, and digital products.",
          items: [
            "UI design",
            "Frontend implementation",
            "Core SEO setup",
            "Content management panel",
            "Contact flows and lead capture",
          ],
          icon: FiMonitor,
        },
        {
          title: "Admin dashboard development",
          description:
            "Custom dashboards for managing users, content, orders, data, reporting, and operational workflows.",
          items: [
            "Authentication and roles",
            "Tables and filters",
            "Advanced forms",
            "Reporting",
            "Status management",
          ],
          icon: FiLayers,
        },
        {
          title: "Web application development",
          description:
            "Interactive web apps with backend services, database design, APIs, payments, subscriptions, and custom logic.",
          items: [
            "Front-End architecture",
            "API and database",
            "Payments and wallet flows",
            "Notifications",
            "Scalable foundations",
          ],
          icon: FiServer,
        },
        {
          title: "Improving an existing product",
          description:
            "Performance, UI/UX, SEO, code structure, database, deployment, and stability improvements for existing products.",
          items: [
            "Technical review",
            "Performance optimization",
            "UI/UX cleanup",
            "Bug fixing",
            "Growth-readiness",
          ],
          icon: FiTrendingUp,
        },
      ] satisfies MarketingCard[],
    },
    factorsSection: {
      eyebrow: "Pricing factors",
      title: "What affects project cost?",
      subtitle:
        "Project pricing is not only about page count. Features, architecture, design quality, and the growth path all matter.",
      cards: [
        {
          title: "Page count and user flows",
          description:
            "The more screens, routes, and user flows a product needs, the more design and implementation time it requires.",
          icon: FiLayout,
        },
        {
          title: "Design level and UI/UX",
          description:
            "Custom design, multiple states, motion, and polished interaction details all affect project scope.",
          icon: FiPenTool,
        },
        {
          title: "Backend and custom logic",
          description:
            "Authentication, roles, payments, subscriptions, wallets, notifications, and dashboards add technical complexity.",
          icon: FiServer,
        },
        {
          title: "Third-party integrations",
          description:
            "Payment gateways, SMS, email, maps, external APIs, and automations all require integration and testing time.",
          icon: FiLink,
        },
        {
          title: "SEO and performance",
          description:
            "Speed optimization, technical structure, metadata, caching, and mobile experience are part of the final quality level.",
          icon: FiZap,
        },
        {
          title: "Support and future growth",
          description:
            "If the product is meant to grow, its architecture should be planned for maintainability and extension from the start.",
          icon: FiCode,
        },
      ] satisfies MiniCard[],
    },
    processSection: {
      eyebrow: "Process",
      title: "How does collaboration start?",
      subtitle:
        "The process stays transparent and step by step, from initial review through delivery and support.",
      cards: [
        {
          title: "Send the request",
          description:
            "You share a short outline of the project, the goal, and the features you need.",
          icon: FiSend,
        },
        {
          title: "Review and recommendation",
          description:
            "I review the requirements and suggest the technical path, timing, and a realistic budget range.",
          icon: FiSearch,
        },
        {
          title: "Design and implementation",
          description:
            "The product is built in clear phases with focus on quality, speed, and future scalability.",
          icon: FiCode,
        },
        {
          title: "Delivery and support",
          description:
            "The tested product is handed over and the support or next-phase path is defined clearly.",
          icon: FiArrowUpLeft,
        },
      ] satisfies MiniCard[],
    },
  },
} as const;

export default async function ServicesPage() {
  const { locale, dict } = await getI18n();
  const services = await getPublishedServices(locale);
  const t = dict.services;
  const content = servicesPageContent[locale === "fa" ? "fa" : "en"];

  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden border-b border-border">
        <div
          aria-hidden
          className="absolute inset-0 grid-bg mask-[radial-gradient(ellipse_at_center,black,transparent_76%)] opacity-60"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -left-24 -top-24 h-84 w-84 rounded-full bg-primary/20 blur-[120px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 top-0 h-80 w-80 rounded-full bg-accent/12 blur-[120px]"
        />

        <Container className="relative py-16 sm:py-18 lg:py-20">
          <div className="space-y-5">
            <SectionHeader
              eyebrow={t.eyebrow}
              title={t.title}
              subtitle={t.subtitle}
            />
            <p className="max-w-3xl text-sm leading-7 text-faint sm:text-base">
              {t.supporting}
            </p>
            {services.length > 0 && (
              <div className="pt-1">
                <StatPill value={services.length} label={t.totalLabel} />
              </div>
            )}
          </div>
        </Container>
      </section>

      <main className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-32 h-120 w-120 -translate-x-1/2 rounded-full bg-primary/10 blur-[150px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -left-40 bottom-72 h-110 w-110 rounded-full bg-accent/10 blur-[140px]"
        />

        <div className="relative flex flex-col gap-16 py-16 sm:py-20 lg:gap-20">
          <Container as="section">
            <div className="neon-card relative overflow-hidden rounded-4xl p-6 sm:p-8 lg:p-10">
              <div
                aria-hidden
                className="absolute inset-0 bg-linear-to-br from-primary/14 via-transparent to-accent/14"
              />
              <div
                aria-hidden
                className="absolute -left-10 bottom-0 h-40 w-40 rounded-full bg-primary/14 blur-3xl"
              />
              <div
                aria-hidden
                className="absolute -right-10 top-0 h-40 w-40 rounded-full bg-accent/14 blur-3xl"
              />

              <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-2xl space-y-3">
                  <p className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-2/60 px-3 py-1.5 text-xs font-semibold tracking-[0.16em] text-primary-light backdrop-blur">
                    <span className="h-1.5 w-1.5 rounded-full bg-success shadow-[0_0_14px_rgba(52,211,153,0.7)]" />
                    {dict.footer.available}
                  </p>
                  <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                    {dict.planner.cta.servicesTitle}
                  </h2>
                  <p className="text-sm leading-7 text-muted sm:text-base">
                    {dict.planner.cta.servicesText}
                  </p>
                </div>

                <PublicCtaLink
                  href="/start-project"
                  size="lg"
                  className="w-full shrink-0 sm:w-auto"
                >
                  {dict.planner.cta.servicesButton}
                </PublicCtaLink>
              </div>
            </div>
          </Container>

          <Container as="section" className="space-y-8">
            <SectionHeader
              eyebrow={content.serviceSection.eyebrow}
              title={content.serviceSection.title}
              subtitle={content.serviceSection.subtitle}
            />
            <div className="grid gap-5 md:grid-cols-2">
              {content.serviceSection.cards.map((card) => {
                const Icon = card.icon;

                return (
                  <article
                    key={card.title}
                    className="neon-card group relative overflow-hidden rounded-[1.75rem] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_24px_80px_rgba(79,124,255,0.14)]"
                  >
                    <div
                      aria-hidden
                      className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-accent/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    />
                    <div className="relative space-y-5">
                      <div className="flex items-start gap-4">
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-border bg-background/55 text-lg text-primary-light backdrop-blur">
                          <Icon />
                        </span>
                        <div className="space-y-2">
                          <h3 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
                            {card.title}
                          </h3>
                          <p className="text-sm leading-7 text-muted">
                            {card.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {card.items.map((item) => (
                          <span
                            key={item}
                            className="rounded-full border border-border bg-surface-2/60 px-3 py-1.5 text-xs font-medium leading-5 text-muted backdrop-blur"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </Container>

          <Container as="section" className="space-y-8">
            <SectionHeader
              eyebrow={t.plansEyebrow}
              title={t.plansTitle}
              subtitle={t.plansSubtitle}
            />

            {services.length === 0 ? (
              <div className="relative overflow-hidden rounded-4xl border border-dashed border-border-strong bg-surface/60 p-8 text-center backdrop-blur sm:p-10">
                <div
                  aria-hidden
                  className="pointer-events-none absolute left-1/2 top-0 h-44 w-44 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
                />
                <div className="relative mx-auto max-w-2xl space-y-5">
                  <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-[1.4rem] border border-border bg-background/60 text-2xl text-primary-light backdrop-blur">
                    <FiLayers />
                  </span>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                      {t.emptyTitle}
                    </h3>
                    <p className="text-sm leading-7 text-muted sm:text-base">
                      {t.emptyDesc}
                    </p>
                    <p className="text-sm leading-7 text-faint">
                      {t.emptySupport}
                    </p>
                  </div>
                  <div className="flex flex-col justify-center gap-3 sm:flex-row">
                    <PublicCtaLink
                      href="/start-project"
                      className="w-full sm:w-auto"
                    >
                      {t.emptyPrimary}
                    </PublicCtaLink>
                    <ButtonLink
                      href="/contact"
                      variant="outline"
                      className="w-full sm:w-auto"
                    >
                      {t.emptySecondary}
                    </ButtonLink>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {services.map((service) => (
                    <ServicePlanCard key={service.id} service={service} />
                  ))}
                </div>
                <p className="text-center text-sm leading-7 text-faint">
                  {t.priceNote}
                </p>
              </>
            )}
          </Container>

          <Container as="section" className="space-y-8">
            <SectionHeader
              eyebrow={content.factorsSection.eyebrow}
              title={content.factorsSection.title}
              subtitle={content.factorsSection.subtitle}
            />
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {content.factorsSection.cards.map((card) => {
                const Icon = card.icon;

                return (
                  <article
                    key={card.title}
                    className="neon-card rounded-3xl p-5 sm:p-6"
                  >
                    <div className="flex items-start gap-4">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-border bg-background/55 text-base text-primary-light backdrop-blur">
                        <Icon />
                      </span>
                      <div className="space-y-2">
                        <h3 className="text-base font-semibold tracking-tight text-foreground">
                          {card.title}
                        </h3>
                        <p className="text-sm leading-7 text-muted">
                          {card.description}
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </Container>

          <Container as="section" className="space-y-8">
            <SectionHeader
              eyebrow={content.processSection.eyebrow}
              title={content.processSection.title}
              subtitle={content.processSection.subtitle}
            />
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {content.processSection.cards.map((step, index) => {
                const Icon = step.icon;

                return (
                  <article
                    key={step.title}
                    className="neon-card relative overflow-hidden rounded-3xl p-5 sm:p-6"
                  >
                    <div
                      aria-hidden
                      className="absolute inset-0 bg-linear-to-br from-primary/8 via-transparent to-accent/10"
                    />
                    <div className="relative space-y-4">
                      <div className="flex items-center justify-between gap-3">
                        <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-background/55 text-base text-primary-light backdrop-blur">
                          <Icon />
                        </span>
                        <span className="text-xs font-semibold tracking-[0.18em] text-faint">
                          0{index + 1}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-base font-semibold tracking-tight text-foreground">
                          {step.title}
                        </h3>
                        <p className="text-sm leading-7 text-muted">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </Container>

          <Container as="section" className="space-y-8">
            <SectionHeader
              align="center"
              eyebrow={t.faqEyebrow}
              title={t.faqTitle}
            />
            <div className="grid gap-4 lg:grid-cols-2">
              {t.faqs.map((faq) => (
                <article
                  key={faq.q}
                  className="neon-card rounded-3xl p-6 sm:p-7"
                >
                  <h3 className="text-base font-semibold tracking-tight text-foreground sm:text-lg">
                    {faq.q}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-muted sm:text-base">
                    {faq.a}
                  </p>
                </article>
              ))}
            </div>
          </Container>

          <Container as="section">
            <div className="neon-card relative overflow-hidden rounded-4xl p-6 text-center sm:p-8 lg:p-10">
              <div
                aria-hidden
                className="absolute inset-0 bg-linear-to-br from-primary/14 via-transparent to-accent/14"
              />
              <div
                aria-hidden
                className="absolute -left-10 bottom-0 h-44 w-44 rounded-full bg-primary/14 blur-3xl"
              />
              <div
                aria-hidden
                className="absolute -right-12 top-0 h-44 w-44 rounded-full bg-accent/14 blur-3xl"
              />

              <div className="relative mx-auto max-w-3xl space-y-4">
                <p className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-2/60 px-3 py-1.5 text-xs font-semibold tracking-[0.16em] text-primary-light backdrop-blur">
                  <span className="h-1.5 w-1.5 rounded-full bg-success shadow-[0_0_14px_rgba(52,211,153,0.7)]" />
                  {dict.footer.available}
                </p>
                <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  {t.ctaTitle}
                </h2>
                <p className="mx-auto max-w-2xl text-sm leading-7 text-muted sm:text-base">
                  {t.ctaText}
                </p>
                <div className="flex flex-col justify-center gap-3 pt-2 sm:flex-row">
                  <PublicCtaLink
                    href="/contact"
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    {t.cta}
                  </PublicCtaLink>
                  <PublicCtaLink
                    href="/start-project"
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto"
                  >
                    {t.ctaSecondary}
                  </PublicCtaLink>
                </div>
              </div>
            </div>
          </Container>
        </div>
      </main>
    </div>
  );
}
