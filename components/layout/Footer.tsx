import React from "react";
import { Instagram, Facebook } from "lucide-react";
import { BcnLogo } from "@/components/ui/BcnLogo";

function TikTokIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
  );
}

const FOOTER_SOCIALS = [
  {
    href: "https://www.instagram.com/building_creatives_network",
    label: "Instagram",
    Icon: Instagram,
  },
  {
    href: "https://www.tiktok.com/%40buildingcreatives",
    label: "TikTok",
    Icon: TikTokIcon,
  },
  {
    href: "https://www.facebook.com/share/1C47CfKY8U",
    label: "Facebook",
    Icon: Facebook,
  },
];

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-black/10 backdrop-blur-md backdrop-saturate-150 border-t border-white/15 py-8 sm:py-10 relative z-10 text-[#DFD8CE] shadow-[0_-6px_25px_rgba(255,132,0,0.08)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">

          {/* Logo — matched with header size & crisp resolution */}
          <div className="shrink-0 py-8 md:py-2 flex items-center justify-center md:justify-start">
            <BcnLogo
              type="full"
              size="md"
              variant="transparent"
              className="scale-[4.0] origin-center md:origin-left"
            />
          </div>

          {/* Copyright content */}
          <p className="text-xs sm:text-sm font-normal text-[#8C857B] text-center order-last md:order-none">
            © {new Date().getFullYear()} Building Creatives Network (BCN). All rights reserved.
          </p>

          {/* Social icons: Instagram, TikTok, Facebook */}
          <div className="flex items-center gap-3 shrink-0">
            {FOOTER_SOCIALS.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-9 h-9 rounded-full bg-[#1A1A1A] border border-white/5 flex items-center justify-center text-[#BFB9B0] hover:text-bcn-amber hover:border-bcn-orange/50 hover:bg-bcn-orange/10 transition-all duration-200"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>

        </div>
      </div>
    </footer>
  );
};
