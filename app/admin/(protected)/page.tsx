import {
  FiFolder,
  FiLayers,
  FiMail,
  FiInbox,
  FiUsers,
  FiEye,
} from "react-icons/fi";
import type { ReactNode } from "react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { StatCard } from "@/components/admin/StatCard";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import Link from "next/link";
import {
  getAllProjects,
  getAllServices,
  getMessages,
} from "@/lib/data";
import { getVisitorStats } from "@/lib/analytics";
import { getProjectRequestStats } from "@/lib/planner/data";
import { formatDate } from "@/lib/utils";
import { getI18n } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [projects, services, messages, requestStats, visitors, { dict }] =
    await Promise.all([
      getAllProjects(),
      getAllServices(),
      getMessages(),
      getProjectRequestStats(),
      getVisitorStats(),
      getI18n(),
    ]);
  const t = dict.admin.dashboard;

  const newMessages = messages.filter((m) => m.status === "new");
  const recentMessages = messages.slice(0, 5);

  const numberFmt = new Intl.NumberFormat("en-US");
  const formatCount = (n: number) => numberFmt.format(n);

  const stats: Array<{
    label: string;
    value: string | number;
    icon: ReactNode;
    href?: string;
    trend?: string;
    trendUp?: boolean;
  }> = [
    {
      label: t.statUniqueVisitors,
      value: formatCount(visitors.uniqueVisitors),
      icon: <FiUsers />,
      trend:
        visitors.uniqueToday > 0
          ? `${formatCount(visitors.uniqueToday)} ${t.statToday}`
          : undefined,
      trendUp: visitors.uniqueToday > 0,
    },
    {
      label: t.statPageViews,
      value: formatCount(visitors.pageViews),
      icon: <FiEye />,
    },
    {
      label: t.statProjects,
      value: projects.length,
      href: "/admin/projects",
      icon: <FiFolder />,
    },
    {
      label: t.statServices,
      value: services.length,
      href: "/admin/services",
      icon: <FiLayers />,
    },
    {
      label: t.statNewMessages,
      value: newMessages.length,
      href: "/admin/messages",
      icon: <FiMail />,
    },
    {
      label: dict.admin.requests.title,
      value: requestStats.new,
      href: "/admin/project-requests",
      icon: <FiInbox />,
    },
  ];

  const quickActions = [
    { label: dict.admin.quick.newProject, href: "/admin/projects/new" },
    { label: dict.admin.quick.newService, href: "/admin/services/new" },
    { label: dict.admin.quick.viewMessages, href: "/admin/messages" },
  ];

  return (
    <>
      <AdminPageHeader title={t.title} description={t.description} />

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            href={stat.href}
            icon={stat.icon}
            trend={stat.trend}
            trendUp={stat.trendUp}
          />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent messages */}
        <section className="lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-faint">
              {t.recentMessages}
            </h2>
            <Link
              href="/admin/messages"
              className="text-sm text-primary-light hover:underline"
            >
              {t.viewAll}
            </Link>
          </div>
          {recentMessages.length === 0 ? (
            <p className="mt-3 rounded-xl border border-dashed border-border bg-surface p-6 text-center text-sm text-muted">
              {t.noMessages}
            </p>
          ) : (
            <ul className="neon-card mt-3 divide-y divide-border overflow-hidden rounded-xl">
              {recentMessages.map((message) => (
                <li
                  key={message.id}
                  className="flex items-start justify-between gap-4 p-4 transition-colors hover:bg-surface-2"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground">
                        {message.name}
                      </p>
                      {message.status === "new" && (
                        <Badge tone="success">{t.newBadge}</Badge>
                      )}
                    </div>
                    <p className="truncate text-sm text-muted">
                      {message.subject ?? message.message}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-faint">
                    {formatDate(message.createdAt)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Quick actions */}
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-faint">
            {t.quickActions}
          </h2>
          <div className="mt-3 flex flex-col gap-2 neon-card rounded-xl p-4">
            {quickActions.map((action) => (
              <ButtonLink
                key={action.label}
                href={action.href}
                variant="outline"
                size="sm"
                className="justify-start"
              >
                {action.label}
              </ButtonLink>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
