import type { LineMessage } from "@/lib/line";
import type { ExampleContext } from "./types";

/** พิมพ์ `text` — ข้อความพื้นฐาน: ขึ้นบรรทัดใหม่, emoji, ลิงก์ (LINE auto-link ให้) */
export function buildText(ctx: ExampleContext): LineMessage[] {
  void ctx;
  return [
    {
      type: "text",
      text: [
        "📝 Text Message พื้นฐาน",
        "",
        "• ขึ้นบรรทัดใหม่ได้ด้วย \\n",
        "• ใส่ emoji ได้เลย 🎉🙏✨",
        "• ส่งได้ยาวสุด 5,000 ตัวอักษร (ไม่มีลิงก์) / 2,500 (มีลิงก์)",
        "",
        "ลิงก์จะกดได้ทันที: https://atsoko.com",
      ].join("\n"),
    },
  ];
}
