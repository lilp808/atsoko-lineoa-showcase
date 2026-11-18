import type { LineMessage } from "@/lib/line";
import type { ExampleContext } from "./types";

/**
 * พิมพ์ `template` — Template Messages (แบบเก่าที่ยังนิยม):
 * ส่ง 3 ข้อความ: Buttons → Confirm → Image Carousel
 */
export function buildTemplates(ctx: ExampleContext): LineMessage[] {
  return [
    // 1) Buttons template
    {
      type: "template",
      altText: "ตัวอย่าง Buttons Template",
      template: {
        type: "buttons",
        thumbnailImageUrl: `${ctx.baseUrl}/images/demo.png`,
        title: "Buttons Template",
        text: "การ์ด + ปุ่มด้านล่าง กดได้เลย (ปุ่มแบบ thumbnail ได้สูงสุด 4 ปุ่ม)",
        actions: [
          { type: "message", label: "ส่งข้อความ", text: "quick" },
          { type: "postback", label: "Postback", data: "kw:flex", text: "ขอดู Flex" },
          { type: "uri", label: "เปิดเว็บ ATSOKO", uri: "https://atsoko.com" },
          {
            type: "datetimepicker",
            label: "เลือกเวลา",
            data: "dt:template",
            mode: "datetime",
            initial: "2026-11-18T13:00",
          },
        ],
      },
    },
    // 2) Confirm template
    {
      type: "template",
      altText: "ตัวอย่าง Confirm Template",
      template: {
        type: "confirm",
        text: "Confirm Template — ถามเพื่อยืนยัน (ได้สูงสุด 2 ปุ่ม)",
        actions: [
          { type: "postback", label: "✅ ใช่", data: "confirm:yes" },
          { type: "message", label: "❌ ไม่ใช่", text: "confirm-no" },
        ],
      },
    },
    // 3) Image carousel template
    {
      type: "template",
      altText: "ตัวอย่าง Image Carousel Template",
      template: {
        type: "image_carousel",
        columns: [
          {
            imageUrl: `${ctx.baseUrl}/images/demo-card.png`,
            action: { type: "message", label: "สินค้า A", text: "เลือกสินค้า A" },
          },
          {
            imageUrl: `${ctx.baseUrl}/images/demo-card-2.png`,
            action: { type: "uri", label: "สินค้า B", uri: "https://atsoko.com" },
          },
          {
            imageUrl: `${ctx.baseUrl}/images/demo-card-3.png`,
            action: { type: "postback", label: "สินค้า C", data: "kw:imagemap", text: "ขอดู Imagemap" },
          },
        ],
      },
    },
  ];
}
