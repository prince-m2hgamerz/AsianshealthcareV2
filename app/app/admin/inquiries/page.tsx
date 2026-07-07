"use client";

import { useEffect, useState } from "react";
import { Search, ChevronDown, ChevronUp, MessageSquare, CheckCircle2, Phone, XCircle } from "lucide-react";

interface Inquiry {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  country: string;
  form_type: string;
  medical_condition: string | null;
  message: string | null;
  status: string;
  created_at: string;
  notes: string | null;
}

const statusColors: Record<string, string> = {
  new: "bg-blue-100 text-blue-700",
  contacted: "bg-yellow-100 text-yellow-700",
  "in progress": "bg-purple-100 text-purple-700",
  converted: "bg-emerald-100 text-emerald-700",
  closed: "bg-gray-100 text-gray-500",
};

const statusIcons: Record<string, React.ComponentType<{ size?: string | number }>> = {
  new: MessageSquare,
  contacted: Phone,
  converted: CheckCircle2,
  closed: XCircle,
};

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/leads");
      if (res.ok) {
        const data = await res.json();
        setInquiries(data as Inquiry[]);
      }
    } catch {
      console.error("Failed to fetch inquiries");
    }
    setLoading(false);
  };

  useEffect(() => { fetchInquiries(); }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      await fetch("/api/admin/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      setInquiries((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
    } catch {
      alert("Failed to update status");
    }
  };

  const filtered = inquiries.filter((inq) => {
    const matchesSearch =
      inq.name.toLowerCase().includes(search.toLowerCase()) ||
      inq.email?.toLowerCase().includes(search.toLowerCase()) ||
      inq.country.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || inq.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Inquiries</h1>
        <span className="text-sm text-gray-500">{filtered.length} total</span>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, or country..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-200 pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#065c2c]"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:border-[#065c2c]"
        >
          <option value="all">All Status</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="in progress">In Progress</option>
          <option value="converted">Converted</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <MessageSquare size={48} className="mx-auto mb-3 text-gray-300" />
          <p className="text-lg font-medium text-gray-500">No inquiries found</p>
          <p className="text-sm mt-1">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((inq) => {
            const StatusIcon = statusIcons[inq.status] || MessageSquare;
            const isExpanded = expandedId === inq.id;
            return (
              <div key={inq.id} className="rounded-xl border border-gray-200 bg-white overflow-hidden">
                <button
                  onClick={() => setExpandedId(isExpanded ? null : inq.id)}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className={`rounded-full p-2 ${statusColors[inq.status] || "bg-gray-100"}`}>
                      <StatusIcon size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900 truncate">{inq.name}</span>
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize ${statusColors[inq.status] || "bg-gray-100 text-gray-500"}`}>
                          {inq.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 truncate mt-0.5">
                        {inq.form_type} &middot; {inq.country} &middot; {new Date(inq.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    {isExpanded ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t border-gray-100 p-4 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wider">Email</p>
                        <p className="text-sm text-gray-900">{inq.email || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wider">Phone</p>
                        <p className="text-sm text-gray-900">{inq.phone}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wider">Form Type</p>
                        <p className="text-sm text-gray-900">{inq.form_type}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wider">Date</p>
                        <p className="text-sm text-gray-900">{new Date(inq.created_at).toLocaleString()}</p>
                      </div>
                      {inq.medical_condition && (
                        <div className="md:col-span-2">
                          <p className="text-xs text-gray-400 uppercase tracking-wider">Medical Condition</p>
                          <p className="text-sm text-gray-900">{inq.medical_condition}</p>
                        </div>
                      )}
                      {inq.message && (
                        <div className="md:col-span-2">
                          <p className="text-xs text-gray-400 uppercase tracking-wider">Message</p>
                          <p className="text-sm text-gray-900">{inq.message}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
                      <span className="text-xs text-gray-400 mr-2">Update status:</span>
                      {["new", "contacted", "in progress", "converted", "closed"].map((s) => (
                        <button
                          key={s}
                          onClick={() => updateStatus(inq.id, s)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-colors ${
                            inq.status === s
                              ? "bg-[#065c2c] text-white"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
