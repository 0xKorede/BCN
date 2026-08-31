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
  photo: "",
  bio: "Samuel Oboh is the driving force behind Building Creatives Network. A passionate community builder and creative professional, he brings energy, vision, and a heart for raising the next generation of African innovators to every BCN Hangout.",
  socials: { instagram: "#", twitter: "#", linkedin: "#" },
};

export const SPEAKERS: SpeakerEntry[] = [
  {
    id: "speaker-tspice",
    name: "T-Spice",
    role: "Speaker",
    photo: "",
    bio: "Add T-Spice's bio here — background, area of expertise, and what they bring to BCN.",
    socials: { instagram: "#", twitter: "#", linkedin: "#" },
  },
  {
    id: "speaker-jigah-favour",
    name: "Mr. Jigah Favour",
    role: "Speaker",
    photo: "",
    bio: "Add Mr. Jigah Favour's bio here — background, area of expertise, and what they bring to BCN.",
    socials: { instagram: "#", twitter: "#", linkedin: "#" },
  },
  {
    id: "speaker-gideon-bello",
    name: "Mr. Gideon Bello",
    role: "Speaker",
    photo: "",
    bio: "Add Mr. Gideon Bello's bio here — background, area of expertise, and what they bring to BCN.",
    socials: { instagram: "#", twitter: "#", linkedin: "#" },
  },
  {
    id: "speaker-stephen-yusuf",
    name: "Pst. Stephen Yusuf",
    role: "Speaker",
    photo: "",
    bio: "Add Pst. Stephen Yusuf's bio here — background, area of expertise, and what they bring to BCN.",
    socials: { instagram: "#", twitter: "#", linkedin: "#" },
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
