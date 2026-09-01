import React from "react";
import Image from "next/image";

interface BcnLogoProps {
  type?: "full" | "mark" | "icon";
  className?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  /** Use "transparent" (default) for transparent background, "standalone" for icon only, "primary" for full lockup */
  variant?: "primary" | "standalone" | "mono-white" | "transparent";
}

export const BcnLogo: React.FC<BcnLogoProps> = ({
  className = "",
  size = "md",
  variant = "transparent",
}) => {
  const sizeMap = {
    xs: { h: 32, maxH: "h-8 sm:h-9" },
    sm: { h: 44, maxH: "h-10 sm:h-11" },
    md: { h: 56, maxH: "h-12 sm:h-14" },
    lg: { h: 80, maxH: "h-16 sm:h-20" },
    xl: { h: 120, maxH: "h-24 sm:h-32" },
  };

  // Variant → asset mapping
  // "transparent" / "primary" = full lockup on transparent background (cropped to content bounds)
  // "standalone"              = mark only, transparent bg (BCN Standalone logo.png)
  // "mono-white"              = transparent logo for dark/burgundy backgrounds
  const assetMap = {
    transparent:  "/images/logo/bcn-logo-transparent.png",
    primary:      "/images/logo/bcn-logo-transparent.png",
    standalone:   "/images/logo/bcn-logo-standalone.png",
    "mono-white": "/images/logo/bcn-logo-transparent.png",
  };

  const { h, maxH } = sizeMap[size] || sizeMap.md;
  const src = assetMap[variant] || assetMap.transparent;
  const minH = Math.max(24, h); // enforce minimum 24px render height

  return (
    <div className={`inline-flex items-center select-none shrink-0 ${className}`}>
      <Image
        src={src}
        alt="Building Creatives Network (BCN) Logo"
        width={minH * 10}
        height={minH * 5}
        className={`${maxH} w-auto object-contain transition-transform duration-200 hover:scale-105`}
        priority
        style={{ minHeight: 24 }}
      />
    </div>
  );
};
