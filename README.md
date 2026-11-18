> 🌐 **English (this file)** · ไทย: [README.th.md](README.th.md)

# LINE OA Message Showcase 🤖💬

A rule-based **Next.js + Vercel** webhook chatbot that demonstrates **every LINE reply message type**:
Flex, Carousel, Quick Reply, Templates, Imagemap, Image/Video/Audio, Sticker, Location, Postback, datetimePicker.

Includes a bilingual (TH/EN) catalog page that simulates the chat bubbles and shows the exact raw JSON the bot sends (`/api/examples`).

## Keywords the bot answers

| Type in LINE chat | You get |
|---|---|
| `help` / `เมนู` / `สวัสดี` | welcome + Buttons menu (every button is a postback) |
| `text` | Text message (newlines / emoji / auto-linked URLs) |
| `flex` | Flex Bubble — header/hero/body/footer + all 4 action button types |
| `carousel` | Flex Carousel with 3 bubbles |
| `quick` | Quick Reply chips (message / postback / datetimePicker) |
| `combo` | Flex + Quick Reply in one reply (2 messages) |
| `template` | Buttons → Confirm → Image Carousel |
| `imagemap` | Rich 1040×1300 image with 5 tappable zones |
| `media` | image + video + audio (exactly 5 messages/reply) |
| `sticker` | official sticker (package 11537) |
| `location` | location pin + quickReply confirmation |
| anything else | fallback with suggestion chips / acknowledges media types you send |

> All bot replies in this demo are in English. The catalog page itself switches TH/EN with `?lang=en`.

## Run locally

```bash
npm install
cp env.example .env.local   # fill in real token/secret (see below)
npm run dev                 # http://localhost:3000
```

Environment variables (real values live in the LINE Developers console):

| Variable | Where to find it |
|---|---|
| `LINE_CHANNEL_ACCESS_TOKEN` | LINE Developers → your channel → **Messaging API** → Channel access token |
| `LINE_CHANNEL_SECRET` | LINE Developers → your channel → **Basic settings** → Channel secret |
| `NEXT_PUBLIC_BASE_URL` | *(optional)* only if the public URL differs from the request origin (e.g. custom domain) |

> ⚠️ `.env.local` is gitignored — never commit a real token.

## Deploy to Vercel

1. **Push the repo** to GitHub.
2. Open [vercel.com/new](https://vercel.com/new) → import the repo → framework auto-detected (Next.js).
3. Set **Environment Variables** (Production + Preview): `LINE_CHANNEL_ACCESS_TOKEN`, `LINE_CHANNEL_SECRET`.
4. Deploy → you get a URL like `https://atsoko-lineoa-showcase.vercel.app`.
5. (Optional) deploy via CLI instead: `npm i -g vercel && vercel --prod`.

## Configure the LINE webhook

1. [LINE Developers console](https://developers.line.biz/console/) → your channel.
2. **Messaging API** tab → **Webhook settings**:
   - Webhook URL: `https://<app>.vercel.app/api/webhook`
   - Click **Verify** (must show "Success" — the route handles the `LINE testing message` ping)
   - Turn **Use webhook** ON.
3. Use **LINE Official Test** or add your OA as a friend, then type `help`.

> The Free plan supports webhook + replies fully (replies don't consume the push quota).

## Testing checklist (type these in LINE)

- [ ] `help` → text + buttons (4 buttons)
- [ ] press a menu button → postback → that sample is delivered
- [ ] `flex` → gold card; test all four buttons: URI / postback / message / clipboard
- [ ] `carousel` → swipe 3 bubbles; tap "I'm interested" → fallback with chips
- [ ] `quick` → chips appear; tap "📅 Pick a date" → calendar opens → postback.params comes back
- [ ] `combo` → flex card then a text message with chips
- [ ] `template` → buttons + confirm + image carousel
- [ ] `imagemap` → tap each zone → different actions fire
- [ ] `media` → real image / video / audio in chat
- [ ] type gibberish → fallback with chips; send a photo → bot acknowledges it

## Project structure

```
app/
  api/webhook/route.ts   # webhook: verify signature → rules → Reply API
  api/examples/route.ts  # JSON of every sample (real payload)
  page.tsx               # web catalog + mock chat previews (?lang=th|en)
components/
  ChatMock.tsx           # LINE chat simulation per message type
  CopyButton.tsx
lib/
  line.ts                # signature verification + reply/push API (plain fetch, no SDK)
  rules.ts               # rule engine: event → messages
  site-text.ts           # TH/EN UI strings for the catalog page
  examples/              # builders per type: flex.ts, templates.ts, quickReply.ts, media.ts, imagemap.ts …
scripts/
  gen-images.mjs         # regenerate public/images/*.png (demo/card/rich)
  smoke-test.mjs         # webhook flow test (needs a running server)
  wait-and-test.mjs      # wait for server, then run smoke
public/images/           # assets used by image/flex/imagemap samples
```

## LINE limits handled by design

- **replyToken is single-use and short-lived** → everything replies inside the request (no push API needed).
- **Max 5 messages per reply** → `media`/`combo` are designed exactly at the ceiling.
- **quickReply cannot attach to flex/template/imagemap** → send a follow-up text message instead (see `combo`).
- **Media URLs must not redirect** → images are self-hosted in `public/`; video/audio use direct public file URLs.
- **altText is required for flex/template/imagemap** → set on every sample (lock-screen previews, etc.).
- **Custom LINE stickers require the Pro plan** → official package 11537 is used instead.
- Sample `video`/`audio` point at public demo files (gtv-videos-bucket / soundhelix) — showcase only.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` / `build` / `start` | standard Next.js |
| `npm run gen:images` | regenerate demo PNGs (edit colors in `scripts/gen-images.mjs`) |
| `npm run smoke` | automated webhook flow test (server must be running; dummy token = no real sends) |
| `npm run check:page` | verifies the catalog page + `/api/examples` output |
