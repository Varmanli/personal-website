import type {
  ProjectChallenge,
  Project,
  Service,
  ContactMessage,
  SiteSettings,
} from "@/types";

/**
 * Placeholder content.
 *
 * Used to render pages before the database is wired up / seeded. Swap these
 * out for real Drizzle queries once `DATABASE_URL` is configured.
 * Shapes match the DB row types so the swap is mechanical.
 */

const now = new Date();

// Null defaults for the localized (*Fa/*En) columns, so the placeholder rows
// satisfy the bilingual schema types without repeating empty fields everywhere.
const projectL10nNull = {
  titleFa: null,
  titleEn: null,
  shortDescriptionFa: null,
  shortDescriptionEn: null,
  descriptionFa: null,
  descriptionEn: null,
  roleFa: null,
  roleEn: null,
  clientFa: null,
  clientEn: null,
  projectTypeFa: null,
  projectTypeEn: null,
  challengeFa: null,
  challengeEn: null,
  solutionFa: null,
  solutionEn: null,
  outcomeFa: null,
  outcomeEn: null,
  homeMetricsFa: [] as { label: string; value: string; description?: string }[],
  homeMetricsEn: [] as { label: string; value: string; description?: string }[],
  technicalHighlightsFa: [] as string[],
  technicalHighlightsEn: [] as string[],
  tagsFa: [] as string[],
  tagsEn: [] as string[],
  challengesFa: [] as ProjectChallenge[],
  challengesEn: [] as ProjectChallenge[],
  coverImageUrl: null,
  galleryImages: [] as string[],
};

const projectHomeDefaults = {
  projectType: null as string | null,
  previewImageUrl: null as string | null,
  isFeaturedOnHome: false,
  homeOrder: 0,
  homeMetrics: [] as { label: string; value: string; description?: string }[],
  technicalHighlights: [] as string[],
};

type BaseProject = Omit<
  Project,
  | keyof typeof projectL10nNull
  | "projectType"
  | "projectTypeFa"
  | "projectTypeEn"
  | "previewImageUrl"
  | "isFeaturedOnHome"
  | "homeOrder"
  | "homeMetrics"
  | "homeMetricsFa"
  | "homeMetricsEn"
  | "technicalHighlights"
  | "technicalHighlightsFa"
  | "technicalHighlightsEn"
> &
  Partial<
    Pick<
      Project,
      | "projectType"
      | "projectTypeFa"
      | "projectTypeEn"
      | "previewImageUrl"
      | "isFeaturedOnHome"
      | "homeOrder"
      | "homeMetrics"
      | "homeMetricsFa"
      | "homeMetricsEn"
      | "technicalHighlights"
      | "technicalHighlightsFa"
      | "technicalHighlightsEn"
    >
  >;

const serviceL10nNull = {
  nameFa: null,
  nameEn: null,
  taglineFa: null,
  taglineEn: null,
  descriptionFa: null,
  descriptionEn: null,
  featuresFa: [] as string[],
  featuresEn: [] as string[],
  ctaLabelFa: null,
  ctaLabelEn: null,
};

const profileL10nNull = {
  ownerNameFa: null,
  ownerNameEn: null,
  headlineFa: null,
  headlineEn: null,
  bioFa: null,
  bioEn: null,
  locationFa: null,
  locationEn: null,
  skillsFa: [] as string[],
  skillsEn: [] as string[],
  aboutIntro: null,
  aboutIntroFa: null,
  aboutIntroEn: null,
  aboutPageContent: null,
  aboutPageContentFa: null,
  aboutPageContentEn: null,
  contactPageContent: null,
  contactPageContentFa: null,
  contactPageContentEn: null,
  contactSettings: null,
};

export const placeholderProfile: SiteSettings = {
  ...profileL10nNull,
  id: 1,
  websiteMode: "freelance",
  heroConfig: null,
  ownerName: "Varmanli",
  headline: "Full-stack developer building commercial web apps",
  bio: "I'm a full-stack developer who helps founders and small teams turn ideas into fast, reliable web products. From marketing sites to data-heavy dashboards, I handle design, development, and deployment — so you get a finished product, not just code.",
  avatarUrl: null,
  resumeUrl: null,
  logoUrl: null,
  faviconUrl: null,
  heroImageUrl: null,
  email: null,
  location: "Remote / Worldwide",
  skills: [
    "TypeScript",
    "React",
    "Next.js",
    "Node.js",
    "PostgreSQL",
    "Tailwind CSS",
    "Drizzle ORM",
  ],
  socialLinks: [],
  createdAt: now,
  updatedAt: now,
};

