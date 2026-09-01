import { cookies } from "next/headers";
import { getSupabaseAdmin, Registration } from "@/lib/supabase";
import { AdminClient } from "./AdminClient";
import { AdminLoginForm } from "./AdminLoginForm";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const SESSION_COOKIE = "bcn_admin_session";
const SESSION_VALUE = "authenticated";

export default async function AdminPage() {
  const session = cookies().get(SESSION_COOKIE);
  const isAuthenticated = session?.value === SESSION_VALUE;

  if (!isAuthenticated) {
    return <AdminLoginForm />;
  }

  let registrations: Registration[] = [];

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("registrations")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[BCN Admin] Error fetching registrations:", error);
    } else if (data) {
      registrations = data as Registration[];
    }
  } catch (err) {
    console.error("[BCN Admin] Supabase connection error:", err);
  }

  return <AdminClient initialRegistrations={registrations} />;
}
