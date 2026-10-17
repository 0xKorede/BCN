import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/app/admin/AdminLoginForm";

export const dynamic = "force-dynamic";

export default function DashboardLoginPage() {
  if (cookies().get("bcn_admin_session")?.value === "authenticated") {
    redirect("/dashboard");
  }
  return <AdminLoginForm />;
}
