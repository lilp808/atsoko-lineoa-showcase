> 🌐 English version: [README.md](README.md) · **ไทย (ฉบับนี้)**

# LINE OA Message Showcase 🤖💬

Next.js + Vercel webhook chatbot (rule-based) สำหรับ**ชม reply message ของ LINE ครบทุกชนิด**:
Flex, Carousel, Quick Reply, Templates, Imagemap, Image/Video/Audio, Sticker, Location, Postback, datetimePicker

พร้อมหน้าเว็บ catalog (สลับ TH/EN ด้วย `?lang=en`) จำลองบทแชท + raw JSON ของ payload จริงที่บอทส่ง (`/api/examples`)

> 📣 ตอนนี้ข้อความที่บอทตอบจริงเป็น **ภาษาอังกฤษ** ทั้งหมด (keyword/alias ภาษาไทยยังใช้ได้เหมือนเดิม)

## Keyword ที่บอทตอบ

| พิมพ์ใน LINE |จะได้รับ |
|---|---|
| `help` / `เมนู` / `สวัสดี` | welcome + Buttons เมนู (ทุกปุ่มส่ง keyword ตรงๆ) |
| `text` | Text message (บรรทัดใหม่/emoji/ลิงก์) |
| `flex` | Flex Bubble — header/hero/body/footer + ปุ่ม 4 action types |
| `carousel` | Flex Carousel 3 ใบ |
| `quick` | Quick Reply chips (message/postback/datetimePicker) |
| `combo` | Flex + Quick Reply ใน reply เดียว (2 messages) |
| `template` | Buttons → Confirm → Image Carousel |
| `imagemap` | Rich image 1040×1300 กดได้ 5 โซน |
| `media` | image + video + audio (ครบ 5 messages/-reply) |
| `sticker` | official sticker (package 11537) |
| `location` | location pin + quickReply ยืนยัน |
| อื่น ๆ | fallback + ชิปแนะนำ / รับรู้ type ของมีเดียที่ user ส่ง |

## รันในเครื่อง (local)

```bash
npm install
cp env.example .env.local   # เติม token/secret จริง (ดูด้านล่าง)
npm run dev                 # http://localhost:3000
```

Environment variables (ค่าจริงอยู่ใน LINE Developers console):

| ตัวแปร | เอาจากไหน |
|---|---|
| `LINE_CHANNEL_ACCESS_TOKEN` | LINE Developers → your channel → **Messaging API** → Channel access token |
| `LINE_CHANNEL_SECRET` | LINE Developers → your channel → **Basic settings** → Channel secret |
| `NEXT_PUBLIC_BASE_URL` | *(ไม่จำเป็น)* ใส่เฉพาะเมื่อ URL จริง ≠ origin ที่ request ส่งมา (เช่น custom domain) |

> ⚠️ `.env.local` อยู่ใน .gitignore แล้ว — ห้าม commit token จริง

## Deploy ขึ้น Vercel

1. **push repo** → GitHub
   ```bash
   git add -A && git commit -m "LINE OA showcase" && git push
   ```
