import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AboutBcn } from "@/components/sections/AboutBcn";
import { TeamSection } from "@/components/sections/TeamSection";
import { VolunteerCTA } from "@/components/sections/VolunteerCTA";
import { EventCard } from "@/components/events/EventCard";
import { ComingSoonEvent } from "@/components/events/ComingSoonEvent";
import { getEvents } from "@/lib/events";
import { getSupabaseAdmin } from "@/lib/supabase";
import { HomeHeroBackground } from "@/components/sections/HomeHeroBackground";

export const revalidate = 60;

export default async function Home() {
  const events = await getEvents();
  const upcoming = events.filter(e => e.status === "upcoming");
  const past = events.filter(e => e.status === "past").reverse();
  const next = upcoming[0];
  const pastEventIds = past.map((event) => event.id);
  let volunteerImages: string[] = [];
  if (pastEventIds.length > 0) {
    const { data } = await getSupabaseAdmin()
      .from("media")
      .select("url")
      .in("event_id", pastEventIds)
      .eq("type", "image")
      .order("uploaded_at", { ascending: false });
    volunteerImages = (data ?? []).map((item) => item.url);
  }
  return <div className="min-h-screen bg-bcn-black text-[#F5F1E8]"><Navbar upcomingSlug={next?.slug} />
    <main>
      <section className="min-h-[80svh] sm:min-h-[82vh] lg:min-h-screen flex items-center justify-center px-5 pt-24 sm:pt-28 text-center relative overflow-hidden">
        <HomeHeroBackground images={volunteerImages} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/45 to-bcn-black" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,132,0,0.12),rgba(0,0,0,0.08)_42%,rgba(0,0,0,0.72)_86%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.025)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
        <div className="absolute h-[550px] w-[550px] rounded-full bg-bcn-orange/10 blur-[130px]" />
        <div className="relative max-w-4xl -translate-y-8 sm:-translate-y-5 lg:-translate-y-12"><p className="text-bcn-orange font-bold tracking-[.25em] uppercase text-sm">Building Creatives Network</p>
          <h1 className="mt-6 text-5xl sm:text-7xl font-extrabold">Where Creatives <span className="block bg-bcn-gradient bg-clip-text text-transparent">Meet &amp; Build.</span></h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-[#DFD8CE]">A community where creators, developers, designers and innovators connect, grow their craft and build with purpose.</p>
          <div className="mt-9 flex justify-center"><Link className="rounded-xl bg-bcn-gradient px-7 py-3 font-bold text-black" href="#events">Explore Events</Link></div>
        </div>
      </section>
      <AboutBcn />
      <VolunteerCTA images={volunteerImages} />
      <section id="events" className="py-24 px-4"><div className="max-w-6xl mx-auto"><h2 className="text-4xl font-bold mb-10">Upcoming <span className="text-bcn-orange">Events</span></h2>{next ? <><EventCard event={next}/>{upcoming.length > 1 && <div className="grid md:grid-cols-2 gap-6 mt-6">{upcoming.slice(1).map(e => <EventCard key={e.id} event={e} compact />)}</div>}</> : <ComingSoonEvent />}</div></section>
      <section id="past-events" className="py-24 px-4 bg-[#0D0D0D]"><div className="max-w-6xl mx-auto"><h2 className="text-4xl font-bold mb-10">Past Events</h2><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-7">{past.map(e => <EventCard key={e.id} event={e} compact />)}</div></div></section>
      <TeamSection />
    </main><Footer /></div>;
}
