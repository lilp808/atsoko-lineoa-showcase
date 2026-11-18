import type { LineMessage } from "@/lib/line";
import type { ExampleContext } from "./types";

/**
 * Type `imagemap` — Image Map (Rich) Message:
 * one big 1040x1300 image whose "zones" trigger different actions
 * (message / postback / URI). Image: public/images/rich.png — zones baked into the artwork.
 */
export function buildImagemap(ctx: ExampleContext): LineMessage[] {
  return [
    {
      type: "imagemap",
      baseUrl: `${ctx.baseUrl}/images/rich.png`,
      altText: "Imagemap sample — tap each zone for a different action",
      baseSize: { width: 1040, height: 1300 },
      actions: [
        // gold band (top) -> message action
        {
          type: "message",
          text: "flex",
          label: "Zone 1: show Flex Message",
          area: { type: "rectangle", x: 0, y: 0, width: 1040, height: 260 },
        },
        // blue band -> postback
        {
          type: "postback",
          data: "kw:quick",
          displayText: "Show me Quick Reply",
          label: "Zone 2: show Quick Reply (postback)",
          area: { type: "rectangle", x: 0, y: 260, width: 1040, height: 260 },
        },
        // dark cell (right) -> URI
        {
          type: "uri",
          uri: "https://atsoko.com",
          label: "Zone 3: open website (URI)",
          area: { type: "rectangle", x: 520, y: 520, width: 520, height: 260 },
        },
        // circle (bottom-left) -> message
        {
          type: "message",
          text: "template",
          label: "Zone 4: show Templates",
          area: { type: "circle", x: 260, y: 910, radius: 250 },
        },
        // orange block (bottom-right) -> postback
        {
          type: "postback",
          data: "imagemap:last",
          displayText: "Zone 5 tapped",
          label: "Zone 5: test postback",
          area: { type: "rectangle", x: 520, y: 1170, width: 520, height: 130 },
        },
      ],
    },
  ];
}
