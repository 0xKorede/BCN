"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Countdown } from "@/components/ui/Countdown";
import { Calendar, MapPin } from "lucide-react";
import { EVENT_DATE, EVENT_VENUE } from "@/lib/constants";

export const Hero: React.FC = () => {
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
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-bcn-orange/10 border border-bcn-orange/30 backdrop-blur-sm mb-6"
        >
          <Image
            src="/images/logo/bcn-logo-standalone-transpaent.png"
            alt="BCN Logo"
            width={24}
            height={24}
            className="w-5 h-5 sm:w-6 sm:h-6 object-contain shrink-0"
            priority
          />
          <span className="text-xs sm:text-sm font-medium tracking-wider text-bcn-amber uppercase">
            BCN HANGOUT
          </span>
        </motion.div>

        {/* H1 Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl md:text-7xl font-bold text-[#F5F1E8] tracking-tight leading-[1.08] mb-6 max-w-3xl"
        >
          Where Creatives{" "}
          <span className="bg-bcn-gradient bg-clip-text text-transparent inline-block drop-shadow-sm">
            Meet &amp; Build.
          </span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base sm:text-lg md:text-xl font-normal text-[#DFD8CE] max-w-2xl leading-relaxed mb-8"
        >
          Join digital creators, developers, and innovators in Lokoja for practical skill conversations and intentional connection.
        </motion.p>

        {/* Event Quick Info Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm text-[#BFB9B0] mb-10 bg-[#161616]/80 px-5 py-2.5 rounded-2xl border border-white/5 shadow-inner"
        >
          <span className="flex items-center gap-1.5 text-bcn-amber font-medium">
            <Calendar className="w-4 h-4 text-bcn-orange" /> {EVENT_DATE}
          </span>
          <span className="text-white/20">•</span>
          <span className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-bcn-orange" /> {EVENT_VENUE}
          </span>
        </motion.div>

        {/* Countdown Timer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-8"
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
          <a href="#register" className="w-full sm:w-auto">
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
