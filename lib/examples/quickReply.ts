import type { LineAction, LineMessage } from "@/lib/line";
import type { ExampleContext } from "./types";
import { GOLD } from "./types";

/** helper: quick-reply bubble chip (soft gold background to match the brand) */
const chip = (label: string, action: LineAction) => ({
  type: "bubble" as const,
  color: "#FDF6E3",
  action,
});

/** Type `quick` — Quick Reply chips above the keyboard (message / postback / datetimePicker) */
export function buildQuickReply(ctx: ExampleContext): LineMessage[] {
  void ctx;
  return [
    {
      type: "text",
      text: "⚡ Quick Reply — chips that appear above the keyboard. Tap one and it's sent straight to the bot 👇",
      quickReply: {
        items: [
          chip("Thank you 🙏", { type: "message", label: "Thank you 🙏", text: "Thank you! 🙏" }),
          chip("See Flex", { type: "postback", label: "See Flex", data: "kw:flex", text: "flex" }),
          chip("Pick a date", {
            type: "datetimepicker",
            label: "📅 Pick a date",
            data: "dt:booking",
            mode: "date",
            initial: "2026-12-01",
            min: "2026-11-18",
            max: "2026-12-31",
          }),
          chip("Open menu", { type: "message", label: "Open menu", text: "help" }),
        ],
      },
    },
  ];
}

/** Type `combo` — Flex + Quick Reply in one reply (2 messages: quickReply can't attach to flex directly) */
export function buildCombo(ctx: ExampleContext): LineMessage[] {
  return [
    {
      type: "flex",
      altText: "Small flex card followed by Quick Reply chips",
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
              text: "quickReply only attaches to text/image/video/audio/location — not to flex. The trick: reply with 2 messages (one reply allows up to 5).",
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
                  action: { type: "message", label: "See carousel", text: "carousel" },
                },
                {
                  type: "button",
                  style: "secondary",
                  height: "sm",
                  flex: 1,
                  action: { type: "message", label: "See imagemap", text: "imagemap" },
                },
              ],
            },
          ],
        },
      },
    },
    {
      type: "text",
      text: "👇 and here come the Quick Reply chips",
      quickReply: {
        items: [
          chip("More", { type: "message", label: "More", text: "help" }),
          chip("That's enough", { type: "postback", label: "That's enough", data: "combo:stop", text: "That's enough, thanks" }),
        ],
      },
    },
  ];
}
