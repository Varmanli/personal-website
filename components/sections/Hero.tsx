import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { PublicCtaLink } from "@/components/ui/PublicCtaLink";
import { DeveloperHeroVisual } from "@/components/home/DeveloperHeroVisual";
import type { HeroConfiguration } from "@/types";
import type { Locale } from "@/lib/i18n/config";
import { getHeroContent } from "@/lib/hero-config";
import { getTechnology } from "@/lib/admin/technologies";
import { FaReact, FaNodeJs } from "react-icons/fa";
import {
  SiDocker,
  SiGithubactions,
  SiNextdotjs,
  SiNestjs,
  SiPostgresql,
  SiTailwindcss,
  SiTypescript,
} from "react-icons/si";

const techs = [
  { name: "Next.js", icon: <SiNextdotjs size={16} className="text-primary" /> },
  {
    name: "TypeScript",
    icon: <SiTypescript size={16} className="text-primary" />,
  },
  { name: "React", icon: <FaReact size={16} className="text-primary" /> },
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
  { name: "Docker", icon: <SiDocker size={16} className="text-primary" /> },
  {
    name: "GitHub Actions",
    icon: <SiGithubactions size={16} className="text-primary" />,
  },
];

export function Hero({ config, locale }: { config: HeroConfiguration; locale: Locale }) {
  const h = getHeroContent(config, { mode: config.activeMode, locale });
  const direction = locale === "fa" ? "rtl" : "ltr";

  return (
    <section className="relative overflow-hidden border-b border-border" dir={direction}>
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

      <Container className="relative grid items-center gap-10 py-14 sm:py-16 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-14 lg:py-22">
        <div className="order-1 space-y-6">
          <p className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-2/55 px-4 py-2 text-xs font-semibold tracking-[0.18em] text-primary-light backdrop-blur sm:text-sm">
            <span className="h-2 w-2 rounded-full bg-success shadow-[0_0_14px_rgba(52,211,153,0.75)]" />
            {h.greeting}
          </p>

          <div className="space-y-5">
            <h1 className="max-w-3xl text-4xl font-extrabold leading-[1.1] text-foreground sm:text-5xl lg:text-6xl">
              {h.headlineLead}
              <br />
              <span className="text-gradient">{h.headlineHighlight}</span>
            </h1>

            <p className="max-w-2xl text-base leading-8 text-muted sm:text-lg">
              {h.subtitle}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <PublicCtaLink href={h.primaryCta.href} size="lg" className="w-full sm:w-auto sm:min-w-52">
              {h.primaryCta.label}
            </PublicCtaLink>
            <ButtonLink
              href={h.secondaryCta.href}
              size="lg"
              variant="outline"
              className="w-full sm:w-auto sm:min-w-44"
            >
              {h.secondaryCta.label}
            </ButtonLink>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {h.technologies.map((name) => {
              const tech = getTechnology(name);
              return (
              <span
                key={name}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-2/50 px-3 py-1.5 text-xs font-medium text-muted backdrop-blur"
              >
                {tech?.icon}
                {tech?.label ?? name}
              </span>
              );
            })}
          </div>
        </div>

        <div className="order-2">
          <DeveloperHeroVisual />
        </div>
      </Container>
    </section>
  );
}
