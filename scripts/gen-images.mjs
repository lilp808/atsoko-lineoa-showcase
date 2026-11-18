// สคริปต์สร้าง PNG ตัวอย่าง (ไม่ต้องพึ่งไลบรารี): demo.png, demo-card.png, rich.png
// รัน: node scripts/gen-images.mjs
import { deflateSync } from "node:zlib";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "images");
mkdirSync(OUT, { recursive: true });

// ---------- minimal PNG encoder ----------
const CRC_TABLE = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
function crc32(buf) {
  let c = 0xffffffff;
  for (const b of buf) c = CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, "latin1"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}
function encodePng(width, height, pixels /* RGB Buffer w*h*3 */) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // color type RGB
  const raw = Buffer.alloc(height * (1 + width * 3));
  for (let y = 0; y < height; y++) {
    const rowStart = y * (1 + width * 3);
    raw[rowStart] = 0; // filter none
    pixels.copy(raw, rowStart + 1, y * width * 3, (y + 1) * width * 3);
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

// ---------- helpers ----------
const hex = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
function canvas(w, h, fill) {
  const px = Buffer.alloc(w * h * 3);
  const [r, g, b] = hex(fill);
  for (let i = 0; i < w * h; i++) {
    px[i * 3] = r;
    px[i * 3 + 1] = g;
    px[i * 3 + 2] = b;
  }
  return { w, h, px };
}
function rect(c, x, y, w, h, color) {
  const [r, g, b] = hex(color);
  for (let yy = Math.max(0, y); yy < Math.min(c.h, y + h); yy++) {
    for (let xx = Math.max(0, x); xx < Math.min(c.w, x + w); xx++) {
      const i = (yy * c.w + xx) * 3;
      c.px[i] = r;
      c.px[i + 1] = g;
      c.px[i + 2] = b;
    }
  }
}
function circle(c, cx, cy, rad, color) {
  const [r, g, b] = hex(color);
  for (let yy = Math.max(0, cy - rad); yy < Math.min(c.h, cy + rad); yy++) {
    for (let xx = Math.max(0, cx - rad); xx < Math.min(c.w, cx + rad); xx++) {
      if ((xx - cx) ** 2 + (yy - cy) ** 2 <= rad * rad) {
        const i = (yy * c.w + xx) * 3;
        c.px[i] = r;
        c.px[i + 1] = g;
        c.px[i + 2] = b;
      }
    }
  }
}
function save(name, c) {
  const buf = encodePng(c.w, c.h, c.px);
  writeFileSync(join(OUT, name), buf);
  console.log(`${name}  ${c.w}x${c.h}  ${(buf.length / 1024).toFixed(0)} KB`);
}

// ---------- demo.png 1040x560 (gold gradient + white shapes) ----------
{
  const c = canvas(1040, 560, "#D4A84B");
  for (let y = 0; y < c.h; y++) {
    const t = y / c.h;
    const col = [Math.round(0xd4 + (0xb8 - 0xd4) * t), Math.round(0xa8 + (0x92 - 0xa8) * t), Math.round(0x4b + (0x3d - 0x4b) * t)];
    for (let x = 0; x < c.w; x++) {
      const i = (y * c.w + x) * 3;
      c.px[i] = col[0];
      c.px[i + 1] = col[1];
      c.px[i + 2] = col[2];
    }
  }
  circle(c, 840, 140, 190, "#FDF6E3");
  circle(c, 840, 140, 140, "#D4A84B");
  rect(c, 60, 400, 320, 100, "#9C7C34");
  rect(c, 60, 400, 140, 100, "#FFFFFF");
  save("demo.png", c);
}

// ---------- demo-card.png 800x800 (carousel/image carousel) ----------
{
  const c = canvas(800, 800, "#FDF6E3");
  rect(c, 60, 60, 680, 680, "#FFFFFF");
  rect(c, 140, 140, 520, 520, "#D4A84B");
  circle(c, 400, 400, 150, "#FFFFFF");
  circle(c, 400, 400, 80, "#9C7C34");
  save("demo-card.png", c);
}

// ---------- demo-card-2/3.png (variants สำหรับ image carousel) ----------
{
  for (const [n, fill] of [
    [2, "#3B82F6"],
    [3, "#111827"],
  ]) {
    const c = canvas(800, 800, "#F9FAFB");
    rect(c, 60, 60, 680, 680, "#FFFFFF");
    rect(c, 140, 140, 520, 520, fill);
    circle(c, 400, 400, 150, "#FFFFFF");
    circle(c, 400, 400, 80, fill);
    save(`demo-card-${n}.png`, c);
  }
}

// ---------- rich.png 1040x1300 (imagemap zones) ----------
{
  const c = canvas(1040, 1300, "#6B7280");
  rect(c, 0, 0, 1040, 260, "#D4A84B"); // zone1 message "flex"
  rect(c, 0, 260, 1040, 260, "#3B82F6"); // zone2 postback "quick"
  rect(c, 0, 520, 520, 260, "#22C55E"); // decoration
  rect(c, 520, 520, 520, 260, "#111827"); // zone3 URI (dark = ลิงก์)
  rect(c, 0, 780, 1040, 260, "#E5E7EB"); // zone4 bg + circle message "template"
  circle(c, 260, 910, 250, "#D4A84B");
  circle(c, 260, 910, 150, "#FFFFFF");
  rect(c, 0, 1040, 1040, 260, "#6B7280");
  rect(c, 520, 1170, 520, 130, "#F59E0B"); // zone5 postback
  // ตัวเลขโซนแบบง่าย (บล็อกสี่เหลี่ยม) — ไม่ต้องเป๊ะ ขอให้เห็นว่า "กดได้"
  rect(c, 40, 40, 180, 180, "#FFFFFF");
  rect(c, 70, 70, 120, 120, "#9C7C34");
  rect(c, 40, 300, 180, 180, "#FFFFFF");
  rect(c, 70, 330, 120, 120, "#1D4ED8");
  rect(c, 580, 560, 160, 160, "#FFFFFF");
  rect(c, 610, 590, 100, 100, "#111827");
  rect(c, 700, 860, 300, 120, "#9CA3AF");
  rect(c, 700, 1010, 300, 60, "#9CA3AF");
  save("rich.png", c);
}
