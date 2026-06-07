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
        "دقیقاً همان چیزی را که نیاز داشتیم تحویل داد، به‌موقع و فراتر از انتظار. پنل مدیریت هر هفته ساعت‌ها در وقت تیم ما صرفه‌جویی می‌کند.",
      author: "سارا لیندکوئیست",
      role: "بنیان‌گذار",
      company: "نورث‌وایند استودیو",
    },
    {
      quote:
        "ارتباط شفاف، کد تمیز و علاقه‌ی واقعی به نتیجه‌ی کسب‌وکار ما. با کمال میل دوباره همکاری می‌کنم.",
      author: "پریا شاه",
      role: "مدیر محصول",
      company: "لوپ آنالیتیکس",
    },
    {
      quote:
        "یک ایده‌ی مبهم را گرفت و به یک وب‌اپ سریع و حرفه‌ای تبدیل کرد. نرخ تبدیل ما پس از انتشار به‌وضوح بهتر شد.",
      author: "دنیل ریس",
      role: "مدیر بازاریابی",
      company: "برایت‌ساید",
    },
  ],
  en: [
    {
      quote:
        "Delivered exactly what we needed, on time and beyond expectations. The admin panel saved our team hours every week.",
      author: "Alex Morgan",
      role: "Founder",
      company: "Northwind Studio",
    },
    {
      quote:
        "Clear communication, clean code, and a genuine interest in our business outcomes. Would happily work together again.",
      author: "Priya Shah",
      role: "Product Lead",
      company: "Loop Analytics",
    },
    {
      quote:
        "Took a vague idea and turned it into a polished, fast web app. Our conversion rate noticeably improved after launch.",
      author: "Daniel Reyes",
      role: "Marketing Director",
      company: "Brightside",
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
      period: "۱۴۰۱ — اکنون",
      role: "توسعه‌دهنده‌ی فول‌استک فریلنسر",
      organization: "مستقل",
      description:
        "طراحی و ساخت اپلیکیشن‌های وب تجاری برای استارتاپ‌ها و کسب‌وکارهای کوچک، به‌صورت سرتاسری.",
    },
    {
      period: "۱۳۹۹ — ۱۴۰۱",
      role: "مهندس ارشد فرانت‌اند",
      organization: "شرکت فناوری",
      description:
        "هدایت فرانت‌اند یک پلتفرم SaaS سازمانی با تمرکز بر کارایی، سیستم طراحی و تجربه‌ی توسعه‌دهنده.",
    },
    {
      period: "۱۳۹۷ — ۱۳۹۹",
      role: "توسعه‌دهنده‌ی فول‌استک",
      organization: "آژانس دیجیتال",
      description:
        "ساخت وب‌سایت‌ها و وب‌اپ‌های مشتریان در صنایع گوناگون با استک‌های مدرن جاوااسکریپت.",
    },
  ],
  en: [
    {
      period: "2022 — Present",
      role: "Freelance Full-Stack Developer",
      organization: "Self-employed",
      description:
        "Designing and building commercial web applications for startups and small businesses, end to end.",
    },
    {
      period: "2020 — 2022",
      role: "Senior Frontend Engineer",
      organization: "Tech Company",
      description:
        "Led the front-end for a B2B SaaS platform, focusing on performance, design systems, and developer experience.",
    },
    {
      period: "2018 — 2020",
      role: "Full-Stack Developer",
      organization: "Digital Agency",
      description:
        "Shipped client websites and web apps across a range of industries using modern JavaScript stacks.",
    },
  ],
};

export function getExperience(locale: Locale): TimelineEntry[] {
  return experienceByLocale[locale] ?? experienceByLocale.en;
}

/* --------------------------------- Tech stack ---------------------------------- */

// Tech names are universal; only the category labels are localized.
const techCategories: Record<Locale, [string, string, string]> = {
  fa: ["فرانت‌اند", "بک‌اند", "ابزارها و DevOps"],
  en: ["Frontend", "Backend", "Tooling & DevOps"],
};

const techItems: string[][] = [
  ["React", "Next.js", "TypeScript", "Tailwind CSS", "Redux"],
  ["Node.js", "PostgreSQL", "Drizzle ORM", "REST APIs", "Redis"],
  ["Git", "Docker", "Vercel", "GitHub Actions", "Vitest"],
];

export function getTechStack(locale: Locale): TechGroup[] {
  const labels = techCategories[locale] ?? techCategories.en;
  return labels.map((category, i) => ({ category, items: techItems[i] }));
}
