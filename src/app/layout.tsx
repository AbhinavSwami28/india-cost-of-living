import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ThemeProvider from "@/components/ThemeProvider";
import BackToTop from "@/components/BackToTop";
import ErrorBoundary from "@/components/ErrorBoundary";
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
  title: {
    default: "Cost of Living in India (2026) – Compare 54 Cities",
    template: "%s | Cost of Living India",
  },
  description:
    "Compare the cost of living across 54 Indian cities in 2026. Updated prices for rent, PG accommodation, groceries, transport & utilities. Interactive cost index, city comparison tools & salary calculator.",
  keywords: [
    "cost of living in India",
    "cost of living India",
    "India city comparison",
    "rent prices India",
    "PG accommodation cost",
    "cheapest cities in India",
    "Mumbai cost of living",
    "Bangalore cost of living",
    "Delhi cost of living",
    "India living expenses 2026",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Cost of Living India",
    title: "Cost of Living in India (2026) – Compare 54 Cities",
    url: "https://costoflivingindia.com",
    description: "Compare cost of living across 54 Indian cities in 2026. Rent, PG, groceries, transport — find out what life really costs.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cost of Living in India (2026) – 54 Cities Compared",
    description: "Compare rent, PG, groceries & transport prices across 54 Indian cities. Interactive cost index & city comparison tools.",
  },
  metadataBase: new URL("https://costoflivingindia.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const adsenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `
          try {
            const t = localStorage.getItem('theme');
            const d = t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches);
            if (d) document.documentElement.classList.add('dark');
          } catch(e) {}
        `}} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider>
          <Navbar />
          <main id="main-content" className="min-h-screen">
            <ErrorBoundary>{children}</ErrorBoundary>
          </main>
          <Footer />
          <BackToTop />
        </ThemeProvider>

        <Analytics />
        <SpeedInsights />

        {/* Google Funding Choices — GDPR/EEA consent management */}
        {adsenseClientId && (
          <Script
            src={`https://fundingchoicesmessages.google.com/i/${adsenseClientId}?ers=1`}
            strategy="beforeInteractive"
          />
        )}
        {adsenseClientId && (
          <Script id="google-fc-init" strategy="beforeInteractive">
            {`(function() {var a=window;var b="fc";function c(d){for(var e=0;e<d.length-1;e++){if(!a[d[e]]){return}}return a[d[e]]}a[b]=a[b]||{};a[b].callQueue=a[b].callQueue||[];a[b].callQueue.push(c)})();`}
          </Script>
        )}

        {/* Google AdSense */}
        {adsenseClientId && (
          <Script
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClientId}`}
            crossOrigin="anonymous"
            strategy="beforeInteractive"
          />
        )}
      </body>
    </html>
  );
}
