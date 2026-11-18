// ตรวจ payload变更后: help buttons ต้องเป็น message action ส่ง keyword ตรงๆ
// รัน: node scripts/check-actions.mjs (ต้องรัน server ก่อน)
const data = await (await fetch("http://localhost:3000/api/examples")).json();
const help = data.examples.find((e) => e.id === "help");
const btn = help.messages[1].template;
console.log("help template:", btn.text.slice(0, 60));
for (const a of btn.actions) {
  console.log(`  - [${a.type}] "${a.label}" -> ${a.text}`);
  if (a.type !== "message") {
    console.error(`  ERROR: help button '${a.label}' is ${a.type}, expected message`);
    process.exit(1);
  }
  if (!a.text || a.text.toLowerCase() !== a.text) {
    console.error(`  ERROR: help button text '${a.text}' is not a plain keyword`);
    process.exit(1);
  }
}

const flex = data.examples.find((e) => e.id === "flex").messages[0].contents;
const flexBtns = flex.footer.contents.map((b) => b.action);
console.log("flex footer:", flexBtns.map((a) => `${a.type}:${a.label}`).join(" | "));
const quick = flexBtns.find((a) => a.label === "See Quick Reply");
if (quick.type !== "message" || quick.text !== "quick") {
  console.error("ERROR: flex 'See Quick Reply' must be message 'quick'");
  process.exit(1);
}

const em = data.examples.find((e) => e.id === "imagemap").messages[0];
console.log(
  "imagemap zones:",
  em.actions.map((a) => `${a.type}${a.text ?? a.data ?? a.uri ? `(${a.text ?? a.data ?? a.uri})` : ""}`).join(" | "),
);
const z2 = em.actions[1];
if (z2.type !== "message" || z2.text !== "quick") {
  console.error("ERROR: imagemap zone 2 must be message 'quick'");
  process.exit(1);
}

console.log("\nACTION CHECKS PASSED ✅");
