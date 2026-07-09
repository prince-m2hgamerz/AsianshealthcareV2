"use client";

import dynamic from "next/dynamic";

const AdSenseBootstrap = dynamic(() => import("@/components/shared/AdSenseBootstrap"), { ssr: false });

export default function AdSenseWrapper() {
  return <AdSenseBootstrap />;
}
