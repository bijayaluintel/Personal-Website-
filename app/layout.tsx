import type { Metadata } from "next";
import {
  Noto_Sans_Devanagari,
  Noto_Serif_Devanagari,
} from "next/font/google";
import "./globals.css";

const notoSansDevanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari", "latin"],
  variable: "--font-noto-sans-devanagari",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const notoSerifDevanagari = Noto_Serif_Devanagari({
  subsets: ["devanagari", "latin"],
  variable: "--font-noto-serif-devanagari",
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bijaya Luintel — Poet & Writer",
  description: "The official website of Bijaya Luintel—poems, essays, books, and occasional letters.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      className={`${notoSansDevanagari.variable} ${notoSerifDevanagari.variable}`}
      lang="ne"
    >
      <body>{children}</body>
    </html>
  );
}
