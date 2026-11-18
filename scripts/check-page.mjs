// ตรวจหน้าเว็บ TH/EN + /api/examples (รัน: node scripts/check-page.mjs)
const base = "http://localhost:3000";

async function textAt(url) {
  return (await fetch(url)).text();
}

let bad = 0;
function has(html, needle, label) {
  const ok = html.includes(needle);
  if (!ok) bad++;
  console.log(`${ok ? "ok " : "MISSING"} [${label}] ${needle.slice(0, 50)}`);
}

console.log("== TH (/) ==");
const th = await textAt(base);
has(th, "คลังตัวอย่าง Reply Message", "th h1");
has(th, "พิมพ์: flex", "th keyword chip");
has(th, "Raw payload", "th raw json");
has(th, "English", "lang switch to EN");

console.log("== EN (/?lang=en) ==");
const en = await textAt(`${base}/?lang=en`);
has(en, "LINE OA Reply Message Showcase", "en h1");
has(en, "Type: flex", "en keyword chip");
has(en, "Raw payload", "en raw json");
has(en, "Flex Bubble", "en example title");
has(en, "swipe to see the next bubble", "en mock chrome");
has(en, "You", "en user label");
has(en, "ไทย", "lang switch back to TH");

console.log("== /api/examples ==");
const data = await (await fetch(`${base}/api/examples`)).json();
console.log(`examples count: ${data.count}`);
for (const ex of data.examples) {
  const types = ex.messages.map((m) => m.type).join(",");
  console.log(`- ${ex.keyword.padEnd(10)} → [${types}]`);
  if (ex.messages.length > 5) {
    bad++;
    console.log(`  ERROR: ${ex.keyword} exceeds 5 messages/reply`);
  }
}

if (bad) {
  console.log(`\n${bad} problem(s) ❌`);
  process.exit(1);
}
console.log("\nALL CHECKS PASSED ✅");
