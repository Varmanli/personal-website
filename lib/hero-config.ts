import type {
  HeroConfiguration,
  HeroContent,
  HeroLanguage,
  HeroMode,
  SiteSettings,
} from "@/types";
import type { Locale } from "@/lib/i18n/config";

const freelanceEn: HeroContent = {
  greeting: "Hey, I'm Varmanli",
  headlineLead: "Designing and building",
  headlineHighlight: "fast, scalable web applications ready to grow",
  subtitle: "From interface design to backend implementation, I cover the full path to a professional web product.",
  primaryCta: { label: "Request project estimate", href: "/start-project" },
  secondaryCta: { label: "View selected work", href: "/projects" },
  technologies: ["Next.js", "TypeScript", "React", "Node.js", "PostgreSQL", "Docker"],
};

const freelanceFa: HeroContent = {
  greeting: "سلام، من وارمانلی هستم",
  headlineLead: "طراحی و توسعه",
  headlineHighlight: "وب‌اپلیکیشن‌های سریع، مقیاس‌پذیر و آماده رشد",
  subtitle: "از طراحی رابط کاربری تا پیاده‌سازی بک‌اند، یک مسیر کامل برای ساخت محصول وب حرفه‌ای.",
  primaryCta: { label: "درخواست برآورد پروژه", href: "/start-project" },
  secondaryCta: { label: "مشاهده پروژه‌ها", href: "/projects" },
  technologies: ["Next.js", "TypeScript", "React", "Node.js", "PostgreSQL", "Docker"],
};

const hiringEn: HeroContent = {
  greeting: "Hello, I'm Varmanli",
  headlineLead: "A product-minded",
  headlineHighlight: "full-stack developer ready to join ambitious teams",
  subtitle: "I build thoughtful, reliable web products and enjoy working with teams that care about craft, impact, and sustainable engineering.",
  primaryCta: { label: "View selected work", href: "/projects" },
  secondaryCta: { label: "Get in touch", href: "/contact" },
  technologies: ["Next.js", "TypeScript", "React", "Node.js", "PostgreSQL", "Docker"],
};

const hiringFa: HeroContent = {
  greeting: "سلام، من وارمانلی هستم",
  headlineLead: "توسعه‌دهنده فول‌استکی",
  headlineHighlight: "آماده همکاری با تیم‌های بلندپرواز",
  subtitle: "محصولات وب قابل اتکا و کاربرمحور می‌سازم و از همکاری با تیم‌هایی که به کیفیت و اثرگذاری اهمیت می‌دهند لذت می‌برم.",
  primaryCta: { label: "مشاهده پروژه‌ها", href: "/projects" },
  secondaryCta: { label: "ارتباط با من", href: "/contact" },
  technologies: ["Next.js", "TypeScript", "React", "Node.js", "PostgreSQL", "Docker"],
};

export const defaultHeroConfiguration: HeroConfiguration = {
  activeMode: "freelancer",
  activeLanguage: "fa",
  content: {
    freelancer: { fa: freelanceFa, en: freelanceEn },
    hiring: { fa: hiringFa, en: hiringEn },
  },
};

function isContent(value: unknown): value is HeroContent {
  const item = value as Partial<HeroContent> | null;
  return Boolean(
    item && typeof item.greeting === "string" && typeof item.headlineLead === "string" &&
      typeof item.headlineHighlight === "string" && typeof item.subtitle === "string" &&
      item.primaryCta && typeof item.primaryCta.label === "string" && typeof item.primaryCta.href === "string" &&
      item.secondaryCta && typeof item.secondaryCta.label === "string" && typeof item.secondaryCta.href === "string",
  );
}

/** Tolerantly normalizes old or partially saved JSON while retaining safe defaults. */
export function normalizeHeroConfiguration(value: unknown, websiteMode?: string | null): HeroConfiguration {
  const candidate = value as Partial<HeroConfiguration> | null;
  const activeMode: HeroMode = candidate?.activeMode === "hiring"
    ? "hiring"
    : websiteMode === "hiring" ? "hiring" : "freelancer";
  const activeLanguage: HeroLanguage = candidate?.activeLanguage === "en" ? "en" : "fa";
  const content: HeroConfiguration["content"] = {
    freelancer: { ...defaultHeroConfiguration.content.freelancer },
    hiring: { ...defaultHeroConfiguration.content.hiring },
  };

  for (const mode of ["freelancer", "hiring"] as const) {
    for (const language of ["fa", "en"] as const) {
      const saved = candidate?.content?.[mode]?.[language];
      if (isContent(saved)) {
        content[mode][language] = {
          ...saved,
          technologies: Array.isArray(saved.technologies)
            ? saved.technologies.filter((item): item is string => typeof item === "string")
            : content[mode][language].technologies,
        };
      }
    }
  }
  return { activeMode, activeLanguage, content };
}

export function getHeroConfiguration(
  settings: Partial<Pick<SiteSettings, "heroConfig" | "websiteMode">> | null,
): HeroConfiguration {
  return normalizeHeroConfiguration(settings?.heroConfig, settings?.websiteMode);
}

/**
 * Resolve public Hero copy from the site's locale. `activeLanguage` is an
 * admin editing/default preference only; it must never override the visitor's
 * selected website locale.
 */
export function getHeroContent(
  configuration: HeroConfiguration,
  { mode, locale }: { mode: HeroMode; locale: Locale },
): HeroContent {
  return configuration.content[mode][locale];
}