2. เข้า [vercel.com/new](https://vercel.com/new) → import repo → framework ถูกรู้จักอัตโนมัติ (Next.js)
3. ตั้ง **Environment Variables** (Production + Preview): `LINE_CHANNEL_ACCESS_TOKEN`, `LINE_CHANNEL_SECRET`
4. Deploy → ได้ URL เช่น `https://line-oa-test.vercel.app`
5. (ทางเลือก) deploy ด้วย CLI: `npm i -g vercel && vercel --prod`

## ตั้งค่า LINE (webhook)

1. [LINE Developers console](https://developers.line.biz/console/) → channel ของคุณ
2. tab **Messaging API** → section **Webhook settings**:
   - Webhook URL: `https://<app>.vercel.app/api/webhook`
   - กด **Verify** (ต้องได้ "Success" — route ตอบ `LINE testing message` ไว้แล้ว)
   - เปิด **Use webhook**
3. tab **Messaging API** → **LINE Official Test** หรือเพิ่มเพื่อน OA ของคุณแล้วลองพิมพ์ `help`

> ช่องทาง Free plan ก็ใช้ webhook + reply ได้ครบ (reply ไม่กินโควตาข้อความ push)

## ทดสอบ checklist (พิมพ์ตามใน LINE)

- [ ] `help` → text + buttons 4 ปุ่ม
- [ ] กดปุ่มใน buttons → ทุกปุ่มส่ง keyword เป็น message → ได้ตัวอย่างทันที
- [ ] `flex` → การ์ดทอง; ปุ่ม "Open ATSOKO website" → URI, "See Quick Reply" → message, "This tap sends: carousel" → message, "Copy code FLEX2026" → clipboard
- [ ] `carousel` → ปัด 3 ใบ, กด "I'm interested" → fallback + ชิป
- [ ] `quick` → chips; กด "📅 Pick a date" → calendar เด้ง → เลือกแล้วได้ postback.params
- [ ] `combo` → flex แล้ว text+chips ต่อ
- [ ] `template` → buttons + confirm + image carousel
- [ ] `imagemap` → แตะแต่ละโซนได้ action ต่างกัน
- [ ] `media` → รูป/วิดีโอ/เสียงจริงในแชท
- [ ] พิมพ์มั่ว ๆ → fallback พร้อมชิป, ส่งรูปลงแชท → บอกรับรูป

## โครงสร้างโปรเจกต์

```
app/
  api/webhook/route.ts   # webhook: ตรวจ signature → rules → Reply API
  api/examples/route.ts  # JSON ของทุกตัวอย่าง (payload จริง)
  page.tsx               # catalog บนเว็บ + mock chat preview (สลับ ?lang=th|en)
components/
  ChatMock.tsx           # จำลองบทแชท LINE แต่ละ type (preview บนเว็บ)
  CopyButton.tsx
lib/
  line.ts                # signature verification + reply/push API (fetch ตรง ไม่ใช้ SDK)
  rules.ts               # rule engine: event → messages
  site-text.ts           # ข้อความ UI TH/EN ของหน้า catalog
  examples/              # builder แต่ละ type: flex.ts, templates.ts, quickReply.ts, media.ts, imagemap.ts ...
scripts/
  gen-images.mjs         # สร้าง public/images/*.png (demo/card/rich) ใหม่
  smoke-test.mjs         # ไล่ flow webhook (ต้องรัน server ก่อน)
  wait-and-test.mjs      # รอ server พร้อมแล้วรัน smoke
public/images/           # asset สำหรับ image/flex/imagemap
```

## ข้อจำกัด/หมายเหตุของ LINE ที่ออกแบบหลบไว้แล้ว

- **replyToken ใช้งานได้ครั้งเดียวภายในเวลาสั้น** → ทุกอย่าง reply ทันทีใน request (push API ไม่จำเป็น)
- **1 reply ส่งได้สูงสุด 5 messages** → `media`/`combo` ออกแบบพอดีเพดาน
- **quickReply แนบกับ flex/template/imagemap ตรง ๆ ไม่ได้** → ส่งข้อความถัดไปแทน (ดู `combo`)
- **มีเดียห้าม URL redirect** → รูปโฮสต์เองใน `public/`, วิดีโอ/เสียงใช้ไฟล์ตรงจาก public bucket
- **altText จำเป็นกับ flex/template/imagemap** → ตั้งไว้ทุกตัว (แสดงบน iPhone lock screen ฯลฯ)
- **Custom LINE sticker ต้องแพลน Pro** → ใช้ package 11537 (ฟรี/ทางการ)
- `video`/`audio` ในตัวอย่างนี้ชี้ไปไฟล์สาธารณะ (gtv-videos-bucket / soundhelix) — ใช้โชว์เท่านั้น

## Scripts

| คำสั่ง | ทำอะไร |
|---|---|
| `npm run dev` / `build` / `start` | Next.js ธรรมดา |
| `npm run gen:images` | สร้างภาพ demo ใหม่ (แก้สีใน `scripts/gen-images.mjs` ได้) |
| `npm run smoke` | ทดสอบ webhook flow อัตโนมัติ (server ต้องรันอยู่, ไม่ส่งผลจริงถ้า token dummy) |
| `npm run check:page` | เช็คหน้าเว็บ + รายการ message จาก `/api/examples` |
