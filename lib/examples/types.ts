import type { LineMessage } from "@/lib/line";

export interface ExampleContext {
  /** origin ของเว็บ ใช้ประกอบ URL รูป/วิดีโอ ให้ LINE ดึงไปได้ (เช่น https://app.vercel.app) */
  baseUrl: string;
}

export type PreviewKind =
  | "help"
  | "text"
  | "flex"
  | "carousel"
  | "quick"
  | "combo"
  | "template"
  | "imagemap"
  | "media"
  | "sticker"
  | "location";

export interface MessageExample {
  id: string;
  keyword: string;
  aliases: string[];
  category: string;
  title: string;
  description: string;
  note?: string;
  preview: PreviewKind;
  build: (ctx: ExampleContext) => LineMessage[];
}

export const GOLD = "#D4A84B";
export const GOLD_DARK = "#9C7C34";
export const TEXT_MAIN = "#111827";
export const TEXT_MUTED = "#6B7280";