const baseProjects: BaseProject[] = [
  {
    id: 1,
    title: "Negareh",
    slug: "negareh",
    shortDescription:
      "An art-file marketplace with admin tools, artist dashboards, subscriptions, and revenue flows.",
    description:
      "A full marketplace for selling artistic files with payments, subscriptions, limited downloads, and separate management spaces for the internal team and artists.",
    thumbnailUrl: null,
    media: [],
    technologies: ["Next.js", "NestJS", "PostgreSQL", "Prisma", "Redis", "Docker", "Nginx"],
    tags: ["Marketplace", "Full-stack", "Commerce"],
    role: "Full-stack developer & UI designer",
    client: "Negareh",
    year: "2024",
    projectType: "Marketplace",
    isFeaturedOnHome: true,
    homeOrder: 1,
    homeMetrics: [
      { label: "Users", value: "60k+" },
      { label: "Products", value: "30k+" },
      { label: "Pages", value: "120+" },
      { label: "Panels", value: "Admin / Artist" },
    ],
    homeMetricsFa: [
      { label: "کاربر", value: "۶۰k+" },
      { label: "محصول", value: "۳۰k+" },
      { label: "صفحه", value: "۱۲۰+" },
      { label: "پنل", value: "Admin / Artist" },
    ],
    homeMetricsEn: [
      { label: "Users", value: "60k+" },
      { label: "Products", value: "30k+" },
      { label: "Pages", value: "120+" },
      { label: "Panels", value: "Admin / Artist" },
    ],
    technicalHighlights: [
      "Full-stack architecture with Next.js and NestJS",
      "Payments, wallet flows, and revenue split logic",
      "Subscription and download-limit management",
      "SEO, caching, and performance tuning",
      "Docker and Nginx deployment",
    ],
    technicalHighlightsFa: [
      "معماری فول‌استک با Next.js و NestJS",
      "سیستم پرداخت، کیف پول و تقسیم درآمد",
      "مدیریت اشتراک و محدودیت دانلود",
      "بهینه‌سازی سئو، کش و عملکرد",
      "دیپلوی با Docker و Nginx",
    ],
    technicalHighlightsEn: [
      "Full-stack architecture with Next.js and NestJS",
      "Payments, wallet flows, and revenue split logic",
      "Subscription and download-limit management",
      "SEO, caching, and performance tuning",
      "Docker and Nginx deployment",
    ],
    challenge:
      "The product needed reliable payment flows, restricted downloads, subscriptions, and a structure ready for scale.",
    solution:
      "I built a bespoke storefront on Next.js with a typed PostgreSQL data layer, integrated Stripe for payments, and shipped an admin dashboard tailored to their fulfilment process.",
    outcome:
      "Page loads dropped below one second, the team now manages catalogue and orders in-house, and the platform handles seasonal traffic spikes without issues.",
    liveUrl: "https://example.com",
    repoUrl: null,
    status: "published",
    isFeatured: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 2,
    title: "Developer brand site and project showcase",
    slug: "developer-brand-website",
    shortDescription:
      "A multilingual website for showcasing services, projects, case studies, and inbound project requests.",
    description:
      "A premium personal brand website that combines multilingual content, admin-managed projects and services, and a clear conversion path for collaboration requests.",
    thumbnailUrl: null,
    media: [],
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Drizzle ORM", "PostgreSQL"],
    tags: ["Brand site", "Case studies", "Full-stack"],
    role: "Full-stack developer",
    client: "Personal brand",
    year: "2024",
    projectType: "Brand Site",
    isFeaturedOnHome: true,
    homeOrder: 2,
    homeMetrics: [
      { label: "Language", value: "Multilingual" },
      { label: "CMS", value: "Dashboard" },
      { label: "SEO", value: "Ready" },
      { label: "Layout", value: "Responsive" },
    ],
    homeMetricsFa: [
      { label: "زبان", value: "چندزبانه" },
      { label: "محتوا", value: "داشبورد" },
      { label: "سئو", value: "SEO-ready" },
      { label: "طراحی", value: "ریسپانسیو" },
    ],
    homeMetricsEn: [
      { label: "Language", value: "Multilingual" },
      { label: "CMS", value: "Dashboard" },
      { label: "SEO", value: "Ready" },
      { label: "Layout", value: "Responsive" },
    ],
    technicalHighlights: [
      "Persian and English multilingual structure",
      "Dashboard-managed content workflows",
      "Dark, fast, responsive UI system",
      "Contact funnel and project request flow",
    ],
    technicalHighlightsFa: [
      "ساختار چندزبانه فارسی و انگلیسی",
      "مدیریت محتوا از داشبورد",
      "طراحی دارک، سریع و واکنش‌گرا",
      "فرم تماس و مسیر دریافت پروژه",
    ],
    technicalHighlightsEn: [
      "Persian and English multilingual structure",
      "Dashboard-managed content workflows",
      "Dark, fast, responsive UI system",
      "Contact funnel and project request flow",
    ],
    challenge:
      "The site needed to feel premium, stay fast, and remain fully manageable through the admin dashboard.",
    solution:
      "I designed a component-driven dashboard with streaming updates, a flexible report builder, and sensible defaults so new users see value immediately.",
    outcome:
      "Activation improved, support tickets about reporting dropped, and enterprise clients adopted the new workspaces feature.",
    liveUrl: null,
    repoUrl: "https://github.com/",
    status: "published",
    isFeatured: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 3,
    title: "Custom admin dashboard",
    slug: "custom-admin-dashboard",
    shortDescription:
      "A role-based management panel for operational control, reporting, advanced forms, and data workflows.",
    description:
      "A tailored admin suite built around real daily operations, with filters, reporting, status flows, and expandable modules.",
    thumbnailUrl: null,
    media: [],
    technologies: ["React", "TypeScript", "Node.js", "PostgreSQL", "REST API"],
    tags: ["Admin suite", "Operations", "Dashboard"],
    role: "Full-stack developer",
    client: "Internal operations",
    year: "2024",
    projectType: "Admin Suite",
    isFeaturedOnHome: true,
    homeOrder: 3,
    homeMetrics: [
      { label: "Access", value: "Role-based" },
      { label: "Reports", value: "Management" },
      { label: "Forms", value: "Advanced" },
      { label: "Data", value: "Operational" },
    ],
    homeMetricsFa: [
      { label: "دسترسی", value: "Role-based" },
      { label: "گزارش", value: "مدیریتی" },
      { label: "فرم", value: "پیشرفته" },
      { label: "داده", value: "عملیاتی" },
    ],
    homeMetricsEn: [
      { label: "Access", value: "Role-based" },
      { label: "Reports", value: "Management" },
      { label: "Forms", value: "Advanced" },
      { label: "Data", value: "Operational" },
    ],
    technicalHighlights: [
      "UX designed for repeated daily operations",
      "Filters, search, pagination, and status workflows",
      "Precise forms with validation rules",
      "Extensible structure for future modules",
    ],
    technicalHighlightsFa: [
      "طراحی تجربه کاربری برای عملیات روزانه",
      "فیلتر، جستجو، صفحه‌بندی و مدیریت وضعیت‌ها",
      "فرم‌های دقیق با اعتبارسنجی",
      "ساختار قابل توسعه برای ماژول‌های جدید",
    ],
    technicalHighlightsEn: [
      "UX designed for repeated daily operations",
      "Filters, search, pagination, and status workflows",
      "Precise forms with validation rules",
      "Extensible structure for future modules",
    ],
    challenge:
      "The team needed a stable internal system for recurring operations instead of fragmented spreadsheets and ad-hoc tools.",
    solution:
      "I built a self-serve booking flow with real-time availability, calendar sync, and automated email reminders.",
    outcome:
      "Online bookings replaced most phone calls and no-shows fell significantly within the first month.",
    liveUrl: "https://example.com",
    repoUrl: null,
    status: "published",
    isFeatured: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 4,
    title: "Marketing Site & CMS",
    slug: "marketing-site-cms",
    shortDescription:
      "A fast, SEO-friendly marketing site with an editor-friendly CMS.",
    description:
      "A high-performance marketing website paired with a lightweight content management system so the client's team can publish without touching code.",
    thumbnailUrl: null,
    media: [],
    technologies: ["Next.js", "Tailwind CSS", "PostgreSQL"],
    tags: ["Marketing", "CMS", "SEO"],
    role: "Full-stack developer",
    client: "Brightside",
    year: "2022",
    challenge:
      "Every copy change required a developer, slowing the marketing team down.",
    solution:
      "I delivered a statically-optimised site with a simple admin CMS for pages, posts, and SEO metadata.",
    outcome:
      "The marketing team now ships updates independently and organic traffic grew quarter over quarter.",
    liveUrl: "https://example.com",
    repoUrl: null,
    status: "published",
    isFeatured: false,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 5,
    title: "Internal Operations Tool",
    slug: "internal-operations-tool",
    shortDescription:
      "A custom internal tool that replaced a tangle of spreadsheets.",
    description:
      "A bespoke internal application that centralised inventory, suppliers, and reporting into one role-based system for an operations team.",
    thumbnailUrl: null,
    media: [],
    technologies: ["React", "Node.js", "PostgreSQL"],
    tags: ["Internal tool", "Full-stack"],
    role: "Full-stack developer",
    client: "Confidential",
    year: "2022",
    challenge:
      "Critical operations ran on fragile, shared spreadsheets prone to errors and version conflicts.",
    solution:
      "I consolidated the workflows into a single typed application with audit history and permissions.",
    outcome:
      "Manual errors dropped and the team gained a reliable source of truth for daily operations.",
    liveUrl: null,
    repoUrl: null,
    status: "published",
    isFeatured: false,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 6,
    title: "Open-Source UI Kit",
    slug: "open-source-ui-kit",
    shortDescription:
      "A small, accessible React component library published to npm.",
    description:
      "A personal open-source project: a set of accessible, unstyled React components with sensible defaults, fully typed and documented.",
    thumbnailUrl: null,
    media: [],
    technologies: ["React", "TypeScript", "Vitest"],
    tags: ["Open source", "Library"],
    role: "Creator & maintainer",
    client: null,
    year: "2024",
    challenge: null,
    solution: null,
    outcome: null,
    liveUrl: null,
    repoUrl: "https://github.com/",
    status: "published",
    isFeatured: false,
    createdAt: now,
    updatedAt: now,
  },
];

