import type { LineMessage } from "@/lib/line";
import type { ExampleContext } from "./types";

/**
 * พิมพ์ `imagemap` — Image Map (Rich) Message:
 * ภาพใหญ่ 1040x1300 แล้วกำหนด "โซน" ให้กดได้ (message / postback / URI / แตะดูวิดีโอ)
 * ภาพ: public/images/rich.png — โซนตามภาพออกแบบไว้แล้ว
 */
export function buildImagemap(ctx: ExampleContext): LineMessage[] {
  return [
    {
      type: "imagemap",
      baseUrl: `${ctx.baseUrl}/images/rich.png`,
      altText: "ตัวอย่าง Imagemap — กดแต่ละโซนเพื่อดู action ต่าง ๆ",
      baseSize: { width: 1040, height: 1300 },
      actions: [
        // แถบทองด้านบน → ส่งข้อความ (message action)
        {
          type: "message",
          text: "flex",
          label: "โซนที่ 1: ดู Flex Message",
          area: { type: "rectangle", x: 0, y: 0, width: 1040, height: 260 },
        },
        // แถบน้ำเงิน → postback
        {
          type: "postback",
          data: "kw:quick",
          displayText: "ขอดู Quick Reply",
          label: "โซนที่ 2: ดู Quick Reply (postback)",
          area: { type: "rectangle", x: 0, y: 260, width: 1040, height: 260 },
        },
        // ช่องขวา → URI เปิดเว็บ
        {
          type: "uri",
          uri: "https://atsoko.com",
          label: "โซนที่ 3: เปิดเว็บไซต์ (URI)",
          area: { type: "rectangle", x: 520, y: 520, width: 520, height: 260 },
        },
        // ช่องซ้ายล่าง → circular area ส่งข้อความ
        {
          type: "message",
          text: "template",
          label: "โซนที่ 4: ดู Templates",
          area: { type: "circle", x: 260, y: 910, radius: 250 },
        },
        // ขวาล่าง → datetimepicker ไม่ได้ใน imagemap ใช้ postback แทน
        {
          type: "postback",
          data: "imagemap:last",
          displayText: "โซนสุดท้าย",
          label: "โซนที่ 5: postback ทดสอบ",
          area: { type: "rectangle", x: 520, y: 1170, width: 520, height: 130 },
        },
      ],
    },
  ];
}
