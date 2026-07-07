"use client";

import { useRef, useState, useEffect, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface HorizontalSliderProps {
  children: ReactNode;
  className?: string;
  showDots?: boolean;
}

export default function HorizontalSlider({ children, className = "", showDots = true }: HorizontalSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  const updateState = () => {
    const el = containerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);

    const child = el.children[0] as HTMLElement | undefined;
    if (child) {
      const itemWidth = child.offsetWidth + 24;
      const idx = Math.round(el.scrollLeft / itemWidth);
      setCurrentIndex(Math.min(idx, el.children.length - 1));
      setTotalItems(el.children.length);
    }
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(updateState);
    ro.observe(el);
    updateState();
    el.addEventListener("scroll", updateState, { passive: true });
    return () => {
      ro.disconnect();
      el.removeEventListener("scroll", updateState);
    };
  }, [children]);

  const scroll = (direction: "left" | "right") => {
    const el = containerRef.current;
    if (!el) return;
    const child = el.children[0] as HTMLElement | undefined;
    if (!child) return;
    const scrollAmount = child.offsetWidth + 24;
    el.scrollBy({ left: direction === "left" ? -scrollAmount : scrollAmount, behavior: "smooth" });
  };

  return (
    <div className="relative group/slider">
      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          className="absolute -left-2.5 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white/95 shadow-elevation-3 flex items-center justify-center text-ink hover:bg-aloe-10 hover:text-ink hover:scale-105 active:scale-95 transition-all md:opacity-0 md:group-hover/slider:opacity-100 backdrop-blur-sm"
          aria-label="Scroll left"
        >
          <ChevronLeft size={22} />
        </button>
      )}
      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          className="absolute -right-2.5 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white/95 shadow-elevation-3 flex items-center justify-center text-ink hover:bg-aloe-10 hover:text-ink hover:scale-105 active:scale-95 transition-all md:opacity-0 md:group-hover/slider:opacity-100 backdrop-blur-sm"
          aria-label="Scroll right"
        >
          <ChevronRight size={22} />
        </button>
      )}

      <div className="relative">
        <div
          ref={containerRef}
          className={`flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 ${className}`}
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {Array.isArray(children) ? (children as ReactNode[]).map((child, i) => (
            <div key={i} className="snap-start shrink-0 w-[85vw] sm:w-[340px]">
              {child}
            </div>
          )) : (
            <div className="snap-start shrink-0 w-[85vw] sm:w-[340px]">{children}</div>
          )}
        </div>

        {canScrollRight && (
          <div className="absolute right-0 top-0 bottom-4 w-16 bg-gradient-to-l from-canvas-light via-canvas-light/60 to-transparent pointer-events-none" />
        )}
      </div>

      {showDots && totalItems > 1 && (
        <div className="flex items-center justify-center gap-2 mt-2">
          {Array.from({ length: totalItems }).map((_, i) => (
            <button
              key={i}
              onClick={() => {
                const el = containerRef.current;
                if (!el) return;
                const child = el.children[0] as HTMLElement | undefined;
                if (!child) return;
                const scrollAmount = (child.offsetWidth + 24) * i;
                el.scrollTo({ left: scrollAmount, behavior: "smooth" });
              }}
              className={`rounded-full transition-all ${
                i === currentIndex
                  ? "w-6 h-2 bg-aloe-10"
                  : "w-2 h-2 bg-shade-30 hover:bg-shade-50"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
