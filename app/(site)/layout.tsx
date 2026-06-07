import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

/** Layout for all public-facing pages: header + content + footer. */
export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
