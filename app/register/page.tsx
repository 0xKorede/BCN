import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Sparkles, Calendar, MapPin, Clock } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { RegistrationForm } from "@/components/sections/RegistrationForm";
import { EventDetailsBar } from "@/components/sections/EventDetailsBar";
import { Footer } from "@/components/layout/Footer";
import { EVENT_DATE, EVENT_TIME, EVENT_VENUE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Register | BCN Hangout 2026 — Creators with a Difference",
  description:
    "Secure your free attendance for BCN Hangout 2026 in Lokoja. Join designers, developers, creators, and leaders for an inspiring day of networking, skill conversations, and impact.",
  alternates: {
    canonical: "https://buildingcreativesnetwork.com/register",
  },
  openGraph: {
    title: "Register for BCN Hangout 2026 | Creators with a Difference",
    description:
      "Reserve your free seat for BCN Hangout 2026 in Lokoja. Limited seats available.",
    url: "https://buildingcreativesnetwork.com/register",
    siteName: "Building Creatives Network",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Register for BCN Hangout 2026 | Creators with a Difference",
    description:
      "Reserve your free seat for BCN Hangout 2026 in Lokoja. Limited seats available.",
  },
};

export default function RegisterPage() {
  return (
    <div className="relative min-h-screen bg-bcn-black text-[#F5F1E8] flex flex-col selection:bg-bcn-orange selection:text-white">
      {/* Sticky Header Navbar */}
      <Navbar />

      <main className="flex-grow pt-28 sm:pt-36">
        {/* Top Breadcrumb & Return Link */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-[#A39C90] hover:text-bcn-amber transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Event Overview</span>
          </Link>
        </div>

        {/* Dedicated Quick Event Pill Bar */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-2">
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 py-2 px-4 rounded-2xl bg-white/[0.03] border border-white/10 text-xs sm:text-sm text-[#DFD8CE]">
            <div className="flex items-center gap-1.5 text-bcn-amber font-medium">
              <Sparkles className="w-3.5 h-3.5 text-bcn-orange" />
              <span>Free Attendance</span>
            </div>
            <span className="hidden sm:inline text-white/20">•</span>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-bcn-orange" />
              <span>{EVENT_DATE}, 2026</span>
            </div>
            <span className="hidden sm:inline text-white/20">•</span>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-bcn-orange" />
              <span>{EVENT_TIME}</span>
            </div>
            <span className="hidden sm:inline text-white/20">•</span>
            <div className="flex items-center gap-1.5 truncate max-w-[240px] sm:max-w-none">
              <MapPin className="w-3.5 h-3.5 text-bcn-orange shrink-0" />
              <span className="truncate">{EVENT_VENUE}</span>
            </div>
          </div>
        </div>

        {/* Embedded Registration Form */}
        <RegistrationForm className="pt-6 pb-20" />

        {/* High-contrast Event Venue & Date Strip */}
        <EventDetailsBar />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
