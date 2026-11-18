import type { Metadata } from "next";
import { Poppins, Prompt } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

const prompt = Prompt({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-prompt",
});

export const metadata: Metadata = {
  title: "LINE OA Message Showcase · ATSOKO",
  description:
    "คลังตัวอย่าง reply message ของ LINE OA (Flex, Quick Reply, Template, Imagemap, Media) พร้อม webhook rule-base ที่ deploy บน Vercel",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="th" className={`${poppins.variable} ${prompt.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
