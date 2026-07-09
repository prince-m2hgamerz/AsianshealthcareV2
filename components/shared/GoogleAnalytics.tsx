"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, useCallback } from "react";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-CD5HKSSMK1";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

/**
 * Google Analytics 4 wrapper component.
 *
 * Loads the GA4 script afterInteractive. The consent state is already set
 * by ConsentModeInitializer (beforeInteractive), so this component only
 * needs to append the config and page_view events.
 *
 * In basic consent mode, the tag loads but analytics_storage is denied
 * so no cookies are written. After consent is granted via CookieConsent,
 * analytics_storage updates to 'granted' and cookies are set.
 *
 * Uses send_page_view: false to avoid duplicate page_view since we fire
 * it manually in the pathname effect.
 */
export default function GoogleAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    if (!window.gtag) {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function gtag(...args) {
        window.dataLayer.push(args);
      };
    }

    window.gtag("config", GA_ID, {
      send_page_view: false,
      cookie_flags: "SameSite=None;Secure",
      cookie_expires: 63072000, // 2 years
      cookie_update: true,
    });
  }, []);

  useEffect(() => {
    if (!initialized.current) return;
    // Small delay to ensure config has been processed
    const timeout = setTimeout(() => {
      window.gtag?.("event", "page_view", {
        page_location: window.location.href,
        page_title: document.title,
      });
    }, 100);
    return () => clearTimeout(timeout);
  }, [pathname, searchParams]);

  return (
    <Script
      strategy="afterInteractive"
      src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
    />
  );
}