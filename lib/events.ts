import { getSupabasePublic } from "./supabase";

export interface EventRow {
  id: string; slug: string; name: string; theme: string; event_date: string;
  event_time: string; venue: string; status: "upcoming" | "past";
  is_paid: boolean; ticket_price: number | null; hero_headline: string | null;
  hero_subtext: string | null; gallery_link: string | null; cover_image_url: string | null;
}
export interface EventSpeaker { id: string; name: string; role: "host" | "speaker"; bio: string; photo_url: string | null; display_order: number }
export interface ProgrammeRow { id: string; title: string; presenter: string | null; duration_minutes: number; display_order: number }

export async function getEvents() {
  const { data, error } = await getSupabasePublic().from("events").select("*").order("event_date", { ascending: true });
  if (error) throw error;
  return (data ?? []) as EventRow[];
}

export function formatEventDate(date: string) {
  return new Intl.DateTimeFormat("en-NG", { day: "numeric", month: "long", year: "numeric", timeZone: "Africa/Lagos" }).format(new Date(`${date}T00:00:00+01:00`));
}
