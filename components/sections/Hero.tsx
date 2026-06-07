import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { DeveloperHeroVisual } from "@/components/home/DeveloperHeroVisual";
import { getI18n } from "@/lib/i18n/server";
import { format } from "@/lib/i18n/dictionaries";
import { FaReact, FaNodeJs } from "react-icons/fa";
import {
  SiNextdotjs,
  SiTypescript,
  SiNestjs,
  SiTailwindcss,
  SiPostgresql,
  SiDrizzle,
} from "react-icons/si";

const techs = [
  { name: "React", icon: <FaReact size={16} className="text-primary" /> },
  { name: "Next.js", icon: <SiNextdotjs size={16} className="text-primary" /> },
  {
    name: "TypeScript",
    icon: <SiTypescript size={16} className="text-primary" />,
  },
  { name: "Node.js", icon: <FaNodeJs size={16} className="text-primary" /> },
  { name: "NestJS", icon: <SiNestjs size={16} className="text-primary" /> },
  {
    name: "Tailwind CSS",
    icon: <SiTailwindcss size={16} className="text-primary" />,
  },
  {
    name: "PostgreSQL",
    icon: <SiPostgresql size={16} className="text-primary" />,
  },
  { name: "Drizzle", icon: <SiDrizzle size={16} className="text-primary" /> },
];

export async function Hero({ firstName }: { firstName: string }) {
  const { dict } = await getI18n();
  const h = dict.hero;
  return (
    <section className="relative overflow-hidden border-b border-border">
      {/* Grid & radial glows */}
      <div
        aria-hidden
        className="absolute inset-0 grid-bg mask-[radial-gradient(ellipse_at_center,black,transparent_78%)]"
      />
      <div
        aria-hidden
        className="absolute -left-32 top-10 h-96 w-96 rounded-full bg-primary/20 blur-[120px]"
      />
      <div
        aria-hidden
        className="absolute -right-20 top-0 h-96 w-96 rounded-full bg-accent/20 blur-[120px]"
      />

      <Container className="relative grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
        {/* Left content — minimalist and professional */}
        <div className="space-y-6">
          {/* Greeting */}
          <p className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-2/50 px-4 py-2 text-sm font-semibold uppercase tracking-wider text-muted backdrop-blur">
            {format(h.greeting, { name: firstName })}{" "}
            <span aria-hidden>👋</span>
          </p>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-foreground">
            {h.headlineLead} <br />
            <span className="text-gradient">{h.headlineHighlight}</span>
          </h1>

          {/* Description */}
          <p className="max-w-lg text-lg sm:text-xl leading-relaxed text-muted">
            {h.subtitle}
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap gap-4 pt-2">
            <ButtonLink href="/projects" size="lg" className="px-6">
              {h.viewProjects}
            </ButtonLink>
            <ButtonLink
              href="/contact"
              size="lg"
              variant="outline"
              className="px-6"
            >
              {h.contactMe}
            </ButtonLink>
          </div>

          {/* Tech Pills */}
          <div className="flex flex-wrap gap-2 pt-2">
            {techs.map((tech) => (
              <span
                key={tech.name}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-2/50 px-3 py-1.5 text-xs font-medium text-muted backdrop-blur"
              >
                {tech.icon}
                {tech.name}
              </span>
            ))}
          </div>
        </div>

        {/* Right — animated developer visual */}
        <DeveloperHeroVisual availableLabel={h.available} />
      </Container>
    </section>
  );
}
