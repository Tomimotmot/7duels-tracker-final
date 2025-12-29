import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "7Duels Tracker - 7 Wonders Duel Statistiken",
  description: "Verfolge deine 7 Wonders Duel Spiele und Statistiken",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
        style={{
          background: 'linear-gradient(180deg, var(--background) 0%, #0d0b08 100%)',
          color: 'var(--foreground)',
        }}
      >
        <Navigation />
        {children}
      </body>
    </html>
  );
}
