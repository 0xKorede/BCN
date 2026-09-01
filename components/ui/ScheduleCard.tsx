import React from "react";
import { ScheduleItem } from "@/lib/constants";
import { Users, MessageSquare, Sparkles, LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Users,
  MessageSquare,
  Sparkles,
};

interface ScheduleCardProps {
  item: ScheduleItem;
}

export const ScheduleCard: React.FC<ScheduleCardProps> = ({ item }) => {
  const IconComponent = iconMap[item.iconName] || Users;

  return (
    <div className="group relative bg-[#1A1A1A] border border-[#262626] hover:border-bcn-orange/50 rounded-2xl p-6 sm:p-8 transition-all duration-300 shadow-md hover:shadow-[0_0_30px_rgba(255,132,0,0.12)] hover:-translate-y-1">
      {/* Two-column layout: [number + icon] | [title + description] */}
      <div className="flex items-center gap-4">

        {/* LEFT COLUMN — fixed narrow width: number on top, icon below */}
        <div className="flex flex-col items-center gap-3 w-12 shrink-0">
          {/* Number */}
          <span className="text-3xl sm:text-4xl font-bold font-sans tracking-tight leading-none bg-bcn-gradient bg-clip-text text-transparent">
            {item.number}
          </span>

          {/* Icon box — sits directly under number, no extra row */}
          <div className="w-12 h-12 rounded-xl bg-bcn-orange/10 border border-bcn-orange/20 flex items-center justify-center text-bcn-orange group-hover:scale-110 group-hover:bg-bcn-orange group-hover:text-black transition-all duration-300 shrink-0">
            <IconComponent className="w-6 h-6" />
          </div>
        </div>

        {/* RIGHT COLUMN — flex-1: slash + title, then description */}
        <div className="flex-1 min-w-0 pt-2">
          <div className="flex items-center gap-2">
            <span className="text-bcn-orange font-bold text-sm sm:text-base shrink-0">/</span>
            <h3 className="text-lg sm:text-xl font-medium text-[#F5F1E8] group-hover:text-bcn-amber transition-colors leading-tight">
              {item.title}
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-[#BFB9B0] mt-2 leading-relaxed">
            {item.description}
          </p>
        </div>

      </div>
    </div>
  );
};
