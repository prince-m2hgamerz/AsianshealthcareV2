"use client";

import Script from "next/script";

/**
 * Consent Mode v2 initializer.
 *
 * Sets default consent state BEFORE any Google tag config or event command.
 * Uses region-specific defaults for EEA/UK/CH vs rest of world.
 *
 * This runs beforeInteractive so consent defaults are in place before
 * any Google tag loads.
 *
 * Pair with CookieConsent component which updates consent on user choice.
 */
export default function ConsentModeInitializer() {
  return (
    <Script id="consent-mode-init" strategy="beforeInteractive">
      {`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}

        // Default: denied for all regions
        gtag('consent', 'default', {
          ad_storage: 'denied',
          ad_user_data: 'denied',
          ad_personalization: 'denied',
          analytics_storage: 'denied',
          functionality_storage: 'granted',
          security_storage: 'granted',
          wait_for_update: 500
        });

        // Region-specific defaults for EEA, UK, Switzerland
        gtag('consent', 'default', {
          ad_storage: 'denied',
          ad_user_data: 'denied',
          ad_personalization: 'denied',
          analytics_storage: 'denied',
          functionality_storage: 'denied',
          security_storage: 'granted',
          wait_for_update: 500
        }, {
          region: ['AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE', 'GB', 'CH']
        });

        gtag('js', new Date());
      `}
    </Script>
  );
}