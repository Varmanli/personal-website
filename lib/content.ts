import type { Locale } from "@/lib/i18n/config";
import type { Testimonial, TimelineEntry, TechGroup } from "@/types";

/**
 * Static marketing content (testimonials, experience timeline, tech stack).
 *
 * This content is presentational and rarely changes, so it lives in code as
 * bilingual data rather than the database. Persian is the default; English is
 * provided alongside. Process steps and "values" live in the dictionary
 * (dict.home.process / dict.about.values).
 */

/* --------------------------------- Testimonials -------------------------------- */

const testimonialsByLocale: Record<Locale, Testimonial[]> = {
  fa: [
    {
      quote:
        "برای ما فقط ظاهر سایت مهم نبود؛ نیاز داشتیم پنل مدیریت، پرداخت، دانلود و ساختار مالی دقیق کار کند. خروجی هم از نظر فنی هم تجربه کاربری قابل اعتماد بود.",
      author: "مدیر پروژه نگاره",
      role: "مارکت‌پلیس فایل هنری",
    },
    {
      quote:
        "فرآیند همکاری شفاف بود. قبل از پیاده‌سازی، مسیر فنی و بخش‌های اصلی پروژه دقیق مشخص شد و همین باعث شد تصمیم‌گیری راحت‌تر شود.",
      author: "کارفرمای پروژه اختصاصی",
      role: "وب‌اپلیکیشن مدیریتی",
    },
    {
      quote:
        "در کنار طراحی تمیز، به جزئیات فنی مثل سرعت، سئو، ساختار دیتابیس و توسعه‌پذیری هم توجه شد.",
      author: "همکار فنی پروژه",
      role: "توسعه محصول وب",
    },
  ],
  en: [
    {
      quote:
        "We needed more than a polished UI. The admin area, payments, downloads, and financial flows all had to work together, and the final product felt dependable.",
      author: "Negareh project lead",
      role: "Art file marketplace",
    },
    {
      quote:
        "The collaboration was transparent from the start. The technical direction and the key parts of the build were clear before implementation, which made decisions much easier.",
      author: "Custom client",
      role: "Management web application",
    },
    {
      quote:
        "Alongside a clean interface, real attention was given to performance, SEO, database structure, and future maintainability.",
      author: "Technical collaborator",
      role: "Web product development",
    },
  ],
};

export function getTestimonials(locale: Locale): Testimonial[] {
  return testimonialsByLocale[locale] ?? testimonialsByLocale.en;
}

/* --------------------------------- Experience ---------------------------------- */

const experienceByLocale: Record<Locale, TimelineEntry[]> = {
  fa: [
    {
      period: "۱۴۰۳ تا اکنون",
      role: "توسعه‌دهنده فول‌استک",
      organization: "مستقل",
      description:
        "طراحی و توسعه وب‌سایت‌ها، وب‌اپلیکیشن‌ها و پنل‌های مدیریتی برای پروژه‌های واقعی با تمرکز روی کیفیت، سرعت و توسعه‌پذیری.",
      tags: ["Next.js", "NestJS", "PostgreSQL", "Docker"],
    },
    {
      period: "۱۴۰۳ تا اکنون",
      role: "توسعه پروژه نگاره",
      organization: "مارکت‌پلیس فایل هنری",
      description:
        "پیاده‌سازی و بهبود بخش‌های اصلی یک مارکت‌پلیس فایل هنری شامل پنل مدیریت، پنل هنرمندان، پرداخت، اشتراک، دانلود محدود و ساختار مالی.",
      tags: ["Marketplace", "Admin Panel", "Payments", "SEO"],
    },
    {
      period: "۱۴۰۲ تا ۱۴۰۳",
      role: "طراحی و توسعه محصولات دیجیتال",
      organization: "پروژه‌های وب و تعاملی",
      description:
        "ساخت رابط‌های کاربری، داشبوردها و تجربه‌های تعاملی برای وب‌سایت‌ها و محصولات دیجیتال.",
      tags: ["React", "UI", "Dashboard"],
    },
  ],
  en: [
    {
      period: "2024 — Present",
      role: "Full-Stack Developer",
      organization: "Independent",
      description:
        "Designing and developing websites, web applications, and admin panels for real projects with a focus on quality, speed, and maintainability.",
      tags: ["Next.js", "NestJS", "PostgreSQL", "Docker"],
    },
    {
      period: "2024 — Present",
      role: "Negareh product development",
      organization: "Art file marketplace",
      description:
        "Built and improved core parts of an art-file marketplace including the admin panel, artist panel, payments, subscriptions, limited downloads, and financial flows.",
      tags: ["Marketplace", "Admin Panel", "Payments", "SEO"],
    },
    {
      period: "2023 — 2024",
      role: "Digital product design and development",
      organization: "Web and interactive products",
      description:
        "Created interfaces, dashboards, and interactive web experiences for websites and digital products.",
      tags: ["React", "UI", "Dashboard"],
    },
  ],
};

export function getExperience(locale: Locale): TimelineEntry[] {
  return experienceByLocale[locale] ?? experienceByLocale.en;
}

/* --------------------------------- Tech stack ---------------------------------- */

// Tech names are universal; only the category labels are localized.
const techCategories: Record<Locale, [string, string, string]> = {
  fa: ["فرانت‌اند", "بک‌اند", "DevOps و تحویل"],
  en: ["Frontend", "Backend", "DevOps & Delivery"],
};

const techItems: string[][] = [
  ["React", "Next.js", "TypeScript", "Tailwind CSS", "Redux"],
  ["NestJS", "Node.js", "PostgreSQL", "Prisma", "Redis", "REST API"],
  ["Docker", "Nginx", "VPS", "CI/CD", "GitHub Actions"],
];

const techDescriptions: Record<Locale, [string, string, string]> = {
  fa: [
    "ساخت رابط‌های سریع، واکنش‌گرا، سئو محور و قابل توسعه.",
    "طراحی API، احراز هویت، ساختار دیتابیس، داشبورد و منطق‌های پیچیده.",
    "استقرار، مانیتورینگ، بهینه‌سازی عملکرد و آماده‌سازی پروژه برای استفاده واقعی.",
  ],
  en: [
    "Fast, responsive, SEO-aware interfaces that stay maintainable as the product grows.",
    "APIs, authentication, database structure, dashboards, and the heavier business logic behind them.",
    "Deployment, monitoring, performance tuning, and the delivery work that makes a product production-ready.",
  ],
};

export function getTechStack(locale: Locale): TechGroup[] {
  const labels = techCategories[locale] ?? techCategories.en;
  const descriptions = techDescriptions[locale] ?? techDescriptions.en;
  return labels.map((category, i) => ({
    category,
    items: techItems[i],
    description: descriptions[i],
  }));
}
