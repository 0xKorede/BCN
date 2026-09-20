import { cookies } from "next/headers";
import { getSupabaseAdmin, Registration, MediaItem, Volunteer, TeamMember } from "@/lib/supabase";
import { AdminClient } from "./AdminClient";
import { AdminLoginForm } from "./AdminLoginForm";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const SESSION_COOKIE = "bcn_admin_session";
const SESSION_VALUE = "authenticated";

type MediaRow = MediaItem & { storage_key?: string };

export default async function AdminPage() {
  const session = cookies().get(SESSION_COOKIE);
  const isAuthenticated = session?.value === SESSION_VALUE;

  if (!isAuthenticated) {
    return <AdminLoginForm />;
  }

  let registrations: Registration[] = [];
  let initialMedia: MediaRow[] = [];
  let volunteers: Volunteer[] = [];
  let initialCurrentItemId: number | null = null;
  let initialTeamMembers: TeamMember[] = [];

  try {
    const supabase = getSupabaseAdmin();

    const [regResult, mediaResult, volResult, statusResult, teamResult] = await Promise.all([
      supabase
        .from("registrations")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase
        .from("media")
        .select("*")
        .order("uploaded_at", { ascending: false }),
      supabase
        .from("volunteers")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase
        .from("event_status")
        .select("current_item_id")
        .eq("id", 1)
        .maybeSingle(),
      supabase
        .from("team_members")
        .select("*")
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: true }),
    ]);

    if (regResult.error) {
      console.error("[BCN Admin] Error fetching registrations:", regResult.error);
    } else if (regResult.data) {
      registrations = regResult.data as Registration[];
    }

    if (mediaResult.error) {
      console.error("[BCN Admin] Error fetching media:", mediaResult.error);
    } else if (mediaResult.data) {
      initialMedia = mediaResult.data as MediaRow[];
    }

    if (volResult.error) {
      console.error("[BCN Admin] Error fetching volunteers:", volResult.error);
    } else if (volResult.data) {
      volunteers = volResult.data as Volunteer[];
    }

    if (statusResult.data) {
      initialCurrentItemId = statusResult.data.current_item_id ?? null;
    }

    if (teamResult.error) {
      console.error("[BCN Admin] Error fetching team members:", teamResult.error);
    } else if (teamResult.data) {
      initialTeamMembers = teamResult.data as TeamMember[];
    }
  } catch (err) {
    console.error("[BCN Admin] Supabase connection error:", err);
  }

  return (
    <AdminClient
      initialRegistrations={registrations}
      initialMedia={initialMedia}
      initialVolunteers={volunteers}
      initialCurrentItemId={initialCurrentItemId}
      initialTeamMembers={initialTeamMembers}
    />
  );
}
