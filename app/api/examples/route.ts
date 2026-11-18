import type { NextRequest } from "next/server";
import { EXAMPLES } from "@/lib/examples";

/**
 * GET /api/examples — JSON ของทุกตัวอย่าง (raw payload จริงที่บอทจะส่ง)
 * ใช้โดยหน้า catalog บนเว็บ และใช้ debug เวลาอยากร่าง payload ไปลองกับ LINE
 */
export async function GET(request: NextRequest) {
  const origin =
    process.env.NEXT_PUBLIC_BASE_URL ??
    `${request.nextUrl.protocol}//${request.nextUrl.host}`;
  const ctx = { baseUrl: origin.replace(/\/$/, "") };

  return Response.json({
    count: EXAMPLES.length,
    examples: EXAMPLES.map((ex) => ({
      id: ex.id,
      keyword: ex.keyword,
      aliases: ex.aliases,
      category: ex.category,
      title: ex.title,
      description: ex.description,
      note: ex.note ?? null,
      messages: ex.build(ctx),
    })),
  });
}
