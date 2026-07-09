# Google Tag Manager (GTM) Setup Guide

## Overview

Google Tag Manager is **not yet installed** on this site. The current implementation uses direct `gtag.js` for Google Analytics and direct AdSense bootstrap via the `adsbygoogle.js` script.

This guide documents the steps to migrate to GTM if needed in the future.

## Current Architecture

```
ConsentModeInitializer (beforeInteractive)
  └─ Sets Consent Mode v2 defaults (denied)
  └─ Region-specific defaults (EEA/UK/CH)

GoogleAnalytics (afterInteractive)
  └─ Loads gtag.js -> G-CD5HKSSMK1
  └─ Fires page_view on route changes

AdSenseBootstrap (afterInteractive)
  └─ Loads adsbygoogle.js -> ca-pub-8492704974936957
  └─ Auto ads and manual units work via Consent Mode signals

CookieConsent
  └─ Three-button layout (Accept / Customize / Decline)
  └─ Updates Consent Mode v2 state on user action

Consent Mode v2 covers:
  - analytics_storage
  - ad_storage
  - ad_user_data
  - ad_personalization
```

## When To Introduce GTM

Consider GTM when:
1. Multiple Google products need coordination (GA4 + Google Ads + Floodlight)
2. Third-party marketing tags need to be managed without code deployments
3. The marketing team needs self-service tag deployment
4. Multiple event tags with complex triggers are required

## Migration Steps

### Phase 1: Container Setup
1. Create GTM account and web container at `tagmanager.google.com`
2. Copy the `GTM-XXXXXXX` container ID
3. Add `NEXT_PUBLIC_GTM_ID` to `.env.local`

### Phase 2: Install GTM Snippets
1. Add GTM `<head>` snippet in `app/layout.tsx` via `<Script strategy="beforeInteractive">`
2. Add GTM `<noscript>` iframe after `<body>` opening tag
3. Keep ConsentModeInitializer running before the GTM snippet

### Phase 3: Recreate Tags In GTM
1. Google Tag -> GA4 (G-CD5HKSSMK1)
2. Google Tag -> Consent Mode v2 defaults on Consent Initialization
3. Event tags for: sign_up, generate_lead, login, search

### Phase 4: Consent In GTM
1. Enable Consent Overview in Container Settings
2. Use `setDefaultConsentState` on Consent Initialization - All Pages
3. Use `updateConsentState` via CMP template or custom HTML tag
4. Do NOT use queued `gtag('consent', ...)` calls inside GTM

### Phase 5: Remove Direct gtag.js
1. Remove GoogleAnalytics component from layout
2. Keep AdSenseBootstrap (AdSense works better as direct page integration)
3. Verify with Tag Assistant

## Important Guardrails

- **Do not** move AdSense bootstrap into GTM as default. Keep AdSense as direct page integration.
- **Do not** use queued `gtag('consent', ...)` calls inside GTM. Use GTM consent APIs instead.
- **Do not** leave duplicate Google tag installs after migration.
- Server-side tagging does **not** remove consent obligations.