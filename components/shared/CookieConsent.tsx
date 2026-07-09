"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie, Settings, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type ConsentChoice = "accepted" | "declined" | "custom";

interface ConsentSelections {
  analytics: boolean;
  ads: boolean;
  functional: boolean;
}

const DEFAULT_SELECTIONS: ConsentSelections = {
  analytics: false,
  ads: false,
  functional: true, // Functional cookies are often essential
};

/**
 * Cookie consent banner with three-button layout (Accept All / Decline / Customize)
 * compliant with GDPR, ePrivacy, and Google CMP requirements.
 *
 * Sets consent state via:
 *   1. localStorage persistence
 *   2. Consent Mode v2 updates via gtag
 *   3. Custom DOM events for application-level listeners
 */
export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const [selections, setSelections] = useState<ConsentSelections>(DEFAULT_SELECTIONS);

  useEffect(() => {
    const stored = localStorage.getItem("cookie-consent");
    if (!stored) {
      const timer = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const applyConsent = (choice: ConsentChoice, customSelections?: ConsentSelections) => {
    const sel = customSelections || DEFAULT_SELECTIONS;

    if (choice === "accepted") {
      updateGtagConsent("granted", "granted", "granted", "granted");
      localStorage.setItem("cookie-consent", "accepted");
    } else if (choice === "declined") {
      updateGtagConsent("denied", "denied", "denied", "denied");
      localStorage.setItem("cookie-consent", "declined");
    } else if (choice === "custom") {
      updateGtagConsent(
        sel.analytics ? "granted" : "denied",
        sel.ads ? "granted" : "denied",
        sel.ads ? "granted" : "denied",
        sel.ads ? "granted" : "denied"
      );
      localStorage.setItem("cookie-consent", JSON.stringify(sel));
    }

    setVisible(false);
    setShowCustomize(false);
    window.dispatchEvent(new Event("consent-granted"));
  };

  const updateGtagConsent = (
    analytics: "granted" | "denied",
    adStorage: "granted" | "denied",
    adUserData: "granted" | "denied",
    adPersonalization: "granted" | "denied"
  ) => {
    try {
      (window as any).gtag?.("consent", "update", {
        analytics_storage: analytics,
        ad_storage: adStorage,
        ad_user_data: adUserData,
        ad_personalization: adPersonalization,
      });
    } catch {
      // gtag may not be loaded yet
    }
  };

  const toggleSelection = (key: keyof ConsentSelections) => {
    setSelections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const ConsentOption = ({
    label,
    description,
    checked,
    onChange,
  }: {
    label: string;
    description: string;
    checked: boolean;
    onChange: () => void;
  }) => (
    <label className="flex items-start gap-3 py-2 cursor-pointer group">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="mt-0.5 h-4 w-4 rounded border-shade-30 text-accent focus:ring-accent/30 cursor-pointer"
      />
      <div>
        <span className="font-medium text-body-sm text">{label}</span>
        <p className="text-shade-50 text-xs mt-0.5">{description}</p>
      </div>
    </label>
  );

  return (
    <AnimatePresence>
      {visible && !showCustomize && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-4 left-4 right-4 z-[60] mx-auto max-w-[800px] bg-white border border-border rounded-lg shadow-card-hover p-5"
          role="dialog"
          aria-label="Cookie consent"
        >
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <div className="hidden sm:flex w-10 h-10 rounded-full bg-accent-light items-center justify-center shrink-0 mt-0.5">
                <Cookie size={18} className="text-accent" />
              </div>
              <div className="flex-1">
                <p className="text-body-sm sm:text-body-md text-text-muted leading-relaxed">
                  We use cookies and similar technologies to enhance your browsing experience,
                  serve personalised content and ads, and analyse our traffic. By clicking
                  &ldquo;Accept All&rdquo; you consent to our use of cookies. Read our{" "}
                  <Link
                    href="/privacy-policy"
                    className="underline underline-offset-2 hover:text-text hover:decoration-accent transition-colors"
                  >
                    Privacy Policy
                  </Link>{" "}
                  for more details.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
              <button
                onClick={() => applyConsent("accepted")}
                className="flex-1 px-5 py-2.5 text-body-sm font-medium rounded-md bg-accent text-white hover:bg-accent-dark transition-colors"
              >
                Accept All
              </button>
              <button
                onClick={() => {
                  setShowCustomize(true);
                  setSelections({ ...DEFAULT_SELECTIONS });
                }}
                className="flex-1 sm:flex-none px-4 py-2.5 text-body-sm font-medium rounded-md border border-border text-text-muted hover:text-text hover:bg-background transition-colors flex items-center justify-center gap-1.5"
              >
                <Settings size={14} />
                Customize
              </button>
              <button
                onClick={() => applyConsent("declined")}
                className="flex-1 sm:flex-none px-5 py-2.5 text-body-sm font-medium rounded-md text-text-muted hover:text-text hover:bg-background transition-colors underline underline-offset-2"
              >
                Decline
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {visible && showCustomize && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-4 left-4 right-4 z-[60] mx-auto max-w-[600px] bg-white border border-border rounded-lg shadow-card-hover p-5"
          role="dialog"
          aria-label="Customize cookie preferences"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-heading-2xs font-semibold flex items-center gap-2">
              <Settings size={16} />
              Privacy Settings
            </h3>
            <button
              onClick={() => setShowCustomize(false)}
              className="p-1 hover:bg-background rounded-md transition-colors"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          <p className="text-body-sm text-shade-50 mb-4">
            Choose which cookies you allow. Essential cookies are always enabled
            for the site to function properly.
          </p>

          <div className="border-t border-hairline-light pt-3 space-y-1">
            <ConsentOption
              label="Necessary"
              description="Required for the website to function. Cannot be disabled."
              checked={true}
              onChange={() => {}}
            />

            <ConsentOption
              label="Functional"
              description="Remember your preferences and enhance your experience."
              checked={selections.functional}
              onChange={() => toggleSelection("functional")}
            />

            <ConsentOption
              label="Analytics"
              description="Help us understand how visitors interact with the site."
              checked={selections.analytics}
              onChange={() => toggleSelection("analytics")}
            />

            <ConsentOption
              label="Advertising"
              description="Used to deliver personalised ads and measure their performance."
              checked={selections.ads}
              onChange={() => toggleSelection("ads")}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4 pt-3 border-t border-hairline-light">
            <button
              onClick={() => applyConsent("accepted")}
              className="flex-1 px-5 py-2.5 text-body-sm font-medium rounded-md bg-accent text-white hover:bg-accent-dark transition-colors"
            >
              Accept All
            </button>
            <button
              onClick={() => applyConsent("custom", selections)}
              className="flex-1 px-5 py-2.5 text-body-sm font-medium rounded-md bg-primary text-white hover:opacity-90 transition-opacity"
            >
              Save Preferences
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}