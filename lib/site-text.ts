/**
 * ข้อความ UI สำหรับหน้า catalog (TH/EN)
 * หมายเหตุ: เนื้อหาใน bubbles คือ payload จริงที่บอทตอบ (ภาษาไทย) — ไม่แปล
 * แปลเฉพาะโครงหน้า + คำอธิบายตัวอย่าง เพื่อสลับภาษาด้วย ?lang=en
 */

export type Lang = "th" | "en";

export interface UiStrings {
  h1: string;
  sub: string;
  startBtn: string;
  jsonLink: string;
  webhookLink: string;
  setupTitle: string;
  steps: string[];
  typeLabel: (kw: string) => string;
  alsoLabel: string;
  rawLabel: (n: number) => string;
  closeLabel: string;
  copyJsonLabel: string;
  langNote: string;
  langSwitch: string;
  footer: string;
  categories: Record<string, string>;
  examples: Record<string, { title: string; description: string; note?: string }>;
  chat: { you: string; swipeHint: string; input: string; legend: string[] };
}

const CATEGORY_KEYS = ["เมนู", "พื้นฐาน", "มีเดีย", "Flex", "Quick Reply", "Template", "Imagemap"];

export const UI: Record<Lang, UiStrings> = {
  th: {
    h1: "คลังตัวอย่าง Reply Message ของ LINE OA",
    sub: "บอท rule-base บน Next.js + Vercel — พิมพ์ keyword ในแชท LINE แล้วรับตัวอย่างจริงทันที หน้านี้จำลอง preview ให้ดูก่อน พร้อม raw JSON ที่บอทจะส่งจริง",
    startBtn: 'เริ่มที่ LINE: พิมพ์ "help"',
    jsonLink: "GET /api/examples (JSON)",
    webhookLink: "Webhook status",
    setupTitle: "ตั้งค่าให้บอททำงานได้ใน 4 ขั้นตอน",
    steps: [
      "ตั้ง env บน Vercel: LINE_CHANNEL_ACCESS_TOKEN และ LINE_CHANNEL_SECRET",
      "ตั้ง Webhook URL ใน LINE Developers → https://<app>.vercel.app/api/webhook",
      "กด Verify แล้วเปิด Use webhook",
      'ทัก OA แล้วพิมพ์ keyword ด้านล่าง — แนะนำเริ่มจาก "help"',
    ],
    typeLabel: (kw) => `พิมพ์: ${kw}`,
    alsoLabel: "คำสั่งอื่นที่ใช้ได้:",
    rawLabel: (n) => `Raw payload (${n} message)`,
    closeLabel: "▲ ปิด",
    copyJsonLabel: "copy JSON",
    langNote: "หมายเหตุ: ตอนนี้ข้อความที่บอทตอบจริงเป็นภาษาอังกฤษทั้งหมด — preview และ raw JSON ตรงกับ payload จริง",
    langSwitch: "English",
    footer: "สร้างด้วย Next.js + Vercel · rule-based chatbot ตัวอย่างโดย ATSOKO · API docs จริงที่",
    categories: Object.fromEntries(CATEGORY_KEYS.map((c) => [c, c])),
    examples: {},
    chat: {
      you: "คุณ",
      swipeHint: "← ปัดเพื่อดู bubble ถัดไป",
      input: "เพิ่มข้อความ…",
      legend: [
        "▬ แถบทอง (บน) = ส่ง 'flex' (message)",
        "▬ แถวน้ำเงิน = ส่ง 'quick' (message)",
        "▬ ช่องเข้มขวา = URI เปิดเว็บ",
        "◯ วงกลม = ส่ง 'template' (message)",
        "▬ ส้มล่างขวา = postback ทดสอบ",
      ],
    },
  },
  en: {
    h1: "LINE OA Reply Message Showcase",
    sub: "A rule-based bot on Next.js + Vercel — type a keyword in LINE chat and receive the real sample instantly. This page previews each type and shows the exact raw JSON the bot sends.",
    startBtn: 'Start in LINE: type "help"',
    jsonLink: "GET /api/examples (JSON)",
    webhookLink: "Webhook status",
    setupTitle: "Get the bot running in 4 steps",
    steps: [
      "Set env vars on Vercel: LINE_CHANNEL_ACCESS_TOKEN and LINE_CHANNEL_SECRET",
      "Set the Webhook URL in LINE Developers → https://<app>.vercel.app/api/webhook",
      "Click Verify, then turn on Use webhook",
      'Say hi to your OA and type any keyword below — start with "help"',
    ],
    typeLabel: (kw) => `Type: ${kw}`,
    alsoLabel: "Other accepted keywords:",
    rawLabel: (n) => `Raw payload (${n} message${n > 1 ? "s" : ""})`,
    closeLabel: "▲ close",
    copyJsonLabel: "copy JSON",
    langNote: "",
    langSwitch: "ไทย",
    footer: "Built with Next.js + Vercel · rule-based chatbot showcase by ATSOKO · official docs:",
    categories: {
      เมนู: "Menu",
      พื้นฐาน: "Basics",
      มีเดีย: "Media",
      Flex: "Flex",
      "Quick Reply": "Quick Reply",
      Template: "Template",
      Imagemap: "Imagemap",
    },
    examples: {
      help: {
        title: "Welcome + Buttons menu",
        description:
          "Welcome text plus a Buttons template — each button is a message action that literally sends its keyword, so the sample appears instantly.",
      },
      text: {
        title: "Text Message",
        description: "Plain text: line breaks with \\n, emoji, and auto-linked URLs.",
        note: "Max 2,500 characters with a URL / 5,000 without.",
      },
      sticker: {
        title: "Sticker Message",
        description: "Official free sticker pack (package 11537) + how custom stickers work.",
      },
      location: {
        title: "Location Message",
        description: "A map pin with in-chat preview + quickReply chips to confirm the spot.",
      },
      media: {
        title: "Image / Video / Audio",
        description:
          "All three media types in one reply — image hosted on this site, video/audio from public files.",
        note: "Media URLs must be HTTPS with no redirect; LINE caches the file at first send.",
      },
      flex: {
        title: "Flex Bubble",
        description:
          "Fully hand-designed card: header/hero/body/footer with URI, message and clipboard buttons (postback is demoed in the Templates sample).",
      },
      carousel: {
        title: "Flex Carousel",
        description: "Several flex bubbles side by side — swipe left/right (sample: 3 package cards).",
      },
      quick: {
        title: "Quick Reply chips",
        description:
          "Chips above the keyboard: message, postback and datetimePicker (a native date picker pops up).",
      },
      combo: {
        title: "Flex + Quick Reply (2 messages)",
        description:
          "quickReply cannot attach to a flex message directly — the trick is replying with 2 messages on one replyToken.",
      },
      template: {
        title: "Templates full set",
        description: "Sends 3 messages: Buttons → Confirm → Image Carousel (the classic template family).",
      },
      imagemap: {
        title: "Image Map (Rich)",
        description:
          "One 1040×1300 image split into tappable zones — gold band = message, blue band = message, dark cell = URI, circle = message.",
      },
    },
    chat: {
      you: "You",
      swipeHint: "← swipe to see the next bubble",
      input: "Add a message…",
      legend: [
        "▬ Gold band (top) = message 'flex'",
        "▬ Blue band = message 'quick'",
        "▬ Dark cell (right) = URI link",
        "◯ Circle = message 'template'",
        "▬ Orange (bottom-right) = test postback",
      ],
    },
  },
};
