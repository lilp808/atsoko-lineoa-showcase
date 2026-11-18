// smoke test: ไล่ flow webhook ผ่าน replyMessages จริง (token dummy → LINE ตอบ 401 ซึ่งถือว่าถูกต้อง)
// รัน: node scripts/smoke-test.mjs  (ต้องมี next dev/start ที่ :3000)
import { createHmac, randomBytes } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
function fromEnvLocal(key) {
  try {
    const txt = readFileSync(join(ROOT, ".env.local"), "utf8");
    const m = txt.match(new RegExp(`^${key}=(.*)$`, "m"));
    return m?.[1]?.trim();
  } catch {
    return undefined;
  }
}

const BASE = process.env.SMOKE_BASE ?? "http://localhost:3000";
const SECRET = process.env.LINE_CHANNEL_SECRET ?? fromEnvLocal("LINE_CHANNEL_SECRET") ?? "REPLACED_WITH_YOUR_CHANNEL_ACCESS_TOKEN_SECRET";

function makeEvent(event) {
  const body = JSON.stringify({ destination: "dummy", events: [event] });
  const signature = createHmac("sha256", SECRET).update(body).digest("base64");
  return { body, signature };
}

async function postWebhook(event) {
  const { body, signature } = makeEvent(event);
  const res = await fetch(`${BASE}/api/webhook`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-line-signature": signature },
    body,
  });
  return { status: res.status, json: await res.json().catch(() => null) };
}

const mk = (text) => ({
  type: "message",
  replyToken: "dummy-" + randomBytes(4).toString("hex"),
  source: { type: "user", userId: "Utest" },
  message: { type: "text", id: "1", text },
});

let fail = 0;
async function check(name, fn) {
  try {
    await fn();
    console.log(`  ✓ ${name}`);
  } catch (e) {
    fail++;
    console.error(`  ✗ ${name}: ${e.message}`);
  }
}
const assert = (cond, msg) => {
  if (!cond) throw new Error(msg);
};

console.log(`smoke test → ${BASE}`);

await check("GET /api/webhook status ok", async () => {
  const res = await fetch(`${BASE}/api/webhook`);
  assert(res.status === 200, "status != 200");
});

await check("POST text 'flex' → event processed", async () => {
  const r = await postWebhook(mk("flex"));
  assert(r.status === 200 && r.json?.events === 1, JSON.stringify(r));
});

await check("ทุก keyword ผ่าน rules ไม่ error", async () => {
  const ex = await (await fetch(`${BASE}/api/examples`)).json();
  for (const item of ex.examples) {
    const r = await postWebhook(mk(item.keyword));
    assert(r.status === 200 && r.json?.events === 1, `keyword ${item.keyword}: ${JSON.stringify(r)}`);
  }
});

await check("postback kw:imagemap", async () => {
  const r = await postWebhook({
    type: "postback",
    replyToken: "dummy-pb",
    source: { type: "user", userId: "Utest" },
    postback: { data: "kw:imagemap" },
  });
  // replied อาจเป็น 0 เพราะ token dummy → LINE ตอบ 401; ทดสอบแค่ว่า route ไม่พัง + event ถูก parse
  assert(r.status === 200 && r.json?.events === 1, JSON.stringify(r));
});

await check("wrong signature → 401", async () => {
  const { body } = makeEvent(mk("help"));
  const res = await fetch(`${BASE}/api/webhook`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-line-signature": "bogus" },
    body,
  });
  assert(res.status === 401, `expected 401, got ${res.status}`);
});

await check("LINE testing message (no events) → 200", async () => {
  const body = "LINE testing message";
  const signature = createHmac("sha256", SECRET).update(body).digest("base64");
  const res = await fetch(`${BASE}/api/webhook`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-line-signature": signature },
    body,
  });
  assert(res.status === 200, `expected 200, got ${res.status}`);
});

console.log(fail === 0 ? "\nALL PASSED ✅" : `\n${fail} FAILED ❌`);
process.exit(fail === 0 ? 0 : 1);
