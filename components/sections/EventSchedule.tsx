"use client";

import React from "react";
import { motion } from "framer-motion";
import { SCHEDULE } from "@/lib/constants";
import { ScheduleCard } from "@/components/ui/ScheduleCard";

export const EventSchedule: React.FC = () => {
  return (
    <section id="schedule" className="py-24 bg-bcn-black relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center mb-16 space-y-3">
          <span className="text-xs sm:text-sm font-bold tracking-widest text-bcn-orange uppercase block">
            EVENT SCHEDULE
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#F5F1E8] tracking-tight">
            Designed for{" "}
            <span className="bg-bcn-gradient bg-clip-text text-transparent">
              Growth &amp; Connection
            </span>
          </h2>
          <p className="text-base text-[#DFD8CE] max-w-xl mx-auto font-normal">
            Three impactful segments crafted to foster relationship, professional elevation, and spiritual alignment.
          </p>
        </div>

        {/* Timeline Container */}
        <div className="relative">
          {/* Vertical connecting gradient line (Desktop view) */}
          <div className="hidden sm:block absolute left-[2.25rem] top-8 bottom-8 w-[2px] bg-bcn-gradient-vertical z-0 opacity-40" />

          <div className="space-y-6 relative z-10">
            {SCHEDULE.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
              >
                <ScheduleCard item={item} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
