/**
 * LINE Messaging API helpers — ไม่มี SDK, ใช้ fetch + Web Crypto ตรง ๆ
 * Docs: https://developers.line.biz/en/reference/messaging-api/
 * (Node.js runtime เป็นค่าเริ่มต้นของ Next 16 — crypto.subtle ใช้ได้)
 */

// ---------------------------------------------------------------------------
// Types (subset ที่พอใช้กับตัวอย่างในโปรเจกต์นี้)
// ---------------------------------------------------------------------------

export type LineAction =
  | { type: "message"; label: string; text: string }
  | { type: "postback"; label: string; data: string; text?: string }
  | { type: "uri"; label: string; uri: string; altUri?: { desktop: string } }
  | { type: "clipboard"; label: string; text: string }
  | {
      type: "datetimepicker";
      label: string;
      data: string;
      mode: "date" | "time" | "datetime";
      min?: string;
      max?: string;
      initial?: string;
    };

export interface QuickReplyItem {
  type: "bubble";
  action: LineAction | { type: "camera" | "cameraRoll" | "location" };
  color?: string;
}

export interface QuickReply {
  items: QuickReplyItem[];
}

export interface TextMessage {
  type: "text";
  text: string;
  quickReply?: QuickReply;
}

export interface ImageMessage {
  type: "image";
  originalContentUrl: string;
  previewImageUrl: string;
  quickReply?: QuickReply;
}

export interface VideoMessage {
  type: "video";
  originalContentUrl: string;
  previewImageUrl: string;
}

export interface AudioMessage {
  type: "audio";
  originalContentUrl: string;
  duration?: number;
}

export interface StickerMessage {
  type: "sticker";
  packageId: string;
  stickerId: string;
}

export interface LocationMessage {
  type: "location";
  title: string;
  address: string;
  latitude: number;
  longitude: number;
  quickReply?: QuickReply;
}

export interface FlexMessage {
  type: "flex";
  altText: string;
  contents: unknown; // BubbleContainer | CarouselContainer
}

export interface TemplateMessage {
  type: "template";
  altText: string;
  template: unknown; // ButtonsTemplate | ConfirmTemplate | ImageCarouselTemplate ...
}

export interface ImagemapMessage {
  type: "imagemap";
  baseUrl: string;
  altText: string;
  baseSize: { width: number; height: number };
  video?: {
    previewUrl: string;
    area: { type: "rectangle"; x: number; y: number; width: number; height: number };
  };
  actions: unknown[];
}

export type LineMessage =
  | TextMessage
  | ImageMessage
  | VideoMessage
  | AudioMessage
  | StickerMessage
  | LocationMessage
  | FlexMessage
  | TemplateMessage
  | ImagemapMessage;

// ---------------------------------------------------------------------------
// Webhook payload
// ---------------------------------------------------------------------------

export interface WebhookEvent {
  type: string; // "message" | "postback" | "follow" | "join" | "leave" | "unfollow" | "beacon" | ...
  replyToken?: string;
  source?: { type: string; userId?: string; groupId?: string; roomId?: string };
  message?: { type: string; text?: string; id?: string };
  postback?: { data: string };
  params?: { type: "date" | "time" | "datetime"; date?: string; time?: string }[]; // datetime picker result in postback.params
}

export interface WebhookBody {
  destination: string;
  events: WebhookEvent[];
}

// ---------------------------------------------------------------------------
// Signature verification (X-Line-Signature)
// ---------------------------------------------------------------------------

/**
 * ตรวจ HMAC-SHA256 ของ raw body ด้วย Channel Access Token Secret
 * signature = base64(HMAC_SHA256(body, secret))
 */
export async function verifyLineSignature(
  rawBody: string,
  signature: string,
  channelSecret: string,
): Promise<boolean> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(channelSecret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const mac = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(rawBody));
  const expected = Buffer.from(mac).toString("base64");

  // timing-safe compare
  if (expected.length !== signature.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) {
    diff |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
  }
  return diff === 0;
}

// ---------------------------------------------------------------------------
// API calls
// ---------------------------------------------------------------------------

const LINE_API = "https://api.line.me/v2/bot";

async function lineFetch(path: string, payload: unknown): Promise<{ ok: boolean; status: number; body: string }> {
  const token = process.env.LINE_CHANNEL_ACCESS_TOKEN?.trim();
  if (!token) {
    console.error("[line] LINE_CHANNEL_ACCESS_TOKEN is not set");
    return { ok: false, status: 0, body: "missing token" };
  }
  try {
    const res = await fetch(`${LINE_API}${path}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const text = await res.text().catch(() => "");
    if (!res.ok) {
      console.error(`[line] ${path} failed: ${res.status} ${text}`);
    }
    return { ok: res.ok, status: res.status, body: text };
  } catch (err) {
    console.error(`[line] ${path} network error:`, err);
    return { ok: false, status: 0, body: String(err) };
  }
}

/** ตอบกลับด้วย replyToken (ใช้ฟรี ไม่กินโควตา push, แต่มีอายุสั้นมาก — ต้องส่งทันทีใน webhook) */
export function replyMessages(replyToken: string, messages: LineMessage[]) {
  return lineFetch("/message/reply", { replyToken, messages });
}/** ส่งแบบ push (กินโควตา, ใช้เมื่อไม่มี replyToken เช่นตอบช้า/ส่งหาเอง) */
export function pushMessages(to: string, messages: LineMessage[]) {
  return lineFetch("/message/push", { to, messages });
}
