"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BcnLogo } from "@/components/ui/BcnLogo";
import { Button } from "@/components/ui/Button";
import { Menu, X } from "lucide-react";

interface NavbarProps { upcomingSlug?: string; variant?: "org" | "event"; eventPast?: boolean }
export const Navbar: React.FC<NavbarProps> = ({ upcomingSlug, variant = "org", eventPast = false }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const links = variant === "event"
    ? [{label:"Home",href:"/"},{label:"All Events",href:"/events"},{label:"Speakers",href:"#speakers"},{label:"Schedule",href:"#schedule"},{label:"Register",href:"#register"}]
    : [{label:"About",href:"#about"},{label:"Events",href:"#events"},{label:"Team",href:"#team"},{label:"Volunteer",href:"#volunteer"}];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 12) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      // If user scrolled back to top on homepage, reset URL to /
      if (pathname === "/" && window.scrollY < 200 && window.location.pathname === "/register") {
        window.history.replaceState(null, "", "/");
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  const handleRegisterClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === "/") {
      const registerEl = document.getElementById("register");
      if (registerEl) {
        e.preventDefault();
        registerEl.scrollIntoView({ behavior: "smooth" });
        window.history.pushState(null, "", "/register");
      }
    }
  };

  const getHref = (href: string) => {
    if (href.startsWith("#") && pathname !== "/") {
      return `/${href}`;
    }
    return href;
  };

  return (
    <header className="fixed top-4 inset-x-0 z-50 px-4 sm:px-6 flex flex-col items-center pointer-events-none">
      {/* Floating Island Header Bar */}
      <div
        className={`w-full max-w-6xl rounded-full pointer-events-auto transition-all duration-300 border backdrop-blur-xl backdrop-saturate-150 pl-5 pr-8 sm:pl-7 sm:pr-11 py-3 sm:py-3.5 ${
          scrolled
            ? "bg-black/15 border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_15px_rgba(255,132,0,0.08)]"
            : "bg-white/[0.03] border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.2)]"
        }`}
      >
        <div className="flex items-center justify-between">
          {/* Left: BCN Logo — transparent mark on navbar */}
          <Link href="/" className="focus:outline-none shrink-0 py-0.5">
            <BcnLogo type="full" size="md" variant="transparent" className="scale-[4.0] origin-left -translate-x-[70px] md:-translate-x-20 translate-y-[6.5px]" />
          </Link>

          {/* Center: Nav links (Desktop) */}
          <nav className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <a
                key={link.label}
                href={getHref(link.href)}
                className="text-sm font-medium text-[#DFD8CE] hover:text-bcn-amber transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right: Register Button + Mobile Hamburger */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0 mr-1 sm:mr-2">
            {variant === "event" && !eventPast ? <a href="#register">
              <Button variant="primary" size="sm" className="hidden sm:inline-flex">Register</Button>
            </a> : upcomingSlug && <a href={`/events/${upcomingSlug}`}>
              <Button variant="primary" size="sm" className="hidden sm:inline-flex">
                Upcoming Event
              </Button>
            </a>}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-full text-[#F5F1E8] hover:text-bcn-amber hover:bg-white/5 transition-colors focus:outline-none"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Glassmorphic Panel (Floating below island header) */}
      {mobileMenuOpen && (
        <div className="md:hidden w-full max-w-6xl mt-3 rounded-3xl pointer-events-auto bg-black/15 backdrop-blur-2xl backdrop-saturate-150 border border-white/10 p-5 shadow-[0_12px_40px_rgba(0,0,0,0.4)] space-y-4 animate-fadeIn">
          <nav className="flex flex-col gap-3">
            {links.map((link) => (
              <a
                key={link.label}
                href={getHref(link.href)}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-[#F5F1E8] hover:text-bcn-amber py-2 border-b border-white/5 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
          {((variant === "event" && !eventPast) || upcomingSlug) && <div className="pt-2">
            <a href={variant === "event" ? "#register" : `/events/${upcomingSlug}`} onClick={() => setMobileMenuOpen(false)}>
              <Button variant="primary" size="md" fullWidth>
                {variant === "event" ? "Register Now" : "Upcoming Event"}
              </Button>
            </a>
          </div>}
        </div>
      )}
    </header>
  );
};
