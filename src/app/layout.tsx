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

export const metadata: Metadata = {
  title: "The Skill-Stack Field Guide — 30 Motion-Stack Combinations",
  description: "An interactive mobile-first knowledge-base: 30 skill-stack combinations across 3 directions, a 20-row synergy matrix, a verified skills registry, and top-5 synergies per foundational core.",
  keywords: ["skills.sh", "agent skills", "GSAP", "Three.js", "Framer Motion", "Rive", "WebGPU", "motion stack", "ui-ux-pro-max", "stitch-design", "21st.dev"],
  authors: [{ name: "Super Z" }],
  openGraph: {
    title: "The Skill-Stack Field Guide",
    description: "30 motion-stack combinations. 20-row synergy matrix. Verified skills registry.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Skill-Stack Field Guide",
    description: "30 motion-stack combinations. 20-row synergy matrix. Verified skills registry.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}
