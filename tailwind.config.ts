import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bcn: {
          black: "#000000",       // Ink Black — base background
          burgundy: "#761530",    // Deep Burgundy — grounding accent
          orange: "#FF8400",      // Signal Orange — gradient start, primary CTA
          amber: "#FFA341",       // Amber — gradient mid-tone
          lightAmber: "#FFBD60",  // Light Amber — gradient mid-tone
          paleGold: "#FFD192",    // Pale Gold — gradient end, lightest highlight
        },
      },
      fontFamily: {
        sans: ["var(--font-poppins)", "sans-serif"],
      },
      backgroundImage: {
        "bcn-gradient": "linear-gradient(135deg, #FF8400 0%, #FFA341 35%, #FFBD60 65%, #FFD192 100%)",
        "bcn-gradient-vertical": "linear-gradient(180deg, #FF8400 0%, #FFA341 35%, #FFBD60 65%, #FFD192 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
