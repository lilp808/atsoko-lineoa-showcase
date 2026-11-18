// ตรวจ byte-level ของ .env.local ว่าไม่มีอักขระเกิน ASCII ในค่า token/secret
import { readFileSync } from "node:fs";
const s = readFileSync(".env.local", "utf8");
for (const line of s.split(/\r?\n/)) {
  const bad = [...line].filter((c) => c.codePointAt(0) > 126);
  console.log(line.split("=")[0] + ":", bad.length ? `BAD chars: ${bad.map((c) => c + "(" + c.codePointAt(0) + ")").join(" ")}` : "ascii-only OK");
}
