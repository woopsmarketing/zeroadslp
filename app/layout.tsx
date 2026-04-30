import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import {
  TrackingBootstrap,
  TrackingNoscript,
} from "@/components/TrackingBootstrap";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://zeroads.kr";
const SITE_NAME = "제로애드";
const SITE_DESC =
  "어떤 매체든, 어떤 산업이든 — 광고가 잘 되는 대행사. 네이버·구글·메타·카카오·유튜브 통합 운영.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — 광고대행사`,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESC,
  applicationName: SITE_NAME,
  keywords: [
    "광고대행사",
    "검색광고 대행",
    "구글 광고대행",
    "네이버 광고대행",
    "메타 광고대행",
    "치과마케팅",
    "병원마케팅",
    "인테리어마케팅",
    "세무사마케팅",
    "제로애드",
  ],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — 광고대행사`,
    description: SITE_DESC,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — 광고대행사`,
    description: SITE_DESC,
  },
  robots: { index: true, follow: true },
  alternates: { canonical: SITE_URL },
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" className={inter.variable}>
      <head>
        <TrackingBootstrap />
      </head>
      <body>
        <TrackingNoscript />
        {children}
      </body>
    </html>
  );
}
