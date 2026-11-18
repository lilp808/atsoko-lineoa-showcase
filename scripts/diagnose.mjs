// ตรวจสุขภาพระบบ LINE ด้วย token/secret จริงจาก .env.local (ไม่พิมพ์ค่า secret)
// รัน: node scripts/diagnose.mjs
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
function env(key) {
  if (process.env[key]) return process.env[key];
  try {
    const txt = readFileSync(join(ROOT, ".env.local"), "utf8");
    return txt.match(new RegExp(`^${key}=(.*)$`, "m"))?.[1] ?? "";
  } catch {
    return "";
  }
}

const token = env("LINE_CHANNEL_ACCESS_TOKEN");
const secret = env("LINE_CHANNEL_SECRET");

function reportSecret(name, val) {
  const placeholder = /DUMMY|REPLACE/i.test(val);
  const whitespace = /\s/.test(val);
  console.log(
    `${name}: length=${val.length}` +
      (placeholder ? " [!] ยังเป็นค่า placeholder — ใส่ค่าจริงจาก LINE Developers" : "") +
      (whitespace ? " [!] มีช่องว่าง/newline ปน — ลบออก แล้ว paste ใหม่" : "") +
      (val.length && !placeholder && !whitespace ? " OK" : ""),
  );
  return !placeholder && val.length > 20 && !whitespace;
}

const tokenOk = reportSecret("LINE_CHANNEL_ACCESS_TOKEN", token);
const secretOk = reportSecret("LINE_CHANNEL_SECRET", secret);

if (!tokenOk) {
  console.log("\nยัง verify กับ LINE ไม่ได้ — ใส่ token จริงก่อน (ค่าปัจจุบันไม่ใช่ของจริง)");
  process.exit(0);
}

console.log("\nเรียก GET https://api.line.me/v2/bot/info ...");
const res = await fetch("https://api.line.me/v2/bot/info", {
  headers: { Authorization: `Bearer ${token.trim()}` },
});
if (!res.ok) {
  console.log(`token ใช้ไม่ได้: HTTP ${res.status} — ${await res.text()}`);
  process.exit(1);
}
const info = await res.json();
console.log("bot:", info.displayName, `(${info.basicId}) · type=${info.type} · chatMode=${info.chatMode}`);
console.log("webhookEnabled:", info.webhookEnabled === true ? "✅ ON — Use webhook เปิดแล้ว" : "❌ OFF — ไปเปิด 'Use webhook' ใน LINE Developers → Messaging API");
console.log("messageQuota:", info.messageQuota, "· availableQuota:", info.availableQuota);
if (info.chatMode !== "chat") console.log("[!] chatMode ไม่ใช่ 'chat' — OA mode ไม่รับ event แบบนี้");
if (!info.webhookEnabled) {
  console.log("\nสาเหตุที่บอทไม่ตอบ: LINE ไม่ได้ส่ง event มาที่ webhook ของคุณเลย (Use webhook ยัง OFF)");
}
