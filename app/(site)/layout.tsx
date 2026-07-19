import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { VisitorTracker } from "@/components/analytics/VisitorTracker";
import { WebsiteModeProvider } from "@/components/layout/WebsiteModeProvider";
import { getWebsiteMode } from "@/lib/website-mode";

/** Layout for all public-facing pages: header + content + footer. */
export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const mode = await getWebsiteMode();

  return (
    <WebsiteModeProvider mode={mode}>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <VisitorTracker />
    </WebsiteModeProvider>
  );
}
