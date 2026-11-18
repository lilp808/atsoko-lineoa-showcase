// ตรวจ asset บน deployment จริงว่า LINE ดึงไปได้ (HTTPS, ไม่มี redirect, content-type ถูก)
// รัน: node scripts/check-live.mjs [https://your-app.vercel.app]
const base = (process.argv[2] ?? "https://atsoko-lineoa-showcase.vercel.app").replace(/\/$/, "");

async function probe(path) {
  const res = await fetch(base + path, { method: "GET", redirect: "follow" });
  const finalUrl = res.url;
  const redirected = finalUrl !== base + path;
  const buf = await res.arrayBuffer();
  console.log(
    `${path.padEnd(24)} status=${res.status} type=${res.headers.get("content-type")} bytes=${buf.byteLength}` +
      (redirected ? ` [REDIRECTED -> ${finalUrl}]` : " (no redirect)"),
  );
  return res.ok && !redirected;
}

const checks = await Promise.all([
  probe("/images/demo.png"),
  probe("/images/demo-card.png"),
  probe("/images/rich.png"),
  probe("/api/webhook"),
]);
console.log(checks.every(Boolean) ? "\nLIVE ASSETS OK ✅" : "\nPROBLEM DETECTED ❌ (redirect / not reachable = LINE rejects media)");

// GET /api/webhook แสดง baseUrl ที่ deploy ปัจจุบัน resolve ได้
const j = await (await fetch(`${base}/api/webhook`)).json();
console.log("webhook status:", JSON.stringify(j));
if (j.baseUrl && j.baseUrl.startsWith("https://")) console.log("baseUrl เป็น HTTPS ✅");
else if (j.baseUrl) console.log(`baseUrl เป็น ${j.baseUrl} ❌ — LINE จะ reject media URL`);
