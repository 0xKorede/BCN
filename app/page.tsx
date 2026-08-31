import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/sections/Hero";
import { AboutBcn } from "@/components/sections/AboutBcn";
import { Speakers } from "@/components/sections/Speakers";
import { EventSchedule } from "@/components/sections/EventSchedule";
import { EventDetailsBar } from "@/components/sections/EventDetailsBar";
import { RegistrationForm } from "@/components/sections/RegistrationForm";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
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

        {/* 4. Full-width High-Contrast Event Details Bar */}
        <EventDetailsBar />

        {/* 5. Registration Form Section */}
        <RegistrationForm />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
