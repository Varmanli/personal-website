import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { getI18n } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getI18n();
  return { title: dict.meta.pages.notFound };
}

export default async function NotFound() {
  const { dict } = await getI18n();
  const t = dict.notFound;

  return (
    <Container className="flex min-h-[70vh] flex-col items-center justify-center py-20 text-center">
      <p className="text-7xl font-bold tracking-tight text-gradient sm:text-8xl">
        404
      </p>
      <h1 className="mt-6 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        {t.title}
      </h1>
      <p className="mx-auto mt-3 max-w-md text-muted">{t.description}</p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <ButtonLink href="/" size="lg">
          {t.backHome}
        </ButtonLink>
        <ButtonLink href="/projects" size="lg" variant="outline">
          {t.viewProjects}
        </ButtonLink>
      </div>
    </Container>
  );
}
