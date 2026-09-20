"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PROGRAMME, ProgrammeItem, EVENT_HAS_ENDED } from "@/lib/constants";
import { getSupabasePublic } from "@/lib/supabase";
import { Radio, Clock, User, CheckCircle2 } from "lucide-react";

export const EventSchedule: React.FC = () => {
  const [currentLiveId, setCurrentLiveId] = useState<number | null>(null);

  useEffect(() => {
    // 1. Initial fetch from Supabase
    async function fetchStatus() {
      try {
        const supabase = getSupabasePublic();
        const { data, error } = await supabase
          .from("event_status")
          .select("current_item_id")
          .eq("id", 1)
          .maybeSingle();

        if (!error && data) {
          setCurrentLiveId(data.current_item_id ?? null);
        }
      } catch (err) {
        console.error("[EventSchedule] Error loading initial event_status:", err);
      }
    }

    fetchStatus();

    // 2. Realtime subscription to event_status changes
    const supabase = getSupabasePublic();
    const channel = supabase
      .channel("event-status-realtime")
      .on(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        "postgres_changes" as any,
        { event: "*", schema: "public", table: "event_status" },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (payload: any) => {
          if (payload.new && typeof payload.new.current_item_id !== "undefined") {
            setCurrentLiveId(payload.new.current_item_id);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const liveItem = PROGRAMME.find((item) => item.id === currentLiveId);

  return (
    <section id="schedule" className="py-20 sm:py-24 bg-bcn-black relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-bcn-orange/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Heading */}
        <div className="text-center mb-12 sm:mb-16 space-y-3">
          {EVENT_HAS_ENDED && (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs font-semibold text-[#DFD8CE] mb-2">
              <span className="w-2 h-2 rounded-full bg-[#8C857B]" />
              <span>This event has concluded</span>
            </div>
          )}
          <span className="text-xs sm:text-sm font-bold tracking-widest text-bcn-orange uppercase block">
            EVENT SCHEDULE
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#F5F1E8] tracking-tight">
            Designed for{" "}
            <span className="bg-bcn-gradient bg-clip-text text-transparent">
              Growth &amp; Connection
            </span>
          </h2>
          <p className="text-sm sm:text-base text-[#DFD8CE] max-w-xl mx-auto font-normal leading-relaxed">
            18 impactful segments crafted to foster relationship, professional elevation, and spiritual alignment.
          </p>

          {/* Realtime Live Broadcast Banner — hidden when event has ended */}
          {!EVENT_HAS_ENDED && liveItem && (
            <div className="pt-2">
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#241306] border border-bcn-orange/60 shadow-[0_0_20px_rgba(255,132,0,0.25)] animate-pulse">
                <span className="w-2 h-2 rounded-full bg-bcn-orange" />
                <span className="text-xs font-bold uppercase tracking-wider text-bcn-orange">
                  NOW ON STAGE:
                </span>
                <span className="text-xs sm:text-sm font-semibold text-white truncate max-w-[260px] sm:max-w-md">
                  #{liveItem.number} {liveItem.title} {liveItem.presenter ? `— ${liveItem.presenter}` : ""}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Compact 18-Item Timeline Container */}
        <div className="relative">
          {/* Vertical connecting accent line */}
          <div className="absolute left-[1.35rem] sm:left-[1.85rem] top-6 bottom-6 w-[2px] bg-gradient-to-b from-bcn-orange/40 via-white/10 to-transparent z-0" />

          <div className="space-y-3 relative z-10">
            {PROGRAMME.map((item, index) => {
              const isLive = EVENT_HAS_ENDED ? false : currentLiveId === item.id;
              const isCompleted = EVENT_HAS_ENDED ? true : (currentLiveId !== null && item.id < currentLiveId);

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-20px" }}
                  transition={{ duration: 0.35, delay: Math.min(index * 0.03, 0.4) }}
                  className={`group relative rounded-2xl transition-all duration-300 ${
                    isLive
                      ? "bg-[#1C1208] border-2 border-bcn-orange shadow-[0_0_35px_rgba(255,132,0,0.28)] scale-[1.01] sm:scale-[1.02]"
                      : isCompleted
                      ? "bg-[#111111] border border-white/5 opacity-45 hover:opacity-80"
                      : "bg-[#161616] border border-white/10 hover:border-bcn-orange/30 hover:bg-[#1A1A1A]"
                  }`}
                >
                  <div className="flex items-center gap-3 sm:gap-4 p-3.5 sm:p-4">
                    {/* Number Badge */}
                    <div
                      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-bold text-xs sm:text-sm shrink-0 border transition-all ${
                        isLive
                          ? "bg-bcn-orange text-black border-bcn-orange shadow-[0_0_15px_rgba(255,132,0,0.5)]"
                          : isCompleted
                          ? "bg-white/5 text-[#6C665D] border-white/5"
                          : "bg-white/5 text-[#DFD8CE] border-white/10 group-hover:border-bcn-orange/40 group-hover:text-bcn-orange"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-[#8C857B]" />
                      ) : (
                        item.number
                      )}
                    </div>

                    {/* Middle: Title & Presenter */}
                    <div className="flex-1 min-w-0 pr-1">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <h3
                          className={`text-sm sm:text-base font-medium leading-snug transition-colors ${
                            isLive
                              ? "text-bcn-orange font-bold"
                              : isCompleted
                              ? "text-[#8C857B] line-through decoration-white/20"
                              : "text-[#F5F1E8] group-hover:text-bcn-amber"
                          }`}
                        >
                          {item.title}
                        </h3>

                        {/* LIVE NOW Pulsing Badge */}
                        {isLive && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider bg-bcn-orange text-black shadow-[0_0_10px_rgba(255,132,0,0.6)] animate-pulse shrink-0">
                            <Radio className="w-2.5 h-2.5" />
                            LIVE NOW
                          </span>
                        )}
                      </div>

                      {/* Presenter info */}
                      {item.presenter && (
                        <p
                          className={`text-xs sm:text-sm mt-0.5 flex items-center gap-1.5 ${
                            isLive
                              ? "text-[#DFD8CE]"
                              : isCompleted
                              ? "text-[#6C665D]"
                              : "text-[#A39C90]"
                          }`}
                        >
                          <User className="w-3 h-3 text-[#7C756B] shrink-0" />
                          <span className="truncate">{item.presenter}</span>
                        </p>
                      )}
                    </div>

                    {/* Right: Duration Badge */}
                    <div className="shrink-0 text-right">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-medium border ${
                          isLive
                            ? "bg-bcn-orange/20 border-bcn-orange/50 text-bcn-orange font-semibold"
                            : isCompleted
                            ? "bg-white/[0.02] border-white/5 text-[#5C564E]"
                            : "bg-white/5 border-white/10 text-[#8C857B]"
                        }`}
                      >
                        <Clock className="w-3 h-3 opacity-60" />
                        {item.durationLabel}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
