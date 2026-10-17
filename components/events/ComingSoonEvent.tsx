import Image from "next/image";
import { CalendarDays, Facebook, Instagram, Youtube } from "lucide-react";

function TikTokIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
  );
}

const socials = [
  {
    name: "YouTube",
    href: "https://youtube.com/@buildingcreativesnetwork?si=hQabV1Tpvs4-ZXr0",
    Icon: Youtube,
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/share/1C47CfKY8U/?mibextid=wwXIfr",
    Icon: Facebook,
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/building_creatives_network?igsi=MXFvcmp1enBrN211bg==",
    Icon: Instagram,
  },
  {
    name: "TikTok",
    href: "https://www.tiktok.com/@buildingcreatives?_r=1&_t=ZS-99MvHEPBEuH",
    Icon: TikTokIcon,
  },
];

export function ComingSoonEvent() {
  return (
    <article className="relative overflow-hidden rounded-[2rem] border border-bcn-orange/25 bg-[#11100E] shadow-[0_24px_90px_rgba(0,0,0,.45)]">
      <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-bcn-orange/10 blur-3xl" />
      <div className="grid lg:grid-cols-[minmax(320px,.82fr)_1.18fr]">
        <div className="relative flex items-center justify-center bg-black p-3 sm:p-5 lg:p-7">
          <Image
            src="/images/events/bcn-2-poster-original.jpeg"
            alt="Building Creatives Network 2.0 — The Creative Economy, coming November 2026"
            width={864}
            height={1080}
            sizes="(max-width: 1024px) 100vw, 42vw"
            className="h-auto w-full max-w-[620px] rounded-2xl object-contain"
            priority={false}
          />
        </div>

        <div className="relative flex flex-col justify-center px-6 py-9 sm:px-10 sm:py-12 lg:px-14">
          <div className="flex w-fit items-center gap-2 rounded-full border border-bcn-orange/35 bg-bcn-orange/10 px-4 py-2 text-xs font-bold uppercase tracking-[.18em] text-bcn-amber">
            <CalendarDays className="h-4 w-4" />
            November 2026
          </div>
          <p className="mt-7 text-sm font-bold uppercase tracking-[.22em] text-bcn-orange">
            Coming next
          </p>
          <h3 className="mt-3 text-4xl font-extrabold leading-tight sm:text-5xl">
            Building Creatives Network <span className="text-bcn-orange">2.0</span>
          </h3>
          <p className="mt-5 text-lg font-semibold text-[#F5C174]">
            Theme: The Creative Economy
          </p>
          <p className="mt-4 max-w-xl leading-7 text-[#BEB7AD]">
            BCN returns this November with a new experience focused on how
            creatives turn ideas, skills, and community into lasting value.
            Speakers, host, venue, and the exact date will be announced soon.
          </p>

          <div className="mt-8 border-t border-white/10 pt-7">
            <p className="text-sm font-semibold text-[#F5F1E8]">
              Follow BCN for speaker reveals and event updates
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              {socials.map(({ name, href, Icon }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Follow BCN on ${name}`}
                  title={name}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/[.05] text-[#DED7CD] transition hover:-translate-y-0.5 hover:border-bcn-orange/60 hover:bg-bcn-orange/15 hover:text-bcn-amber"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
