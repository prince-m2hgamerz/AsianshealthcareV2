import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/layout/AppShell";
import CookieConsent from "@/components/shared/CookieConsent";
import RollbarProvider from "@/components/shared/RollbarProvider";
import PwaProvider from "@/components/shared/PwaProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://medsolutionhealthcare.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Med Solution Healthcare - Medical Tourism in India",
    template: "%s | Med Solution Healthcare",
  },
  description:
    "Connect with India's top hospitals and doctors. Affordable medical treatments, world-class healthcare, and personalized care for international patients.",
  robots: { index: true, follow: true },
  alternates: { canonical: siteUrl },
  icons: {
    icon: "/newlogo/logo-mark.png",
    shortcut: "/newlogo/logo-mark.png",
    apple: "/newlogo/logo-mark.png",
  },
  openGraph: {
    title: "Med Solution Healthcare - Medical Tourism in India",
    description:
      "Connect with India's top hospitals and doctors. Affordable medical treatments, world-class healthcare.",
    siteName: "Med Solution Healthcare",
    type: "website",
    locale: "en_US",
    url: siteUrl,
    images: [{ url: "/opengraph-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@medsolutionhc",
    creator: "@medsolutionhc",
    title: "Med Solution Healthcare - Medical Tourism in India",
    description: "Connect with India's top hospitals and doctors for affordable, world-class medical treatment.",
    images: ["/opengraph-image.png"],
  },
  other: {
    "google-site-verification": "G-CD5HKSSMK1",
    "geo.region": "IN-DL",
    "geo.placename": "New Delhi",
  },
};

export const viewport: Viewport = {
  themeColor: "#2563eb",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `(function(){var m=document.createElement("link");m.rel="manifest";m.href=location.pathname.startsWith("/admin")?"/manifest-admin.json":"/manifest.json";document.head.appendChild(m)})()`
        }} />
        <link rel="preconnect" href={process.env.NEXT_PUBLIC_SUPABASE_URL?.split("/").slice(0, 3).join("/") || "https://cjqfgshjpqpfcjdvfpgc.supabase.co"} />
        <link rel="dns-prefetch" href={process.env.NEXT_PUBLIC_SUPABASE_URL?.split("/").slice(0, 3).join("/") || "https://cjqfgshjpqpfcjdvfpgc.supabase.co"} />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-CD5HKSSMK1" />
        <script dangerouslySetInnerHTML={{
          __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-CD5HKSSMK1');`
        }} />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="alternate" type="application/rss+xml" title="Med Solution Healthcare Blog" href="/api/rss" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Med Solution" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-icon-180x180.png" />
        <link rel="apple-touch-startup-image" href="/newlogo/logo-mark-badge.png" />
      </head>
      <body className="font-sans antialiased">
        <RollbarProvider>
          <AppShell>{children}</AppShell>
          <CookieConsent />
          <PwaProvider />
        </RollbarProvider>
        <script dangerouslySetInnerHTML={{
          __html: `(function(){function r(e,t){try{navigator.sendBeacon("/api/report-error",JSON.stringify({message:e,stack:t?.stack,url:location.href,metadata:{source:"client"}}))}catch{}}window.onerror=function(e,s,l,c,err){r(String(e),err)};window.onunhandledrejection=function(e){r(e.reason?.message||String(e.reason),e.reason)};})()`
        }} />
      </body>
    </html>
  );
}
