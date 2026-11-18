import type { LineMessage } from "@/lib/line";
import type { ExampleContext, MessageExample } from "./types";
import { buildText } from "./text";
import { buildFlexBubble, buildFlexCarousel } from "./flex";
import { buildQuickReply, buildCombo } from "./quickReply";
import { buildTemplates } from "./templates";
import { buildImagemap } from "./imagemap";
import { buildMedia, buildSticker, buildLocation } from "./media";

/** help menu — Buttons template linking to every sample (each button sends the keyword) */
export function buildHelp(ctx: ExampleContext): LineMessage[] {
  void ctx;
  return [
    {
      type: "text",
      text: "👋 Welcome to the ATSOKO LINE Showcase!\nThis bot runs on simple keyword rules and replies with *real message samples* you can inspect right in LINE.\n\nType any keyword below or use the menu 👇",
    },
    {
      type: "template",
      altText: "Message samples menu — Flex / Quick Reply / Templates / Imagemap",
      template: {
        type: "buttons",
        title: "Pick a sample to view",
        text: "Tap a button and it sends that keyword to the bot (message action) — you get the sample right away",
        actions: [
          { type: "message", label: "🃏 Flex Message", text: "flex" },
          { type: "message", label: "⚡ Quick Reply", text: "quick" },
          { type: "message", label: "🧱 Templates", text: "template" },
          { type: "message", label: "🗺 Imagemap", text: "imagemap" },
        ],
      },
    },
  ];
}

export const EXAMPLES: MessageExample[] = [
  {
    id: "help",
    keyword: "help",
    aliases: ["เมนู", "menu", "start", "ทักทาย", "สวัสดี", "hi", "hello"],
    category: "เมนู",
    title: "Welcome + Buttons เมนู",
    description: "ข้อความต้อนรับพร้อม Buttons template — ทุกปุ่มเป็น message action ส่ง keyword ตรงๆ ไปรับตัวอย่างทันที",
    preview: "help",
    build: buildHelp,
  },
  {
    id: "text",
    keyword: "text",
    aliases: ["ข้อความ", "ตัวหนังสือ"],
    category: "พื้นฐาน",
    title: "Text Message",
    description: "ข้อความธรรมดา: ขึ้นบรรทัดใหม่ด้วย \\n, emoji, ลิงก์กดได้ทันที",
    note: "ยาวสุด 2,500 ตัวอักษร (ถ้ามี URL) / 5,000 (ไม่มี URL)",
    preview: "text",
    build: buildText,
  },
  {
    id: "sticker",
    keyword: "sticker",
    aliases: ["สติกเกอร์"],
    category: "พื้นฐาน",
    title: "Sticker Message",
    description: "Official sticker ฟรี (package 11537) + อธิบายเงื่อนไข custom sticker",
    preview: "sticker",
    build: buildSticker,
  },
  {
    id: "location",
    keyword: "location",
    aliases: ["โลเคชัน", "ตำแหน่ง", "แผนที่"],
    category: "พื้นฐาน",
    title: "Location Message",
    description: "หมุดตำแหน่งพร้อม preview map ในแชท + quickReply ต่อท้ายเพื่อยืนยันตำแหน่ง",
    preview: "location",
    build: buildLocation,
  },
  {
    id: "media",
    keyword: "media",
    aliases: ["รูป", "วิดีโอ", "เสียง", "image", "video", "audio"],
    category: "มีเดีย",
    title: "Image / Video / Audio",
    description: "ข้อความมีเดียครบ 3 ชนิด — รูปโฮสต์บนเว็บนี้, วิดีโอ/เสียงใช้ไฟล์สาธารณะ",
    note: "URL ต้อง HTTPS, ไม่ redirect, LINE จะ cache รูปไว้ถาวรครั้งแรกที่ส่ง",
    preview: "media",
    build: buildMedia,
  },
  {
    id: "flex",
    keyword: "flex",
    aliases: ["การ์ด", "flex message"],
    category: "Flex",
    title: "Flex Bubble",
    description: "การ์ดออกแบบเอง: header/hero/body/footer ครบ พร้อมปุ่ม URI / message / clipboard (postback มีในตัวอย่าง template)",
    preview: "flex",
    build: buildFlexBubble,
  },
  {
    id: "carousel",
    keyword: "carousel",
    aliases: ["คาราเซล", "flex carousel", "ปัด"],
    category: "Flex",
    title: "Flex Carousel",
    description: "หลาย Flex bubble วางต่อกัน ปัดซ้าย-ขวาได้ (ตัวอย่าง: แพ็กเกจ 3 ใบ)",
    preview: "carousel",
    build: buildFlexCarousel,
  },
  {
    id: "quick",
    keyword: "quick",
    aliases: ["quick reply", "ชิป"],
    category: "Quick Reply",
    title: "Quick Reply chips",
    description: "ชิปเหนือคีย์บอร์ด: message, postback และ datetimePicker (ปฏิทินเลือกวันเด้งขึ้น)",
    preview: "quick",
    build: buildQuickReply,
  },
  {
    id: "combo",
    keyword: "combo",
    aliases: ["flex quick", "คู่"],
    category: "Quick Reply",
    title: "Flex + Quick Reply (2 ข้อความ)",
    description: "quickReply แนบกับ flex ตรง ๆ ไม่ได้ → เทคนิคคือ reply 2 ข้อความต่อ 1 replyToken",
    preview: "combo",
    build: buildCombo,
  },
  {
    id: "template",
    keyword: "template",
    aliases: ["เทมเพลต", "templates", "buttons", "confirm"],
    category: "Template",
    title: "Templates ครบชุด",
    description: "ส่ง 3 ข้อความ: Buttons → Confirm → Image Carousel (template แบบเก่า ใช้งานง่าย)",
    preview: "template",
    build: buildTemplates,
  },
  {
    id: "imagemap",
    keyword: "imagemap",
    aliases: ["imagemap", "emap", "rich image", "ภาพกดได้"],
    category: "Imagemap",
    title: "Image Map (Rich)",
    description: "ภาพใหญ่ 1040×1300 แบ่งโซนกดได้ — แถวทอง/น้ำเงิน/วงกลม ส่ง keyword ตรงๆ, ช่องเข้มขวา เปิดลิงก์, ส้มล่างขวา postback",
    preview: "imagemap",
    build: buildImagemap,
  },
];

/** map keyword/alias (lowercase, trim) → example id */
const KEYWORD_INDEX = new Map<string, string>();
for (const ex of EXAMPLES) {
  KEYWORD_INDEX.set(ex.keyword.toLowerCase(), ex.id);
  for (const a of ex.aliases) KEYWORD_INDEX.set(a.toLowerCase(), ex.id);
}

export function findExampleByKeyword(text: string): MessageExample | undefined {
  const key = text.trim().toLowerCase();
  const id = KEYWORD_INDEX.get(key);
  return id ? EXAMPLES.find((e) => e.id === id) : undefined;
}

export function findExampleById(id: string): MessageExample | undefined {
  return EXAMPLES.find((e) => e.id === id);
}
