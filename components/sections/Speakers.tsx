"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Instagram, Twitter, Linkedin } from "lucide-react";
import { HOST, SPEAKERS, SpeakerEntry } from "@/lib/constants";

// ─── Placeholder avatar (no photo) ───────────────────────────────────────────
function AvatarPlaceholder({ name, large = false }: { name: string; large?: boolean }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div
      className={`flex items-center justify-center w-full h-full bg-gradient-to-br from-bcn-orange/30 via-bcn-amber/20 to-bcn-burgundy/30 ${large ? "text-4xl sm:text-5xl" : "text-2xl sm:text-3xl"} font-bold text-[#F5F1E8] select-none tracking-tight`}
    >
      {initials}
    </div>
  );
}

// ─── Social icons row ─────────────────────────────────────────────────────────
function SocialRow({ socials }: { socials: SpeakerEntry["socials"] }) {
  const links = [
    { href: socials.instagram, Icon: Instagram, label: "Instagram" },
    { href: socials.twitter,   Icon: Twitter,   label: "Twitter / X" },
    { href: socials.linkedin,  Icon: Linkedin,  label: "LinkedIn" },
  ].filter((l) => l.href);

  if (!links.length) return null;

  return (
    <div className="flex items-center gap-2 mt-4">
      {links.map(({ href, Icon, label }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="w-8 h-8 rounded-full bg-[#222222] border border-white/5 flex items-center justify-center text-[#8C857B] hover:text-bcn-amber hover:border-bcn-orange/50 hover:bg-bcn-orange/10 transition-all duration-200"
        >
          <Icon className="w-3.5 h-3.5" />
        </a>
      ))}
    </div>
  );
}

// ─── Role badge ───────────────────────────────────────────────────────────────
function RoleBadge({ role }: { role: "Host" | "Speaker" }) {
  return (
    <span
      className={`inline-flex w-fit self-start px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-transparent ${
        role === "Host"
          ? "border border-bcn-orange text-bcn-orange"
          : "border border-bcn-amber/40 text-bcn-amber/70"
      }`}
    >
      {role}
    </span>
  );
}

// ─── Featured host card ───────────────────────────────────────────────────────
function HostCard({ entry }: { entry: SpeakerEntry }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="group relative bg-[#1A1A1A] border border-[#262626] hover:border-bcn-orange/50 rounded-2xl overflow-hidden transition-all duration-300 shadow-lg hover:shadow-[0_0_40px_rgba(255,132,0,0.14)] hover:-translate-y-1"
    >
      <div className="flex flex-col md:flex-row">
        {/* Photo — compact portrait on mobile, fixed height on desktop */}
        <div className="relative w-full md:w-72 lg:w-80 shrink-0 aspect-[4/5] md:aspect-auto md:min-h-[300px] overflow-hidden">
          {entry.photo ? (
            <Image
              src={entry.photo}
              alt={entry.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 320px"
            />
          ) : (
            <AvatarPlaceholder name={entry.name} large />
          )}
          {/* Subtle vignette on image */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/60 via-transparent to-transparent md:bg-gradient-to-r" />
        </div>

        {/* Text content — constrained to max-w-xl so wide viewports breathe */}
        <div className="flex flex-col justify-center px-6 py-8 sm:px-8 sm:py-10 gap-4 max-w-xl">
          <RoleBadge role={entry.role} />
          <h3 className="text-2xl sm:text-3xl font-bold text-[#F5F1E8] tracking-tight leading-tight">
            {entry.name}
          </h3>
          <p className="text-sm sm:text-base text-[#BFB9B0] leading-relaxed max-w-lg">
            {entry.bio}
          </p>
          <SocialRow socials={entry.socials} />
        </div>
      </div>
    </motion.div>
  );
}

// ─── Regular speaker card ─────────────────────────────────────────────────────
function SpeakerCard({ entry, delay = 0 }: { entry: SpeakerEntry; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="group bg-[#1A1A1A] border border-[#262626] hover:border-bcn-orange/50 rounded-2xl overflow-hidden transition-all duration-300 shadow-md hover:shadow-[0_0_30px_rgba(255,132,0,0.12)] hover:-translate-y-1 flex flex-col"
    >
      {/* Photo — compact portrait ratio keeps card mobile-friendly */}
      <div className="relative w-full aspect-[4/5] overflow-hidden">
        {entry.photo ? (
          <Image
            src={entry.photo}
            alt={entry.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <AvatarPlaceholder name={entry.name} />
        )}
        {/* Bottom fade into card body */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-transparent" />
      </div>

      {/* Text */}
      <div className="flex flex-col flex-1 p-5 gap-2">
        <RoleBadge role={entry.role} />
        <h3 className="text-base sm:text-lg font-bold text-[#F5F1E8] tracking-tight mt-1">
          {entry.name}
        </h3>
        <p className="text-xs sm:text-sm text-[#8C857B] leading-relaxed line-clamp-3 flex-1">
          {entry.bio}
        </p>
        <SocialRow socials={entry.socials} />
      </div>
    </motion.div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────
export const Speakers: React.FC = () => {
  return (
    <section id="speakers" className="py-24 bg-bcn-black relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-bcn-orange/5 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-bcn-burgundy/8 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 isolate">

        {/* ── Section heading ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 sm:mb-16"
        >
          <span className="text-xs sm:text-sm font-bold tracking-widest text-bcn-orange uppercase block mb-2">
            THE VOICES
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#F5F1E8] tracking-tight leading-tight">
            Meet the{" "}
            <span className="bg-bcn-gradient bg-clip-text text-transparent">
              Voices
            </span>
          </h2>
          <p className="mt-3 text-base sm:text-lg text-[#BFB9B0] font-normal">
            Creators with a Difference
          </p>
        </motion.div>

        {/* ── Featured host ── */}
        <div className="mb-10 sm:mb-12">
          <HostCard entry={HOST} />
        </div>

        {/* ── Speaker grid — 2×2 on tablet/desktop ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {SPEAKERS.map((speaker, i) => (
            <SpeakerCard key={speaker.id} entry={speaker} delay={i * 0.08} />
          ))}
        </div>

      </div>
    </section>
  );
};
