"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown, Menu, X, Search, Home, Stethoscope, Building2, HeartPulse,
  Info, Heart, Shield, Building, Plane, Newspaper, Mail, FileText,
  DollarSign, AlertTriangle, ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import dynamic from "next/dynamic";

const SearchModal = dynamic(() => import("@/components/search/SearchModal"), { ssr: false });

// Navbar-specific serif stack: Playfair Display first, falling back to
// Georgia, then the browser's generic serif if neither font is available.
const NAV_SERIF = '"Playfair Display", Georgia, serif';

const primaryNavLinks = [
  { label: "Home", href: "/" },
  { label: "Doctors", href: "/doctors" },
  { label: "Hospitals", href: "/hospitals" },
  { label: "Treatments", href: "/treatment-package" },
];

const exploreLinks = [
  { label: "About", href: "/about-us" },
  { label: "Specialities", href: "/speciality" },
  { label: "Insurance", href: "/insurance-company" },
  { label: "Hotels", href: "/hotels" },
  { label: "Tourism", href: "/tourism" },
  { label: "Blogs", href: "/blogs" },
  { label: "Contact", href: "/contact-us" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms", href: "/terms" },
  { label: "Refund Policy", href: "/refund-policy" },
  { label: "Disclaimer", href: "/disclaimer" },
];

const linkIcon: Record<string, React.ReactNode> = {
  Home: <Home size={18} />,
  Doctors: <Stethoscope size={18} />,
  Hospitals: <Building2 size={18} />,
  Treatments: <HeartPulse size={18} />,
  About: <Info size={18} />,
  Specialities: <Heart size={18} />,
  Insurance: <Shield size={18} />,
  Hotels: <Building size={18} />,
  Tourism: <Plane size={18} />,
  Blogs: <Newspaper size={18} />,
  Contact: <Mail size={18} />,
  "Privacy Policy": <Shield size={18} />,
  Terms: <FileText size={18} />,
  "Refund Policy": <DollarSign size={18} />,
  Disclaimer: <AlertTriangle size={18} />,
};

// Splits the site name so the last word can be styled in the accent color,
// matching the "Med Solution Healthcare" -> "Med Solution" + "Healthcare" look.
// Falls back to rendering the whole name in one color if there's only one
// word, so short/unusual site names never look broken.
function splitWordmark(name: string): { lead: string; accent: string } {
  const trimmed = name.trim();
  const lastSpace = trimmed.lastIndexOf(" ");
  if (lastSpace === -1) {
    return { lead: "", accent: trimmed };
  }
  return {
    lead: trimmed.slice(0, lastSpace),
    accent: trimmed.slice(lastSpace + 1),
  };
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const settings = useSiteSettings();
  const exploreRef = useRef<HTMLDivElement>(null);

  // Bug fix: this was hardcoded to "Med Solution Healthcare" before,
  // ignoring the siteName pulled from settings above. Falls back to the
  // same default only when settings haven't loaded yet.
  const siteName = settings.site_name || "Med Solution Healthcare";
  const wordmark = splitWordmark(siteName);

  const exploreActive = exploreLinks.some(
    (link) => pathname === link.href || pathname.startsWith(`${link.href}/`)
  );

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setExploreOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  // Close the Explore dropdown on outside click and on Escape,
  // not just on hover-out — fixes it staying open after a click-toggle
  // when the pointer never leaves the trigger/menu area (e.g. touch devices,
  // or mouse users who click then move away without crossing the boundary).
  useEffect(() => {
    if (!exploreOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (exploreRef.current && !exploreRef.current.contains(e.target as Node)) {
        setExploreOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setExploreOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [exploreOpen]);

  return (
    <>
      <nav
        className={cn(
          "sticky top-0 z-50 h-[72px] transition-all duration-300",
          scrolled
            ? "bg-white/90 backdrop-blur-md border-b border-border"
            : "bg-white border-b border-transparent"
        )}
      >
        <div className="container-cinematic flex items-center justify-between h-full gap-4">
          <Link
            href="/"
            className="shrink-0 flex items-center gap-3 min-w-0 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2"
          >
            <Image
              src="/newlogo/logo-mark.png"
              alt=""
              width={32}
              height={32}
              className="shrink-0"
              style={{ width: 32, height: 32 }}
              priority
            />
            <div className="flex flex-col">
              <span
                style={{ fontFamily: NAV_SERIF }}
                className="text-[17px] sm:text-[20px] font-medium -tracking-[0.5px] truncate max-w-[50vw] sm:max-w-[280px] lg:max-w-[340px] text-foreground leading-tight"
              >
                {wordmark.lead && <span>{wordmark.lead} </span>}
                <span className="text-accent">{wordmark.accent}</span>
              </span>
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.15em] text-muted-foreground/70 leading-tight">
                Medical Tourism in India
              </span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-6">
            {primaryNavLinks.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  style={{ fontFamily: NAV_SERIF }}
                  className={cn(
                    "relative text-[16px] font-medium -tracking-[0.2px] transition-colors py-2 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2",
                    isActive ? "text-accent" : "text-text hover:text-primary-mid"
                  )}
                >
                  {link.label}
                  <span
                    className={cn(
                      "absolute left-0 -bottom-[1px] h-[2px] w-full bg-accent rounded-full transition-transform duration-200 origin-left",
                      isActive ? "scale-x-100" : "scale-x-0"
                    )}
                  />
                </Link>
              );
            })}

            <div
              ref={exploreRef}
              className="relative"
              onMouseEnter={() => setExploreOpen(true)}
              onMouseLeave={() => setExploreOpen(false)}
            >
              <button
                type="button"
                onClick={() => setExploreOpen((current) => !current)}
                style={{ fontFamily: NAV_SERIF }}
                className={cn(
                  "inline-flex items-center gap-1.5 text-[16px] font-medium -tracking-[0.2px] transition-colors py-2 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2",
                  exploreActive ? "text-accent" : "text-text hover:text-primary-mid"
                )}
                aria-expanded={exploreOpen}
                aria-haspopup="menu"
              >
                Explore
                <ChevronDown
                  size={15}
                  className={cn("transition-transform duration-200", exploreOpen && "rotate-180")}
                />
              </button>

              <AnimatePresence>
                {exploreOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.18 }}
                    className="absolute right-0 top-full mt-4 w-64 rounded-lg border border-border bg-white p-2 shadow-lg"
                    role="menu"
                  >
                    {exploreLinks.map((link) => {
                      const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          aria-current={isActive ? "page" : undefined}
                          className={cn(
                            "block rounded-md px-3 py-2.5 text-[14px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50",
                            isActive
                              ? "bg-primary-tint text-accent"
                              : "text-text-muted hover:bg-primary-tint hover:text-text"
                          )}
                          role="menuitem"
                        >
                          {link.label}
                        </Link>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-2 text-text-muted bg-canvas-light border border-border rounded-lg hover:border-primary-mid/30 transition-colors text-[13px] font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
              aria-label="Search"
            >
              <Search size={16} />
              <span className="hidden xl:inline">Search...</span>
              <kbd className="hidden xl:inline-flex items-center px-1.5 py-0.5 text-[10px] text-text-light bg-white rounded border border-border">
                ⌘K
              </kbd>
            </button>
            <Link href="/treatment-package" className="btn-outline text-[15px] !py-2.5 !px-6">
              Find Cost
            </Link>
            <Link href="/contact-us" className="btn-accent text-[15px] !py-2.5 !px-6">
              Get Free Quote
            </Link>
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden text-text p-3 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden overflow-hidden bg-white border-t border-border"
            >
              <div className="flex flex-col max-h-[80vh]">
                <div className="overflow-y-auto container-cinematic py-6 space-y-5">
                  <button
                    onClick={() => {
                      setOpen(false);
                      setSearchOpen(true);
                    }}
                    className="flex items-center gap-3 w-full text-left text-text transition-colors py-2.5 px-4 -mx-4 rounded-lg hover:bg-primary-tint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
                  >
                    <Search size={20} className="text-primary-mid" />
                    <span className="font-display text-heading-sm">Search</span>
                  </button>
                  <hr className="border-border" />

                  <div className="space-y-2">
                    <p className="text-eyebrow text-primary-mid font-medium px-4">Main</p>
                    {primaryNavLinks.map((link) => {
                      const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setOpen(false)}
                          aria-current={isActive ? "page" : undefined}
                          className={cn(
                            "flex items-center justify-between rounded-lg px-4 py-2.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50",
                            isActive
                              ? "bg-primary-tint text-accent font-medium"
                              : "text-text hover:bg-primary-tint hover:text-text"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            {linkIcon[link.label]}
                            <span className="font-display text-heading-sm">{link.label}</span>
                          </div>
                          <ChevronRight size={14} className="text-text-light" />
                        </Link>
                      );
                    })}
                  </div>

                  <hr className="border-border" />

                  <div className="space-y-2">
                    <p className="text-eyebrow text-primary-mid font-medium px-4">Explore</p>
                    {exploreLinks.map((link) => {
                      const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setOpen(false)}
                          aria-current={isActive ? "page" : undefined}
                          className={cn(
                            "flex items-center justify-between rounded-lg px-4 py-2.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50",
                            isActive
                              ? "bg-primary-tint text-accent font-medium"
                              : "text-text hover:bg-primary-tint hover:text-text"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            {linkIcon[link.label]}
                            <span className="font-display text-heading-sm">{link.label}</span>
                          </div>
                          <ChevronRight size={14} className="text-text-light" />
                        </Link>
                      );
                    })}
                  </div>

                  <hr className="border-border" />

                  <div className="space-y-2">
                    <p className="text-eyebrow text-primary-mid font-medium px-4">Legal</p>
                    {legalLinks.map((link) => {
                      const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setOpen(false)}
                          aria-current={isActive ? "page" : undefined}
                          className={cn(
                            "flex items-center justify-between rounded-lg px-4 py-2.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50",
                            isActive
                              ? "bg-primary-tint text-accent font-medium"
                              : "text-text hover:bg-primary-tint hover:text-text"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            {linkIcon[link.label]}
                            <span className="font-display text-heading-sm">{link.label}</span>
                          </div>
                          <ChevronRight size={14} className="text-text-light" />
                        </Link>
                      );
                    })}
                  </div>
                </div>

                <div className="sticky bottom-0 border-t border-border bg-white p-4 container-cinematic space-y-3">
                  <Link
                    href="/treatment-package"
                    className="btn-outline w-full text-center block"
                    onClick={() => setOpen(false)}
                  >
                    Find Cost
                  </Link>
                  <Link
                    href="/contact-us"
                    className="btn-accent w-full text-center block"
                    onClick={() => setOpen(false)}
                  >
                    Get Free Quote
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}