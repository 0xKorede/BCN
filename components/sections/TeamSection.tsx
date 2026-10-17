"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { getSupabasePublic, TeamMember } from "@/lib/supabase";

function AvatarPlaceholder({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-bcn-orange/30 via-bcn-amber/20 to-bcn-burgundy/30 text-2xl sm:text-3xl font-bold text-[#F5F1E8] select-none tracking-tight">
      {initials}
    </div>
  );
}

function TeamMemberCard({ member, index }: { member: TeamMember; index: number }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isLongBio = member.bio.length > 120;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: (index % 4) * 0.08 }}
      className="group flex min-w-[52vw] max-w-[230px] snap-start flex-col overflow-hidden rounded-2xl border border-[#262626] bg-[#1A1A1A] shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-bcn-orange/50 hover:shadow-[0_0_30px_rgba(255,132,0,0.12)] sm:max-w-none sm:min-w-0"
    >
      {/* Photo / Avatar Placeholder */}
      <div className="relative w-full aspect-square overflow-hidden bg-[#141414]">
        {member.photo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={member.photo_url}
            alt={member.name}
            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <AvatarPlaceholder name={member.name} />
        )}
        {/* Bottom fade into card body */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Details */}
      <div className="flex flex-col flex-1 p-3.5 sm:p-5 gap-1.5">
        <h3 className="text-sm sm:text-base md:text-lg font-bold text-[#F5F1E8] tracking-tight leading-snug">
          {member.name}
        </h3>
        <p className={`text-xs sm:text-sm text-[#BFB9B0] leading-relaxed font-normal ${isExpanded ? "" : "line-clamp-3"}`}>
          {member.bio}
        </p>
        {isLongBio && (
          <button
            type="button"
            onClick={() => setIsExpanded((expanded) => !expanded)}
            className="mt-1 self-start text-[11px] font-semibold text-bcn-orange transition-colors hover:text-bcn-amber focus:outline-none focus:text-bcn-amber"
            aria-expanded={isExpanded}
          >
            {isExpanded ? "Show less" : "Read more"}
          </button>
        )}
      </div>
    </motion.div>
  );
}

export function TeamSection() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchTeam() {
      try {
        const supabase = getSupabasePublic();
        const { data, error } = await supabase
          .from("team_members")
          .select("*")
          .order("display_order", { ascending: true })
          .order("created_at", { ascending: true });

        if (error) {
          console.error("[TeamSection] Error fetching team members:", error);
        } else if (data && isMounted) {
          setMembers(data as TeamMember[]);
        }
      } catch (err) {
        console.error("[TeamSection] Unexpected error fetching team members:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchTeam();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (members.length < 2) return;
    let current = 0;
    const timer = window.setInterval(() => {
      if (!window.matchMedia("(max-width: 639px)").matches) return;
      const carousel = carouselRef.current;
      if (!carousel) return;
      current = (current + 1) % members.length;
      const card = carousel.children[current] as HTMLElement | undefined;
      if (card) {
        carousel.scrollTo({ left: card.offsetLeft - 16, behavior: "smooth" });
      }
    }, 4000);
    return () => window.clearInterval(timer);
  }, [members.length]);

  // EMPTY STATE: If no team members exist or still fetching, hide the section entirely
  if (loading || members.length === 0) {
    return null;
  }

  return (
    <section id="team" className="py-24 bg-bcn-black relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-bcn-orange/5 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-bcn-burgundy/8 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 isolate">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 sm:mb-16"
        >
          <span className="text-xs sm:text-sm font-bold tracking-widest text-bcn-orange uppercase block mb-2">
            THE CREATIVE MINDS
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#F5F1E8] tracking-tight leading-tight">
            Meet the{" "}
            <span className="bg-bcn-gradient bg-clip-text text-transparent">
              Team
            </span>
          </h2>
          <p className="mt-3 text-base sm:text-lg text-[#BFB9B0] font-normal max-w-xl mx-auto">
            The passionate minds, builders, and community leads behind Building Creatives Network.
          </p>
        </motion.div>

        {/* Horizontal swipe row on mobile; responsive grid from tablet upward */}
        <div ref={carouselRef} className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 sm:pb-0 md:grid-cols-3 lg:grid-cols-4">
          {members.map((member, index) => (
            <TeamMemberCard key={member.id} member={member} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
