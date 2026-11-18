import type { LineMessage } from "@/lib/line";
import type { ExampleContext } from "./types";

/**
 * Type `template` — Template Messages (the classic set):
 * sends 3 messages: Buttons → Confirm → Image Carousel
 */
export function buildTemplates(ctx: ExampleContext): LineMessage[] {
  return [
    // 1) Buttons template
    {
      type: "template",
      altText: "Buttons Template sample",
      template: {
        type: "buttons",
        thumbnailImageUrl: `${ctx.baseUrl}/images/demo.png`,
        title: "Buttons Template",
        text: "Card + buttons below — tap one (max 4 actions when a thumbnail is shown)",
        actions: [
          { type: "message", label: "Send a message", text: "quick" },
          { type: "postback", label: "Postback", data: "kw:flex", text: "Show me Flex" },
          { type: "uri", label: "Open ATSOKO website", uri: "https://atsoko.com" },
          {
            type: "datetimepicker",
            label: "Pick a time 📅",
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
      altText: "Confirm Template sample",
      template: {
        type: "confirm",
        text: "Confirm Template — a yes/no question (exactly 2 actions)",
        actions: [
          { type: "postback", label: "✅ Yes", data: "confirm:yes" },
          { type: "message", label: "❌ No", text: "confirm-no" },
        ],
      },
    },
    // 3) Image carousel template
    {
      type: "template",
      altText: "Image Carousel Template sample",
      template: {
        type: "image_carousel",
        columns: [
          {
            imageUrl: `${ctx.baseUrl}/images/demo-card.png`,
            action: { type: "message", label: "Item A", text: "I choose item A" },
          },
          {
            imageUrl: `${ctx.baseUrl}/images/demo-card-2.png`,
            action: { type: "uri", label: "Item B", uri: "https://atsoko.com" },
          },
          {
            imageUrl: `${ctx.baseUrl}/images/demo-card-3.png`,
            action: { type: "postback", label: "Item C", data: "kw:imagemap", text: "Show me Imagemap" },
          },
        ],
      },
    },
  ];
}
