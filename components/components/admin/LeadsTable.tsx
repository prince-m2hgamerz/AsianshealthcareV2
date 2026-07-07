"use client";

import { useMemo, useState } from "react";
import { Download, Eye, Mail, Phone, Search, StickyNote } from "lucide-react";
import Modal from "@/components/admin/Modal";

export interface Lead {
  id: string;
  name: string;
  email?: string | null;
  phone: string;
  country: string;
  form_type: string;
  status: "new" | "contacted" | "converted" | "closed";
  created_at: string;
  notes?: string | null;
  message?: string | null;
  medical_condition?: string | null;
  doctor_preference?: string | null;
  insurance_company?: string | null;
  assigned_to?: string | null;
}

interface LeadsTableProps {
  leads: Lead[];
  loading?: boolean;
  onUpdateLead?: (lead: Lead, updates: Partial<Pick<Lead, "status" | "notes" | "assigned_to">>) => Promise<void>;
}

const statusColors: Record<Lead["status"], string> = {
  new: "bg-accent-light text-accent-text",
  contacted: "bg-primary-tint text-primary-mid",
  converted: "bg-accent-light text-accent-text",
  closed: "bg-border text-text-muted",
};

const statusOptions: Lead["status"][] = ["new", "contacted", "converted", "closed"];

