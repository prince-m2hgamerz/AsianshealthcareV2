"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  ArrowLeft,
  Bell,
  Inbox,
  LayoutDashboard,
  Users,
  Building2,
  Stethoscope,
  FileText,
  MessageSquare,
  Shield,
  Hotel,
  Settings,
  UserCog,
  Mail,
  Send,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarGroups = [
  {
    label: "Main",
    links: [
      { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
      { label: "Leads", href: "/admin/leads", icon: MessageSquare },
      { label: "Doctors", href: "/admin/doctors", icon: Stethoscope },
      { label: "Hospitals", href: "/admin/hospitals", icon: Building2 },
      { label: "Treatments", href: "/admin/treatments", icon: FileText },
    ],
  },
  {
    label: "Content",
    links: [
      { label: "Blogs", href: "/admin/blogs", icon: FileText },
      { label: "Testimonials", href: "/admin/testimonials", icon: Users },
      { label: "Insurance", href: "/admin/insurance", icon: Shield },
      { label: "Hotels", href: "/admin/hotels", icon: Hotel },
    ],
  },
  {
    label: "System",
    links: [
      { label: "Settings", href: "/admin/settings", icon: Settings },
      { label: "Users", href: "/admin/users", icon: UserCog },
      { label: "Subscribers", href: "/admin/subscribers", icon: Mail },
      { label: "Email Marketing", href: "/admin/email-marketing", icon: Send },
      { label: "Email Inbox", href: "/admin/emails", icon: Inbox },
    ],
  },
];

const allLinks = sidebarGroups.flatMap((g) => g.links);

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();
  const activePage = allLinks
    .slice()
    .reverse()
    .find((link) => pathname === link.href || pathname.startsWith(`${link.href}/`));

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border px-6 py-5">
        <Link href="/admin" className="font-display text-heading-sm tracking-wide text-primary">
          Med Solution <span className="text-accent">Admin</span>
        </Link>
        <button
          onClick={() => setMobileSidebar(false)}
          className="text-text-muted hover:text-text lg:hidden"
          aria-label="Close admin navigation"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-6">
        {sidebarGroups.map((group) => (
          <div key={group.label}>
            <p className="mb-2 px-3 text-eyebrow font-semibold uppercase tracking-[0.12em] text-accent">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.links.map((link) => {
                const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileSidebar(false)}
                    className={cn(
                      "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                      isActive
                        ? "bg-primary-tint text-primary"
                        : "text-text-muted hover:bg-primary-tint/50 hover:text-text"
                    )}
                  >
                    {isActive && (
                      <span className="absolute inset-y-2 left-0 w-0.5 rounded-full bg-accent" />
                    )}
                    <link.icon
                      size={18}
                      className={cn(
                        "shrink-0",
                        isActive ? "text-accent" : "group-hover:text-accent"
                      )}
                    />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="space-y-1 border-t border-border p-3">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-text-muted transition-all hover:bg-primary-tint/50 hover:text-text"
        >
          <ArrowLeft size={18} /> View Site
        </Link>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-text-muted transition-all hover:bg-primary-tint/50 hover:text-red-500"
        >
          <LogOut size={18} /> Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen overflow-x-hidden bg-surface">
      <aside className="fixed hidden h-full w-64 shrink-0 flex-col border-r border-border bg-surface-white lg:flex">
        {sidebar}
      </aside>

      {mobileSidebar && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileSidebar(false)}
          />
          <aside className="relative h-full w-64 bg-surface-white">
            {sidebar}
          </aside>
        </div>
      )}

      <div className="flex-1 min-w-0 lg:pl-64">
        <header className="sticky top-0 z-30 border-b border-border bg-surface-white/95 backdrop-blur">
          <div className="flex items-center justify-between px-4 py-3 lg:px-8">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileSidebar(true)}
                className="-ml-1 p-1 text-text lg:hidden"
                aria-label="Open admin navigation"
              >
                <Menu size={24} />
              </button>
              <div>
                <p className="text-eyebrow uppercase tracking-[0.12em] text-accent">Admin Panel</p>
                <h1 className="font-display text-heading-sm text-text">{activePage?.label || "Dashboard"}</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/" className="hidden text-sm sm:inline-flex btn-outline !px-4 !py-2">
                View Site
              </Link>
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border text-text-muted transition-colors hover:bg-surface hover:text-text"
                aria-label="Notifications"
              >
                <Bell size={18} />
              </button>
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-6 lg:p-8 overflow-x-auto">{children}</div>
      </div>
    </div>
  );
}
