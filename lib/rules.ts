import type { LineMessage, WebhookEvent } from "@/lib/line";
import { findExampleById, findExampleByKeyword, EXAMPLES } from "@/lib/examples";
import type { ExampleContext } from "@/lib/examples/types";

/** chip สำรองสำหรับ fallback */
const suggestionChips = (labels: string[]) => ({
  items: labels.map((text) => ({
    type: "bubble" as const,
    action: { type: "message" as const, label: text, text },
  })),
});

/**
 * rule engine หลัก: webhook event → messages ที่จะ reply (null = ไม่ต้องตอบ)
 */
export function buildReply(
  event: WebhookEvent,
  ctx: ExampleContext,
): LineMessage[] | null {
  switch (event.type) {
    case "follow":
      // ทักทายเมื่อแอดเพื่อน
      return EXAMPLES.find((e) => e.id === "help")!.build(ctx);

    case "message": {
      const m = event.message;
      if (!m) return null;

      if (m.type === "text" && m.text) {
        const example = findExampleByKeyword(m.text);
        if (example) return example.build(ctx);

        // keyword อื่น → fallback พร้อมชิปแนะนำ
        return [
          {
            type: "text",
            text: `🤖 (fallback rule) ยังไม่มีคำสั่งสำหรับ "${m.text.trim()}"\n\nพิมพ์ "help" เพื่อดูเมนู หรือแตะชิปด้านล่าง 👇`,
            quickReply: suggestionChips(["help", "flex", "quick", "imagemap"]),
          },
        ];
      }

      // user ส่งมีเดีย/สติกเกอร์/location มา → echo รับ + ชิป help
      const ack: Record<string, string> = {
        image: "📷 รับรูปแล้ว! (webhook ได้ event message.type=image)",
        video: "🎬 รับวิดีโอแล้ว!",
        audio: "🎧 รับเสียงแล้ว!",
        sticker: "🐰 รับสติกเกอร์แล้ว น่ารักดี!",
        location: "📍 รับตำแหน่งแล้ว!",
        file: "📁 รับไฟล์แล้ว!",
      };
      return [
        {
          type: "text",
          text: `${ack[m.type] ?? `รับ ${m.type} แล้ว!`}\n\nลองพิมพ์ "help" เพื่อดูตัวอย่างข้อความชนิดต่าง ๆ 👇`,
          quickReply: suggestionChips(["help", "flex", "template"]),
        },
      ];
    }

    case "postback": {
      const data = event.postback?.data ?? "";

      // kw:<id> → ส่งตัวอย่างตาม id
      if (data.startsWith("kw:")) {
        const example = findExampleById(data.slice(3));
        if (example) return example.build(ctx);
      }

      // dt:<purpose> → user เลือกวัน/เวลาจาก datetimePicker
      if (data.startsWith("dt:")) {
        const p = event.params?.[0];
        const picked =
          p?.type === "date"
            ? `วันที่ ${p.date ?? "?"}`
            : p?.type === "time"
              ? `เวลา ${p.time ?? "?"}`
              : p?.type === "datetime"
                ? `${p.date ?? "?"} ${p.time ?? ""}`.trim()
                : null;
        return [
          {
            type: "text",
            text: picked
              ? `🗓 คุณเลือก ${picked} (ได้รับผ่าน postback.params)\n\nnote: ค่าที่ user เลือกจะไม่อยู่ใน text แต่อยู่ใน postback event`
              : `🗓 ได้รับ postback datetime (${data}) แล้ว`,
            quickReply: suggestionChips(["quick", "help"]),
          },
        ];
      }

      if (data === "confirm:yes") {
        return [
          { type: "text", text: "🙌 จัดให้! นี่ตัวอย่าง Flex Carousel ต่อจาก Confirm →" },
          ...buildPostbackExample("carousel", ctx),
        ];
      }
      if (data === "confirm:no") {
        return [
          {
            type: "text",
            text: "👌 ไม่เป็นไร ไว้พิมพ์ help เมื่อไหร่ก็ได้",
            quickReply: suggestionChips(["help"]),
          },
        ];
      }
      if (data === "combo:stop") {
        return [{ type: "text", text: "จบทัวร์แค่นี้ก่อน 🙏 พิมพ์ help เมื่ออยากชมต่อ" }];
      }
      if (data === "imagemap:last") {
        return [
          {
            type: "text",
            text: "🎯 คุณแตะโซนที่ 5 ของ Imagemap — ทุกโซนส่ง event type=postback/message เข้า webhook เหมือนกดปุ่มปกติ",
          },
        ];
      }

      return [
        {
          type: "text",
          text: `ได้รับ postback data="${data}"\n(rule ยังไม่มี handler สำหรับ data นี้ — แก้ได้ที่ lib/rules.ts)`,
        },
      ];
    }

    default:
      // join / leave / unfollow / beacon → ไม่ต้องตอบ
      return null;
  }
}

function buildPostbackExample(id: string, ctx: ExampleContext): LineMessage[] {
  const ex = findExampleById(id);
  return ex ? ex.build(ctx) : [];
}
