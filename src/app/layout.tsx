import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk, Syne } from "next/font/google";
import "./globals.css";
import { TimeRangeProvider } from "@/hooks/TimeRangeContext";
import { InsightsModalProvider } from "@/hooks/InsightsModalContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  adjustFontFallback: false,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  adjustFontFallback: false,
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-grotesk',
});

const syne = Syne({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-syne',
});

export const metadata: Metadata = {
  title: "Rayls Dashboard",
  description: "Metrics for Rayls",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} ${syne.variable} antialiased`}
      >
        <main className={`${spaceGrotesk.variable} ${syne.variable} font-sans`}>
          <TimeRangeProvider>
            <InsightsModalProvider>
              {children}
            </InsightsModalProvider>
          </TimeRangeProvider>
        </main>
      </body>
    </html>
  );
}
