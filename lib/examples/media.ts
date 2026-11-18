import type { LineMessage } from "@/lib/line";
import type { ExampleContext } from "./types";

/** พิมพ์ `media` — Media messages: image / video / audio (reply ส่งได้สูงสุด 5 ข้อความ) */
export function buildMedia(ctx: ExampleContext): LineMessage[] {
  return [
    {
      type: "text",
      text: "นี่คือตัวอย่าง media ครบ 3 ชนิดใน reply เดียว (5 ข้อความ = เพดานสูงสุดของ LINE)\n🖼 URL ต้องเป็น HTTPS เข้าถึงจากภายนอกได้ และห้าม redirect",
    },
    {
      type: "image",
      originalContentUrl: `${ctx.baseUrl}/images/demo.png`,
      previewImageUrl: `${ctx.baseUrl}/images/demo.png`,
    },
    {
      type: "video",
      originalContentUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
      previewImageUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerJoyrides.jpg",
    },
    {
      type: "audio",
      originalContentUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      duration: 372000,
    },
    {
      type: "text",
      text: "📌 สรุป: image (jpg/png ≤10MB) · video (mp4 ≤200MB + cover) · audio (mp3/m4a ≤30MB)\nLINE cache ไฟล์มีเดียครั้งแรกที่ส่ง — เปลี่ยนไฟล์ต้องเปลี่ยน URL",
    },
  ];
}

/** พิมพ์ `sticker` — Official sticker (ใช้ได้ทั้ง 2 message เดี่ยวและต่อท้ายข้อความ) */
export function buildSticker(ctx: ExampleContext): LineMessage[] {
  void ctx;
  return [
    { type: "sticker", packageId: "11537", stickerId: "52002738" },
    {
      type: "text",
      text: "☝️ Official sticker จากแพ็กฟรี (packageId 11537 — Brown & Cony) ไม่ต้องซื้อสติกเกอร์ก็ใช้เป็นตัวอย่างได้\n\nข้อจำกัด: custom sticker (LINE Creators Market) ใช้ได้เฉพาะแพลน Pro ขึ้นไป",
    },
  ];
}

/** พิมพ์ `location` — Location message + quick reply ต่อ */
export function buildLocation(ctx: ExampleContext): LineMessage[] {
  return [
    {
      type: "location",
      title: "ATSOKO HQ 📍",
      address: "กรุงเทพมหานคร ประเทศไทย",
      latitude: 13.7466,
      longitude: 100.541,
      quickReply: {
        items: [
          { type: "bubble", action: { type: "message", label: "ถูกที่นี้ ✅", text: "yes" } },
          { type: "bubble", action: { type: "postback", label: "ไม่ถูก ❌", data: "confirm:no", text: "ไม่ถูกค่ะ" } },
        ],
      },
    },
    {
      type: "text",
      text: "Location message แสดง map ย่อในแชท กดแล้วเปิดหมุดบนแผนที่ได้ (note: quickReply แนบกับ location ได้ด้วย 👆)",
    },
  ];
}
