import type { ReactNode } from "react";
import type { PreviewKind } from "@/lib/examples/types";

/* ---------------------------------------------------------------
   Mock component จำลองบทแชท LINE สำหรับพรีวิวบนเว็บ
   (ของจริงต้องพิมพ์ keyword ใน LINE — ตัวนี้เป็น simulation)
---------------------------------------------------------------- */

function Frame({ children }: { children: ReactNode }) {
  return (
    <div className="w-[340px] max-w-full rounded-2xl bg-[var(--line-bg)] p-3 shadow-inner">
      <div className="space-y-2.5">{children}</div>
    </div>
  );
}

function BotBubble({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`relative max-w-[88%] ${className}`}>
      <span
        aria-hidden
        className="absolute -left-1.5 top-3 h-0 w-0 border-y-6 border-r-8 border-y-transparent border-r-white"
      />
      <div className="rounded-xl bg-white px-3 py-2 text-[13px] leading-relaxed text-[#020202] shadow-sm">
        {children}
      </div>
    </div>
  );
}

function UserBubble({ children }: { children: ReactNode }) {
  return (
    <div className="ml-auto flex max-w-[80%] flex-col items-end">
      <span className="mb-0.5 text-[10px] font-medium text-[var(--gold-600)]">คุณ</span>
      <div className="rounded-xl bg-[var(--line-green)] px-3 py-2 text-[13px] leading-relaxed text-white shadow-sm">
        {children}
      </div>
    </div>
  );
}

function Chips({ items }: { items: string[] }) {
  return (
    <>
      <div className="flex flex-wrap gap-1.5 pt-1">
        {items.map((c) => (
          <span
            key={c}
            className="rounded-full border border-[var(--line-green)] bg-white px-3 py-1.5 text-[11px] font-medium text-[#020202]"
          >
            {c}
          </span>
        ))}
      </div>
      <div className="rounded-full border border-slate-300 bg-white px-3 py-2 text-[11px] text-slate-400">
        เพิ่มข้อความ…
      </div>
    </>
  );
}

const TBtn = ({ kind, label }: { kind: "primary" | "outline" | "link"; label: string }) => {
  if (kind === "primary")
    return (
      <div className="rounded-md bg-[#06c755] py-1.5 text-center text-[12px] font-medium text-white">
        {label}
      </div>
    );
  if (kind === "link")
    return (
      <div className="py-1 text-center text-[12px] font-medium text-[var(--gold-600)] underline">
        {label}
      </div>
    );
  return (
    <div className="rounded-md border border-[var(--line-green)] py-1.5 text-center text-[12px] font-medium text-[#06c755]">
      {label}
    </div>
  );
};

/* ---------------- per-kind mocks ---------------- */

function TextMock() {
  return (
    <Frame>
      <UserBubble>text</UserBubble>
      <BotBubble>
        <pre className="font-sans whitespace-pre-wrap text-[13px]">
          {"📝 Text Message พื้นฐาน\n\n• ขึ้นบรรทัดใหม่ได้ด้วย \\n\n• ใส่ emoji ได้เลย 🎉🙏✨\n• ส่งได้ยาวสุด 5,000 ตัวอักษร\n\nลิงก์จะกดได้ทันที: https://atsoko.com"}
        </pre>
      </BotBubble>
    </Frame>
  );
}

function HelpMock() {
  return (
    <Frame>
      <BotBubble>
        👋 ยินดีต้อนรับสู่ ATSOKO LINE Showcase! ลองพิมพ์คำเหล่านี้ในแชท หรือกดปุ่มด้านล่าง 👇
      </BotBubble>
      <BotBubble className="max-w-[92%]">
        <div className="mb-1 text-[13px] font-semibold">เลือกตัวอย่างที่จะชม</div>
        <div className="mb-2 text-[11px] text-slate-500">กดปุ่มเพื่อรับตัวอย่างทันที (ทุกปุ่มคือ postback)</div>
        <div className="space-y-1">
          <TBtn kind="outline" label="🃏 Flex Message" />
          <TBtn kind="outline" label="⚡ Quick Reply" />
          <TBtn kind="outline" label="🧱 Templates" />
          <TBtn kind="outline" label="🗺 Imagemap" />
        </div>
      </BotBubble>
    </Frame>
  );
}

