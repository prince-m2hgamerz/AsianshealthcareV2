"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    _googCsa: (...args: unknown[]) => void;
  }
}

interface AFSPageOptions {
  pubId: string;
  query: string;
  styleId: string;
  hl?: string;
  channel?: string;
  adPage?: number;
  adsafe?: "high" | "medium" | "low";
  linkTarget?: "_top" | "_blank";
  maxTermLength?: number;
  resultsPageBaseUrl?: string;
  resultsPageQueryParam?: string;
  terms?: string[];
}

interface AFSAdBlock {
  container: string;
  maxTop?: number;
  number?: number;
  width?: string | number;
  adLoadedCallback?: (containerName: string, adsLoaded: boolean) => void;
}

interface AFSRelatedSearchBlock {
  container: string;
  relatedSearches: number;
  width?: string | number;
}

interface AdSenseForSearchProps {
  pageOptions: AFSPageOptions;
  adBlocks?: AFSAdBlock[];
  relatedSearchBlock?: AFSRelatedSearchBlock;
}

/**
 * AdSense for Search (AFS) component.
 *
 * Integrates AFS into a search results page. Loads the AFS head script
 * and renders ad blocks with configurable parameters.
 *
 * Props:
 *   pageOptions: Page-level AFS configuration (pubId, query, styleId, etc.)
 *   adBlocks: Array of ad block configurations to render
 *   relatedSearchBlock: Optional related search block configuration
 *
 * Usage:
 *   <AdSenseForSearch
 *     pageOptions={{ pubId: 'partner-pub-...', query: searchQuery, styleId: '...' }}
 *     adBlocks={[{ container: 'afscontainer1', maxTop: 4, width: '100%' }]}
 *   />
 */
export default function AdSenseForSearch({
  pageOptions,
  adBlocks,
  relatedSearchBlock,
}: AdSenseForSearchProps) {
  const initialized = useRef(false);
  const containerIds = useRef<string[]>([]);

  // Collect unique container IDs
  if (adBlocks) {
    for (const block of adBlocks) {
      if (!containerIds.current.includes(block.container)) {
        containerIds.current.push(block.container);
      }
    }
  }
  if (relatedSearchBlock && !containerIds.current.includes(relatedSearchBlock.container)) {
    containerIds.current.push(relatedSearchBlock.container);
  }

  useEffect(() => {
    if (initialized.current) return;
    if (!pageOptions.query) return;
    initialized.current = true;

    // Load the AFS head script dynamically
    const script = document.createElement("script");
    script.src = "https://www.google.com/adsense/search/ads.js";
    script.async = true;
    script.onload = () => {
      // Call AFS after the script loads
      const args: unknown[] = ["ads", pageOptions];
      if (adBlocks) {
        for (const block of adBlocks) {
          args.push(block);
        }
      }
      try {
        (window._googCsa as (...args: unknown[]) => void)("ads", pageOptions, ...(adBlocks || []));
      } catch {
        // AFS may not be available in dev
      }

      // Related search
      if (relatedSearchBlock) {
        try {
          (window._googCsa as (...args: unknown[]) => void)(
            "relatedsearch",
            pageOptions,
            relatedSearchBlock
          );
        } catch {
          // AFS may not be available in dev
        }
      }
    };
    document.head.appendChild(script);

    return () => {
      // Cleanup: remove the script if component unmounts
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [pageOptions.query]); // Re-run only when query changes

  return (
    <>
      {containerIds.current.map((id) => (
        <div
          key={id}
          id={id}
          className="afs-ad-slot"
          data-afs-container="true"
          style={{ minHeight: id.includes("related") ? "60px" : "200px", width: "100%", contain: "layout" }}
        />
      ))}
    </>
  );
}