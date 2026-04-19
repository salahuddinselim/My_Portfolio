import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#020617" },
  ],
};

const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://selimsalahuddin.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Salah Uddin Selim - Software Developer | Portfolio",
    template: "%s | Salah Uddin Selim",
  },
  description: "Salah Uddin Selim - Software Developer specializing in modern web technologies. View my projects, skills, education, and experience. Contact me for web development opportunities.",
  keywords: ["Salah Uddin Selim", "software developer", "web developer", "portfolio", "projects", "skills", "react", "nextjs", "programming", "Bangladesh"],
  authors: [{ name: "Salah Uddin Selim" }],
  creator: "Salah Uddin Selim",
  publisher: "Salah Uddin Selim",
  openGraph: {
    type: "profile",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Salah Uddin Selim Portfolio",
    title: "Salah Uddin Selim - Software Developer Portfolio",
    description: "Salah Uddin Selim - Software Developer specializing in modern web technologies.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Salah Uddin Selim - Developer Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Salah Uddin Selim - Software Developer Portfolio",
    description: "Salah Uddin Selim - Software Developer specializing in modern web technologies.",
    images: ["/og-image.png"],
    creator: "@selimsalahuddin",
    site: "@selimsalahuddin",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
    languages: {
      "en-US": SITE_URL,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${jetbrainsMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}