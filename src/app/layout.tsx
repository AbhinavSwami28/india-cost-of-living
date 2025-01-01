import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ThemeProvider from "@/components/ThemeProvider";
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
    default: "India Cost of Living - Compare Prices Across 50+ Indian Cities",
    template: "%s | India Cost of Living",
  },
  description:
    "Compare the cost of living across 50+ Indian cities. Prices for rent, PG accommodation, groceries, transport, and more in Mumbai, Delhi, Bangalore, Chennai, Hyderabad, Pune, Kolkata, and other cities.",
  keywords: [
    "cost of living India",
    "India city comparison",
    "rent prices India",
    "PG accommodation cost",
    "Mumbai cost of living",
    "Bangalore cost of living",
    "Delhi cost of living",
    "double sharing PG price",
    "triple sharing PG price",
    "India grocery prices",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "India Cost of Living",
  },
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
          <main className="min-h-screen">{children}</main>
          <Footer />
        </ThemeProvider>

        <Analytics />

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
