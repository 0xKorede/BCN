"use client";

import React, { useState } from "react";
import { ProgrammeRow } from "@/lib/events";
import { Radio, CheckCircle2, Clock, User, Sparkles, X, Loader2, AlertCircle } from "lucide-react";

interface ProgrammeControlProps {
  initialCurrentItemId: number | null;
  eventId: string;
  items: ProgrammeRow[];
}

export function ProgrammeControl({ initialCurrentItemId, eventId, items }: ProgrammeControlProps) {
  const [currentLiveId, setCurrentLiveId] = useState<number | null>(initialCurrentItemId);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const currentLiveItem = items.find((item) => item.display_order === currentLiveId);

  const handleToggleLive = async (itemId: number) => {
    // If already live, clicking it sets to null (clear). Otherwise set to this itemId.
    const newTargetId = currentLiveId === itemId ? null : itemId;
    const previousId = currentLiveId;

    // Optimistic update
    setCurrentLiveId(newTargetId);
    setUpdatingId(itemId);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/admin/programme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ current_item_id: newTargetId, event_id: eventId }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to update programme status");
      }
    } catch (err: unknown) {
      console.error("[ProgrammeControl] Update error:", err);
      // Rollback on error
      setCurrentLiveId(previousId);
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "Failed to update. Make sure the event_status table is created in Supabase."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const handleClearAll = async () => {
    if (currentLiveId === null) return;
    const previousId = currentLiveId;
    setCurrentLiveId(null);
    setUpdatingId(0);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/admin/programme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ current_item_id: null, event_id: eventId }),
      });

      if (!res.ok) {
        throw new Error("Failed to clear live status");
      }
    } catch (err: unknown) {
      setCurrentLiveId(previousId);
      setErrorMsg("Failed to clear live status.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Status Banner (Thumb-friendly & Quick Glance) ── */}
      <div className="bg-[#1C1C1C] border border-white/10 rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div
            className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border ${
              currentLiveId !== null
                ? "bg-bcn-orange/20 border-bcn-orange text-bcn-orange"
                : "bg-white/5 border-white/10 text-[#8C857B]"
            }`}
          >
            <Radio className={`w-5 h-5 ${currentLiveId !== null ? "animate-pulse" : ""}`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8C857B]">
                Current Broadcast Status
              </span>
              {currentLiveId !== null ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-bcn-orange/20 text-bcn-orange border border-bcn-orange/40 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-bcn-orange" />
                  Live Now
                </span>
              ) : (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-white/10 text-[#A39C90]">
                  Gaps / Not Started
                </span>
              )}
            </div>

            {currentLiveItem ? (
              <p className="text-base sm:text-lg font-bold text-white mt-0.5 leading-snug">
                #{String(currentLiveItem.display_order).padStart(2, "0")} {currentLiveItem.title}
                {currentLiveItem.presenter && (
                  <span className="text-[#A39C90] text-sm font-normal ml-2">
                    — {currentLiveItem.presenter}
                  </span>
                )}
              </p>
            ) : (
              <p className="text-xs sm:text-sm text-[#8C857B] mt-0.5">
                No programme item is currently live on the public page.
              </p>
            )}
          </div>
        </div>

        {currentLiveId !== null && (
          <button
            onClick={handleClearAll}
            disabled={updatingId !== null}
            className="w-full sm:w-auto px-4 py-3 sm:py-2.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/15 active:bg-white/20 text-white border border-white/15 flex items-center justify-center gap-2 transition-all shrink-0"
          >
            <X className="w-4 h-4 text-[#DFD8CE]" />
            Clear Live Status
          </button>
        )}
      </div>

      {errorMsg && (
        <div className="bg-red-950/40 border border-red-500/40 rounded-2xl p-4 flex items-center gap-3 text-red-300 text-xs sm:text-sm">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <p>{errorMsg}</p>
        </div>
      )}

      {/* ── 18 Items List (Thumb-Friendly Controls) ── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold uppercase tracking-wider text-[#8C857B]">
            All 18 Programme Schedule Items
          </span>
          <span className="text-xs text-[#5C564E]">
            Tap button to switch live status
          </span>
        </div>

        <div className="space-y-2.5">
          {items.map((item, index) => {
            const itemId = item.display_order;
              const isLive = currentLiveId === itemId;
            const isCompleted = currentLiveId !== null && itemId < currentLiveId;
            const isPending = updatingId === itemId;

            return (
              <div
                key={item.id}
                className={`group relative rounded-2xl p-3.5 sm:p-4 border transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isLive
                    ? "bg-[#1F140A] border-bcn-orange shadow-[0_0_25px_rgba(255,132,0,0.18)]"
                    : isCompleted
                    ? "bg-[#141414] border-white/5 opacity-70 hover:opacity-95"
                    : "bg-[#161616] border-white/10 hover:border-white/20"
                }`}
              >
                {/* Left details */}
                <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-1 min-w-0">
                  {/* Number Badge */}
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 border ${
                      isLive
                        ? "bg-bcn-orange text-black border-bcn-orange"
                        : isCompleted
                        ? "bg-white/5 text-[#8C857B] border-white/5"
                        : "bg-white/5 text-[#DFD8CE] border-white/10"
                    }`}
                  >
                    {String(itemId).padStart(2, "0")}
                  </div>

                  {/* Title & Presenter */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4
                        className={`text-sm sm:text-base font-semibold truncate ${
                          isLive ? "text-bcn-orange" : "text-[#F5F1E8]"
                        }`}
                      >
                        {item.title}
                      </h4>

                      {/* Live Badge */}
                      {isLive && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-bcn-orange text-black animate-pulse">
                          <Radio className="w-2.5 h-2.5" />
                          Live Now
                        </span>
                      )}

                      {/* Completed badge */}
                      {isCompleted && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-semibold text-[#8C857B] bg-white/5">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          Passed
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-[#8C857B]">
                      {item.presenter && (
                        <span className="flex items-center gap-1 text-[#BFB9B0]">
                          <User className="w-3 h-3 text-[#7C756B]" />
                          {item.presenter}
                        </span>
                      )}
                      <span className="flex items-center gap-1 text-[#8C857B]">
                        <Clock className="w-3 h-3 text-[#7C756B]" />
                        {item.duration_minutes} mins
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Large thumb-friendly tap target button */}
                <div className="sm:shrink-0 pt-1 sm:pt-0">
                  <button
                    type="button"
                    onClick={() => handleToggleLive(itemId)}
                    disabled={isPending}
                    className={`w-full sm:w-auto min-w-[170px] min-h-[46px] px-5 py-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 shadow-md ${
                      isLive
                        ? "bg-gradient-to-r from-[#FF8400] to-[#FFA341] text-black shadow-[0_0_20px_rgba(255,132,0,0.35)] hover:brightness-110 border border-amber-300"
                        : "bg-[#242424] hover:bg-[#303030] text-[#DFD8CE] hover:text-white border border-white/10 hover:border-bcn-orange/40"
                    }`}
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Updating...</span>
                      </>
                    ) : isLive ? (
                      <>
                        <span className="w-2 h-2 rounded-full bg-black animate-ping" />
                        <span>Live Now — Tap to Clear</span>
                      </>
                    ) : (
                      <>
                        <Radio className="w-3.5 h-3.5 text-bcn-orange group-hover:scale-110 transition-transform" />
                        <span>Mark as Live</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
