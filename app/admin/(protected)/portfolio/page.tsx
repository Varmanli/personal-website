import { redirect } from "next/navigation";

export default function AdminPortfolioRedirectPage() {
  redirect("/admin/projects");
}
