"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function VolunteerCTA({ images = [] }: { images?: string[] }) {
  const displayImages = images.filter(Boolean);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    if (displayImages.length < 2) return;
    const timer = window.setInterval(() => {
      setActiveImage((current) => {
        let next = current;
        while (next === current) next = Math.floor(Math.random() * displayImages.length);
        return next;
      });
    }, 4500);
    return () => window.clearInterval(timer);
  }, [displayImages.length]);

  return (
    <section id="volunteer" className="relative overflow-hidden bg-bcn-black px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[760px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-bcn-orange/10 blur-[130px]" />
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-bcn-orange/20 bg-[#111111] shadow-[0_24px_80px_rgba(0,0,0,0.65)]">
        <div className="grid items-stretch lg:grid-cols-[1.05fr_.95fr]">
          <div className="relative z-10 flex flex-col justify-center px-6 py-12 sm:px-10 lg:px-14 lg:py-16">
            <div className="mb-6 inline-flex w-fit rounded-full border border-bcn-orange/30 bg-bcn-orange/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-bcn-amber">
              Volunteer with BCN
            </div>
            <h2 className="max-w-xl text-3xl font-extrabold leading-tight text-[#F5F1E8] sm:text-4xl md:text-5xl">
              Want to be part of <span className="bg-bcn-gradient bg-clip-text text-transparent">something meaningful?</span>
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-[#BFB9B0] sm:text-base">
              Join the people who turn BCN ideas into unforgettable experiences. Bring your energy, creativity, and heart. We’ll build, serve, learn, and make an impact together.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold uppercase tracking-wider text-[#A39C90]">
              <span>Find your people</span><span className="h-1 w-1 rounded-full bg-bcn-orange" />
              <span>Build real experience</span><span className="h-1 w-1 rounded-full bg-bcn-orange" />
              <span>Create lasting impact</span>
            </div>
            <Link href="/volunteer" className="group mt-9 inline-flex w-fit items-center gap-2 rounded-xl bg-bcn-gradient px-7 py-3.5 text-sm font-bold text-black shadow-[0_5px_28px_rgba(255,132,0,0.3)] transition-transform hover:-translate-y-0.5">
              Join the BCN volunteer team <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <div className="relative min-h-[380px] overflow-hidden border-t border-white/10 bg-black lg:min-h-[560px] lg:border-l lg:border-t-0">
            {displayImages.length > 0 ? (
              <>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={displayImages[activeImage]}
                    initial={{ opacity: 0, scale: 1.025 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="absolute inset-0 flex items-center justify-center p-4 sm:p-6"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={displayImages[activeImage]}
                      alt="A moment from a previous BCN event"
                      className="h-full w-full rounded-[2rem] object-contain object-center"
                      loading="lazy"
                    />
                  </motion.div>
                </AnimatePresence>
                {displayImages.length > 1 && (
                  <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2 rounded-full border border-white/10 bg-black/60 px-3 py-2 backdrop-blur-md">
                    {displayImages.map((src, index) => (
                      <button
                        key={`${src}-${index}`}
                        type="button"
                        aria-label={`Show event photo ${index + 1}`}
                        onClick={() => setActiveImage(index)}
                        className={`h-1.5 rounded-full transition-all ${index === activeImage ? "w-7 bg-bcn-orange" : "w-1.5 bg-white/45 hover:bg-white/75"}`}
                      />
                    ))}
                  </div>
                )}
              </>
            ) : <div className="absolute inset-0 bg-[radial-gradient(#FF8400_1px,transparent_1px)] [background-size:28px_28px] opacity-20" />}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,rgba(0,0,0,.32)_100%)]" />
          </div>
        </div>
      </div>
    </section>
  );
}