export const placeholderProjects: Project[] = baseProjects.map((p) => ({
  ...projectL10nNull,
  ...projectHomeDefaults,
  ...p,
}));

const baseServices: Omit<Service, keyof typeof serviceL10nNull>[] = [
  {
    id: 1,
    name: "Landing Page",
    slug: "landing-page",
    tagline: "Best for launches & campaigns",
    description:
      "A single, high-converting page to promote a product, event, or campaign — designed, built, and shipped fast.",
    priceCents: 89900,
    currency: "USD",
    billingPeriod: "one-time",
    features: [
      "Single responsive landing page",
      "Custom design from your brand",
      "Contact / lead capture form",
      "Basic SEO & analytics setup",
      "Deployed and live",
    ],
    ctaLabel: "Start a landing page",
    status: "published",
    isFeatured: false,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 2,
    name: "Full-Stack Website",
    slug: "full-stack-website",
    tagline: "Best for growing businesses",
    description:
      "A complete multi-page website with a content management panel so your team can keep it up to date.",
    priceCents: 299900,
    currency: "USD",
    billingPeriod: "one-time",
    features: [
      "Up to 8 custom pages",
      "Content management panel",
      "Database integration",
      "Advanced SEO & analytics",
      "Performance optimisation",
      "30 days post-launch support",
    ],
    ctaLabel: "Build my website",
    status: "published",
    isFeatured: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 3,
    name: "Admin Panel / Dashboard",
    slug: "admin-dashboard",
    tagline: "Best for data-driven teams",
    description:
      "A custom dashboard or admin panel to manage your data, users, and operations — built around your workflow.",
    priceCents: 449900,
    currency: "USD",
    billingPeriod: "one-time",
    features: [
      "Role-based access control",
      "CRUD for your core data",
      "Charts & reporting views",
      "Search, filters & exports",
      "API integration",
      "Documentation & handover",
    ],
    ctaLabel: "Plan my dashboard",
    status: "published",
    isFeatured: false,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 4,
    name: "Custom Web Application",
    slug: "custom-web-application",
    tagline: "Best for bespoke products",
    description:
      "End-to-end design and development of a tailored web application, scoped and priced to your specific needs.",
    priceCents: null,
    currency: "USD",
    billingPeriod: "project",
    features: [
      "Custom architecture & data model",
      "Full-stack development",
      "Third-party integrations",
      "Authentication & permissions",
      "Ongoing support options",
      "Dedicated collaboration",
    ],
    ctaLabel: "Let's talk",
    status: "published",
    isFeatured: false,
    createdAt: now,
    updatedAt: now,
  },
];

