"use client";

import Script from "next/script";

const AD_CLIENT = process.env.NEXT_PUBLIC_AD_CLIENT || "ca-pub-8492704974936957";

/**
 * Google AdSense bootstrap.
 *
 * Loads the adsbygoogle.js script on every page view.  With Consent Mode v2
 * enabled, the AdSense runtime automatically reads the current `ad_storage`
 * consent state and serves non-personalised or personalised ads accordingly.
 *
 * No need to wait for a consent-granted event — that pattern is superseded by
 * the Consent Mode signals set in ConsentModeInitializer and updated in
 * CookieConsent.
 */
export default function AdSenseBootstrap() {
  return (
    <Script
      id="adsense-init"
      strategy="afterInteractive"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${AD_CLIENT}`}
      crossOrigin="anonymous"
    />
  );
}
