import { track } from "@vercel/analytics";

export function trackEvent(action: string, params?: Record<string, string | number>) {
  try {
    track(action, params);
  } catch {
    // Vercel analytics not loaded (dev mode, ad blockers, etc.)
  }

  if (typeof window !== "undefined" && "gtag" in window) {
    (window as unknown as { gtag: (...args: unknown[]) => void }).gtag("event", action, params);
  }
}
