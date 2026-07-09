"use client";

import { useEffect, useRef } from "react";

type AdFormat = "auto" | "rectangle" | "horizontal" | "vertical" | "fluid";

interface AdSenseManualAdProps {
  /** Ad slot ID from AdSense console (numeric). */
  slot: string;
  /** Ad format. Default "auto" for responsive. */
  format?: AdFormat;
  /** Fixed width in px. Omit for responsive/full-width. */
  width?: number;
  /** Fixed height in px. Omit for responsive/full-width. */
  height?: number;
  /** Additional CSS class names. */
  className?: string;
  /** Minimum height to reserve for CLS prevention. Default 120px. */
  minHeight?: number;
}

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

/**
 * Manual AdSense ad unit component.
 *
 * Usage:
 *   <AdSenseManualAd slot="1234567890" format="auto" />
 *   <AdSenseManualAd slot="1234567890" format="rectangle" width={300} height={250} />
 *
 * The component reserves layout space via min-height to reduce CLS.
 * It pushes the ad to the queue only once per mount.
 */
export default function AdSenseManualAd({
  slot,
  format = "auto",
  width,
  height,
  className = "",
  minHeight = 120,
}: AdSenseManualAdProps) {
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    pushed.current = true;

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // Silently fail — AdSense may not be loaded yet in development
    }
  }, []);

  const style: React.CSSProperties = {
    display: "block",
    minHeight: `${minHeight}px`,
  };
  if (width) style.width = width;
  if (height) style.height = height;

  return (
    <div className={`ad-slot ${className}`} style={{ minHeight: `${minHeight}px`, width: "100%", contain: "layout" }}>
      <ins
        className="adsbygoogle"
        style={style}
        data-ad-client={process.env.NEXT_PUBLIC_AD_CLIENT || "ca-pub-8492704974936957"}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={format === "auto" ? "true" : undefined}
      />
    </div>
  );
}