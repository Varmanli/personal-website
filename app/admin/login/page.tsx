import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LoginForm } from "@/components/admin/LoginForm";
import { getCurrentAdmin } from "@/lib/auth";
import { getProfile } from "@/lib/data";
import { getI18n } from "@/lib/i18n/server";
import { format } from "@/lib/i18n/dictionaries";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getI18n();
  return {
    title: dict.admin.auth.title,
    robots: { index: false, follow: false },
  };
}

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  // Already signed in → skip the login form.
  const admin = await getCurrentAdmin();
  if (admin) redirect("/admin");

  const { locale, dict } = await getI18n();
  const profile = await getProfile(locale);
  const t = dict.admin.auth;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-base font-bold text-white">
            {profile.ownerName.charAt(0)}
          </span>
          <h1 className="mt-4 text-xl font-bold text-foreground">{t.title}</h1>
          <p className="mt-1 text-sm text-muted">{t.subtitle}</p>
        </div>

        <div className="neon-card rounded-2xl p-6">
          <LoginForm />
        </div>

        <p className="mt-6 text-center text-xs text-faint">
          <Link href="/" className="transition-colors hover:text-foreground">
            {format(t.backTo, { site: profile.ownerName })}
          </Link>
        </p>
      </div>
    </div>
  );
}
