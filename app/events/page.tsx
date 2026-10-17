import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { EventCard } from "@/components/events/EventCard";
import { getEvents } from "@/lib/events";
export const revalidate = 60;
export default async function EventsPage(){const events=await getEvents(); const upcoming=events.filter(e=>e.status==="upcoming"); const past=events.filter(e=>e.status==="past").reverse(); return <div className="min-h-screen bg-bcn-black text-white"><Navbar/><main className="max-w-6xl mx-auto px-4 pt-36 pb-24"><h1 className="text-5xl font-bold mb-14">BCN <span className="text-bcn-orange">Events</span></h1>{upcoming.length>0&&<section><h2 className="text-3xl font-bold mb-6">Upcoming</h2><div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">{upcoming.map(e=><EventCard key={e.id} event={e}/>)}</div></section>}<section className="mt-16"><h2 className="text-3xl font-bold mb-6">Past Events</h2><div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-7">{past.map(e=><EventCard key={e.id} event={e} compact/>)}</div></section></main><Footer/></div>}
