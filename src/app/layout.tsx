import type { Metadata } from "next";
import { Fraunces, Hanken_Grotesk } from "next/font/google";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { Cursor } from "@/components/motion/Cursor";
import { AtmosphereDrift } from "@/components/motion/AtmosphereDrift";
import { site, siteUrl } from "@/lib/content/site";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
});

const title = `${site.name} — ${site.role}`;
const description = site.intro;

export const metadata: Metadata = {
  // metadataBase makes every relative URL below (OG image, canonical) absolute.
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: `%s — ${site.name}`,
  },
  description,
  keywords: [
    "software engineer",
    "frontend developer",
    "React",
    "Next.js",
    "TypeScript",
    site.name,
  ],
  authors: [{ name: site.name }],
  creator: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: site.name,
    title,
    description,
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
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
      className={`${fraunces.variable} ${hankenGrotesk.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans text-foreground">
        <a href="#main-content" className="skip-link print:hidden">
          Skip to content
        </a>
        {/*
          Named for the same reason as Nav's header (see globals.css): pulls
          this fixed full-viewport glow out of the view transition's default
          root snapshot so it doesn't flash/double-expose during the card ->
          case-study morph.
        */}
        <div
          aria-hidden
          className="atmosphere print:hidden"
          style={{ viewTransitionName: "atmosphere" }}
        />
        <AtmosphereDrift />
        <Cursor />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
