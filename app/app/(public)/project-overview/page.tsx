'use client'

import { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import {
  ArrowUpRight, CheckCircle, Globe, LayoutDashboard, Database,
  Mail, Search, Image, Shield, Users, Building2, Stethoscope,
  Hotel, FileText, BarChart3, Smartphone, MessageCircle, Zap,
  Server, Activity, Layers, Code2, Box, GitCommit, Clock,
  Award, TrendingUp, DollarSign, BookOpen, ExternalLink,
  Grid3X3, ChevronDown, PieChart, Cpu, Eye,
  Share2, Link2, ArrowUp, Send
} from "lucide-react"
import MarkdownRenderer from "@/components/MarkdownRenderer"

function useScrollPosition() {
  const [scrollY, setScrollY] = useState(0)
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])
  return scrollY
}

function FadeInSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.unobserve(el)
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className="transition-all duration-700"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

function ShareModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [copied, setCopied] = useState(false)
  const url = typeof window !== "undefined" ? window.location.href : ""
  const title = "Med Solution Healthcare – Project Overview"

  useEffect(() => {
    if (!open) { setCopied(false); return }
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [open, onClose])

  const shareData = { url, title, text: `${title}\n${url}` }

  const shareNative = useCallback(() => {
    if (navigator.share) {
      navigator.share(shareData).catch(() => {})
    }
  }, [shareData])

  const shareWhatsApp = useCallback(() => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareData.text)}`, "_blank", "noopener")
  }, [shareData])

  const shareFacebook = useCallback(() => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank", "noopener")
  }, [url])

  const shareTwitter = useCallback(() => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, "_blank", "noopener")
  }, [url, title])

  const shareTelegram = useCallback(() => {
    window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, "_blank", "noopener")
  }, [url, title])

  const shareLinkedIn = useCallback(() => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, "_blank", "noopener")
  }, [url])

  const shareEmail = useCallback(() => {
    window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`
  }, [url, title])

  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* fallback */ }
  }, [url])

  if (!open) return null

  const items = [
    { label: "WhatsApp", icon: MessageCircle, action: shareWhatsApp, color: "text-green-500" },
    { label: "Facebook", icon: FacebookSvg, action: shareFacebook, color: "text-blue-600" },
    { label: "X (Twitter)", icon: XSvg, action: shareTwitter, color: "text-neutral-900" },
    { label: "Telegram", icon: Send, action: shareTelegram, color: "text-blue-500" },
    { label: "LinkedIn", icon: LinkedinSvg, action: shareLinkedIn, color: "text-blue-700" },
    { label: "Email", icon: Mail, action: shareEmail, color: "text-neutral-600" },
    { label: copied ? "Copied!" : "Copy Link", icon: Link2, action: copyLink, color: "text-primary" },
    ...(typeof navigator !== "undefined" && typeof navigator.share !== "undefined"
      ? [{ label: "More…", icon: Share2, action: shareNative, color: "text-accent" }]
      : []),
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-t-2xl sm:rounded-2xl shadow-elevation-4 w-full sm:w-auto sm:min-w-[400px] p-6 animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 duration-300">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-heading text-heading-sm text-primary">Share This Page</h3>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-neutral-100 flex items-center justify-center hover:bg-neutral-200 transition"
          >
            <ArrowUp size={14} className="text-neutral-500 rotate-45" />
          </button>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {items.map((item) => (
            <button
              key={item.label}
              onClick={item.action}
              className="flex flex-col items-center gap-1.5 p-3 rounded-xl hover:bg-neutral-50 transition group"
            >
              <div className={`w-11 h-11 rounded-full bg-neutral-100 flex items-center justify-center group-hover:scale-110 transition ${item.color}`}>
                <item.icon size={20} />
              </div>
              <span className="text-xs text-neutral-600 text-center leading-tight">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function FacebookSvg(props: { size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={props.size || 20} height={props.size || 20} fill="currentColor" className={props?.className || ""}>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

function XSvg(props: { size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={props.size || 20} height={props.size || 20} fill="currentColor" className={props?.className || ""}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function LinkedinSvg(props: { size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={props.size || 20} height={props.size || 20} fill="currentColor" className={props?.className || ""}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

function AnimatedCounter({ end, suffix = "" }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const counted = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el || counted.current) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !counted.current) {
          counted.current = true
          let start = 0
          const duration = 1500
          const step = Math.ceil(end / (duration / 16))
          const timer = setInterval(() => {
            start += step
            if (start >= end) {
              setCount(end)
              clearInterval(timer)
            } else setCount(start)
          }, 16)
        }
      },
      { threshold: 0.5 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [end])

  return (
    <div ref={ref} className="font-heading tabular-nums">
      {count}{suffix}
    </div>
  )
}

function ProgressBar({ value, label, max = 100 }: { value: number; label: string; max?: number }) {
  const pct = Math.min(Math.round((value / max) * 100), 100)
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-white/80">{label}</span>
        <span className="text-white/60 font-mono">{value.toLocaleString()}</span>
      </div>
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-accent to-accent/70 rounded-full transition-all duration-1000"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

const scopeCategories = [
  {
    icon: Globe, title: "Public Website", complexity: "Enterprise",
    hours: "80", value: "Patient-facing portal — 30+ pages including doctors, hospitals, treatments, specialties, blogs, testimonials, cost calculator, tourism guide, search, and legal pages. Designed to convert visitors into leads.",
    items: 26, files: 45, details: ["Hero with stats & specialties grid", "Doctor & hospital directories with filters", "218 treatment packages with cost", "Full-site fuzzy search", "Blog with RSS", "Patient testimonials gallery", "Medical tourism guide", "Cost calculator", "SEO metadata on every page"],
  },
  {
    icon: LayoutDashboard, title: "Admin Control Panel", complexity: "Enterprise",
    hours: "60", value: "Full admin dashboard to manage all site content, leads, emails, and settings without touching code. Role-based access for team collaboration.",
    items: 19, files: 32, details: ["Dashboard with stats & pipeline", "CRUD for doctors, hospitals, treatments, blogs", "Lead & inquiry management", "Email inbox with threading", "Email marketing campaigns", "Newsletter subscribers", "Admin user management", "Dynamic site settings"],
  },
  {
    icon: Database, title: "Database Architecture", complexity: "High",
    hours: "35", value: "14-table PostgreSQL schema on Supabase with Row-Level Security, proper foreign keys, and comprehensive seed data (1700+ doctors, 16 hospitals, 218 packages).",
    items: 14, files: 12, details: ["14 tables with relationships & RLS", "8 migration files, 1,152 lines SQL", "1700+ doctor profiles seeded", "16 hospitals with full metadata", "8 insurance companies", "9+ hotels near hospitals", "59 configurable image slots", "Public read / admin write security"],
  },
  {
    icon: Server, title: "API Layer", complexity: "High",
    hours: "35", value: "23 REST API endpoints connecting frontend to backend — contact forms, lead capture, email sending, admin CRUD, sitemap generation, image proxy, and more.",
    items: 23, files: 28, details: ["13 admin API routes", "10 public API routes", "Contact & inquiry form handlers", "Newsletter subscription", "Dynamic XML sitemap generation", "RSS feed generation", "Image proxy for external images", "File upload to Supabase Storage"],
  },
  {
    icon: Mail, title: "Email System", complexity: "High",
    hours: "30", value: "Dual email architecture — transactional emails via Resend (lead alerts, confirmations) plus a Cloudflare Workers-powered inbound email handler with full MIME parsing and search.",
    items: 12, files: 10, details: ["Transactional via Resend API", "Lead notification to admin (HTML table)", "Customer confirmation with WhatsApp link", "Cloudflare Workers email handler", "Full MIME parser (multipart, base64)", "Email threading via parent_id", "Full-text search (FTS5)", "Attachment storage & retrieval"],
  },
  {
    icon: PaletteIcon, title: "Design System", complexity: "High",
    hours: "45", value: "Custom-designed UI across 55+ components with a full DESIGN.md spec — proprietary color palette, typography scale, shadows, animations, and Radix UI primitives.",
    items: 55, files: 16, details: ["Full DESIGN.md specification (516 lines)", "60+ custom Tailwind color tokens", "10 levels of font-size scale", "Playfair Display + Inter font pairing", "Framer Motion animations", "Radix UI primitives (6 packages)", "Class Variance Authority variants", "Two-canvas dark/light system"],
  },
  {
    icon: MessageCircle, title: "WhatsApp & Engagement", complexity: "Medium",
    hours: "15", value: "Direct patient communication via floating WhatsApp button with pre-filled templates, callback requests, social media integration, and configurable contact points.",
    items: 8, files: 5, details: ["Floating WhatsApp button with animation", "Multiple message templates", "Callback request system", "Phone call button", "Social media links (5 platforms)", "WhatsApp in email confirmations", "Configurable via site settings", "Pulsing CSS engagement animation"],
  },
  {
    icon: Shield, title: "Security & Monitoring", complexity: "Medium",
    hours: "20", value: "Admin authentication via Supabase Auth, role-based access, Row-Level Security on all tables, Rollbar error monitoring (client + server), and security HTTP headers.",
    items: 10, files: 8, details: ["Supabase Auth for admin login", "3 role levels (super_admin, editor, viewer)", "Row-Level Security on all tables", "Admin session cookie validation", "Route protection middleware", "Rollbar error monitoring", "HTML sanitization", "Security headers (X-Frame-Options, etc.)"],
  },
]

const techRadar = [
  { name: "Next.js 16", role: "Application Framework", why: "SSR + static generation for SEO, App Router for nested layouts, React 19 support" },
  { name: "React 19", role: "UI Library", why: "Latest React with improved useRef, concurrent features, server components" },
  { name: "TypeScript", role: "Language", why: "Type safety across 170+ files, prevents runtime errors, improves maintainability" },
  { name: "Supabase", role: "Database & Auth", why: "Managed PostgreSQL with real-time, auth, storage, and RLS in one service" },
  { name: "Tailwind CSS", role: "Styling", why: "Utility-first with 60+ custom design tokens, responsive by default" },
  { name: "Framer Motion", role: "Animations", why: "Declarative animations with spring physics, layout transitions" },
  { name: "Radix UI", role: "Primitives", why: "Accessible headless UI components with full keyboard navigation" },
  { name: "Fuse.js", role: "Search", why: "Client-side fuzzy search across 7 entity types, no server cost" },
  { name: "Resend", role: "Email", why: "Modern email API with high deliverability, React Email support" },
  { name: "Cloudflare Workers", role: "Email Handler", why: "Edge-based email processing, no server to manage" },
  { name: "Rollbar", role: "Monitoring", why: "Real-time error tracking with source maps, session replay" },
  { name: "Vercel", role: "Deployment", why: "Zero-config Next.js deployment, global CDN, preview deployments" },
]

export default function ProjectOverviewPage() {
  const [openSection, setOpenSection] = useState<string | null>(null)
  const [shareOpen, setShareOpen] = useState(false)
  const [readmeContent, setReadmeContent] = useState<string | null>(null)
  const [readmeLoading, setReadmeLoading] = useState(true)

  useEffect(() => {
    fetch("/api/readme")
      .then((r) => r.json())
      .then((data) => { setReadmeContent(data.content ?? null); setReadmeLoading(false) })
      .catch(() => setReadmeLoading(false))
  }, [])

  const scrollY = useScrollPosition()
  const showBackToTop = scrollY > 600

  return (
    <div className="min-h-screen bg-surface overflow-x-hidden">
      <meta name="robots" content="noindex, nofollow" />

      <ShareModal open={shareOpen} onClose={() => setShareOpen(false)} />

      <button
        onClick={() => setShareOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-accent text-white shadow-btn-accent flex items-center justify-center hover:bg-accent/90 hover:scale-105 active:scale-95 transition"
        aria-label="Share this page"
      >
        <Share2 size={20} />
      </button>

      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`fixed bottom-6 left-6 z-40 w-12 h-12 rounded-full bg-primary text-white shadow-elevation-3 flex items-center justify-center hover:bg-primary/90 hover:scale-105 active:scale-95 transition duration-300 ${showBackToTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}
        aria-label="Back to top"
      >
        <ArrowUp size={20} />
      </button>

      {/* ── HERO ── */}
      <section className="relative bg-canvas-night overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_#0B3954_30%,_transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_#C9963A15_0%,_transparent_50%)]" />
        <div className="hidden lg:block absolute top-20 right-20 w-72 h-72 border border-accent/10 rounded-full blur-3xl" />
        <div className="hidden lg:block absolute bottom-10 left-10 w-96 h-96 border border-white/5 rounded-full blur-3xl" />
        <div className="relative max-w-cinematic mx-auto px-6 py-24 md:py-36">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-pill bg-accent/10 text-accent text-sm font-medium mb-6 border border-accent/20">
              <Award size={16} />
              Complete Project Overview
            </div>
            <h1 className="font-heading text-display-lg md:text-display-xl text-white leading-tight mb-4">
              Med Solution Healthcare
            </h1>
            <p className="text-xl md:text-2xl text-white/60 font-heading font-normal mb-3">
              Medical Tourism Facilitation Platform
            </p>
            <p className="text-lg text-white/60 max-w-3xl mx-auto mb-10 leading-relaxed">
              A comprehensive digital platform connecting international patients with India&apos;s top
              healthcare providers — featuring a polished public website, full admin panel, email system,
              and complete SEO infrastructure.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://medsolutionhealthcare.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-pill bg-accent text-white font-semibold hover:bg-accent/90 transition shadow-btn-accent"
              >
                Visit Live Site <ExternalLink size={18} />
              </a>
              <Link
                href="/contact-us"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-pill bg-white/10 text-white font-semibold hover:bg-white/20 transition border border-white/10"
              >
                Request Full Walkthrough <ArrowUpRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROJECT DNA ── */}
      <FadeInSection>
        <section className="relative -mt-14 px-6 z-10">
          <div className="max-w-cinematic mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { value: 29919, label: "Lines of Code", suffix: "+", icon: Code2, color: "text-accent" },
                { value: 658, label: "Total Files", suffix: "", icon: Layers, color: "text-accent" },
                { value: 50, label: "Pages Built", suffix: "", icon: Grid3X3, color: "text-accent" },
                { value: 23, label: "API Endpoints", suffix: "", icon: Server, color: "text-accent" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="group bg-white rounded-xl shadow-elevation-3 p-5 sm:p-6 border border-hairline-light hover:shadow-elevation-4 transition"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center group-hover:scale-110 transition">
                      <s.icon size={18} className={s.color} />
                    </div>
                    <div className="text-3xl font-heading text-primary tabular-nums">
                      <AnimatedCounter end={s.value} suffix={s.suffix} />
                    </div>
                  </div>
                  <div className="text-sm text-neutral-600">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* ── SCOPE OF WORK ── */}
      <FadeInSection delay={100}>
        <section className="px-6 py-20">
        <div className="max-w-cinematic mx-auto">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-pill bg-primary/5 text-primary text-sm font-medium mb-4">
              <Activity size={14} />
              Scope of Work
            </div>
            <h2 className="font-heading text-display-md md:text-display-lg text-primary mb-3">
              What Was Built
            </h2>
            <p className="text-neutral-600 max-w-2xl mx-auto text-lg">
              A complete end-to-end medical tourism platform spanning eight major work areas.
              Each category represents weeks of focused development.
            </p>
          </div>

          {/* Effort Summary Bar */}
          <div className="bg-white rounded-xl shadow-elevation-2 border border-hairline-light p-6 md:p-8 mb-10">
            <h3 className="font-heading text-heading-md text-primary mb-5">Estimated Effort by Module</h3>
            <div className="space-y-4">
              {[
                { label: "Public Website", hours: 80, bars: "w-full",    cap: "Enterprise" },
                { label: "Admin Panel", hours: 60, bars: "w-[75%]",   cap: "Enterprise" },
                { label: "Design System", hours: 45, bars: "w-[56%]",   cap: "High" },
                { label: "Database Architecture", hours: 35, bars: "w-[44%]",   cap: "High" },
                { label: "API Layer", hours: 35, bars: "w-[44%]",   cap: "High" },
                { label: "Email System", hours: 30, bars: "w-[38%]",   cap: "High" },
                { label: "Security & Monitoring", hours: 20, bars: "w-[25%]",   cap: "Medium" },
                { label: "WhatsApp & Engagement", hours: 15, bars: "w-[19%]",   cap: "Medium" },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-neutral-700 font-medium">{item.label}</span>
                    <span className="text-neutral-500">
                      ~{item.hours} hrs
                      <span className="ml-3 inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-primary/5 text-primary">
                        {item.cap}
                      </span>
                    </span>
                  </div>
                  <div className="h-3 bg-neutral-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${item.bars === "w-full" ? "bg-gradient-to-r from-accent to-accent/70" : "bg-gradient-to-r from-primary to-primary/60"}`}
                      style={{ width: item.cap === "Enterprise" ? "100%" : item.cap === "High" ? "66%" : "33%" }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-hairline-light flex flex-wrap justify-between items-center gap-4 text-sm">
              <div className="flex gap-6">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-accent" /> Enterprise</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-primary" /> High</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-neutral-400" /> Medium</span>
              </div>
              <span className="text-neutral-600 font-medium">~320+ total development hours</span>
            </div>
          </div>

          {/* Scope Cards */}
          <div className="space-y-5">
            {scopeCategories.map((cat) => {
              const isOpen = openSection === cat.title
              return (
                <div
                  key={cat.title}
                  className={`bg-white rounded-xl shadow-elevation-2 border border-hairline-light transition-all ${isOpen ? "shadow-elevation-3" : "hover:shadow-elevation-3"}`}
                >
                  <button
                    onClick={() => setOpenSection(isOpen ? null : cat.title)}
                    className="w-full flex items-start gap-4 p-5 md:p-6 text-left"
                  >
                    <div className="w-11 h-11 rounded-lg bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                      <cat.icon size={22} className="text-accent" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-3 mb-1">
                        <h3 className="font-heading text-heading-md text-primary">{cat.title}</h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold ${cat.complexity === "Enterprise" ? "bg-accent/10 text-accent" : cat.complexity === "High" ? "bg-primary/5 text-primary" : "bg-neutral-100 text-neutral-600"}`}>
                          {cat.complexity}
                        </span>
                          <span className="text-xs text-neutral-500">~{cat.hours} hrs</span>
                      </div>
                      <p className="text-sm text-neutral-600 leading-relaxed">{cat.value}</p>
                      <div className="flex flex-wrap gap-3 mt-2 text-xs text-neutral-500">
                        <span>{cat.items} feature groups</span>
                        <span>{cat.files} files</span>
                      </div>
                    </div>
                    <div className={`shrink-0 w-7 h-7 rounded-full bg-neutral-100 flex items-center justify-center transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}>
                      <ChevronDown size={14} className="text-neutral-500" />
                    </div>
                  </button>
                  {isOpen && (
                    <div className="px-5 md:px-6 pb-5 md:pb-6 pt-0">
                      <div className="border-t border-hairline-light pt-4">
                        <ul className="grid sm:grid-cols-2 gap-2">
                          {cat.details.map((d) => (
                            <li key={d} className="flex items-start gap-2 text-sm text-neutral-700">
                              <CheckCircle size={15} className="text-accent shrink-0 mt-0.5" />
                              <span>{d}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>
      </FadeInSection>

      {/* ── CODEBASE STATISTICS ── */}
      <FadeInSection delay={200}>
        <section className="bg-canvas-night px-6 py-20">
        <div className="max-w-cinematic mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-pill bg-accent/10 text-accent text-sm font-medium mb-4">
              <BarChart3 size={14} />
              Codebase Statistics
            </div>
            <h2 className="font-heading text-display-md text-white mb-3">
              By the Numbers
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              Nearly 30,000 lines of production TypeScript/React code across 658 files.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="font-heading text-heading-sm text-white mb-5">Source Code by Directory</h3>
              <div className="space-y-3">
                <ProgressBar value={11956} label="lib/ (Utilities, data, clients)" max={29919} />
                <ProgressBar value={9450} label="app/ (Pages, API routes)" max={29919} />
                <ProgressBar value={5484} label="components/ (React components)" max={29919} />
                <ProgressBar value={1152} label="supabase/ (SQL migrations)" max={29919} />
                <ProgressBar value={853} label="scripts/ (Seed, crawl, generate)" max={29919} />
                <ProgressBar value={475} label="workers/ (Email handler)" max={29919} />
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="font-heading text-heading-sm text-white mb-5">Project Composition</h3>
              <div className="space-y-4">
                {[
                  { label: "TypeScript React (.tsx)", value: 125, color: "bg-accent" },
                  { label: "TypeScript (.ts)", value: 53, color: "bg-primary-mid" },
                  { label: "JavaScript (.mjs / .js)", value: 9, color: "bg-aloe-50" },
                  { label: "SQL migrations", value: 10, color: "bg-link-cool-2" },
                  { label: "CSS", value: 1, color: "bg-pistachio-10" },
                ].map((item) => {
                  const pct = Math.round((item.value / 198) * 100)
                  return (
                    <div key={item.label}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-white/80">{item.label}</span>
                        <span className="text-white/60 font-mono">{item.value} files</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${item.color}`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="mt-5 pt-4 border-t border-white/10">
                <div className="flex justify-between text-sm">
                  <span className="text-white/80">Total source files</span>
                  <span className="text-white font-medium">198</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-white/80">Images &amp; assets</span>
                  <span className="text-white font-medium">291</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-white/80">JSON data &amp; documentation</span>
                  <span className="text-white font-medium">137</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      </FadeInSection>

      {/* ── TECHNOLOGY RADAR ── */}
      <FadeInSection delay={300}>
        <section className="px-6 py-20">
        <div className="max-w-cinematic mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-pill bg-primary/5 text-primary text-sm font-medium mb-4">
              <Cpu size={14} />
              Technology Stack
            </div>
            <h2 className="font-heading text-display-md text-primary mb-3">
              Architecture Decisions
            </h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              Every technology was chosen for a specific reason — performance, developer experience,
              scalability, or cost-effectiveness.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {techRadar.map((tech) => (
              <div
                key={tech.name}
                className="group bg-white rounded-xl shadow-elevation-2 border border-hairline-light p-5 hover:shadow-elevation-3 transition"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-heading text-heading-sm text-primary">{tech.name}</h3>
                  <div className="w-6 h-6 rounded bg-accent/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                    <CheckCircle size={14} className="text-accent" />
                  </div>
                </div>
                <div className="text-xs text-accent uppercase tracking-wider font-medium mb-1.5">{tech.role}</div>
                <p className="text-sm text-neutral-600 leading-relaxed">{tech.why}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      </FadeInSection>

      {/* ── BUSINESS VALUE ── */}
      <FadeInSection delay={400}>
        <section className="bg-gradient-to-br from-primary/5 to-transparent px-6 py-20">
        <div className="max-w-cinematic mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-pill bg-accent/10 text-accent text-sm font-medium mb-4">
              <TrendingUp size={14} />
              Business Value
            </div>
            <h2 className="font-heading text-display-md text-primary mb-3">
              What This Means for Your Business
            </h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              Every feature was built with a specific business outcome in mind — reducing manual work,
              increasing patient conversions, and establishing digital authority.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Globe, title: "Global Reach", desc: "30+ SEO-optimized pages bring international patients directly from search engines", metric: "SEO pages", value: "30+" },
              { icon: Users, title: "Lead Generation", desc: "Contact forms, inquiry system, and WhatsApp integration capture every visitor", metric: "Conversion paths", value: "6+" },
              { icon: LayoutDashboard, title: "Operational Control", desc: "Admin panel eliminates developer dependency for content, leads, and email management", metric: "Admin screens", value: "19" },
              { icon: Shield, title: "Brand Authority", desc: "Professional design, 10 types of structured data, testimonials, and accreditations build trust", metric: "Schema types", value: "10" },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-xl shadow-elevation-2 border border-hairline-light p-6">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <item.icon size={20} className="text-accent" />
                </div>
                <h3 className="font-heading text-heading-sm text-primary mb-2">{item.title}</h3>
                <p className="text-sm text-neutral-600 leading-relaxed mb-4">{item.desc}</p>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-neutral-500">{item.metric}:</span>
                  <span className="font-heading text-lg text-accent">{item.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      </FadeInSection>

      {/* ── DATA SUMMARY ── */}
      <FadeInSection delay={500}>
        <section className="px-6 py-20">
        <div className="max-w-cinematic mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-pill bg-primary/5 text-primary text-sm font-medium mb-4">
              <BookOpen size={14} />
              Data & Content
            </div>
            <h2 className="font-heading text-display-md text-primary mb-3">
              Content & Data Library
            </h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              The platform ships with extensive pre-loaded content so it launches with real data,
              not placeholders.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { label: "Doctor Profiles", value: "1700+", detail: "With specializations and hospital affiliations" },
              { label: "Treatment Packages", value: "218", detail: "With cost estimates and recovery info" },
              { label: "Hospitals", value: "16", detail: "Delhi/NCR hospitals with accreditations" },
              { label: "Medical Specialties", value: "12", detail: "With dedicated landing pages" },
              { label: "Insurance Partners", value: "8", detail: "With coverage details" },
              { label: "Patient Testimonials", value: "8+", detail: "With video and photo options" },
              { label: "Hotel Accommodations", value: "15+", detail: "Near major hospitals" },
              { label: "Image Slots", value: "59", detail: "Configurable site-wide image slots" },
            ].map((d) => (
              <div key={d.label} className="bg-white rounded-xl shadow-elevation-2 border border-hairline-light p-6 text-center hover:shadow-elevation-3 transition">
                <div className="font-heading text-3xl text-accent mb-1">{d.value}</div>
                <div className="font-medium text-primary mb-1">{d.label}</div>
                <div className="text-xs text-neutral-600">{d.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      </FadeInSection>

      {/* ── README VIEWER ── */}
      <FadeInSection delay={500}>
        <section className="px-6 py-20">
        <div className="max-w-cinematic mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-pill bg-primary/5 text-primary text-sm font-medium mb-4">
              <FileText size={14} />
              README
            </div>
            <h2 className="font-heading text-display-md text-primary mb-3">
              Full Project README
            </h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              The complete project documentation, automatically loaded from the repository's README.md.
            </p>
          </div>

          {readmeLoading && (
            <div className="flex items-center justify-center py-16">
              <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {!readmeLoading && readmeContent && (
            <div className="bg-white rounded-xl shadow-elevation-2 border border-hairline-light p-6 md:p-10 max-w-4xl mx-auto">
              <MarkdownRenderer content={readmeContent} />
            </div>
          )}

          {!readmeLoading && !readmeContent && (
            <div className="text-center py-16 text-neutral-500">
              <FileText size={40} className="mx-auto mb-3 opacity-40" />
              <p>Unable to load README.md content.</p>
            </div>
          )}
        </div>
      </section>
      </FadeInSection>

      {/* ── COMPARISON / CONTEXT ── */}
      <FadeInSection delay={600}>
        <section className="bg-canvas-night px-6 py-20">
        <div className="max-w-cinematic mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-pill bg-accent/10 text-accent text-sm font-medium mb-4">
              <Eye size={14} />
              Project Context
            </div>
            <h2 className="font-heading text-display-md text-white mb-3">
              Understanding the Investment
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              This is not a template or a theme — it is a fully custom-built platform with production-grade
              architecture, security, and data.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="font-heading text-heading-sm text-white mb-4 flex items-center gap-2">
                <CheckCircle size={16} className="text-aloe-50" />
                Included
              </h3>
              <ul className="space-y-2.5">
                {[
                  "Custom Next.js 16 + React 19 architecture",
                  "Full public website (30+ pages)",
                  "Complete admin panel (19 screens)",
                  "Supabase PostgreSQL database (14 tables)",
                  "23 REST API endpoints",
                  "Transactional + inbound email system",
                  "Cloudflare email worker",
                  "WhatsApp integration",
                  "Full-text search across 7 entities",
                  "10 JSON-LD structured data types",
                  "Dynamic XML sitemap & RSS feed",
                  "SEO metadata on every page",
                  "Role-based admin access",
                  "Row-Level Security on all tables",
                  "Error monitoring (Rollbar)",
                  "Custom design system (55+ components)",
                  "Framer Motion animations",
                  "291 images & assets",
                  "1700+ doctor profiles pre-loaded",
                  "218 treatment packages pre-loaded",
                  "Responsive design (mobile + desktop)",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-white/70">
                    <CheckCircle size={15} className="text-aloe-50 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="font-heading text-heading-sm text-white mb-4 flex items-center gap-2">
                <Activity size={16} className="text-white/40" />
                Scope Indicators
              </h3>
              <div className="space-y-5">
                {[
                  { label: "Total source code", value: "29,919 lines", pct: 100 },
                  { label: "Custom React components", value: "65 components", pct: 100 },
                  { label: "NPM packages managed", value: "33 packages", pct: 100 },
                  { label: "Database tables designed", value: "14 tables", pct: 100 },
                  { label: "SQL migration code", value: "1,152 lines", pct: 100 },
                  { label: "Custom CSS/Tailwind config", value: "206 lines", pct: 100 },
                  { label: "JSON-LD schema generators", value: "10 types", pct: 100 },
                  { label: "Cyber security layers", value: "8 measures", pct: 100 },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-white/60">{s.label}</span>
                      <span className="text-white font-medium">{s.value}</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-accent to-accent/60 rounded-full" style={{ width: `${s.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      </FadeInSection>

      {/* ── ESTIMATED EFFORT ── */}
      <FadeInSection delay={700}>
        <section className="px-6 py-20">
        <div className="max-w-cinematic mx-auto">
          <div className="bg-gradient-to-br from-primary to-primary/90 rounded-2xl p-8 md:p-12">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-pill bg-white/10 text-white/90 text-sm font-medium mb-4">
                <Clock size={14} />
                Development Summary
              </div>
              <h2 className="font-heading text-display-md text-white mb-3">
                Project at a Glance
              </h2>
              <p className="text-white/60 max-w-xl mx-auto">
                A production-ready medical tourism platform — built with modern technology,
                comprehensive data, and a focus on converting visitors into patients.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-3xl mx-auto">
              {[
                { value: "~320+", label: "Development Hours", sub: "Across 8 modules" },
                { value: "29,919", label: "Lines of Code", sub: "TypeScript + SQL" },
                { value: "658", label: "Total Files", sub: "Including 291 images" },
                { value: "33", label: "NPM Packages", sub: "Curated dependencies" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <div className="font-heading text-3xl md:text-4xl text-accent mb-1">{s.value}</div>
                  <div className="text-white font-medium text-sm">{s.label}</div>
                  <div className="text-white/50 text-xs mt-0.5">{s.sub}</div>
                </div>
              ))}
            </div>
            <div className="mt-10 pt-8 border-t border-white/10 text-center">
              <p className="text-white/60 text-sm max-w-2xl mx-auto mb-6">
                This project delivers a turnkey digital presence for a medical tourism facilitator —
                from the first line of code to live deployment on Vercel with SSL, custom domain,
                email system, and monitoring.
              </p>
              <a
                href="https://medsolutionhealthcare.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-pill bg-accent text-white font-semibold hover:bg-accent/90 transition shadow-btn-accent"
              >
                Visit Live Site <ExternalLink size={18} />
              </a>
            </div>
          </div>
        </div>
      </section>
      </FadeInSection>

      {/* ── CTA ── */}
      <FadeInSection delay={800}>
        <section className="px-6 pb-20">
        <div className="max-w-cinematic mx-auto">
          <div className="bg-white rounded-xl shadow-elevation-3 border border-hairline-light p-8 md:p-12 text-center">
            <h2 className="font-heading text-display-md text-primary mb-3">
              Want a Full Walkthrough?
            </h2>
            <p className="text-neutral-600 max-w-xl mx-auto mb-8">
              We&apos;ll show you the admin panel, email system, database architecture, and every feature
              in detail — live on a call.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/contact-us"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-pill bg-primary text-white font-semibold hover:bg-primary/90 transition"
              >
                Schedule a Demo <ArrowUpRight size={18} />
              </Link>
              <a
                href="mailto:info@medsolutionhealthcare.com"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-pill border border-hairline-light text-primary font-semibold hover:bg-neutral-50 transition"
              >
                <Mail size={18} />
                info@medsolutionhealthcare.com
              </a>
            </div>
            <div className="mt-6 pt-4 border-t border-hairline-light text-xs text-neutral-500">
              <span className="font-medium">Med Solution Healthcare</span> &nbsp;·&nbsp; Unit No. 36, Living Style Mall, Jasola, New Delhi - 110025 &nbsp;·&nbsp; +91-8285068544
            </div>
          </div>
        </div>
      </section>
      </FadeInSection>
    </div>
  )
}

function PaletteIcon(props: { size?: number; className?: string }) {
  return (
    <svg width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
      <circle cx="13.5" cy="6.5" r="0.5" fill="currentColor" />
      <circle cx="17.5" cy="10.5" r="0.5" fill="currentColor" />
      <circle cx="8.5" cy="7.5" r="0.5" fill="currentColor" />
      <circle cx="6.5" cy="12.5" r="0.5" fill="currentColor" />
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.93 0 1.5-.67 1.5-1.5 0-.36-.15-.7-.38-.94-.21-.23-.38-.55-.38-.94 0-.83.67-1.5 1.5-1.5h4.38c3.28 0 5.38-2.12 5.38-5.12C22 6.5 17.5 2 12 2z" />
    </svg>
  )
}