function StickerMock() {
  return (
    <Frame>
      <UserBubble>sticker</UserBubble>
      <div className="pl-1 text-6xl leading-none drop-shadow-sm">🐰</div>
      <BotBubble>
        Official sticker จากแพ็กฟรี (packageId 11537) — ใช้ได้ทุกแพลน
      </BotBubble>
    </Frame>
  );
}

function LocationMock() {
  return (
    <Frame>
      <UserBubble>location</UserBubble>
      <BotBubble className="max-w-[80%] overflow-hidden">
        <div className="-mx-3 -mt-2 mb-2 overflow-hidden rounded-t-xl">
          <svg viewBox="0 0 200 110" className="h-24 w-full bg-[#e8eae4]">
            <path d="M0 70 L200 55" stroke="#fff" strokeWidth="7" />
            <path d="M60 0 L80 110" stroke="#fff" strokeWidth="6" />
            <path d="M0 20 L200 30" stroke="#fff" strokeWidth="4" />
            <circle cx="80" cy="58" r="8" fill="var(--gold-400)" />
            <path d="M80 50 l-4 8 h8 z" fill="#483a19" transform="rotate(180 80 56)" />
          </svg>
        </div>
        <div className="text-[13px] font-semibold">ATSOKO HQ 📍</div>
        <div className="text-[11px] text-slate-500">กรุงเทพมหานคร ประเทศไทย</div>
        <div className="mt-1.5 border-t border-slate-100 pt-1 text-[11px] text-[var(--line-green)]">
          📍 ดูแผนที่ขนาดใหญ่
        </div>
      </BotBubble>
      <Chips items={["ถูกที่นี้ ✅", "ไม่ถูก ❌"]} />
    </Frame>
  );
}

function MediaMock() {
  return (
    <Frame>
      <UserBubble>media</UserBubble>
      <BotBubble>🖼 Image message (ต้องเป็น URL ที่ LINE เข้าถึงได้)</BotBubble>
      <BotBubble className="max-w-[80%] overflow-hidden">
        <img src="/images/demo.png" alt="ตัวอย่าง" className="-mx-3 -my-2 w-full" />
      </BotBubble>
      <BotBubble>🎬 Video message</BotBubble>
      <BotBubble className="max-w-[80%] overflow-hidden">
        <div className="relative -mx-3 -my-2 flex h-28 items-center justify-center bg-[#111827]">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-sm">▶</span>
          <span className="absolute bottom-1.5 right-2 text-[10px] text-white/80">0:15</span>
        </div>
      </BotBubble>
      <BotBubble className="max-w-[70%]">
        <div className="-my-2 flex items-center gap-2">
          <span className="text-[var(--line-green)]">▶</span>
          <div className="flex h-8 flex-1 items-center gap-0.5">
            {[3, 6, 9, 12, 8, 5, 10, 14, 7, 4, 9, 6, 3, 8].map((v, i) => (
              <span key={i} className="w-1 rounded bg-slate-300" style={{ height: v * 2 }} />
            ))}
          </div>
          <span className="text-[10px] text-slate-400">6:12</span>
        </div>
      </BotBubble>
    </Frame>
  );
}

