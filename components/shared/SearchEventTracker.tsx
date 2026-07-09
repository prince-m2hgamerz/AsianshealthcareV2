"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

export default function SearchEventTracker() {
  const q = useSearchParams().get("q");
  const sent = useRef(false);

  useEffect(() => {
    if (!q || sent.current) return;
    sent.current = true;
    (window as any).gtag?.("event", "search", { search_term: q });
  }, [q]);

  return null;
}
