// รอเซิร์ฟเวอร์พร้อม (retry GET จนกว่า 200) แล้วรัน smoke-test ตาม
import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";

const BASE = process.env.SMOKE_BASE ?? "http://localhost:3000";
for (let i = 0; i < 40; i++) {
  try {
    const r = await fetch(`${BASE}/api/webhook`);
    if (r.ok) break;
  } catch {
    /* server ยังไม่ขึ้น */
  }
  await sleep(1000);
}
const child = spawn(process.execPath, ["scripts/smoke-test.mjs"], { stdio: "inherit" });
child.on("exit", (code) => process.exit(code ?? 1));