function FlexMock() {
  return (
    <Frame>
      <UserBubble>flex</UserBubble>
      <div className="w-[240px] overflow-hidden rounded-xl bg-white text-[#020202] shadow-sm">
        <div className="bg-[var(--gold-400)] px-3 py-2.5">
          <div className="text-[13px] font-semibold text-white">ATSOKO Showcase</div>
          <div className="text-[10px] text-[var(--gold-50)]">Flex Message · ปรับแต่งได้ทั้งใบ</div>
        </div>
        <img src="/images/demo.png" alt="" className="aspect-video w-full object-cover" />
        <div className="space-y-1.5 px-3 py-2.5">
          <div className="text-[12px] font-semibold">Flex = การ์ดที่ออกแบบเองได้</div>
          <div className="text-[11px] leading-snug text-slate-500">
            ซ้อน box (vertical / horizontal), ใส่ image, separator, สี — เหมือนทำใน Figma
          </div>
          <div className="my-1 border-t border-slate-100" />
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-500">ค่าบริการ</span>
            <span className="text-[14px] font-semibold text-[var(--gold-500)]">฿ 1,290</span>
          </div>
        </div>
        <div className="space-y-1.5 border-t border-slate-100 px-3 py-2.5">
          <div className="rounded-md bg-[var(--gold-400)] py-1.5 text-center text-[11px] font-medium text-white">
            เปิดเว็บไซต์ ATSOKO
          </div>
          <div className="rounded-md border border-slate-300 py-1.5 text-center text-[11px] font-medium">
            ดันท่า Postback
          </div>
          <div className="py-0.5 text-center text-[11px] font-medium text-[var(--gold-600)] underline">
            กดแล้วส่งข้อความ 'carousel'
          </div>
          <div className="py-0.5 text-center text-[11px] font-medium text-[var(--gold-600)] underline">
            คัดลอกรหัส FLEX2026
          </div>
        </div>
      </div>
    </Frame>
  );
}

function CarouselMock() {
  const items = [
    { n: "แพ็กเกจ S", name: "Starter", price: "฿ 490", hot: false },
    { n: "แพ็กเกจ P", name: "Pro", price: "฿ 1,290", hot: true },
    { n: "แพ็กเกจ E", name: "Enterprise", price: "฿ 3,900", hot: false },
  ];
  return (
    <Frame>
      <UserBubble>carousel</UserBubble>
      <div className="flex gap-2 overflow-x-auto pb-2 pr-6">
        {items.map((it) => (
          <div key={it.n} className="w-[150px] shrink-0 overflow-hidden rounded-xl bg-white shadow-sm">
            <div
              className={`px-2.5 py-2 text-[11px] font-semibold ${
                it.hot ? "bg-[var(--gold-400)] text-white" : "bg-[var(--gold-50)] text-[var(--gold-600)]"
              }`}
            >
              {it.n}
            </div>
            <img src="/images/demo-card.png" alt="" className="aspect-square w-full object-cover" />
            <div className="space-y-0.5 px-2.5 py-2">
              <div className="text-[10px] font-semibold">{it.name}</div>
              <div className="text-[13px] font-semibold text-[var(--gold-500)]">{it.price}</div>
              <div className="rounded-md bg-[var(--gold-400)] py-1 text-center text-[10px] font-medium text-white">
                สนใจ
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="pl-1 text-[10px] text-slate-400">← ปัดเพื่อดู bubble ถัดไป</div>
    </Frame>
  );
}

function QuickMock() {
  return (
    <Frame>
      <UserBubble>quick</UserBubble>
      <BotBubble>⚡ Quick Reply — ชิปที่ขึ้นมาเหนือคีย์บอร์ด แตะแล้วส่งต่อให้บอททันที 👇</BotBubble>
      <Chips items={["ขอบคุณ 🙏", "ดู Flex", "📅 เลือกวันนัด", "เปิดเมนู"]} />
    </Frame>
  );
}

function ComboMock() {
  return (
    <Frame>
      <UserBubble>combo</UserBubble>
      <div className="w-[220px] rounded-xl bg-white px-3 py-2.5 shadow-sm">
        <div className="text-[12px] font-semibold">🎯 Combo: Flex + Quick Reply</div>
        <div className="mt-1 text-[10px] leading-snug text-slate-500">
          quickReply แนบกับ flex ตรง ๆ ไม่ได้ → reply 2 ข้อความต่อกันแทน
        </div>
      </div>
      <BotBubble>👇 แล้วตรงนี้ก็มี Quick Reply ต่อทันที</BotBubble>
      <Chips items={["เอาอีก", "พอแล้ว"]} />
    </Frame>
  );
}

function TemplateMock() {
  return (
    <Frame>
      <UserBubble>template</UserBubble>
      <BotBubble className="max-w-[92%] overflow-hidden">
        <img src="/images/demo.png" alt="" className="-mx-3 -mt-2 mb-2 w-[calc(100%+24px)]" />
        <div className="text-[13px] font-semibold">Buttons Template</div>
        <div className="mb-2 text-[11px] text-slate-500">การ์ด + ปุ่มด้านล่าง (มี thumbnail ได้สูงสุด 4 ปุ่ม)</div>
        <div className="space-y-1">
          <TBtn kind="primary" label="ส่งข้อความ" />
          <TBtn kind="outline" label="Postback" />
          <TBtn kind="outline" label="เปิดเว็บ ATSOKO" />
          <TBtn kind="outline" label="เลือกเวลา 📅" />
        </div>
      </BotBubble>
      <BotBubble className="max-w-[92%]">
        <div className="mb-2 text-[12px]">Confirm Template — ถามเพื่อยืนยัน</div>
        <div className="flex gap-1.5">
          <div className="flex-1 rounded-md bg-[#06c755] py-1.5 text-center text-[12px] font-medium text-white">✅ ใช่</div>
          <div className="flex-1 rounded-md border border-[#06c755] py-1.5 text-center text-[12px] font-medium text-[#06c755]">
            ❌ ไม่ใช่
          </div>
        </div>
      </BotBubble>
      <div className="flex gap-2 overflow-x-auto pb-1 pr-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="relative shrink-0">
            <img src={`/images/demo-card${i === 1 ? "" : `-${i}`}.png`} alt="" className="h-20 w-20 rounded-md" />
            <span className="absolute inset-x-0 bottom-0 rounded-b-md bg-white/90 py-0.5 text-center text-[9px] font-medium">
              สินค้า {["A", "B", "C"][i - 1]}
            </span>
          </div>
        ))}
      </div>
    </Frame>
  );
}

