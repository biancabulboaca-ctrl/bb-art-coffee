import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

// 🎨 TIPOGRAFIE 100% SANS-SERIF - MODERN CLEAN
// Plus Jakarta Sans - Sans-serif modern pentru TOATE titlurile (H1-H6)
const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

// Cormorant Garamond - Serif elegant pentru BB Art Coffee title
const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-title-elegant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// Inter - Sans-serif curat pentru body text
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  display: "swap",
});

/**
 * 🔍 SEO METADATA
 * Pentru cursanți: Metadata = informații pentru Google și social media
 */
export const metadata: Metadata = {
  title: "Vibe Coffee - Cafea de Specialitate în București",
  description: "Descoperă aromele autentice ale cafelei de specialitate într-un ambient modern și prietenos. Boabe proaspăt prăjite, bariști experimentați, WiFi gratuit.",
  keywords: ["cafenea bucuresti", "cafea specialitate", "coffee shop", "vibe coffee"],
  authors: [{ name: "Vibe Coffee Team" }],
  openGraph: {
    title: "Vibe Coffee - Cafea de Specialitate",
    description: "Locul perfect pentru cafeaua ta zilnică",
    type: "website",
    locale: "ro_RO",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro">
      <body
        className={`${plusJakarta.variable} ${cormorantGaramond.variable} ${inter.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