export default function LeadsTable({ leads, loading = false, onUpdateLead }: LeadsTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [saving, setSaving] = useState(false);
  const [draft, setDraft] = useState<{ status: Lead["status"]; notes: string; assigned_to: string }>({
    status: "new",
    notes: "",
    assigned_to: "",
  });

  const leadTypes = useMemo(() => {
    return Array.from(new Set(leads.map((lead) => lead.form_type).filter(Boolean))).sort();
  }, [leads]);

  const filtered = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return leads.filter((lead) => {
      const matchesSearch =
        !normalizedSearch ||
        [lead.name, lead.email, lead.phone, lead.country, lead.form_type, lead.message, lead.medical_condition]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(normalizedSearch);
      const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
      const matchesType = typeFilter === "all" || lead.form_type === typeFilter;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [leads, search, statusFilter, typeFilter]);

  const openLead = (lead: Lead) => {
    setSelectedLead(lead);
    setDraft({
      status: lead.status,
      notes: lead.notes || "",
      assigned_to: lead.assigned_to || "",
    });
  };

  const exportCSV = () => {
    const headers = ["Name", "Email", "Phone", "Country", "Type", "Status", "Assigned To", "Date", "Notes"];
    const rows = filtered.map((lead) => [
      lead.name,
      lead.email || "",
      lead.phone,
      lead.country,
      lead.form_type,
      lead.status,
      lead.assigned_to || "",
      lead.created_at,
      lead.notes || "",
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `med-solution-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSave = async () => {
    if (!selectedLead || !onUpdateLead) return;

    setSaving(true);
    await onUpdateLead(selectedLead, {
      status: draft.status,
      notes: draft.notes,
      assigned_to: draft.assigned_to,
    });
    setSelectedLead(null);
    setSaving(false);
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
          <input
            type="search"
            placeholder="Search by name, country, phone, condition..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md border border-border bg-surface-white py-2.5 pl-10 pr-4 text-body-md text-text placeholder:text-text-muted focus:border-border-focus focus:outline-none"
          />
        </div>
        <div className="flex flex-wrap gap-3">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="flex-1 min-w-0 rounded-md border border-border bg-surface-white px-4 py-2.5 text-body-md text-text focus:border-border-focus focus:outline-none"
          >
            <option value="all">All Types</option>
            {leadTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="flex-1 min-w-0 rounded-md border border-border bg-surface-white px-4 py-2.5 text-body-md text-text focus:border-border-focus focus:outline-none"
          >
            <option value="all">All Status</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
            ))}
          </select>
          <button onClick={exportCSV} className="btn-outline flex items-center gap-2 whitespace-nowrap text-sm">
            <Download size={16} /> <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-surface-white shadow-card">
        <div className="border-b border-border px-4 py-3">
          <p className="text-caption text-text-muted">
            {loading ? "Loading leads..." : `${filtered.length.toLocaleString()} of ${leads.length.toLocaleString()} leads`}
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-body-md">
            <thead>
              <tr className="border-b border-border bg-surface text-left">
                <th className="p-3 sm:p-4 text-caption uppercase tracking-wider text-text-muted">Patient</th>
                <th className="p-3 sm:p-4 text-caption uppercase tracking-wider text-text-muted">Contact</th>
                <th className="p-3 sm:p-4 text-caption uppercase tracking-wider text-text-muted">Country</th>
                <th className="p-3 sm:p-4 text-caption uppercase tracking-wider text-text-muted">Type</th>
                <th className="p-3 sm:p-4 text-caption uppercase tracking-wider text-text-muted">Status</th>
                <th className="p-3 sm:p-4 text-caption uppercase tracking-wider text-text-muted">Date</th>
                <th className="p-3 sm:p-4 text-caption uppercase tracking-wider text-text-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 6 }).map((_, index) => (
                  <tr key={index} className="border-b border-border">
                    <td colSpan={7} className="p-3 sm:p-4">
                      <div className="h-5 animate-pulse rounded bg-surface" />
                    </td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-6 sm:p-8 text-center text-caption text-text-muted">
                    No leads found.
                  </td>
                </tr>
              ) : (
                filtered.map((lead) => (
                  <tr key={lead.id} className="border-b border-border transition-colors hover:bg-surface/50">
                    <td className="p-3 sm:p-4">
                      <p className="font-medium text-text">{lead.name}</p>
                      {lead.medical_condition && <p className="mt-1 max-w-[180px] sm:max-w-[220px] truncate text-caption text-text-muted">{lead.medical_condition}</p>}
                    </td>
                    <td className="p-3 sm:p-4 text-text-muted">
                      <div className="space-y-1">
                        <a href={`tel:${lead.phone}`} className="flex items-center gap-1.5 hover:text-text">
                          <Phone size={14} /> <span className="hidden sm:inline">{lead.phone}</span><span className="sm:hidden">{lead.phone}</span>
                        </a>
                        {lead.email && (
                          <a href={`mailto:${lead.email}`} className="hidden sm:flex items-center gap-1.5 hover:text-text">
                            <Mail size={14} /> {lead.email}
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="p-3 sm:p-4 text-text-muted">{lead.country}</td>
                    <td className="p-3 sm:p-4 text-text-muted">{lead.form_type}</td>
                    <td className="p-3 sm:p-4">
                      <span className={`rounded-full px-2 py-0.5 text-micro capitalize ${statusColors[lead.status] || "bg-border text-text-muted"}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="p-3 sm:p-4 text-text-muted whitespace-nowrap">{new Date(lead.created_at).toLocaleDateString()}</td>
                    <td className="p-3 sm:p-4">
                      <button
                        onClick={() => openLead(lead)}
                        className="inline-flex items-center justify-center rounded-md p-2 text-text-muted transition-colors hover:bg-surface hover:text-text"
                        title="View details"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={Boolean(selectedLead)} onClose={() => setSelectedLead(null)} title="Lead Details" size="lg">
        {selectedLead && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <LeadDetail label="Patient" value={selectedLead.name} />
              <LeadDetail label="Country" value={selectedLead.country} />
              <LeadDetail label="Phone" value={selectedLead.phone} href={`tel:${selectedLead.phone}`} />
              <LeadDetail label="Email" value={selectedLead.email || "-"} href={selectedLead.email ? `mailto:${selectedLead.email}` : undefined} />
              <LeadDetail label="Form Type" value={selectedLead.form_type} />
              <LeadDetail label="Created" value={new Date(selectedLead.created_at).toLocaleString()} />
              <LeadDetail label="Doctor Preference" value={selectedLead.doctor_preference || "-"} />
              <LeadDetail label="Insurance Company" value={selectedLead.insurance_company || "-"} />
            </div>

            {(selectedLead.medical_condition || selectedLead.message) && (
              <div className="rounded-lg border border-border bg-surface p-4">
                <h3 className="mb-2 flex items-center gap-2 font-display text-heading-sm text-text">
                  <StickyNote size={17} /> Case Summary
                </h3>
                {selectedLead.medical_condition && <p className="text-body-md leading-relaxed text-text-muted">{selectedLead.medical_condition}</p>}
                {selectedLead.message && <p className="mt-3 text-body-md leading-relaxed text-text-muted">{selectedLead.message}</p>}
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-caption text-text-muted">Status</label>
                <select
                  value={draft.status}
                  onChange={(event) => setDraft({ ...draft, status: event.target.value as Lead["status"] })}
                  className="w-full rounded-md border border-border px-3 py-2.5 text-body-md text-text focus:border-border-focus focus:outline-none"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-caption text-text-muted">Assigned To</label>
                <input
                  value={draft.assigned_to}
                  onChange={(event) => setDraft({ ...draft, assigned_to: event.target.value })}
                  className="w-full rounded-md border border-border px-3 py-2.5 text-body-md text-text focus:border-border-focus focus:outline-none"
                  placeholder="Case manager name"
                />
              </div>
              <div className="md:col-span-2">
                <label className="mb-1.5 block text-caption text-text-muted">Internal Notes</label>
                <textarea
                  value={draft.notes}
                  onChange={(event) => setDraft({ ...draft, notes: event.target.value })}
                  rows={4}
                  className="w-full rounded-md border border-border px-3 py-2.5 text-body-md text-text focus:border-border-focus focus:outline-none"
                  placeholder="Next action, follow-up date, documents pending..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-border pt-4">
              <button onClick={() => setSelectedLead(null)} className="btn-outline">Cancel</button>
              <button onClick={handleSave} disabled={saving || !onUpdateLead} className="btn-primary disabled:opacity-50">
                {saving ? "Saving..." : "Save Lead"}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function LeadDetail({ label, value, href }: { label: string; value: string; href?: string }) {
  return (
    <div>
      <p className="text-caption text-text-muted">{label}</p>
      {href ? (
        <a href={href} className="text-body-md text-text hover:text-text/70">{value}</a>
      ) : (
        <p className="text-body-md text-text">{value}</p>
      )}
    </div>
  );
}
