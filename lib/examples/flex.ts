import type { LineMessage } from "@/lib/line";
import type { ExampleContext } from "./types";
import { GOLD, GOLD_DARK, TEXT_MAIN, TEXT_MUTED } from "./types";

/** Type `flex` — Flex Bubble: header / hero / body / footer + all four action buttons */
export function buildFlexBubble(ctx: ExampleContext): LineMessage[] {
  return [
    {
      type: "flex",
      altText: "Flex Message sample — ATSOKO showcase card",
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
            { type: "text", text: "Flex Message · a fully custom card", color: "#FDF6E3", size: "xs" },
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
            { type: "text", text: "Flex = a card you design yourself", color: TEXT_MAIN, size: "md", weight: "bold", wrap: true },
            {
              type: "text",
              text: "Stack boxes (vertical / horizontal / baseline), add images, separators, colors and spacing — like laying out a design in Figma",
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
                { type: "text", text: "Price", color: TEXT_MUTED, size: "sm" },
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
              action: { type: "uri", label: "Open ATSOKO website", uri: "https://atsoko.com" },
            },
            {
              type: "button",
              style: "secondary",
              height: "sm",
              action: {
                type: "postback",
                label: "Fire a Postback",
                data: "kw:quick",
                text: "Show me Quick Reply",
              },
            },
            {
              type: "button",
              style: "link",
              height: "sm",
              action: { type: "message", label: "This tap sends: carousel", text: "carousel" },
            },
            {
              type: "button",
              style: "link",
              height: "sm",
              action: { type: "clipboard", label: "Copy code FLEX2026", text: "FLEX2026" },
            },
          ],
        },
      },
    },
  ];
}

/** Type `carousel` — Flex Carousel: several bubbles, swipe left/right */
export function buildFlexCarousel(ctx: ExampleContext): LineMessage[] {
  const items = [
    { name: "Starter", price: "฿ 490", desc: "Basic webhook, keyword replies" },
    { name: "Pro", price: "฿ 1,290", desc: "Flex + Carousel + Quick Reply" },
    { name: "Enterprise", price: "฿ 3,900", desc: "Rich menu + AI replies + reports" },
  ];
  return [
    {
      type: "flex",
      altText: "Flex Carousel sample — 3 package cards",
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
                text: `Package ${["S", "P", "E"][i]}`,
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
                action: { type: "message", label: "I'm interested", text: `Interested in ${it.name}` },
              },
            ],
          },
        })),
      },
    },
  ];
}
