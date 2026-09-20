import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { DealSyncProvider } from "@/context/DealSyncContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DealSync Sentinel — Every Deal. Every Update. Always in Sync.",
  description: "AI-powered CRM synchronization, pipeline intelligence, and conflict resolution platform for HubSpot and Notion via Fastn.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full bg-[#090d16] text-slate-100 flex flex-col font-sans">
        <DealSyncProvider>
          {children}
        </DealSyncProvider>
      </body>
    </html>
  );
}
