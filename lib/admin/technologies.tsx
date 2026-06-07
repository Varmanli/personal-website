import type { ReactNode } from "react";
import {
  SiJavascript,
  SiTypescript,
  SiHtml5,
  SiCss,
  SiTailwindcss,
  SiReact,
  SiNextdotjs,
  SiNodedotjs,
  SiNestjs,
  SiExpress,
  SiMongodb,
  SiPostgresql,
  SiMysql,
  SiPrisma,
  SiDrizzle,
  SiDocker,
  SiRedis,
  SiGraphql,
  SiGit,
  SiGithub,
  SiVercel,
  SiRedux,
  SiReactquery,
  SiFramer,
  SiFigma,
} from "react-icons/si";
import { FiServer, FiPackage } from "react-icons/fi";

/**
 * Fixed registry of technologies used across the portfolio. Values are the
 * canonical display strings stored in `projects.technologies` (so the picker
 * and public badges stay in sync). Icons come from react-icons; any tech not
 * found here still renders as a plain chip (custom values are preserved).
 */
export interface TechnologyOption {
  value: string;
  label: string;
  icon: ReactNode;
  /** Brand-ish text color for the icon. */
  colorClass?: string;
}

export const TECHNOLOGIES: TechnologyOption[] = [
  { value: "JavaScript", label: "JavaScript", icon: <SiJavascript />, colorClass: "text-yellow-400" },
  { value: "TypeScript", label: "TypeScript", icon: <SiTypescript />, colorClass: "text-blue-400" },
  { value: "HTML", label: "HTML", icon: <SiHtml5 />, colorClass: "text-orange-500" },
  { value: "CSS", label: "CSS", icon: <SiCss />, colorClass: "text-sky-400" },
  { value: "Tailwind CSS", label: "Tailwind CSS", icon: <SiTailwindcss />, colorClass: "text-cyan-400" },
  { value: "React", label: "React", icon: <SiReact />, colorClass: "text-cyan-400" },
  { value: "Next.js", label: "Next.js", icon: <SiNextdotjs />, colorClass: "text-foreground" },
  { value: "Node.js", label: "Node.js", icon: <SiNodedotjs />, colorClass: "text-green-500" },
  { value: "NestJS", label: "NestJS", icon: <SiNestjs />, colorClass: "text-red-500" },
  { value: "Express.js", label: "Express.js", icon: <SiExpress />, colorClass: "text-muted" },
  { value: "MongoDB", label: "MongoDB", icon: <SiMongodb />, colorClass: "text-green-500" },
  { value: "PostgreSQL", label: "PostgreSQL", icon: <SiPostgresql />, colorClass: "text-sky-500" },
  { value: "MySQL", label: "MySQL", icon: <SiMysql />, colorClass: "text-blue-500" },
  { value: "Prisma", label: "Prisma", icon: <SiPrisma />, colorClass: "text-teal-300" },
  { value: "Drizzle ORM", label: "Drizzle ORM", icon: <SiDrizzle />, colorClass: "text-lime-400" },
  { value: "Docker", label: "Docker", icon: <SiDocker />, colorClass: "text-blue-400" },
  { value: "Redis", label: "Redis", icon: <SiRedis />, colorClass: "text-red-500" },
  { value: "REST API", label: "REST API", icon: <FiServer />, colorClass: "text-primary-light" },
  { value: "GraphQL", label: "GraphQL", icon: <SiGraphql />, colorClass: "text-pink-400" },
  { value: "Git", label: "Git", icon: <SiGit />, colorClass: "text-orange-500" },
  { value: "GitHub", label: "GitHub", icon: <SiGithub />, colorClass: "text-foreground" },
  { value: "Vercel", label: "Vercel", icon: <SiVercel />, colorClass: "text-foreground" },
  { value: "Redux", label: "Redux", icon: <SiRedux />, colorClass: "text-purple-400" },
  { value: "React Query", label: "React Query", icon: <SiReactquery />, colorClass: "text-red-400" },
  { value: "Zustand", label: "Zustand", icon: <FiPackage />, colorClass: "text-amber-500" },
  { value: "Framer Motion", label: "Framer Motion", icon: <SiFramer />, colorClass: "text-pink-500" },
  { value: "Figma", label: "Figma", icon: <SiFigma />, colorClass: "text-purple-400" },
];

const BY_VALUE = new Map(TECHNOLOGIES.map((t) => [t.value.toLowerCase(), t]));

/** Look up a registry entry by its stored value (case-insensitive). */
export function getTechnology(value: string): TechnologyOption | undefined {
  return BY_VALUE.get(value.trim().toLowerCase());
}
