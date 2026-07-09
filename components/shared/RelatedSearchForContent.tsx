"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    _googCsa: (...args: unknown[]) => void;
  }
}

interface RelatedSearchForContentProps {
  /** Publisher ID (e.g., 'partner-pub-XXXXXXXXXXXXXXXX') */
  pubId: string;
  /** Search style ID from AdSense console */
  styleId: string;
  /** Base URL of the search results page (e.g., 'https://example.com/search/') */
  resultsPageBaseUrl: string;
  /** Query parameter name used by the search page (default: 'q') */
  resultsPageQueryParam?: string;
  /** Number of related search terms to show */
  relatedSearches?: number;
  /** Container ID (default: 'rscontentcontainer') */
  containerId?: string;
  /** Language code (optional) */
  hl?: string;
  /** Custom channel for tracking */
  channel?: string;
}

/**
 * Related Search for Content Pages component.
 *
 * Adds Related Search blocks to non-search content pages (articles, blog posts, etc.)
 * to drive traffic to the search results page and increase search ad revenue.
 *
 * Usage:
 *   <RelatedSearchForContent
 *     pubId="partner-pub-XXXXXXXXXXXX"
 *     styleId="XXXXXXXXXX"
 *     resultsPageBaseUrl="https://asianshealthcare.com/search"
 *     resultsPageQueryParam="q"
 *   />
 */
export default function RelatedSearchForContent({
  pubId,
  styleId,
  resultsPageBaseUrl,
  resultsPageQueryParam = "q",
  relatedSearches = 4,
  containerId = "rscontentcontainer",
  hl,
  channel,
}: RelatedSearchForContentProps) {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // Check if AFS script is already loaded
    const existingScript = document.querySelector(
      'script[src="https://www.google.com/adsense/search/ads.js"]'
    );

    const loadAFS = () => {
      const pageOptions: Record<string, unknown> = {
        pubId,
        styleId,
        resultsPageBaseUrl,
        resultsPageQueryParam,
      };
      if (hl) pageOptions.hl = hl;
      if (channel) pageOptions.channel = channel;

      const rsBlock = {
        container: containerId,
        relatedSearches,
        width: "100%",
      };

      try {
        (window._googCsa as (...args: unknown[]) => void)("relatedsearch", pageOptions, rsBlock);
      } catch {
        // AFS may not be available in dev
      }
    };

    if (existingScript) {
      // AFS script already loaded — call directly
      loadAFS();
    } else {
      // Load AFS script dynamically
      const script = document.createElement("script");
      script.src = "https://www.google.com/adsense/search/ads.js";
      script.async = true;
      script.onload = loadAFS;
      document.head.appendChild(script);
    }
  }, []);

  return (
    <div
      id={containerId}
      className="afs-related-search-slot"
      data-afs-container="true"
      style={{ minHeight: "60px", width: "100%", contain: "layout" }}
    />
  );
}