export const placeholderServices: Service[] = baseServices.map((s) => ({
  ...serviceL10nNull,
  ...s,
}));

export const placeholderMessages: ContactMessage[] = [
  {
    id: 1,
    name: "Sara Lindqvist",
    email: "sara@brightlabs.io",
    subject: "New SaaS dashboard project",
    projectType: "Dashboard",
    budgetRange: null,
    timeline: "1 to 2 months",
    message:
      "Hi! We're a small SaaS team looking to build an analytics dashboard. Do you have availability next month?",
    status: "new",
    createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 3),
    updatedAt: new Date(now.getTime() - 1000 * 60 * 60 * 3),
  },
  {
    id: 2,
    name: "Marcus Bell",
    email: "marcus@foundry.co",
    subject: "Landing page for product launch",
    projectType: "Website",
    budgetRange: "Need estimate",
    timeline: "Urgent",
    message:
      "We need a high-converting landing page for a launch in 3 weeks. What would that cost?",
    status: "read",
    createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 28),
    updatedAt: new Date(now.getTime() - 1000 * 60 * 60 * 26),
  },
  {
    id: 3,
    name: "Aisha Khan",
    email: "aisha@retailco.com",
    subject: "E-commerce admin panel",
    projectType: "Admin panel",
    budgetRange: null,
    timeline: "Flexible",
    message:
      "Following up on our call — could you send over a rough proposal for the admin panel?",
    status: "new",
    createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 50),
    updatedAt: new Date(now.getTime() - 1000 * 60 * 60 * 50),
  },
];
