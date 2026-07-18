import type { Metadata } from "next";
import { Fraunces, IBM_Plex_Mono, Inter } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";
import PageTransition from "@/components/PageTransition";
import MagneticButtons from "@/components/MagneticButtons";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  weight: ["400", "500"],
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://thesteerway.com"),
  title: "The Steerway | Systems that steer growth",
  description:
    "The Steerway builds websites, AI automations, SaaS products, CRM systems, dashboards and growth infrastructure that turn demand into direction, action and measurable performance.",
  openGraph: {
    type: "website",
    siteName: "The Steerway",
    title: "The Steerway | Systems that steer growth",
    description:
      "Websites, AI automation, software, CRM, dashboards and the growth infrastructure that connects them, built by one team.",
    url: "https://thesteerway.com",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Steerway | Systems that steer growth",
    description:
      "Websites, AI automation, software, CRM, dashboards and the growth infrastructure that connects them, built by one team.",
  },
  alternates: { canonical: "/" },
  icons: {
    icon: [
      { url: "/brand/04_favicon_and_icons/steerway_favicon-32.png", sizes: "32x32" },
      { url: "/brand/04_favicon_and_icons/steerway_favicon-48.png", sizes: "48x48" },
    ],
    apple: "/brand/04_favicon_and_icons/steerway_apple-touch-icon-180.png",
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
      className={`${fraunces.variable} ${plexMono.variable} ${inter.variable}`}
    >
      <body>
        <SmoothScroll>{children}</SmoothScroll>
        <PageTransition />
        <MagneticButtons />
        <CustomCursor />
      </body>
    </html>
  );
}
