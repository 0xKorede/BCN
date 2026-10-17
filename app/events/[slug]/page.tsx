import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSupabasePublic, MediaItem } from "@/lib/supabase";
import { EventRow, EventSpeaker, ProgrammeRow, formatEventDate } from "@/lib/events";
import { eventDateTime } from "@/lib/eventTime";
import { Countdown } from "@/components/ui/Countdown";
import { RegistrationForm } from "@/components/sections/RegistrationForm";
import { VolunteerCTA } from "@/components/sections/VolunteerCTA";
import { Footer } from "@/components/layout/Footer";
import { EventProgramme } from "@/components/events/EventProgramme";
import { Navbar } from "@/components/layout/Navbar";
import { Speakers } from "@/components/sections/Speakers";

export const revalidate = 60;
async function eventFor(slug:string){const {data}=await getSupabasePublic().from("events").select("*").eq("slug",slug).maybeSingle(); return data as EventRow|null}
export async function generateMetadata({params}:{params:{slug:string}}):Promise<Metadata>{const e=await eventFor(params.slug); if(!e)return{}; return{title:`${e.theme} | Building Creatives Network`,description:e.hero_subtext||`${e.theme} on ${formatEventDate(e.event_date)} at ${e.venue}`}}

export default async function EventPage({params}:{params:{slug:string}}){
 const event=await eventFor(params.slug); if(!event)notFound(); const db=getSupabasePublic();
 const [speakerResult,programmeResult,mediaResult,volunteerMediaResult]=await Promise.all([
  db.from("speakers").select("*").eq("event_id",event.id).order("display_order"),
  db.from("programme_items").select("*").eq("event_id",event.id).order("display_order"),
  db.from("media").select("*").eq("event_id",event.id).order("uploaded_at",{ascending:false}).limit(8),
  db.from("media").select("url").eq("type","image").order("uploaded_at",{ascending:false})
 ]);
 const speakers=(speakerResult.data??[]) as EventSpeaker[]; const programme=(programmeResult.data??[]) as ProgrammeRow[]; const media=(mediaResult.data??[]) as MediaItem[]; const volunteerImages=(volunteerMediaResult.data??[]).map((item) => item.url); const past=event.status==="past";
 return <div className="min-h-screen bg-bcn-black text-[#F5F1E8]">
  <Navbar variant="event" eventPast={past} />
  <main><section className="min-h-[90vh] flex items-center justify-center px-4 pt-32 text-center relative overflow-hidden"><div className="absolute w-[600px] h-[600px] bg-bcn-orange/10 rounded-full blur-[130px]"/><div className="relative max-w-4xl"><p className="text-bcn-orange uppercase tracking-[.2em] font-bold">{event.name} · Lokoja</p><h1 className="mt-7 text-5xl sm:text-7xl font-extrabold">{past?<>Thank You for an <span className="text-bcn-orange">Amazing Day!</span></>:<span className="bg-bcn-gradient bg-clip-text text-transparent">{event.hero_headline||event.theme}</span>}</h1><p className="mt-6 text-lg text-[#DFD8CE]">{past?`${event.name} has come and gone — thank you to everyone who showed up, spoke, performed, and built with us.`:(event.hero_subtext||"Connecting innovators, digital artists, founders, and creatives for a transformative day of community, craft, and vision.")}</p><p className="mt-7">{formatEventDate(event.event_date)} · {event.venue}</p><div className="mt-8"><Countdown target={eventDateTime(event.event_date,event.event_time).toISOString()} concluded={past}/></div></div></section>
  {speakers.length>0&&<Speakers entries={speakers} />}
  {programme.length>0&&<EventProgramme eventId={event.id} items={programme} past={past}/>} 
  <section className="bg-bcn-gradient text-black py-9 px-4"><div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6 text-center font-bold"><div>{formatEventDate(event.event_date)}</div><div>{event.event_time}</div><div>{event.venue}</div></div></section><VolunteerCTA images={volunteerImages}/>
  {(media.length>0||event.gallery_link)&&<section id="live-moments" className="py-24 px-4 max-w-6xl mx-auto"><h2 className="text-4xl font-bold mb-10">Event Highlights</h2><div className="grid grid-cols-2 md:grid-cols-4 gap-3">{media.map(m=><div key={m.id} className="relative aspect-square rounded-xl overflow-hidden bg-[#181818]">{m.type==="image"?<Image src={m.url} alt={m.caption||"Event highlight"} fill className="object-cover object-center"/>:<video src={m.url} controls className="w-full h-full object-cover object-center"/>}</div>)}</div>{event.gallery_link&&<a href={event.gallery_link} target="_blank" rel="noreferrer" className="mt-8 inline-block rounded-xl border border-bcn-orange px-6 py-3 text-bcn-orange">View Full Gallery</a>}</section>}
  <RegistrationForm event={event}/></main><Footer/></div>
}
