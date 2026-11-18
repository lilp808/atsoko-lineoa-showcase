// รอ Vercel auto-deploy ตัวที่มี baseUrl ใน GET /api/webhook แล้วรายงานค่า
// รัน: node scripts/wait-deploy.mjs [minutes]
import { setTimeout as sleep } from "node:timers/promises";

const url = (process.argv[2] ?? "https://atsoko-lineoa-showcase.vercel.app").replace(/\/$/, "") + "/api/webhook";
const limitMs = (Number(process.argv[3] ?? 4)) * 60_000;
const t0 = Date.now();
let last = null;

while (Date.now() - t0 < limitMs) {
  try {
    const j = await (await fetch(url, { cache: "no-store" })).json();
    last = j;
    if ("baseUrl" in j) {
      console.log("NEW BUILD LIVE:", JSON.stringify(j));
      console.log(j.baseUrl.startsWith("https://") ? "baseUrl = HTTPS ✅" : `baseUrl = ${j.baseUrl} ❌`);
      process.exit(0);
    }
  } catch {
    /* deploy in progress */
  }
  await sleep(10_000);
}
console.log("timeout — ยังไม่เห็น build ใหม่. ผล GET ล่าสุด:", JSON.stringify(last));
process.exit(1);
