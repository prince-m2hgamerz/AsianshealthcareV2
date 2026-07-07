"use client";

import { useEffect, useState } from "react";
import LeadsTable, { type Lead } from "@/components/admin/LeadsTable";

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/leads")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setLeads(data as Lead[]);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleUpdateLead = async (
    lead: Lead,
    updates: Partial<Pick<Lead, "status" | "notes" | "assigned_to">>
  ) => {
    const res = await fetch("/api/admin/leads", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: lead.id, ...updates }),
    });

    if (!res.ok) {
      console.error("Failed to update lead");
      return;
    }

    setLeads((current) => current.map((item) => item.id === lead.id ? { ...item, ...updates } : item));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-heading-xl text-text">Leads</h1>
      </div>
      <LeadsTable leads={leads} loading={loading} onUpdateLead={handleUpdateLead} />
    </div>
  );
}
