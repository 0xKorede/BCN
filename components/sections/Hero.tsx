"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Countdown } from "@/components/ui/Countdown";
import { Calendar, MapPin } from "lucide-react";
import { EVENT_DATE, EVENT_VENUE } from "@/lib/constants";

export const Hero: React.FC = () => {
  const handleRegisterClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const registerEl = document.getElementById("register");
    if (registerEl) {
      e.preventDefault();
      registerEl.scrollIntoView({ behavior: "smooth" });
      window.history.pushState(null, "", "/register");
    }
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-32 pb-20 overflow-hidden bg-bcn-black">
      {/* Decorative CSS Glow Orbs — Signal Orange / Amber ambient background */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[600px] h-[350px] sm:h-[600px] bg-gradient-to-br from-bcn-orange/15 via-bcn-amber/10 to-bcn-lightAmber/5 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-bcn-burgundy/10 rounded-full blur-[90px] pointer-events-none -z-10" />

      {/* Subtle background grid pattern */}
      <div
        className="absolute inset-0 bg-[radial-gradient(#FF8400_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.04] pointer-events-none -z-10"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center z-10 flex flex-col items-center">
        {/* Pill Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-bcn-orange/30 backdrop-blur-md mb-8 text-xs font-semibold tracking-wider uppercase text-bcn-amber shadow-[0_0_20px_rgba(255,132,0,0.15)]"
        >
          <span className="w-2 h-2 rounded-full bg-bcn-orange animate-pulse" />
          <span>BCN Hangout 2026</span>
          <span className="text-white/40">•</span>
          <span>Lokoja</span>
        </motion.div>

        {/* Hero Title Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative w-full max-w-2xl mx-auto mb-6 flex justify-center"
        >
          <div className="relative w-full aspect-[16/7] max-w-xl">
            <Image
              src="/images/hero-title.png"
              alt="Creators with a Difference - BCN Hangout 2026"
              fill
              priority
              className="object-contain"
              sizes="(max-width: 768px) 90vw, (max-width: 1200px) 60vw, 600px"
            />
          </div>
        </motion.div>

        {/* Subtitle / Value Proposition */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base sm:text-lg md:text-xl text-[#DFD8CE] max-w-2xl mb-8 font-normal leading-relaxed"
        >
          Connecting tech innovators, digital artists, founders, and creatives
          across Kogi State for a transformative day of community, craft, and vision.
        </motion.p>

        {/* Event Quick Info Pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mb-10 text-xs sm:text-sm font-medium text-[#F5F1E8]"
        >
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/[0.03] border border-white/10 backdrop-blur-sm">
            <Calendar className="w-4 h-4 text-bcn-orange shrink-0" />
            <span>{EVENT_DATE}, 2026</span>
          </div>
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/[0.03] border border-white/10 backdrop-blur-sm">
            <MapPin className="w-4 h-4 text-bcn-orange shrink-0" />
            <span className="truncate max-w-[200px] sm:max-w-none">{EVENT_VENUE}</span>
          </div>
        </motion.div>

        {/* Countdown Timer */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-10 w-full"
        >
          <Countdown />
        </motion.div>

        {/* Dual CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
        >
          <a href="/register" onClick={handleRegisterClick} className="w-full sm:w-auto">
            <Button variant="primary" size="lg" className="w-full sm:w-auto px-10">
              Secure Your Spot
            </Button>
          </a>
          <a href="#schedule" className="w-full sm:w-auto">
            <Button variant="secondary" size="lg" className="w-full sm:w-auto px-8">
              View Schedule
            </Button>
          </a>
        </motion.div>
      </div>
    </section>
  );
};
