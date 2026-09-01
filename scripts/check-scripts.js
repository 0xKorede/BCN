async function main() {
  try {
    const res = await fetch("http://localhost:3000");
    const html = await res.text();
    const scripts = html.match(/<script src="[^"]+"/g) || [];
    console.log("Total script tags:", scripts.length);
    for (const s of scripts) {
      const src = s.match(/src="([^"]+)"/)[1];
      const scriptRes = await fetch("http://localhost:3000" + src);
      if (scriptRes.status !== 200) {
        console.error("FAIL:", src, scriptRes.status);
      } else {
        console.log("OK (200):", src);
      }
    }
  } catch (err) {
    console.error("Error:", err);
  }
}
main();
