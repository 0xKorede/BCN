import { cookies } from "next/headers";
import { getSupabaseAdmin, Registration, MediaItem, Volunteer, TeamMember } from "@/lib/supabase";
import { AdminClient } from "./AdminClient";
import { AdminLoginForm } from "./AdminLoginForm";
import { EventRow, ProgrammeRow } from "@/lib/events";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const SESSION_COOKIE = "bcn_admin_session";
const SESSION_VALUE = "authenticated";

type MediaRow = MediaItem & { storage_key?: string };

export default async function AdminPage({ searchParams }: { searchParams: { event?: string } }) {
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
  let events: EventRow[] = [];
  let selectedEvent: EventRow | null = null;
  let programmeItems: ProgrammeRow[] = [];

  try {
    const supabase = getSupabaseAdmin();

    const { data: eventRows } = await supabase.from("events").select("*").order("event_date", { ascending: true });
    events = (eventRows ?? []) as EventRow[];
    selectedEvent = events.find(e => e.slug === searchParams.event) ?? events.find(e => e.status === "upcoming") ?? [...events].reverse().find(e => e.status === "past") ?? null;
    const eventId = selectedEvent?.id ?? "00000000-0000-0000-0000-000000000000";
    const [regResult, mediaResult, volResult, statusResult, teamResult, programmeResult] = await Promise.all([
      supabase
        .from("registrations")
        .select("*")
        .eq("event_id", eventId)
        .order("created_at", { ascending: false }),
      supabase
        .from("media")
        .select("*")
        .eq("event_id", eventId)
        .order("uploaded_at", { ascending: false }),
      supabase
        .from("volunteers")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase
        .from("event_status")
        .select("current_item_id")
        .eq("event_id", eventId)
        .maybeSingle(),
      supabase
        .from("team_members")
        .select("*")
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: true }),
      supabase.from("programme_items").select("*").eq("event_id", eventId).order("display_order"),
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
    programmeItems = (programmeResult.data ?? []) as ProgrammeRow[];
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
      events={events}
      selectedEvent={selectedEvent}
      programmeItems={programmeItems}
    />
  );
}
