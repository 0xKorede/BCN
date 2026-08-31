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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-5">
          {/* Number badge */}
          <span className="text-3xl sm:text-4xl font-bold text-bcn-orange font-sans tracking-tight shrink-0 bg-bcn-gradient bg-clip-text text-transparent">
            {item.number}
          </span>

          <div className="h-8 w-[2px] bg-bcn-orange/20 hidden sm:block" />

          {/* Title & Slash tag */}
          <div>
            <div className="flex items-center gap-2">
              <span className="text-bcn-orange font-bold text-sm sm:text-base">/</span>
              <h3 className="text-lg sm:text-xl font-medium text-[#F5F1E8] group-hover:text-bcn-amber transition-colors">
                {item.title}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-[#BFB9B0] mt-1 line-clamp-2">
              {item.description}
            </p>
          </div>
        </div>

        {/* Icon container */}
        <div className="w-12 h-12 rounded-xl bg-bcn-orange/10 border border-bcn-orange/20 flex items-center justify-center text-bcn-orange group-hover:scale-110 group-hover:bg-bcn-orange group-hover:text-black transition-all duration-300 shrink-0 self-start sm:self-center">
          <IconComponent className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};
