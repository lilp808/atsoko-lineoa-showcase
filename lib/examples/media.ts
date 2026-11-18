import type { LineMessage } from "@/lib/line";
import type { ExampleContext } from "./types";

/** Type `media` — Image / Video / Audio in one reply (LINE allows max 5 messages per reply) */
export function buildMedia(ctx: ExampleContext): LineMessage[] {
  return [
    {
      type: "text",
      text: "Here are all three media types in a single reply (5 messages = LINE's per-reply ceiling)\n🖼 URLs must be HTTPS, publicly reachable, and never redirect",
    },
    {
      type: "image",
      originalContentUrl: `${ctx.baseUrl}/images/demo.png`,
      previewImageUrl: `${ctx.baseUrl}/images/demo.png`,
    },
    {
      type: "video",
      originalContentUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
      previewImageUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerJoyrides.jpg",
    },
    {
      type: "audio",
      originalContentUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      duration: 372000,
    },
    {
      type: "text",
      text: "📌 Recap: image (jpg/png ≤10MB) · video (mp4 ≤200MB + cover jpg/png) · audio (mp3/m4a ≤30MB)\nLINE caches the file at first send — to update it, use a new URL",
    },
  ];
}

/** Type `sticker` — official sticker + plan notes */
export function buildSticker(ctx: ExampleContext): LineMessage[] {
  void ctx;
  return [
    { type: "sticker", packageId: "11537", stickerId: "52002738" },
    {
      type: "text",
      text: "☝️ That's an official sticker from a free pack (packageId 11537 — Brown & Cony) — usable on every plan\n\nNote: custom stickers (LINE Creators Market) require a paid plan.",
    },
  ];
}

/** Type `location` — Location message + quickReply confirmation */
export function buildLocation(ctx: ExampleContext): LineMessage[] {
  return [
    {
      type: "location",
      title: "ATSOKO HQ 📍",
      address: "Bangkok, Thailand",
      latitude: 13.7466,
      longitude: 100.541,
      quickReply: {
        items: [
          { type: "bubble", action: { type: "message", label: "Correct ✅", text: "yes" } },
          { type: "bubble", action: { type: "postback", label: "Not quite ❌", data: "confirm:no", text: "Not quite right" } },
        ],
      },
    },
    {
      type: "text",
      text: "A Location message renders a mini map right in the chat — tapping it opens the pin in the map app.\nNote: quickReply can attach to location messages too 👆",
    },
  ];
}
