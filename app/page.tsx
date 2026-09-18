import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/sections/Hero";
import { AboutBcn } from "@/components/sections/AboutBcn";
import { Speakers } from "@/components/sections/Speakers";
import { EventSchedule } from "@/components/sections/EventSchedule";
import { EventDetailsBar } from "@/components/sections/EventDetailsBar";
import { LiveMoments } from "@/components/sections/LiveMoments";
import { RegistrationForm } from "@/components/sections/RegistrationForm";
import { VolunteerCTA } from "@/components/sections/VolunteerCTA";
import { Footer } from "@/components/layout/Footer";
import { getSupabaseAdmin, MediaItem } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  let initialMedia: MediaItem[] = [];
  try {
    const supabase = getSupabaseAdmin();
    const { data } = await supabase
      .from("media")
      .select("*")
      .order("uploaded_at", { ascending: false });
    if (data) {
      initialMedia = data as MediaItem[];
    }
  } catch (err) {
    console.error("[Home] Error loading media:", err);
  }

  return (
    <div className="relative min-h-screen bg-bcn-black text-[#F5F1E8] flex flex-col">
      {/* Sticky Header Navbar */}
      <Navbar />

      {/* Main Content Composition */}
      <main className="flex-grow">
        {/* 1. Hero Section */}
        <Hero />

        {/* 2. About BCN Section */}
        <AboutBcn />

        {/* 3. Speakers Section */}
        <Speakers />

        {/* 4. Event Schedule Section */}
        <EventSchedule />

        {/* 4b. Full-width High-Contrast Event Details Bar */}
        <EventDetailsBar />

        {/* 5. Volunteer CTA Banner — Placed right after schedule for people looking to get involved */}
        <VolunteerCTA />

        {/* 6. Live Moments Gallery — Realtime photo/video feed */}
        <LiveMoments initialMedia={initialMedia} />

        {/* 7. Registration Form Section */}
        <RegistrationForm />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

