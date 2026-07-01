import { redirect } from "next/navigation";

export default function AdminPortfolioNewRedirectPage() {
  redirect("/admin/projects/new");
}
