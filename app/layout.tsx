import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-poppins",
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://buildingcreativesnetwork.com";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0A0A0A" },
    { media: "(prefers-color-scheme: light)", color: "#0A0A0A" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Building Creatives Network",
    template: "%s | Building Creatives Network",
  },
  description:
    "A community where creators, developers, designers, and innovators connect, grow their craft, and build with purpose.",
  applicationName: "Building Creatives Network",
  authors: [{ name: "Building Creatives Network", url: SITE_URL }],
  generator: "Next.js",
  keywords: [
    "BCN Hangout",
    "BCN Hangout 2026",
    "Building Creatives Network",
    "Creators with a Difference",
    "Samuel Oboh",
    "T-Spice",
    "Favour Jigah",
    "Gideon Bello",
    "Stephen Yusuf",
    "Lokoja Tech Event",
    "Lokoja Creatives",
    "Nigerian Creative Community",
    "African Innovators",
    "Developer Conference Nigeria",
    "Creative Networking Lokoja",
    "Kogi State Tech Hangout",
  ],
  creator: "Building Creatives Network",
  publisher: "Building Creatives Network",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicon.ico?v=black-bg", sizes: "any" },
      { url: "/icon.png?v=black-bg", type: "image/png", sizes: "32x32" },
    ],
    apple: [
      { url: "/apple-icon.png?v=black-bg", sizes: "180x180", type: "image/png" },
    ],
    shortcut: ["/favicon.ico?v=black-bg"],
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: "Building Creatives Network",
    description:
      "Where creatives meet and build. Connect with creators, developers, designers, and innovators growing their craft and building with purpose.",
    url: SITE_URL,
    siteName: "Building Creatives Network (BCN)",
    images: [
      {
        url: "/images/logo/bcn-logo-primary.png",
        width: 2500,
        height: 2000,
        alt: "Building Creatives Network logo",
        type: "image/png",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Building Creatives Network",
    description:
      "Where creatives meet and build. Connect, grow your craft, and build with purpose.",
    images: [
      {
        url: "/images/logo/bcn-logo-primary.png",
        width: 2500,
        height: 2000,
        alt: "Building Creatives Network logo",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Structured schema for Google Rich Results (Event & Organization)
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Event",
        "@id": `${SITE_URL}#event`,
        "name": "BCN Hangout 2026: Creators with a Difference",
        "description":
          "The premier gathering of digital creators, developers, designers, and innovators in Lokoja for practical skill conversations, intentional networking, and spiritual impact.",
        "startDate": "2026-09-19T10:00:00+01:00",
        "endDate": "2026-09-19T17:00:00+01:00",
        "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
        "eventStatus": "https://schema.org/EventScheduled",
        "location": {
          "@type": "Place",
          "name": "KHMS Hall, LFC Lokongoma",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "LFC Lokongoma",
            "addressLocality": "Lokoja",
            "addressRegion": "Kogi State",
            "addressCountry": "NG",
          },
        },
        "image": [`${SITE_URL}/og-image.jpg`],
        "offers": {
          "@type": "Offer",
          "url": `${SITE_URL}/register`,
          "price": "0",
          "priceCurrency": "NGN",
          "availability": "https://schema.org/InStock",
          "validFrom": "2026-01-01T00:00:00+01:00",
        },
        "performer": [
          {
            "@type": "Person",
            "name": "Mr. Samuel Oboh",
            "jobTitle": "Lead Convener & Host",
          },
          {
            "@type": "Person",
            "name": "T-Spice",
            "jobTitle": "Featured Speaker",
          },
          {
            "@type": "Person",
            "name": "Mr. Favour Jigah",
            "jobTitle": "Featured Speaker",
          },
          {
            "@type": "Person",
            "name": "Mr. Gideon Bello",
            "jobTitle": "Featured Speaker",
          },
          {
            "@type": "Person",
            "name": "Pst. Stephen Yusuf",
            "jobTitle": "Featured Speaker",
          },
        ],
        "organizer": {
          "@type": "Organization",
          "@id": `${SITE_URL}#organization`,
          "name": "Building Creatives Network",
          "url": SITE_URL,
          "logo": `${SITE_URL}/images/logo/bcn-logo-transparent.png`,
        },
      },
      {
        "@type": "Organization",
        "@id": `${SITE_URL}#organization`,
        "name": "Building Creatives Network",
        "url": SITE_URL,
        "logo": `${SITE_URL}/images/logo/bcn-logo-transparent.png`,
        "sameAs": [
          "https://youtube.com/@buildingcreativesnetwork?si=hQabV1Tpvs4-ZXr0",
          "https://www.facebook.com/share/1C47CfKY8U/?mibextid=wwXIfr",
          "https://www.instagram.com/building_creatives_network?igsi=MXFvcmp1enBrN211bg==",
          "https://www.tiktok.com/@buildingcreatives?_r=1&_t=ZS-99MvHEPBEuH",
        ],
      },
    ],
  };

  return (
    <html lang="en" className={`scroll-smooth ${poppins.variable}`}>
      <body className="bg-bcn-black text-[#F5F1E8] font-sans antialiased selection:bg-bcn-amber selection:text-bcn-black min-h-screen flex flex-col">
        {/* JSON-LD Structured Data for Event & Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
