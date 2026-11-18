import type { NextRequest } from "next/server";
import { verifyLineSignature, replyMessages, type WebhookBody } from "@/lib/line";
import { buildReply } from "@/lib/rules";
import { resolveBaseUrl } from "@/lib/base-url";
import type { ExampleContext } from "@/lib/examples/types";

/**
 * LINE OA Webhook endpoint
 * ตั้ง URL นี้ (https://<app>.vercel.app/api/webhook) ใน LINE Developers → Messaging API
 */

export async function POST(request: NextRequest) {
  const rawBody = await request.text();

  const secret = process.env.LINE_CHANNEL_SECRET?.trim();
  const signature = request.headers.get("x-line-signature");

  // 1) ตรวจลายเซ็น (ข้ามได้เฉพาะตอน dev ที่ยังไม่มี secret — production ต้องมี)
  if (secret) {
    const valid = signature !== null && (await verifyLineSignature(rawBody, signature, secret));
    if (!valid) {
      return new Response("invalid signature", { status: 401 });
    }
  } else if (process.env.NODE_ENV === "production") {
    return new Response("server misconfigured (LINE_CHANNEL_SECRET missing)", { status: 500 });
  } else {
    console.warn("[webhook] LINE_CHANNEL_SECRET ไม่ถูกตั้ง — ข้ามการตรวจ signature (เฉพาะ dev)");
  }

  // 2) parse events — "LINE testing message" จากปุ่ม Verify ต้องได้ 200 เสมอ
  if (rawBody === "LINE testing message") {
    return Response.json({ ok: true, ping: true });
  }

  let payload: WebhookBody;
  try {
    payload = JSON.parse(rawBody) as WebhookBody;
  } catch {
    return new Response("invalid json", { status: 400 });
  }

  if (!Array.isArray(payload.events)) {
    return Response.json({ ok: true, events: 0 }); // "LINE testing message" ก็มาตรงนี้
  }

  // 3) compose reply แล้วส่งทันที (replyToken มีอายุสั้นมาก)
  // URL สำหรับ media ต้องเป็น https — resolveBaseUrl的信任 x-forwarded-proto บน Vercel
  const ctx: ExampleContext = { baseUrl: resolveBaseUrl(request) };

  const results: unknown[] = [];
  for (const event of payload.events) {
    const messages = buildReply(event, ctx);
    if (!messages || !event.replyToken) continue;
    const res = await replyMessages(event.replyToken, messages);
    results.push({ type: event.type, ok: res.ok, status: res.status, err: res.ok ? null : res.body.slice(0, 300) });
  }

  console.log(`[webhook] events=${payload.events.length} ok=${results.filter((r) => (r as { ok: boolean }).ok).length}`, JSON.stringify(results));
  return Response.json({ ok: true, baseUrl: ctx.baseUrl, events: payload.events.length, results });
}

/** GET สำหรับเช็คสถานะแบบเร็ว (ไม่ใช่ส่วนหนึ่งของ LINE) — baseUrl บอกว่า media URL จะถูกสร้างเป็นอะไร */
export async function GET(request: NextRequest) {
  return Response.json({
    ok: true,
    name: "line-oa-showcase webhook",
    signatureCheck: Boolean(process.env.LINE_CHANNEL_SECRET?.trim()),
    accessToken: Boolean(process.env.LINE_CHANNEL_ACCESS_TOKEN?.trim()),
    baseUrl: resolveBaseUrl(request),
  });
}
