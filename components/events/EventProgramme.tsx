"use client";
import { useEffect, useState } from "react";
import { getSupabasePublic } from "@/lib/supabase";
import { ProgrammeRow } from "@/lib/events";

export function EventProgramme({ eventId, items, past }: { eventId: string; items: ProgrammeRow[]; past: boolean }) {
  const [current, setCurrent] = useState<number | null>(null);
  useEffect(() => {
    if (past) return;
    const db = getSupabasePublic();
    db.from("event_status").select("current_item_id").eq("event_id", eventId).maybeSingle().then(({data}) => setCurrent(data?.current_item_id ?? null));
    const channel = db.channel(`event-status-${eventId}`).on("postgres_changes", { event: "*", schema: "public", table: "event_status", filter: `event_id=eq.${eventId}` }, payload => setCurrent((payload.new as {current_item_id?:number}).current_item_id ?? null)).subscribe();
    return () => { db.removeChannel(channel); };
  }, [eventId, past]);
  return <section id="schedule" className="py-24 px-4 bg-[#0D0D0D]"><div className="max-w-4xl mx-auto">{past&&<p className="mb-5 text-center text-[#8C857B]">This event has concluded</p>}<h2 className="text-4xl font-bold text-center mb-10">Event Programme</h2><div className="space-y-3">{items.map(p=>{const live=!past&&current===p.display_order; const done=past||current!==null&&p.display_order<current; return <div key={p.id} className={`flex gap-4 rounded-xl border p-4 ${live?"border-bcn-orange bg-[#1f140a]":"border-white/10 bg-[#161616]"} ${done?"opacity-60":""}`}><b className="text-bcn-orange">{String(p.display_order).padStart(2,"0")}</b><div className="flex-1"><h3 className="font-semibold">{p.title} {live&&<span className="ml-2 rounded-full bg-bcn-orange px-2 py-1 text-[10px] text-black">LIVE NOW</span>}</h3>{p.presenter&&<p className="text-sm text-[#A39C90]">{p.presenter}</p>}</div><span className="text-sm text-[#8C857B]">{p.duration_minutes} mins</span></div>})}</div></div></section>;
}
