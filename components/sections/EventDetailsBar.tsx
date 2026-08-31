import React from "react";
import { Calendar, Clock, MapPin } from "lucide-react";
import { EVENT_DATE, EVENT_TIME, EVENT_VENUE } from "@/lib/constants";

export const EventDetailsBar: React.FC = () => {
  return (
    <section id="location" className="w-full bg-bcn-gradient py-8 sm:py-10 shadow-[0_4px_30px_rgba(255,132,0,0.3)] relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-center divide-y md:divide-y-0 md:divide-x divide-black/15">
          
          {/* Date Item */}
          <div className="flex items-center justify-start md:justify-center gap-4 pt-4 md:pt-0 first:pt-0">
            <div className="w-12 h-12 rounded-full bg-black/10 border border-black/20 flex items-center justify-center shrink-0">
              <Calendar className="w-6 h-6 text-black" />
            </div>
            <div className="text-black text-left">
              <span className="block text-xs font-bold uppercase tracking-wider opacity-80">
                Date
              </span>
              <span className="text-xl sm:text-2xl font-bold tracking-tight">
                {EVENT_DATE}
              </span>
            </div>
          </div>

          {/* Time Item */}
          <div className="flex items-center justify-start md:justify-center gap-4 pt-4 md:pt-0 md:pl-6">
            <div className="w-12 h-12 rounded-full bg-black/10 border border-black/20 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6 text-black" />
            </div>
            <div className="text-black text-left">
              <span className="block text-xs font-bold uppercase tracking-wider opacity-80">
                Time
              </span>
              <span className="text-xl sm:text-2xl font-bold tracking-tight">
                {EVENT_TIME}
              </span>
            </div>
          </div>

          {/* Location Item */}
          <div className="flex items-center justify-start md:justify-center gap-4 pt-4 md:pt-0 md:pl-6">
            <div className="w-12 h-12 rounded-full bg-black/10 border border-black/20 flex items-center justify-center shrink-0">
              <MapPin className="w-6 h-6 text-black" />
            </div>
            <div className="text-black text-left">
              <span className="block text-xs font-bold uppercase tracking-wider opacity-80">
                Location
              </span>
              <span className="text-sm sm:text-base font-bold tracking-tight leading-snug whitespace-nowrap">
                {EVENT_VENUE}
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
