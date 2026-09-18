import Link from "next/link";
import { Heart, ArrowRight } from "lucide-react";

export function VolunteerCTA() {
  return (
    <section className="bg-bcn-black py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[200px] bg-bcn-orange/5 rounded-full blur-[80px]" />
      </div>

      <div className="max-w-4xl mx-auto relative">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-[#141414] border border-white/10 rounded-2xl px-6 sm:px-10 py-7 sm:py-8 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">

          {/* Left — icon + text */}
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-bcn-orange/10 border border-bcn-orange/30 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
              <Heart className="w-5 h-5 text-bcn-orange" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-bcn-orange mb-0.5">
                Volunteer with BCN
              </p>
              <h3 className="text-lg sm:text-xl font-bold text-white leading-snug">
                Be part of the team behind every BCN experience
              </h3>
              <p className="text-sm text-[#A39C90] mt-1">
                We're always looking for passionate people to help organize, support, and grow everything we do.
              </p>
            </div>
          </div>

          {/* Right — CTA button */}
          <Link
            href="/volunteer"
            className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-black bg-bcn-orange hover:bg-bcn-amber transition-all shadow-[0_4px_20px_rgba(255,132,0,0.3)] hover:shadow-[0_4px_25px_rgba(255,132,0,0.45)] group whitespace-nowrap"
          >
            Apply to Volunteer
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
