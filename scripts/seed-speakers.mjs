if (typeof globalThis.WebSocket === "undefined") {
  globalThis.WebSocket = class DummyWebSocket {};
}

const { createClient } = await import("@supabase/supabase-js");

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  console.error("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.");
  process.exit(1);
}

const speakers = [
  {
    name: "Mr. Samuel Oboh",
    role: "host",
    photo_url: "/images/speakers/samuel-oboh.png",
    bio: "Samuel Oboh is the driving force behind Building Creatives Network and the CEO of Reflection Pro Frames. A passionate community builder and creative professional, he brings energy, vision, and a heart for raising the next generation of African innovators to every BCN Hangout.",
    display_order: 0,
  },
  {
    name: "T-Spice",
    role: "speaker",
    photo_url: "/images/speakers/t-spice.png",
    bio: "Tosin Samuel (T-Spice) is a Nigerian food creator, media entrepreneur, and the founder of Tspices Kitchen, dedicated to showcasing Nigerian cuisine through modern storytelling, education, and creative content. With over 2.5 million followers, she has collaborated with top brands like GTCO, Peak, and Indomie, was named 1st Runner-Up for TikTok Food Creator of the Year (2024), and hosted a DStv cooking show.",
    display_order: 1,
  },
  {
    name: "Mr. Favour Jigah",
    role: "speaker",
    photo_url: "/images/speakers/favour-jigah.png",
    bio: "Jigah Favour Sokoato is a Computer Engineer, Software Developer, and Creative Professional with a deep passion for technology, digital innovation, and youth empowerment. Bringing extensive hands-on expertise across software engineering, digital media, video production, and creative leadership, he is dedicated to equipping the next generation of creatives to discover, build, and maximize their full potential.",
    display_order: 2,
  },
  {
    name: "Mr. Gideon Bello",
    role: "speaker",
    photo_url: "/images/speakers/gideon-bello.png",
    bio: "Gideon Bello is an educator, technology entrepreneur, preacher, Christian communicator, and content creator dedicated to leveraging knowledge, technology, and digital media to influence the next generation for good. He is the Founder of Ambassadors Coding Academy, an initiative equipping children and teenagers with practical digital skills, including coding, web development, and Python programming. Passionate about Christian apologetics and the intellectual formation of young minds, Gideon champions the thoughtful and compelling communication of faith at the intersection of education, technology, parenting, and digital culture. He is happily married.",
    display_order: 3,
  },
  {
    name: "Pst. Stephen Yusuf",
    role: "speaker",
    photo_url: "/images/speakers/stephen-yusuf.png",
    bio: "Pastor Stephen Yusuf is a dynamic Minister of the Gospel and Lead Pastor of Christ Discipleship Place, Lokoja, tasked with the mandate to 'Raise a People of Eternal Excellence.' Bringing an 8-year banking career into ministry, he blends marketplace acumen with spiritual depth to equip creatives with purpose and leadership. He is happily married and blessed with kids.",
    display_order: 4,
  },
];

const supabase = createClient(url, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const { data: event, error: eventError } = await supabase
  .from("events")
  .select("id")
  .eq("slug", "creators-with-a-difference")
  .single();

if (eventError || !event) {
  console.error("Could not find creators-with-a-difference event:", eventError?.message);
  process.exit(1);
}

const { count: existingCount, error: countError } = await supabase
  .from("speakers")
  .select("id", { count: "exact", head: true })
  .eq("event_id", event.id);

if (countError) {
  console.error("Could not count speakers:", countError.message);
  process.exit(1);
}

if ((existingCount ?? 0) > 0) {
  console.log("speakers already seeded, skipping");
} else {
  const { error: insertError } = await supabase
    .from("speakers")
    .insert(speakers.map((speaker) => ({ ...speaker, event_id: event.id })));

  if (insertError) {
    console.error("Could not seed speakers:", insertError.message);
    process.exit(1);
  }
}

const { count, error: verifyError } = await supabase
  .from("speakers")
  .select("id", { count: "exact", head: true })
  .eq("event_id", event.id);

if (verifyError) {
  console.error("Could not verify speakers:", verifyError.message);
  process.exit(1);
}

console.log(`speaker row count: ${count}`);
if (count !== 5) process.exit(2);
