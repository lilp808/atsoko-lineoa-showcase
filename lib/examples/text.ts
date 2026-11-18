import type { LineMessage } from "@/lib/line";
import type { ExampleContext } from "./types";

/** Type `text` — basic message: newlines, emoji, auto-linked URLs */
export function buildText(ctx: ExampleContext): LineMessage[] {
  void ctx;
  return [
    {
      type: "text",
      text: [
        "📝 Basic Text Message",
        "",
        "• New lines with \\n",
        "• Emoji work out of the box 🎉🙏✨",
        "• Up to 5,000 characters (2,500 when it contains links)",
        "",
        "Links are tappable right in chat: https://atsoko.com",
      ].join("\n"),
    },
  ];
}
