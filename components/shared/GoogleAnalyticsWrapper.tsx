"use client";

import dynamic from "next/dynamic";

const GoogleAnalytics = dynamic(() => import("@/components/shared/GoogleAnalytics"), { ssr: false });

export default function GoogleAnalyticsWrapper() {
  return <GoogleAnalytics />;
}
