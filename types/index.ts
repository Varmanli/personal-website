/**
 * Central type exports.
 *
 * Database row/insert types live in `db/schema.ts` (inferred from Drizzle).
 * Re-export them here so app code can `import { Project } from "@/types"`
 * without reaching into the db layer.
 */
export type {
  Project,
  NewProject,
  Service,
  NewService,
  PortfolioItem,
  NewPortfolioItem,
  ContactMessage,
  NewContactMessage,
  SiteSettings,
  NewSiteSettings,
  ProjectRequest,
  NewProjectRequest,
  PlannerOption,
  NewPlannerOption,
  PlannerEstimateRule,
  NewPlannerEstimateRule,
  PlannerSettings,
  NewPlannerSettings,
  EstimateBreakdownItem,
} from "@/db/schema";

/** Standard envelope for all API responses. */
export type ApiResponse<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

/** Payload accepted by the public contact form / POST /api/contact. */
export interface ContactFormPayload {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

/** A single navigation link. */
export interface NavLink {
  label: string;
  href: string;
}

/** Client testimonial shown on the home page. */
export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company?: string;
}

/** A step in the "how I work" process section. */
export interface ProcessStep {
  title: string;
  description: string;
}

/** An entry in the experience / timeline section. */
export interface TimelineEntry {
  period: string;
  role: string;
  organization: string;
  description: string;
}

/** A grouped set of tools/technologies for the tech-stack section. */
export interface TechGroup {
  category: string;
  items: string[];
}

/** A working-style value / principle. */
export interface ValueItem {
  title: string;
  description: string;
}
