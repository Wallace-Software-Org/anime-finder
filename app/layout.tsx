import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || "https://anime-finder-taupe.vercel.app/";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "AniMatch — Find your next anime",
  description:
    "Four questions. Your next anime awaits. AI-powered recommendations matched to your exact taste.",
  openGraph: {
    title: "AniMatch — Find your next anime",
    description: "Four questions. Your next anime awaits.",
    url: baseUrl,
    siteName: "AniMatch",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AniMatch — Find your next anime",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AniMatch — Find your next anime",
    description: "Four questions. Your next anime awaits.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
