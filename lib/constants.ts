export const EVENT_DATE = "Sept 19";
export const EVENT_TIME = "10:00 AM";
export const EVENT_VENUE = "KHMS HALL, LFC LOKONGOMA LOKOJA";
/** ISO-8601 target for the live countdown — Sept 19, 2026, 10:00 AM WAT (UTC+1) */
export const EVENT_TARGET_DATE = new Date("2026-09-19T10:00:00+01:00");

export interface SpeakerSocials {
  instagram?: string;
  twitter?: string;
  linkedin?: string;
}

export interface SpeakerEntry {
  id: string;
  name: string;
  role: "Host" | "Speaker";
  /** Path relative to /public, or empty string for placeholder avatar */
  photo: string;
  /** Short bio — 1–3 sentences. Edit this prop only to update the bio. */
  bio: string;
  socials: SpeakerSocials;
}

export const HOST: SpeakerEntry = {
  id: "host-samuel-oboh",
  name: "Mr. Samuel Oboh",
  role: "Host",
  photo: "/images/speakers/samuel-oboh.png",
  bio: "Samuel Oboh is the driving force behind Building Creatives Network and the CEO of Reflection Pro Frames. A passionate community builder and creative professional, he brings energy, vision, and a heart for raising the next generation of African innovators to every BCN Hangout.",
  socials: { instagram: "#", twitter: "#", linkedin: "#" },
};

export const SPEAKERS: SpeakerEntry[] = [
  {
    id: "speaker-tspice",
    name: "T-Spice",
    role: "Speaker",
    photo: "/images/speakers/t-spice.png",
    bio: "Tosin Samuel (T-Spice) is a Nigerian food creator, media entrepreneur, and the founder of Tspices Kitchen, dedicated to showcasing Nigerian cuisine through modern storytelling, education, and creative content. With over 2.5 million followers, she has collaborated with top brands like GTCO, Peak, and Indomie, was named 1st Runner-Up for TikTok Food Creator of the Year (2024), and hosted a DStv cooking show.",
    socials: {},
  },
  {
    id: "speaker-favour-jigah",
    name: "Mr. Favour Jigah",
    role: "Speaker",
    photo: "/images/speakers/favour-jigah.png",
    bio: "Jigah Favour Sokoato is a Computer Engineer, Software Developer, and Creative Professional with a deep passion for technology, digital innovation, and youth empowerment. Bringing extensive hands-on expertise across software engineering, digital media, video production, and creative leadership, he is dedicated to equipping the next generation of creatives to discover, build, and maximize their full potential.",
    socials: {},
  },
  {
    id: "speaker-gideon-bello",
    name: "Mr. Gideon Bello",
    role: "Speaker",
    photo: "/images/speakers/gideon-bello.png",
    bio: "Gideon Bello is an educator, technology entrepreneur, preacher, Christian communicator, and content creator dedicated to leveraging knowledge, technology, and digital media to influence the next generation for good. He is the Founder of Ambassadors Coding Academy, an initiative equipping children and teenagers with practical digital skills, including coding, web development, and Python programming. Passionate about Christian apologetics and the intellectual formation of young minds, Gideon champions the thoughtful and compelling communication of faith at the intersection of education, technology, parenting, and digital culture. He is happily married.",
    socials: {},
  },
  {
    id: "speaker-stephen-yusuf",
    name: "Pst. Stephen Yusuf",
    role: "Speaker",
    photo: "/images/speakers/stephen-yusuf.png",
    bio: "Pastor Stephen Yusuf is a dynamic Minister of the Gospel and Lead Pastor of Christ Discipleship Place, Lokoja, tasked with the mandate to 'Raise a People of Eternal Excellence.' Bringing an 8-year banking career into ministry, he blends marketplace acumen with spiritual depth to equip creatives with purpose and leadership. He is happily married and blessed with kids.",
    socials: {},
  },
];

export interface ScheduleItem {
  id: string;
  number: string;
  iconName: "Users" | "MessageSquare" | "Sparkles";
  title: string;
  description: string;
}

export const SCHEDULE: ScheduleItem[] = [
  {
    id: "networking",
    number: "01",
    iconName: "Users",
    title: "Networking",
    description: "Meet amazing creatives and build strong connections.",
  },
  {
    id: "skill-conversations",
    number: "02",
    iconName: "MessageSquare",
    title: "Skill Conversations",
    description: "Engage in practical discussions that sharpen your craft.",
  },
  {
    id: "prayer-impactation",
    number: "03",
    iconName: "Sparkles",
    title: "Prayer & Impactation",
    description: "We end with prayers, impartation, and a charge for impact.",
  },
];

export const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Schedule", href: "#schedule" },
  { label: "Speakers", href: "#speakers" },
  { label: "Location", href: "#location" },
];
