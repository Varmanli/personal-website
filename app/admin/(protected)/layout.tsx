import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { getCurrentAdmin } from "@/lib/auth";
import { getI18n } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getI18n();
  return {
    title: dict.admin.panel,
    robots: { index: false, follow: false },
  };
}

// Auth depends on per-request cookies, so never statically cache the shell.
export const dynamic = "force-dynamic";

/**
 * Protected admin layout: responsive shell (sidebar + topbar) + content area.
 * Unauthenticated requests are redirected to the login page before any
 * admin page renders.
 */
export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  return <AdminShell admin={admin}>{children}</AdminShell>;
}
