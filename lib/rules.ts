import type { LineMessage, WebhookEvent } from "@/lib/line";
import { findExampleById, findExampleByKeyword, EXAMPLES } from "@/lib/examples";
import type { ExampleContext } from "@/lib/examples/types";

/** suggestion chips used by the fallback reply */
const suggestionChips = (labels: string[]) => ({
  items: labels.map((text) => ({
    type: "bubble" as const,
    action: { type: "message" as const, label: text, text },
  })),
});

/**
 * Main rule engine: webhook event → messages to reply (null = stay silent)
 * All user-facing text is English so the showcase works for any audience.
 */
export function buildReply(
  event: WebhookEvent,
  ctx: ExampleContext,
): LineMessage[] | null {
  switch (event.type) {
    case "follow":
      // welcomed when added as a friend
      return EXAMPLES.find((e) => e.id === "help")!.build(ctx);

    case "message": {
      const m = event.message;
      if (!m) return null;

      if (m.type === "text" && m.text) {
        const lower = m.text.trim().toLowerCase();

        // the Confirm template's "No" button sends this literal text
        if (lower === "confirm-no") {
          return [
            {
              type: "text",
              text: "👌 Got it — the \"No\" button just sends normal text back to the bot.\nType help whenever you want to continue 👇",
              quickReply: suggestionChips(["help", "flex"]),
            },
          ];
        }

        // the "Correct ✅" chip on the location sample sends "yes"
        if (lower === "yes") {
          return [
            {
              type: "text",
              text: "✅ Noted! That chip was a message action — it sends fixed text ('yes') back into the chat, exactly like the user typed it.",
              quickReply: suggestionChips(["help", "media", "imagemap"]),
            },
          ];
        }

        const example = findExampleByKeyword(m.text);
        if (example) return example.build(ctx);

        // unknown keyword → fallback with suggestion chips
        return [
          {
            type: "text",
            text: `🤖 (fallback rule) No command matches "${m.text.trim()}".\n\nType "help" for the menu, or tap a chip 👇`,
            quickReply: suggestionChips(["help", "flex", "quick", "imagemap"]),
          },
        ];
      }

      // user sent media/sticker/location → acknowledge its type + suggest help
      const ack: Record<string, string> = {
        image: "📷 Got your photo! (the webhook received message.type=image)",
        video: "🎬 Got your video!",
        audio: "🎧 Got your voice message!",
        sticker: "🐰 Nice sticker!",
        location: "📍 Got your location!",
        file: "📁 Got your file!",
      };
      return [
        {
          type: "text",
          text: `${ack[m.type] ?? `Received your ${m.type}!`}\n\nType "help" to browse message samples 👇`,
          quickReply: suggestionChips(["help", "flex", "template"]),
        },
      ];
    }

    case "postback": {
      const data = event.postback?.data ?? "";

      // kw:<id> → send the matching sample
      if (data.startsWith("kw:")) {
        const example = findExampleById(data.slice(3));
        if (example) return example.build(ctx);
      }

      // dt:<purpose> → user picked a date/time in the datetimePicker
      if (data.startsWith("dt:")) {
        const p = event.params?.[0];
        const picked =
          p?.type === "date"
            ? `the date ${p.date ?? "?"}`
            : p?.type === "time"
              ? `the time ${p.time ?? "?"}`
              : p?.type === "datetime"
                ? `${p.date ?? "?"} at ${p.time ?? "?"}`
                : null;
        return [
          {
            type: "text",
            text: picked
              ? `🗓 You picked ${picked} — delivered via postback.params.\n\nNote: the chosen value arrives inside the postback event, not as chat text.`
              : `🗓 Received datetime postback (${data}).`,
            quickReply: suggestionChips(["quick", "help"]),
          },
        ];
      }

      if (data === "confirm:yes") {
        return [
          { type: "text", text: "🙌 Here you go — a Flex Carousel, right after the Confirm 👇" },
          ...buildPostbackExample("carousel", ctx),
        ];
      }
      if (data === "confirm:no") {
        return [
          {
            type: "text",
            text: "👌 No worries — type help whenever you're ready",
            quickReply: suggestionChips(["help"]),
          },
        ];
      }
      if (data === "combo:stop") {
        return [{ type: "text", text: "That's a wrap on the tour 🙏 Type help anytime to start over" }];
      }
      if (data === "imagemap:last") {
        return [
          {
            type: "text",
            text: "🎯 You tapped zone 5 of the Imagemap — every zone fires a postback/message event into the webhook, just like a button.",
          },
        ];
      }

      return [
        {
          type: "text",
          text: `Received postback data="${data}".\nNo rule matched this payload yet — add handlers in lib/rules.ts.`,
        },
      ];
    }

    default:
      // join / leave / unfollow / beacon → stay silent
      return null;
  }
}

function buildPostbackExample(id: string, ctx: ExampleContext): LineMessage[] {
  const ex = findExampleById(id);
  return ex ? ex.build(ctx) : [];
}
