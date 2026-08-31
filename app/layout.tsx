import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "BCN Hangout | Where Creatives Meet & Build",
  description:
    "Join digital creators, developers, and innovators in Lokoja for practical skill conversations, networking, and intentional connection at Building Creatives Network (BCN) Hangout.",
  keywords: [
    "BCN Hangout",
    "Building Creatives Network",
    "Lokoja Creatives",
    "Developer Community",
    "Designers Lokoja",
    "Tech Hangout Nigeria",
  ],
  authors: [{ name: "Building Creatives Network" }],
  openGraph: {
    title: "BCN Hangout | Where Creatives Meet & Build",
    description:
      "Join digital creators, developers, and innovators in Lokoja for practical skill conversations and intentional connection.",
    type: "website",
    locale: "en_US",
    siteName: "Building Creatives Network",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`scroll-smooth ${poppins.variable}`}>
      <body className="bg-bcn-black text-[#F5F1E8] font-sans antialiased selection:bg-bcn-amber selection:text-bcn-black min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