function ImagemapMock() {
  return (
    <Frame>
      <UserBubble>imagemap</UserBubble>
      <div className="relative w-[280px] overflow-hidden rounded-xl shadow-sm">
        <img src="/images/rich.png" alt="imagemap demo" className="w-full" />
        <span className="absolute left-0 top-0 w-full border-2 border-dashed border-white/80" style={{ height: "20%" }} />
        <span className="absolute left-0 w-full border-2 border-dashed border-white/80" style={{ top: "20%", height: "20%" }} />
        <span className="absolute border-2 border-dashed border-white/80" style={{ left: "50%", top: "40%", width: "50%", height: "20%" }} />
        <span className="absolute rounded-full border-2 border-dashed border-white/80" style={{ left: "1%", top: "51%", width: "48%", height: "38%" }} />
        <span className="absolute border-2 border-dashed border-white" style={{ left: "50%", top: "90%", width: "50%", height: "10%" }} />
      </div>
      <div className="space-y-0.5 pl-1 text-[10px] leading-relaxed text-slate-500">
        <div>▬ แถบทอง (บน) = message "flex"</div>
        <div>▬ แถวน้ำเงิน = postback → Quick Reply</div>
        <div>▬ ช่องเข้มขวา = URI เปิดเว็บ</div>
        <div>◯ วงกลม = message "template"</div>
        <div>▬ ส้มล่างขวา = postback ทดสอบ</div>
      </div>
    </Frame>
  );
}

/* ---------------- entry ---------------- */

export default function ChatMock({ kind }: { kind: PreviewKind }) {
  switch (kind) {
    case "help":
      return <HelpMock />;
    case "text":
      return <TextMock />;
    case "sticker":
      return <StickerMock />;
    case "location":
      return <LocationMock />;
    case "media":
      return <MediaMock />;
    case "flex":
      return <FlexMock />;
    case "carousel":
      return <CarouselMock />;
    case "quick":
      return <QuickMock />;
    case "combo":
      return <ComboMock />;
    case "template":
      return <TemplateMock />;
    case "imagemap":
      return <ImagemapMock />;
  }
}
