import type { LineMessage } from "@/lib/line";
import type { ExampleContext } from "./types";
import { GOLD, GOLD_DARK, TEXT_MAIN, TEXT_MUTED } from "./types";

/** พิมพ์ `flex` — Flex Message แบบ Bubble: header / hero / body / footer + ปุ่มครบทุก action */
export function buildFlexBubble(ctx: ExampleContext): LineMessage[] {
  return [
    {
      type: "flex",
      altText: "ตัวอย่าง Flex Message — การ์ดสินค้า ATSOKO",
      contents: {
        type: "bubble",
        size: "mega",
        header: {
          type: "box",
          layout: "vertical",
          backgroundColor: GOLD,
          paddingAll: "16px",
          contents: [
            { type: "text", text: "ATSOKO Showcase", color: "#FFFFFF", size: "lg", weight: "bold" },
            { type: "text", text: "Flex Message · ปรับแต่งได้ทั้งใบ", color: "#FDF6E3", size: "xs" },
          ],
        },
        hero: {
          type: "image",
          url: `${ctx.baseUrl}/images/demo.png`,
          size: "full",
          aspectRatio: "16:9",
          aspectMode: "cover",
          backgroundColor: "#F9FAFB",
        },
        body: {
          type: "box",
          layout: "vertical",
          spacing: "md",
          contents: [
            { type: "text", text: "Flex = การ์ดที่ออกแบบเองได้", color: TEXT_MAIN, size: "md", weight: "bold", wrap: true },
            {
              type: "text",
              text: "ซ้อน box (vertical / horizontal / baseline), ใส่ image, separator, สี, ฟอนต์, ระยะห่าง ครบเหมือนทำใน Figma",
              color: TEXT_MUTED,
              size: "sm",
              wrap: true,
            },
            { type: "separator", margin: "lg" },
            {
              type: "box",
              layout: "horizontal",
              margin: "md",
              contents: [
                { type: "text", text: "ค่าบริการ", color: TEXT_MUTED, size: "sm" },
                { type: "filler" },
                { type: "text", text: "฿ 1,290", color: GOLD_DARK, size: "lg", weight: "bold" },
              ],
            },
          ],
        },
        footer: {
          type: "box",
          layout: "vertical",
          spacing: "sm",
          contents: [
            {
              type: "button",
              style: "primary",
              color: GOLD,
              height: "sm",
              action: { type: "uri", label: "เปิดเว็บไซต์ ATSOKO", uri: "https://atsoko.com" },
            },
            {
              type: "button",
              style: "secondary",
              height: "sm",
              action: {
                type: "postback",
                label: "ดันท่า Postback",
                data: "kw:quick",
                text: "ขอตัวอย่าง Quick Reply หน่อย",
              },
            },
            {
              type: "button",
              style: "link",
              height: "sm",
              action: { type: "message", label: "กดแล้วส่งข้อความ 'carousel'", text: "carousel" },
            },
            {
              type: "button",
              style: "link",
              height: "sm",
              action: { type: "clipboard", label: "คัดลอกรหัส FLEX2026", text: "FLEX2026" },
            },
          ],
        },
      },
    },
  ];
}

/** พิมพ์ `carousel` — Flex Carousel: หลาย bubble ปัดขวาได้ */
export function buildFlexCarousel(ctx: ExampleContext): LineMessage[] {
  const items = [
    { name: "Starter", price: "฿ 490", desc: "Webhook พื้นฐาน ตอบ keyword" },
    { name: "Pro", price: "฿ 1,290", desc: "Flex + Carousel + Quick Reply" },
    { name: "Enterprise", price: "฿ 3,900", desc: "Rich menu + AI reply + รายงาน" },
  ];
  return [
    {
      type: "flex",
      altText: "ตัวอย่าง Flex Carousel — แพ็กเกจ 3 รายการ",
      contents: {
        type: "carousel",
        containers: items.map((it, i) => ({
          type: "bubble",
          size: "kilo",
          header: {
            type: "box",
            layout: "vertical",
            backgroundColor: i === 1 ? GOLD : "#FDF6E3",
            paddingAll: "12px",
            contents: [
              {
                type: "text",
                text: `แพ็กเกจ ${["S", "P", "E"][i]}`,
                color: i === 1 ? "#FFFFFF" : GOLD_DARK,
                size: "md",
                weight: "bold",
              },
            ],
          },
          hero: {
            type: "image",
            url: `${ctx.baseUrl}/images/demo-card.png`,
            size: "full",
            aspectRatio: "1:1",
            aspectMode: "cover",
          },
          body: {
            type: "box",
            layout: "vertical",
            spacing: "sm",
            contents: [
              { type: "text", text: it.name, color: TEXT_MAIN, size: "sm", weight: "bold" },
              { type: "text", text: it.price, color: GOLD_DARK, size: "xl", weight: "bold" },
              { type: "text", text: it.desc, color: TEXT_MUTED, size: "xs", wrap: true },
            ],
          },
          footer: {
            type: "box",
            layout: "vertical",
            contents: [
              {
                type: "button",
                style: i === 1 ? "primary" : "secondary",
                color: GOLD,
                height: "sm",
                action: { type: "message", label: "สนใจ", text: `สนใจ${it.name}` },
              },
            ],
          },
        })),
      },
    },
  ];
}
