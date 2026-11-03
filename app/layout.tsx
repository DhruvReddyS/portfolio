import type { Metadata } from "next";
import { Archivo, Fraunces, Instrument_Sans, JetBrains_Mono } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import "./buildlog.css";

/** Cinematic editorial display: the headline voice. */
const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
  style: ["normal", "italic"],
  display: "swap",
});

/** Neutral workhorse for body copy. */
const instrument = Instrument_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

/**
 * The poster voice, and the only thing it is allowed to set: the name across
 * the cover and the three numbers beside it. Instrument Sans stops at 700,
 * which is a good deal lighter than a word that has to carry a whole screen,
 * and it has no width axis to open the letters out with.
 */
const archivo = Archivo({
  variable: "--font-poster",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

/** Technical labels, timestamps, log metadata. */
const jetbrains = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ??
    requestHeaders.get("host") ??
    "localhost:3000";
  const protocol =
    requestHeaders.get("x-forwarded-proto") ??
    (host.startsWith("localhost") ? "http" : "https");
  const metadataBase = new URL(`${protocol}://${host}`);

  return {
    metadataBase,
    title: {
      default: "S. Dhruv Reddy, Full-stack & AI Engineer",
      template: "%s · S. Dhruv Reddy",
    },
    description:
      "The build log of S. Dhruv Reddy, a full-stack engineer and applied AI builder. Five internships, six platforms, two competitions won.",
    icons: {
      icon: "/favicon.svg",
      shortcut: "/favicon.svg",
    },
    openGraph: {
      type: "website",
      title: "S. Dhruv Reddy, The Build Log",
      description: "Full-stack engineering and applied AI, logged entry by entry.",
      images: [{ url: new URL("/og.png", metadataBase), width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: "S. Dhruv Reddy, The Build Log",
      description: "Full-stack engineering and applied AI, logged entry by entry.",
      images: [new URL("/og.png", metadataBase)],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // The font variables live on <html> so :root tokens in buildlog.css can
    // resolve them; declared on <body> they are invisible to :root.
    <html
      lang="en"
      className={`dark ${fraunces.variable} ${instrument.variable} ${jetbrains.variable} ${archivo.variable}`}
      data-lamp="off"
    >
      <body className="antialiased">{children}</body>
    </html>
  );
}
