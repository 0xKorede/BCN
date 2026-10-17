"use client";

import React, { useEffect, useState, useCallback } from "react";
import { getSupabasePublic, MediaItem } from "@/lib/supabase";
import { EVENT_HAS_ENDED, GALLERY_DRIVE_LINK } from "@/lib/constants";
import { X, ChevronLeft, ChevronRight, Play } from "lucide-react";

// ─── Lightbox ────────────────────────────────────────────────────────────────

interface LightboxProps {
  items: MediaItem[];
  index: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

function Lightbox({ items, index, onClose, onNavigate }: LightboxProps) {
  const item = items[index];

  const prev = useCallback(() => {
    onNavigate(index > 0 ? index - 1 : items.length - 1);
  }, [index, items.length, onNavigate]);

  const next = useCallback(() => {
    onNavigate(index < items.length - 1 ? index + 1 : 0);
  }, [index, items.length, onNavigate]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, prev, next]);

  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
        aria-label="Close lightbox"
      >
        <X className="w-5 h-5 text-white" />
      </button>

      {/* Prev */}
      {items.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); prev(); }}
          className="absolute left-3 sm:left-6 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          aria-label="Previous"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
      )}

      {/* Media */}
      <div
        className="max-w-5xl w-full mx-16 max-h-[90vh] flex flex-col items-center gap-3"
        onClick={(e) => e.stopPropagation()}
      >
        {item.type === "image" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.url}
            alt={item.caption ?? "Live moment"}
            className="max-h-[80vh] max-w-full rounded-2xl object-contain shadow-2xl"
          />
        ) : (
          <video
            src={item.url}
            controls
            autoPlay
            className="max-h-[80vh] max-w-full rounded-2xl shadow-2xl bg-black"
          />
        )}
        {item.caption && (
          <p className="text-sm text-[#A39C90] text-center max-w-lg px-4">{item.caption}</p>
        )}
        <p className="text-xs text-[#5C564E]">
          {index + 1} / {items.length}
        </p>
      </div>

      {/* Next */}
      {items.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); next(); }}
          className="absolute right-3 sm:right-6 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          aria-label="Next"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
      )}
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 sm:py-28 gap-5 text-center">
      <div className="opacity-25">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M40 6L72 22V58L40 74L8 58V22L40 6Z"
            stroke="#FF8400"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M30 33h4l2-4h8l2 4h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H30a2 2 0 0 1-2-2V35a2 2 0 0 1 2-2z"
            stroke="#FF8400"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <circle cx="40" cy="42" r="5" stroke="#FF8400" strokeWidth="1.5" />
        </svg>
      </div>
      <div className="space-y-2 max-w-xs sm:max-w-sm">
        <p className="text-[#8C857B] text-sm sm:text-base font-medium leading-relaxed">
          Photos and videos will appear here live during the event — check back on Sept 19!
        </p>
      </div>
    </div>
  );
}

// ─── Grid Item ────────────────────────────────────────────────────────────────

interface GridItemProps {
  item: MediaItem;
  onClick: () => void;
  className?: string;
}

function GridItem({ item, onClick, className = "" }: GridItemProps) {
  const isVideo = item.type === "video";

  return (
    <div
      onClick={onClick}
      className={`group relative rounded-2xl overflow-hidden border border-white/10 cursor-pointer
                 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:border-bcn-orange/40
                 hover:shadow-[0_8px_32px_rgba(255,132,0,0.15)] bg-[#161616] min-h-0 ${className}`}
    >
      {isVideo ? (
        <>
          <video
            src={item.url}
            preload="metadata"
            muted
            playsInline
            className="w-full h-full object-cover object-center block"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/10 transition-colors">
            <div className="w-12 h-12 rounded-full bg-black/60 border border-white/30 flex items-center justify-center backdrop-blur-sm
                            group-hover:scale-110 group-hover:bg-bcn-orange/80 transition-all duration-200">
              <Play className="w-5 h-5 text-white ml-0.5" fill="white" />
            </div>
          </div>
        </>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.url}
          alt={item.caption ?? "Live moment"}
          className="w-full h-full object-cover object-center block"
          loading="lazy"
        />
      )}

      {item.caption && (
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3
                        translate-y-full group-hover:translate-y-0 transition-transform duration-200">
          <p className="text-xs text-[#DFD8CE] line-clamp-2">{item.caption}</p>
        </div>
      )}
    </div>
  );
}

// ─── Main Section ─────────────────────────────────────────────────────────────

interface LiveMomentsProps {
  initialMedia?: MediaItem[];
}

