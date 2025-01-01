"use client";

import { useEffect, useRef } from "react";

interface AdBannerProps {
  adSlot?: string;
  adFormat?: "auto" | "horizontal" | "rectangle" | "vertical" | "fluid";
  layoutKey?: string;
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle?: Record<string, unknown>[];
  }
}

export default function AdBanner({
  adSlot,
  adFormat = "auto",
  layoutKey,
  className = "",
}: AdBannerProps) {
  const adRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  useEffect(() => {
    if (!clientId || pushed.current) return;

    const timer = setTimeout(() => {
      try {
        if (adRef.current && !adRef.current.getAttribute("data-adsbygoogle-status")) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          pushed.current = true;
        }
      } catch {
        // AdSense blocked or not loaded
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [clientId]);

  if (!clientId) {
    return null;
  }

  return (
    <div className={className}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={clientId}
        {...(adSlot ? { "data-ad-slot": adSlot } : {})}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
        {...(layoutKey ? { "data-ad-layout-key": layoutKey } : {})}
      />
    </div>
  );
}
