"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import ParticleImage from "@/components/ui/ParticleImage";
import { Lightbulb, Compass, Zap } from "lucide-react";

export const AboutBcn: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const touchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (touchTimeoutRef.current) clearTimeout(touchTimeoutRef.current);
    };
  }, []);

  const handleTouchStart = () => {
    if (touchTimeoutRef.current) clearTimeout(touchTimeoutRef.current);
    setIsHovered(true);
  };

  const handleTouchEnd = () => {
    if (touchTimeoutRef.current) clearTimeout(touchTimeoutRef.current);
    setIsHovered(false);
  };

  return (
    <section id="about" className="pt-10 pb-24 sm:py-24 bg-bcn-black relative overflow-hidden">
      {/* Background radial accent */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-bcn-orange/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Visual Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 relative flex items-center justify-center"
          >
            <div
              className={`relative w-full max-w-lg aspect-square sm:aspect-[4/3] rounded-3xl bg-gradient-to-br from-[#1A1A1A] via-[#141414] to-[#000000] border shadow-[0_10px_40px_rgba(0,0,0,0.8)] overflow-hidden transition-all duration-500 cursor-pointer select-none ${
                isHovered ? "border-bcn-orange/40" : "border-bcn-orange/20"
              }`}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {/* Background ambient mesh grid */}
              <div className="absolute inset-0 bg-[radial-gradient(#FF8400_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-10" />

              {/* Presentation Container — scaled up so both static image & particle canvas appear larger in sync */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ transform: "translateY(-3.5%) scale(1.88)", transformOrigin: "center center" }}
              >
                {/* Particle Canvas — always mounted so physics stay warm, visible on hover */}
                <ParticleImage
                  particleSize={3}
                  repulsionConfig={{ repulsionMode: "outside", repulsionForce: 10, repulsionRadius: 28 }}
                  hoverConfig={{
                    hoverType: "roam",
                    transition: { duration: 0.8, ease: "easeInOut" },
                    roamWidth: 0,
                    roamHeight: 0,
                    roamShape: "rectangle",
                    roamOpacity: 1,
                    hideType: "scatter",
                  }}
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    opacity: isHovered ? 1 : 0,
                    transition: "opacity 0.5s ease",
                    pointerEvents: "auto",
                  }}
                />

                {/* Static transparent logo — visible by default, hides on hover, perfectly aligned with particle canvas */}
                <img
                  src="/images/logo/bcn-logo-transparent.png"
                  alt="BCN Logo"
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    opacity: isHovered ? 0 : 1,
                    transition: "opacity 0.5s ease",
                    pointerEvents: "none",
                  }}
                />
              </div>

              {/* Bottom fade so stats row stays legible */}
              <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#000000] via-[#000000]/70 to-transparent pointer-events-none" />

              {/* Stats row — pinned to bottom of card */}
              <div className="absolute inset-x-0 bottom-0 z-10 px-6 pb-5">
                <div className="grid grid-cols-3 gap-3 w-full pt-4 border-t border-white/10 text-left">
                  <div className="flex items-center gap-2 text-xs text-[#BFB9B0]">
                    <Compass className="w-4 h-4 text-bcn-amber shrink-0" />
                    <span>Purpose Driven</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#BFB9B0]">
                    <Lightbulb className="w-4 h-4 text-bcn-orange shrink-0" />
                    <span>Practical Skill</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#BFB9B0]">
                    <Zap className="w-4 h-4 text-bcn-lightAmber shrink-0" />
                    <span>Spiritual Charge</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Copy & Heading */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 space-y-6 text-left"
          >
            <div>
              <span className="text-xs sm:text-sm font-bold tracking-widest text-bcn-orange uppercase block mb-2">
                WHAT IS BCN HANGOUT?
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#F5F1E8] tracking-tight leading-tight">
                Empowering Creatives to{" "}
                <span className="bg-bcn-gradient bg-clip-text text-transparent">
                  Connect, Learn &amp; Lead.
                </span>
              </h2>
            </div>

            <p className="text-base sm:text-lg text-[#DFD8CE] font-normal leading-relaxed">
              BCN Hangout is a community-driven gathering for creatives, developers, designers, and innovators who are passionate about growth, collaboration, and impact. We create a space for meaningful connections, practical learning, and spiritual empowerment to help you build, grow, and lead with purpose.
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-6 border-t border-[#222222]">
              <div>
                <span className="block text-2xl font-bold text-bcn-orange">100%</span>
                <span className="text-xs text-[#A39C90] uppercase tracking-wider font-medium">Community Focused</span>
              </div>
              <div className="h-8 w-[1px] bg-white/10" />
              <div>
                <span className="block text-2xl font-bold text-bcn-amber">Lokoja</span>
                <span className="text-xs text-[#A39C90] uppercase tracking-wider font-medium">Hub of Innovation</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
