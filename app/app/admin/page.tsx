"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Activity, ArrowRight, Building2, MessageSquare, Stethoscope, TrendingUp, Users } from "lucide-react";
import StatsCard from "@/components/admin/StatsCard";

type LeadStatus = "new" | "contacted" | "converted" | "closed";

interface RecentLead {
  id: string;
  name: string;
  type: string;
  country: string;
  status: LeadStatus;
  date: string;
}

interface DashboardData {
  totalLeads: number;
  todayCount: number;
  recentLeads: RecentLead[];
  pipeline: Record<LeadStatus, number>;
  counts: {
    doctors: number;
    hospitals: number;
    treatments: number;
  };
}

const statusColors: Record<LeadStatus, string> = {
  new: "bg-accent-light text-accent-text",
  contacted: "bg-primary-tint text-primary-mid",
  converted: "bg-accent-light text-accent-text",
  closed: "bg-border text-text-muted",
};

const pipelineLabels: Record<LeadStatus, string> = {
  new: "New",
  contacted: "Contacted",
  converted: "Converted",
  closed: "Closed",
};

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/leads-data")
      .then((res) => res.json())
      .then((json: DashboardData) => {
        setData(json);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const recentLeads = data?.recentLeads ?? [];
  const leadCount = data?.totalLeads ?? 0;
  const todayCount = data?.todayCount ?? 0;
  const pipeline = data?.pipeline ?? { new: 0, contacted: 0, converted: 0, closed: 0 };
  const counts = data?.counts ?? { doctors: 0, hospitals: 0, treatments: 0 };

  const convertedCount = pipeline.converted;
  const conversionRate = leadCount > 0 ? Math.round((convertedCount / leadCount) * 100) : 0;
  const pipelineMax = useMemo(() => Math.max(...Object.values(pipeline), 1), [pipeline]);

  const stats = [
    { label: "Total Leads", value: loading ? "..." : leadCount.toLocaleString(), change: "all inquiries", icon: MessageSquare, color: "bg-accent/10" },
    { label: "New Today", value: loading ? "..." : String(todayCount), change: "since midnight", icon: Activity, color: "bg-primary-tint" },
    { label: "Conversion Rate", value: loading ? "..." : `${conversionRate}%`, change: `${convertedCount} converted`, icon: TrendingUp, color: "bg-accent/10" },
    { label: "Content Library", value: loading ? "..." : (counts.doctors + counts.hospitals + counts.treatments).toLocaleString(), change: "doctors, hospitals, treatments", icon: Users, color: "bg-primary-tint" },
  ];

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-caption text-text-muted">Operational overview</p>
          <h1 className="font-display text-display-md text-text">Dashboard</h1>
        </div>
        <Link href="/admin/leads" className="btn-primary inline-flex gap-2 self-start lg:self-auto">
          <span className="hidden sm:inline">Manage Leads</span>
          <span className="sm:hidden">Leads</span>
          <ArrowRight size={18} />
        </Link>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatsCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-lg border border-border bg-surface-white p-6 shadow-card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-heading-md text-text">Recent Leads</h2>
            <Link href="/admin/leads" className="text-caption text-text-muted hover:text-text">View all</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-body-md">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="pb-3 text-caption font-medium uppercase tracking-wider text-text-muted">Name</th>
                  <th className="pb-3 text-caption font-medium uppercase tracking-wider text-text-muted">Type</th>
                  <th className="pb-3 text-caption font-medium uppercase tracking-wider text-text-muted">Country</th>
                  <th className="pb-3 text-caption font-medium uppercase tracking-wider text-text-muted">Status</th>
                  <th className="pb-3 text-caption font-medium uppercase tracking-wider text-text-muted">Date</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <tr key={index} className="border-b border-border">
                      <td colSpan={5} className="py-3">
                        <div className="h-5 animate-pulse rounded bg-surface" />
                      </td>
                    </tr>
                  ))
                ) : recentLeads.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-caption text-text-muted">
                      No leads yet.
                    </td>
                  </tr>
                ) : (
                  recentLeads.map((lead) => (
                    <tr key={lead.id} className="border-b border-border last:border-0">
                      <td className="py-3 font-medium text-text">{lead.name}</td>
                      <td className="py-3 text-text-muted">{lead.type}</td>
                      <td className="py-3 text-text-muted">{lead.country}</td>
                      <td className="py-3">
                        <span className={`rounded-full px-2 py-0.5 text-micro capitalize ${statusColors[lead.status]}`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="py-3 text-text-muted">{lead.date}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border border-border bg-surface-white p-6 shadow-card">
            <h2 className="font-display text-heading-md text-text">Lead Pipeline</h2>
            <div className="mt-5 space-y-4">
              {statusOptions().map((status) => (
                <div key={status}>
                  <div className="mb-1.5 flex items-center justify-between text-caption">
                    <span className="text-text-muted">{pipelineLabels[status]}</span>
                    <span className="font-medium text-text">{pipeline[status]}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-surface">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${Math.max((pipeline[status] / pipelineMax) * 100, pipeline[status] > 0 ? 8 : 0)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 xl:grid-cols-1">
            <ContentLink href="/admin/doctors" icon={Stethoscope} label="Doctors" value={counts.doctors} />
            <ContentLink href="/admin/hospitals" icon={Building2} label="Hospitals" value={counts.hospitals} />
            <ContentLink href="/admin/treatments" icon={Activity} label="Treatments" value={counts.treatments} />
          </div>
        </div>
      </div>
    </div>
  );
}

function statusOptions(): LeadStatus[] {
  return ["new", "contacted", "converted", "closed"];
}

function ContentLink({
  href,
  icon: Icon,
  label,
  value,
}: {
  href: string;
  icon: typeof Stethoscope;
  label: string;
  value: number;
}) {
  return (
    <Link href={href} className="flex items-center justify-between rounded-lg border border-border bg-surface-white p-4 sm:p-5 transition-colors hover:bg-surface shadow-card min-h-[60px]">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10">
          <Icon size={20} className="text-text" />
        </div>
        <span className="font-display text-heading-sm text-text">{label}</span>
      </div>
      <span className="text-body-md font-medium text-text">{value.toLocaleString()}</span>
    </Link>
  );
}

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
