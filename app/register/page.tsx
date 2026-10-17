import { redirect } from "next/navigation";
import { getEvents } from "@/lib/events";

export const revalidate = 60;
export default async function RegisterPage() {
  const events = await getEvents();
  const event = events.find((item) => item.status === "upcoming");
  if (event) redirect(`/events/${event.slug}#register`);
  redirect("/events");
}
