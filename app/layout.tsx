/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Metadata } from "next";
import { Geist, Geist_Mono,Figtree  } from "next/font/google";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./provider";
import { Analytics } from '@vercel/analytics/next';
import { Toaster } from "@/components/ui/sonner"
import { AuthToast } from "@/components/ui/auth-toast"
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const figtree = Figtree({ subsets: ['latin'], variable: '--font-figtree' })

export const metadata: Metadata = {
  title: "PDEA's College Of Engineering",
  description: "Official Portal Of PDEA's College Of Engineering",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-figtree">
        <Providers>
          {children}
          <AuthToast />
          <Toaster position="top-center" richColors  />
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
