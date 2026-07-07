"use client";

import { useEffect, useState } from "react";
import { Mail, Calendar, Trash2 } from "lucide-react";

interface Subscriber {
  email: string;
  subscribed_at: string;
}

export default function AdminSubscribersPage() {
  const [data, setData] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/admin/subscribers");
      if (res.ok) {
        const items = await res.json();
        setData(items);
      }
    } catch {
      console.error("Failed to fetch subscribers");
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (email: string) => {
    if (!confirm(`Remove ${email} from subscribers?`)) return;
    try {
      await fetch("/api/admin/subscribers", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      fetchData();
    } catch {
      alert("Failed to delete subscriber");
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-10 bg-gray-100 rounded w-48" />
        <div className="h-8 bg-gray-100 rounded w-64" />
        {[1, 2, 3].map((i) => <div key={i} className="h-14 bg-gray-100 rounded" />)}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Email Subscribers</h2>
        <p className="text-sm text-gray-500 mt-1">
          {data.length} subscriber{data.length !== 1 ? "s" : ""} registered
        </p>
      </div>

      {data.length === 0 ? (
        <div className="text-center border border-gray-200 rounded-lg p-10 bg-gray-50">
          <Mail size={40} className="text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-700 mb-1">No subscribers yet</h3>
          <p className="text-sm text-gray-500">Subscribers from the newsletter signup form will appear here.</p>
        </div>
      ) : (
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                <th className="p-4 font-medium">Email</th>
                <th className="p-4 font-medium">Subscribed Date</th>
                <th className="p-4 font-medium w-20">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.map((sub) => (
                <tr key={sub.email} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-sm text-gray-900">{sub.email}</td>
                  <td className="p-4 text-sm text-gray-500">
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar size={14} className="text-gray-400" />
                      {new Date(sub.subscribed_at).toLocaleDateString("en-US", {
                        month: "short", day: "numeric", year: "numeric",
                        hour: "2-digit", minute: "2-digit",
                      })}
                    </span>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleDelete(sub.email)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-md hover:bg-red-50"
                      title="Remove subscriber"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
