"use client";

import { useState, useEffect } from "react";
import { Send, Mail, AlertCircle, CheckCircle, Loader2 } from "lucide-react";

export default function AdminEmailMarketingPage() {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [subscriberCount, setSubscriberCount] = useState(0);

  useEffect(() => {
    fetch("/api/admin/subscribers")
      .then((res) => res.json())
      .then((data) => setSubscriberCount(Array.isArray(data) ? data.length : 0))
      .catch(() => setSubscriberCount(0));
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !body.trim()) return;
    setSending(true);
    setResult(null);

    try {
      const res = await fetch("/api/email-marketing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject: subject.trim(), body: body.trim() }),
      });
      const json = await res.json();
      if (json.sent > 0) {
        setResult({ success: true, message: json.message });
        setSubject("");
        setBody("");
      } else {
        const errorDetail = json.errors?.join("\n") || json.error || json.message || "Failed to send emails";
        setResult({ success: false, message: errorDetail });
      }
    } catch {
      setResult({ success: false, message: "Network error. Please try again." });
    }
    setSending(false);
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Email Marketing</h2>
        <p className="text-sm text-gray-500 mt-1">
          Send an email to all {subscriberCount} newsletter subscribers.
        </p>
      </div>

      {result && (
        <div className={`flex items-start gap-3 p-4 rounded-lg border ${
          result.success ? "bg-green-50 border-green-200 text-green-800" : "bg-red-50 border-red-200 text-red-700"
        }`}>
          {result.success ? <CheckCircle size={20} className="text-green-600 shrink-0 mt-0.5" /> : <AlertCircle size={20} className="text-red-500 shrink-0 mt-0.5" />}
          <p className="text-sm">{result.message}</p>
        </div>
      )}

      <form onSubmit={handleSend} className="space-y-5 bg-gray-50 border border-gray-200 rounded-xl p-6">
        <div>
          <label className="block text-xs text-gray-500 font-medium mb-1.5">Subject Line</label>
          <input
            type="text"
            required
            placeholder="e.g. New Treatment Cost Guide Available"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#065c2c] transition-colors bg-white"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-500 font-medium mb-1.5">Email Body (HTML supported)</label>
          <textarea
            required
            rows={12}
            placeholder="Write your email content here... HTML tags like <h2>, <p>, <a>, <strong> are supported."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#065c2c] transition-colors bg-white font-mono resize-y"
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Mail size={16} />
            Will send to <strong className="text-gray-900">{subscriberCount}</strong> subscriber{subscriberCount !== 1 ? "s" : ""}
          </div>
          <button
            type="submit"
            disabled={sending || !subject.trim() || !body.trim() || subscriberCount === 0}
            className="bg-[#065c2c] text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-[#054a24] transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {sending ? (
              <><Loader2 size={16} className="animate-spin" /> Sending...</>
            ) : (
              <><Send size={16} /> Send to All Subscribers</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
