import type {
  Project,
  Service,
  PortfolioItem,
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
  challengeFa: null,
  challengeEn: null,
  solutionFa: null,
  solutionEn: null,
  outcomeFa: null,
  outcomeEn: null,
  tagsFa: [] as string[],
  tagsEn: [] as string[],
  challengesFa: [] as string[],
  challengesEn: [] as string[],
  coverImageUrl: null,
  galleryImages: [] as string[],
};

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

const portfolioL10nNull = {
  titleFa: null,
  titleEn: null,
  descriptionFa: null,
  descriptionEn: null,
  coverImageUrl: null,
  galleryImages: [] as string[],
  technologies: [] as string[],
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
};

export const placeholderProfile: SiteSettings = {
  ...profileL10nNull,
  id: 1,
  ownerName: "Your Name",
  headline: "Full-stack developer building commercial web apps",
  bio: "I'm a full-stack developer who helps founders and small teams turn ideas into fast, reliable web products. From marketing sites to data-heavy dashboards, I handle design, development, and deployment — so you get a finished product, not just code.",
  avatarUrl: null,
  resumeUrl: null,
  logoUrl: null,
  faviconUrl: null,
  heroImageUrl: null,
  email: "hello@example.com",
  location: "Remote · Worldwide",
  skills: [
    "TypeScript",
    "React",
    "Next.js",
    "Node.js",
    "PostgreSQL",
    "Tailwind CSS",
    "Drizzle ORM",
  ],
  socialLinks: [
    { label: "GitHub", url: "https://github.com/" },
    { label: "LinkedIn", url: "https://linkedin.com/" },
    { label: "X / Twitter", url: "https://x.com/" },
  ],
  createdAt: now,
  updatedAt: now,
};

const baseProjects: Omit<Project, keyof typeof projectL10nNull>[] = [
  {
    id: 1,
    title: "Commerce Platform",
    slug: "commerce-platform",
    shortDescription:
      "A scalable storefront and admin dashboard for a growing retail brand.",
    description:
      "A full e-commerce platform with product management, cart and checkout, order tracking, and a custom admin dashboard. Built for performance and easy day-to-day management by a non-technical team.",
    thumbnailUrl: null,
    media: [],
    technologies: ["Next.js", "PostgreSQL", "Stripe", "Tailwind CSS"],
    tags: ["E-commerce", "SaaS", "Full-stack"],
    role: "Full-stack developer & UI designer",
    client: "Northwind Retail",
    year: "2024",
    challenge:
      "The client was outgrowing an off-the-shelf store builder that couldn't support custom pricing rules or their internal fulfilment workflow.",
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
    title: "Analytics Dashboard",
    slug: "analytics-dashboard",
    shortDescription:
      "Real-time metrics, reporting, and team workspaces for a B2B SaaS.",
    description:
      "A data-dense analytics product with real-time charts, custom report builders, and role-based team workspaces. Designed to make complex data approachable.",
    thumbnailUrl: null,
    media: [],
    technologies: ["React", "Node.js", "PostgreSQL", "Redis"],
    tags: ["SaaS", "Data", "Dashboard"],
    role: "Lead frontend engineer",
    client: "Loop Analytics",
    year: "2023",
    challenge:
      "Users struggled to extract insight from a firehose of raw data, and the existing UI couldn't keep up with real-time updates.",
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
    title: "Booking & Scheduling App",
    slug: "booking-scheduling-app",
    shortDescription:
      "Appointment scheduling with reminders for small service businesses.",
    description:
      "A booking system that lets small businesses accept appointments online, manage availability, and reduce no-shows with automated reminders.",
    thumbnailUrl: null,
    media: [],
    technologies: ["Next.js", "PostgreSQL", "Tailwind CSS"],
    tags: ["Web app", "Scheduling"],
    role: "Full-stack developer",
    client: "Bright Booking",
    year: "2023",
    challenge:
      "The business relied on phone bookings and a paper calendar, leading to double-bookings and missed appointments.",
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
    message:
      "Following up on our call — could you send over a rough proposal for the admin panel?",
    status: "new",
    createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 50),
    updatedAt: new Date(now.getTime() - 1000 * 60 * 60 * 50),
  },
];

const basePortfolio: Omit<PortfolioItem, keyof typeof portfolioL10nNull>[] = [
  {
    id: 1,
    title: "Brand Landing Page",
    slug: "brand-landing-page",
    description: "Marketing site for a product launch.",
    imageUrl: null,
    type: "commercial",
    externalUrl: "https://example.com",
    status: "published",
    isFeatured: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 2,
    title: "SaaS Dashboard UI",
    slug: "saas-dashboard-ui",
    description: "Analytics dashboard interface and design system.",
    imageUrl: null,
    type: "commercial",
    externalUrl: null,
    status: "published",
    isFeatured: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 3,
    title: "Open-Source CLI",
    slug: "open-source-cli",
    description: "A developer tool published to npm.",
    imageUrl: null,
    type: "personal",
    externalUrl: "https://github.com/",
    status: "published",
    isFeatured: false,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 4,
    title: "Client Microsite",
    slug: "client-microsite",
    description: "Campaign microsite for a freelance client.",
    imageUrl: null,
    type: "freelance",
    externalUrl: null,
    status: "published",
    isFeatured: false,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 5,
    title: "Booking Flow Redesign",
    slug: "booking-flow-redesign",
    description: "UX redesign of an appointment booking flow.",
    imageUrl: null,
    type: "freelance",
    externalUrl: null,
    status: "published",
    isFeatured: false,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 6,
    title: "Portfolio Template",
    slug: "portfolio-template",
    description: "An open-source personal portfolio starter.",
    imageUrl: null,
    type: "personal",
    externalUrl: "https://github.com/",
    status: "published",
    isFeatured: false,
    createdAt: now,
    updatedAt: now,
  },
];

export const placeholderPortfolio: PortfolioItem[] = basePortfolio.map((p) => ({
  ...portfolioL10nNull,
  ...p,
}));
