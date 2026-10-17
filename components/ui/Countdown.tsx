"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeLeft(target: Date): TimeLeft | null {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

const SEGMENTS = [
  { key: "days" as const, label: "Days" },
  { key: "hours" as const, label: "Hrs" },
  { key: "minutes" as const, label: "Min" },
  { key: "seconds" as const, label: "Sec" },
];

export const Countdown: React.FC<{ target?: string; concluded?: boolean }> = ({ target = new Date(0).toISOString(), concluded = false }) => {
  // Start as null on the server to avoid hydration mismatch
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (concluded) return;

    const targetDate = new Date(target);
    setTimeLeft(getTimeLeft(targetDate));
    const id = setInterval(() => {
      setTimeLeft(getTimeLeft(targetDate));
    }, 1000);
    return () => clearInterval(id);
  }, [target, concluded]);

  // Render nothing until mounted (avoids hydration mismatch on SSR)
  if (!mounted) {
    return (
      <div className="h-[72px] w-full max-w-xs sm:max-w-sm mx-auto" />
    );
  }

  // Event has concluded — static post-event card state
  if (concluded) {
    return (
      <div
        className={[
          "inline-flex items-center justify-center gap-3",
          "px-8 py-4 rounded-2xl",
          "bg-black/60 backdrop-blur-xl backdrop-saturate-150",
          "border border-white/10",
          "shadow-[0_0_40px_rgba(255,132,0,0.12)]",
        ].join(" ")}
      >
        <CheckCircle2 className="w-5 h-5 text-bcn-orange shrink-0" />
        <span
          className="text-sm sm:text-base font-bold tracking-wide"
          style={{
            backgroundImage:
              "linear-gradient(135deg, #FF8400 0%, #FFA341 35%, #FFBD60 65%, #FFD192 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Event Concluded — Thank You!
        </span>
      </div>
    );
  }

  // Past or at event time — show live message
  if (timeLeft === null) {
    return (
      <div
        className={[
          "inline-flex items-center justify-center gap-3",
          "px-8 py-4 rounded-2xl",
          "bg-black/60 backdrop-blur-xl backdrop-saturate-150",
          "border border-white/10",
          "shadow-[0_0_40px_rgba(255,132,0,0.12)]",
        ].join(" ")}
      >
        <span className="relative flex h-2.5 w-2.5 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-bcn-orange opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-bcn-amber" />
        </span>
        <span
          className="text-sm sm:text-base font-bold tracking-wide"
          style={{
            backgroundImage:
              "linear-gradient(135deg, #FF8400 0%, #FFA341 35%, #FFBD60 65%, #FFD192 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Happening Now — We&apos;re Live!
        </span>
      </div>
    );
  }

  return (
    <div
      className={[
        "inline-flex items-center justify-center",
        "px-5 sm:px-8 py-3.5 sm:py-4 rounded-2xl",
        "bg-black/60 backdrop-blur-xl backdrop-saturate-150",
        "border border-white/10",
        "shadow-[0_0_40px_rgba(255,132,0,0.12)]",
        "gap-1 sm:gap-2",
      ].join(" ")}
      role="timer"
      aria-label="Countdown to BCN Hangout"
    >
      {SEGMENTS.map((seg, idx) => (
        <React.Fragment key={seg.key}>
          {/* Time unit */}
          <div className="flex flex-col items-center min-w-[44px] sm:min-w-[52px]">
            <span
              className="text-2xl sm:text-3xl font-bold tabular-nums leading-none"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, #FF8400 0%, #FFA341 35%, #FFBD60 65%, #FFD192 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {pad(timeLeft[seg.key])}
            </span>
            <span className="mt-1 text-[9px] sm:text-[10px] font-medium uppercase tracking-widest text-[#8C857B]">
              {seg.label}
            </span>
          </div>

          {/* Divider — omit after the last segment */}
          {idx < SEGMENTS.length - 1 && (
            <span className="text-[#3A3530] text-lg sm:text-xl font-light select-none pb-3 px-0.5">
              ·
            </span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};
