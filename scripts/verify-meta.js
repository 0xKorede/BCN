async function test() {
  try {
    const res = await fetch("http://localhost:3000");
    const html = await res.text();

    console.log("Status:", res.status);
    const titleMatch = html.match(/<title>([^<]+)<\/title>/);
    console.log("Title:", titleMatch ? titleMatch[1] : "Not found");

    const ogMatches = html.match(/<meta property="og:[^>]+>/g) || [];
    console.log("OG Tags (" + ogMatches.length + "):");
    ogMatches.forEach((t) => console.log("  " + t));

    const twMatches = html.match(/<meta name="twitter:[^>]+>/g) || [];
    console.log("Twitter Tags (" + twMatches.length + "):");
    twMatches.forEach((t) => console.log("  " + t));

    const iconMatches = html.match(/<link [^>]*rel="(icon|apple-touch-icon|shortcut icon|manifest)"[^>]*>/g) || [];
    console.log("Icon Links (" + iconMatches.length + "):");
    iconMatches.forEach((t) => console.log("  " + t));

    const jsonLdMatch = html.includes('application/ld+json');
    console.log("JSON-LD Schema present:", jsonLdMatch);
  } catch (err) {
    console.error("Error:", err.message);
  }
}

test();