export function LiveMoments({ initialMedia = [] }: LiveMomentsProps) {
  const [media, setMedia] = useState<MediaItem[]>(initialMedia);
  const [isLoading, setIsLoading] = useState(initialMedia.length === 0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    async function fetchMedia() {
      try {
        const res = await fetch("/api/gallery", { cache: "no-store" });
        if (res.ok) {
          const json = await res.json();
          if (json.items && Array.isArray(json.items)) {
            setMedia(json.items);
          }
        }
      } catch (err) {
        console.error("[LiveMoments] Fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchMedia();

    const supabase = getSupabasePublic();

    const channel = supabase
      .channel("media-realtime")
      .on(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        "postgres_changes" as any,
        { event: "INSERT", schema: "public", table: "media" },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (payload: any) => {
          const newItem = payload.new as MediaItem;
          setMedia((prev) => [newItem, ...prev]);
        }
      )
      .on(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        "postgres_changes" as any,
        { event: "DELETE", schema: "public", table: "media" },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (payload: any) => {
          const deleted = payload.old as { id: string };
          setMedia((prev) => prev.filter((m) => m.id !== deleted.id));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const navigateLightbox = (index: number) => setLightboxIndex(index);
  const previewMedia = media.slice(0, 8);

  const getMosaicClass = (index: number) => {
    const desktopPositions = [
      "lg:col-start-1 lg:col-span-2 lg:row-start-1",
      "lg:col-start-3 lg:row-start-1",
      "lg:col-start-4 lg:row-start-1 lg:row-span-2",
      "lg:col-start-1 lg:row-start-2 lg:row-span-2",
      "lg:col-start-2 lg:col-span-2 lg:row-start-2",
      "lg:col-start-2 lg:row-start-3",
      previewMedia.length === 7
        ? "lg:col-start-3 lg:col-span-2 lg:row-start-3"
        : "lg:col-start-3 lg:row-start-3",
      "lg:col-start-4 lg:row-start-3",
    ];

    const completesMobileRow =
      previewMedia.length % 2 === 1 && index === previewMedia.length - 1
        ? "col-span-2 sm:col-span-1"
        : "";

    return `${desktopPositions[index]} ${completesMobileRow}`;
  };

  return (
    <section id="live-moments" className="py-16 sm:py-24 bg-[#0A0A0A] relative overflow-hidden">
      {/* Subtle bg glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-bcn-orange/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="mb-10 sm:mb-14">
          <div className="flex items-center gap-3 mb-3">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
              {EVENT_HAS_ENDED ? "Event Highlights" : "Live Moments"}
            </h2>
            {!EVENT_HAS_ENDED && (
              <span
                className="w-3 h-3 rounded-full bg-bcn-orange animate-livePulse flex-shrink-0 mt-1"
                aria-hidden="true"
              />
            )}
          </div>
          <p className="text-[#8C857B] text-sm sm:text-base max-w-md">
            {EVENT_HAS_ENDED
              ? "Photos and videos from BCN Hangout 2026"
              : "Photos and videos from the day, updated live"}
          </p>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 sm:gap-4" aria-label="Loading gallery">
            {[160, 240, 180, 200, 220, 160, 280, 190].map((h, i) => (
              <div
                key={i}
                className="rounded-2xl bg-white/5 border border-white/5 break-inside-avoid mb-3 sm:mb-4 animate-pulse"
                style={{ height: `${h}px` }}
              />
            ))}
          </div>
        ) : media.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 lg:grid-rows-3 gap-3 sm:gap-4 auto-rows-[180px] sm:auto-rows-[220px] lg:auto-rows-[210px]">
            {previewMedia.map((item, i) => (
              <GridItem
                key={item.id}
                item={item}
                onClick={() => openLightbox(i)}
                className={getMosaicClass(i)}
              />
            ))}
          </div>
        )}

        {GALLERY_DRIVE_LINK !== "PASTE_GOOGLE_DRIVE_LINK_HERE" && (
          <div className="mt-10 sm:mt-12 flex justify-center">
            <a
              href={GALLERY_DRIVE_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full border-2 border-bcn-orange bg-transparent px-6 py-3 text-sm font-medium text-bcn-orange shadow-[0_2px_12px_rgba(255,132,0,0.1)] transition-all duration-200 hover:border-bcn-amber hover:bg-bcn-orange/10 hover:text-bcn-amber focus:outline-none focus:ring-2 focus:ring-bcn-orange/50 active:scale-[0.98] sm:text-base"
            >
              View Full Gallery
            </a>
          </div>
        )}
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          items={previewMedia}
          index={lightboxIndex}
          onClose={closeLightbox}
          onNavigate={navigateLightbox}
        />
      )}
    </section>
  );
}
