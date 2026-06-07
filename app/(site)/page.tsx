import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ButtonLink } from "@/components/ui/Button";
import { Hero } from "@/components/sections/Hero";
import { CtaBanner } from "@/components/ui/CtaBanner";
import { ProjectCard } from "@/components/cards/ProjectCard";
import { ServicePlanCard } from "@/components/cards/ServicePlanCard";
import { TestimonialCard } from "@/components/cards/TestimonialCard";
import {
  getFeaturedProjects,
  getProfile,
  getPublishedServices,
} from "@/lib/data";
import { getTechStack, getTestimonials } from "@/lib/content";
import { getI18n } from "@/lib/i18n/server";
import { getDisplayFirstName } from "@/lib/utils";
import {
  FiCode,
  FiLayers,
  FiPenTool,
  FiSearch,
  FiServer,
  FiTool,
  FiZap,
} from "react-icons/fi";

// Render at request time so admin content changes appear without a rebuild.
export const dynamic = "force-dynamic";

// Icons by tech-stack group order (locale-independent).
const techIcons = [<FiLayers key="fe" />, <FiServer key="be" />, <FiTool key="tool" />];

const processIcons = [FiSearch, FiPenTool, FiCode, FiZap];

export default async function HomePage() {
  const { locale, dict } = await getI18n();
  const [profile, featuredProjects, services] = await Promise.all([
    getProfile(locale),
    getFeaturedProjects(3, locale),
    getPublishedServices(locale),
  ]);

  const featuredServices = services.slice(0, 3);
  const firstName = getDisplayFirstName(profile.ownerName);
  const techStack = getTechStack(locale);
  const testimonials = getTestimonials(locale);
  const t = dict.home;

  return (
    <>
      <Hero firstName={firstName} />

      <main className="relative overflow-hidden">
        {/* Background glows */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-40 h-130 w-130 -translate-x-1/2 rounded-full bg-primary/10 blur-[150px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-48 top-168 h-110 w-110 rounded-full bg-accent/10 blur-[140px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -left-48 bottom-96 h-105 w-105 rounded-full bg-primary/10 blur-[140px]"
        />

        <div className="relative flex flex-col gap-24 py-24 sm:gap-28 lg:gap-32 lg:py-28">
          {/* Featured projects */}
          {featuredProjects.length > 0 && (
            <Container as="section" className="space-y-10">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <SectionHeader
                  eyebrow={t.featured.eyebrow}
                  title={t.featured.title}
                  subtitle={t.featured.subtitle}
                />

                <ButtonLink
                  href="/projects"
                  variant="outline"
                  className="w-fit"
                >
                  {t.featured.all}
                  <span aria-hidden>→</span>
                </ButtonLink>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {featuredProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </Container>
          )}

          {/* Services preview */}
          {featuredServices.length > 0 && (
            <Container as="section" className="space-y-10">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <SectionHeader
                  eyebrow={t.services.eyebrow}
                  title={t.services.title}
                  subtitle={t.services.subtitle}
                />

                <ButtonLink
                  href="/services"
                  variant="outline"
                  className="w-fit"
                >
                  {t.services.all}
                  <span aria-hidden>→</span>
                </ButtonLink>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                {featuredServices.map((service) => (
                  <ServicePlanCard key={service.id} service={service} />
                ))}
              </div>
            </Container>
          )}

          {/* Tech stack */}
          <Container as="section" className="space-y-10">
            <SectionHeader
              eyebrow={t.skills.eyebrow}
              title={t.skills.title}
              subtitle={t.skills.subtitle}
            />

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {techStack.map((group, i) => (
                <article
                  key={group.category}
                  className="neon-card group relative overflow-hidden rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_24px_80px_rgba(79,124,255,0.14)]"
                >
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-primary/15 blur-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  />
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-accent/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  />

                  <div className="relative">
                    <div className="mb-5 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-background/55 text-xl text-primary-light backdrop-blur transition-colors group-hover:border-primary/40 group-hover:bg-primary/10">
                          {techIcons[i] ?? <FiCode />}
                        </span>

                        <div>
                          <h3 className="text-base font-semibold tracking-tight text-foreground">
                            {group.category}
                          </h3>
                          <p className="mt-0.5 text-xs text-faint">
                            {group.items.length} {t.skills.tools}
                          </p>
                        </div>
                      </div>

                      <span className="h-2 w-2 rounded-full bg-linear-to-r from-primary to-accent shadow-[0_0_16px_rgba(166,107,255,0.75)]" />
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {group.items.map((item) => (
                        <span
                          key={item}
                          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-2/45 px-3 py-1.5 text-xs font-medium text-muted backdrop-blur transition-all hover:border-primary/40 hover:bg-primary/10 hover:text-primary-light"
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-primary/60" />
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </Container>

          {/* Process */}
          <Container as="section" className="space-y-10">
            <SectionHeader
              eyebrow={t.process.eyebrow}
              title={t.process.title}
              subtitle={t.process.subtitle}
            />

            <ol className="relative grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <span
                aria-hidden
                className="pointer-events-none absolute left-0 top-12 hidden h-px w-full bg-linear-to-r from-transparent via-border-strong to-transparent lg:block"
              />

              {t.process.steps.map((step, index) => {
                const Icon = processIcons[index] ?? FiCode;

                return (
                  <li
                    key={step.title}
                    className="neon-card group relative overflow-hidden rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_24px_80px_rgba(79,124,255,0.14)]"
                  >
                    <div
                      aria-hidden
                      className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary/15 blur-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    />
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-accent/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    />

                    <div className="relative">
                      <div className="mb-6 flex items-center justify-between">
                        <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-background/55 text-xl text-primary-light backdrop-blur transition-colors group-hover:border-primary/40 group-hover:bg-primary/10">
                          <Icon />
                        </span>

                        <span className="rounded-full border border-border bg-surface-2/50 px-3 py-1 text-xs font-semibold text-faint backdrop-blur">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>

                      <h3 className="text-lg font-semibold tracking-tight text-foreground">
                        {step.title}
                      </h3>

                      <p className="mt-2 text-sm leading-relaxed text-muted">
                        {step.description}
                      </p>

                      <div className="mt-6 h-px w-full bg-linear-to-r from-primary/50 via-accent/40 to-transparent opacity-60" />
                    </div>
                  </li>
                );
              })}
            </ol>
          </Container>

          {/* Testimonials */}
          <Container as="section" className="space-y-10">
            <SectionHeader
              eyebrow={t.testimonials.eyebrow}
              title={t.testimonials.title}
              subtitle={t.testimonials.subtitle}
            />

            <div className="grid gap-6 md:grid-cols-3">
              {testimonials.map((testimonial) => (
                <TestimonialCard
                  key={testimonial.author}
                  testimonial={testimonial}
                />
              ))}
            </div>
          </Container>

          {/* Planner CTA */}
          <Container as="section">
            <CtaBanner
              title={dict.planner.cta.homeTitle}
              description={dict.planner.cta.homeText}
              ctaLabel={dict.planner.cta.start}
              ctaHref="/start-project"
            />
          </Container>

          {/* Contact CTA */}
          <Container as="section">
            <CtaBanner
              title={t.cta.title}
              description={t.cta.description}
              ctaLabel={t.cta.cta}
              ctaHref="/contact"
            />
          </Container>
        </div>
      </main>
    </>
  );
}
