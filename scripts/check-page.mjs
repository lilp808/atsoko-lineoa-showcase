// ตรวจหน้าเว็บ + /api/examples สั้น ๆ (รัน: node scripts/check-page.mjs)
const base = "http://localhost:3000";
const html = await (await fetch(`${base}/`)).text();
const need = ["LINE OA Message Showcase", "Flex Bubble", "Quick Reply", "imagemap", "print", "atsoko"];
for (const n of need) console.log(`page contains "${n}":`, html.toLowerCase().includes(n.toLowerCase()));

const data = await (await fetch(`${base}/api/examples`)).json();
console.log("examples count:", data.count);
for (const ex of data.examples) {
  const types = ex.messages.map((m) => m.type).join(",");
  console.log(`- ${ex.keyword.padEnd(10)} → [${types}]`);
}
