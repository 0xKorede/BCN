"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { BcnLogo } from "@/components/ui/BcnLogo";
import { Button } from "@/components/ui/Button";
import { NAV_LINKS } from "@/lib/constants";
import { Menu, X } from "lucide-react";

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 12) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
            <BcnLogo type="full" size="md" variant="transparent" />
          </Link>

          {/* Center: Nav links (Desktop) */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-[#DFD8CE] hover:text-bcn-amber transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right: Register Button + Mobile Hamburger */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0 mr-1 sm:mr-2">
            <a href="#register">
              <Button variant="primary" size="sm" className="hidden sm:inline-flex">
                Register
              </Button>
            </a>

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
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-[#F5F1E8] hover:text-bcn-amber py-2 border-b border-white/5 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="pt-2">
            <a href="#register" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="primary" size="md" fullWidth>
                Register Now
              </Button>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
