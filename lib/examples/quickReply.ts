import type { LineAction, LineMessage } from "@/lib/line";
import type { ExampleContext } from "./types";
import { GOLD } from "./types";

/** helper สร้าง quick-reply bubble chip (สีพื้นทองอ่อนเข้าแบรนด์) */
const chip = (label: string, action: LineAction) => ({
  type: "bubble" as const,
  color: "#FDF6E3",
  action,
});

/** พิมพ์ `quick` — Quick Reply chips เหนือคีย์บอร์ด (message / postback / datetimePicker) */
export function buildQuickReply(ctx: ExampleContext): LineMessage[] {
  void ctx;
  return [
    {
      type: "text",
      text: "⚡ Quick Reply — ชิปที่ขึ้นมาเหนือคีย์บอร์ด แตะแล้วส่งต่อให้บอททันที ลองเลือกดู 👇",
      quickReply: {
        items: [
          chip("ขอบคุณ 🙏", { type: "message", label: "ขอบคุณ 🙏", text: "ขอบคุณค่ะ/ครับ 🙏" }),
          chip("ดู Flex", { type: "postback", label: "ดู Flex", data: "kw:flex", text: "ขอดู Flex ด้วย" }),
          chip("เลือกวันนัด", {
            type: "datetimepicker",
            label: "เลือกวันนัด",
            data: "dt:booking",
            mode: "date",
            initial: "2026-12-01",
            min: "2026-11-18",
            max: "2026-12-31",
          }),
          chip("เปิดเมนู", { type: "message", label: "เปิดเมนู", text: "help" }),
        ],
      },
    },
  ];
}

/** พิมพ์ `combo` — Flex + Quick Reply ในรอบเดียว (ส่ง 2 ข้อความ เพราะ quickReply แนบกับ flex โดยตรงไม่ได้) */
export function buildCombo(ctx: ExampleContext): LineMessage[] {
  return [
    {
      type: "flex",
      altText: "ตัวอย่าง Flex การ์ดเล็ก + Quick Reply ด้านล่าง",
      contents: {
        type: "bubble",
        size: "kilo",
        body: {
          type: "box",
          layout: "vertical",
          spacing: "sm",
          contents: [
            { type: "text", text: "🎯 Combo: Flex + Quick Reply", color: "#111827", size: "md", weight: "bold", wrap: true },
            {
              type: "text",
              text: "quickReply แนบได้กับ text/image/video/audio/location เท่านั้น จึงต้องส่ง textพร้อมชิป เป็นข้อความถัดไป (1 reply ส่งได้สูงสุด 5 ข้อความ)",
              color: "#6B7280",
              size: "xs",
              wrap: true,
            },
            {
              type: "box",
              layout: "horizontal",
              spacing: "md",
              margin: "md",
              contents: [
                {
                  type: "button",
                  style: "primary",
                  color: GOLD,
                  height: "sm",
                  flex: 1,
                  action: { type: "message", label: "ดู carousel", text: "carousel" },
                },
                {
                  type: "button",
                  style: "secondary",
                  height: "sm",
                  flex: 1,
                  action: { type: "message", label: "ดู imagemap", text: "imagemap" },
                },
              ],
            },
          ],
        },
      },
    },
    {
      type: "text",
      text: "👇 แล้วตรงนี้ก็มี Quick Reply ต่อทันที",
      quickReply: {
        items: [
          chip("เอาอีก", { type: "message", label: "เอาอีก", text: "help" }),
          chip("พอแล้ว", { type: "postback", label: "พอแล้ว", data: "combo:stop", text: "พอแล้วครับ" }),
        ],
      },
    },
  ];
}
