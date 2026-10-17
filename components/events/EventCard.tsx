import Image from "next/image";
import Link from "next/link";
import { EventRow, formatEventDate } from "@/lib/events";

export function EventCard({ event, compact = false }: { event: EventRow; compact?: boolean }) {
  const previewImage = event.cover_image_url || "/og-image.jpg";

  return <article className="overflow-hidden rounded-2xl border border-white/10 bg-[#141414] shadow-xl">
    <div className={`${compact ? "h-48" : "h-52"} relative bg-black`}>
      <Image src={previewImage} alt={`${event.theme} event preview`} fill className="object-contain object-center" />
    </div>
    <div className="p-5 sm:p-6"><p className="text-xs font-bold uppercase tracking-widest text-bcn-orange">{event.status}</p>
      <h3 className="mt-2 text-xl font-bold text-[#F5F1E8]">{event.theme}</h3>
      <p className="mt-3 text-sm text-[#BFB9B0]">{formatEventDate(event.event_date)} · {event.venue}</p>
      <Link className="mt-5 inline-block font-semibold text-bcn-amber hover:text-bcn-orange" href={`/events/${event.slug}`}>{event.status === "past" ? "View Highlights" : "View Event Details"} →</Link>
    </div>
  </article>;
}
