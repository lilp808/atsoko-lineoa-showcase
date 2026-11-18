"use client";

import { useState } from "react";

export default function CopyButton({
  text,
  label,
  className = "",
}: {
  text: string;
  label: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // fallback สำหรับ http/context ที่ clipboard API ไม่ทำงาน
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  }

  return (
    <button
      onClick={copy}
      className={`cursor-pointer rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
        copied
          ? "border-[var(--line-green)] bg-[var(--line-green)] text-white"
          : "border-[var(--gold-200)] bg-white text-[var(--gold-600)] hover:bg-[var(--gold-50)]"
      } ${className}`}
    >
      {copied ? "คัดลอกแล้ว ✓" : label}
    </button>
  );
}
