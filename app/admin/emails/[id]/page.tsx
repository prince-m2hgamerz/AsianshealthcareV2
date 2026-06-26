"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { ArrowLeft, Loader2, Paperclip, Reply, Send, Trash2, X } from "lucide-react"

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
    hour: "numeric", minute: "2-digit",
  })
}

interface Attachment {
  id: number
  filename: string
  mime_type: string
  size: number
}

interface ThreadEmail {
  id: number
  parent_id: number | null
  from_name: string
  from_address: string
  to_address: string
  subject: string
  text_body: string
  html_body: string
  is_read: number
  created_at: string
  attachments: Attachment[]
}

interface EmailDetail {
  id: number
  from_name: string
  from_address: string
  to_address: string
  subject: string
  text_body: string
  html_body: string
  created_at: string
  attachments: Attachment[]
  thread: ThreadEmail[]
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return bytes + " B"
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
  return (bytes / 1048576).toFixed(1) + " MB"
}

export default function EmailDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [email, setEmail] = useState<EmailDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showReply, setShowReply] = useState(false)
  const [replySubject, setReplySubject] = useState("")
  const [replyBody, setReplyBody] = useState("")
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [sendError, setSendError] = useState("")

  const fetchEmail = () => {
    setLoading(true)
    fetch(`/api/admin/emails/${params.id}`)
      .then(res => res.json())
      .then(data => {
        setEmail(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  useEffect(() => {
    fetchEmail()
  }, [params.id])

  const replyToAddress = email
    ? email.from_address === "admin@medsolutionhealthcare.com"
      ? email.to_address
      : email.from_address
    : ""

  const handleDelete = async () => {
    if (!email) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/emails/${email.id}`, {
        method: "DELETE",
      })
      if (res.ok) {
        router.push("/admin/emails")
      }
    } finally {
      setDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  const handleOpenReply = () => {
    if (!email) return
    setReplySubject(`Re: ${email.subject}`)
    setReplyBody("")
    setSent(false)
    setSendError("")
    setShowReply(true)
  }

  const handleSend = async () => {
    if (!email) return
    if (!replyToAddress) {
      setSendError("Cannot reply: sender address is unknown")
      return
    }
    setSending(true)
    setSendError("")
    try {
      const res = await fetch("/api/admin/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: replyToAddress,
          subject: replySubject,
          text_body: replyBody,
          parent_id: email.id,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setSendError(data.error || "Failed to send")
      } else {
        setSent(true)
        setShowReply(false)
        fetchEmail()
      }
    } catch {
      setSendError("Network error")
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 size={32} className="animate-spin text-gray-400" />
      </div>
    )
  }

  if (!email) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-400">
        <p className="text-lg font-medium">Email not found</p>
        <Link href="/admin/emails" className="mt-4 px-4 py-2 text-sm text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors">
          Back to Inbox
        </Link>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Navigation bar */}
      <div className="mb-4 flex items-center justify-between">
        <Link
          href="/admin/emails"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Inbox
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
          >
            <Trash2 size={15} /> Delete
          </button>
          <button
            onClick={handleOpenReply}
            className="inline-flex items-center gap-2 px-4 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Reply size={15} /> Reply
          </button>
        </div>
      </div>

      {/* Delete confirmation dialog */}
      {showDeleteConfirm && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-medium text-red-800">Are you sure you want to delete this email?</p>
          <p className="mt-1 text-sm text-red-600">This action cannot be undone.</p>
          <div className="mt-3 flex items-center gap-3">
            <button onClick={handleDelete} disabled={deleting}
              className="inline-flex items-center gap-2 px-4 py-1.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50">
              {deleting ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
              {deleting ? "Deleting..." : "Delete"}
            </button>
            <button onClick={() => setShowDeleteConfirm(false)}
              className="px-4 py-1.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Subject & date */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900">{email.subject || "(No subject)"}</h1>
        <p className="mt-1 text-sm text-gray-500">{formatDate(email.created_at)}</p>
      </div>

      {/* Metadata */}
      <div className="mb-5 space-y-2 bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <div className="flex gap-2">
          <span className="text-xs font-medium uppercase tracking-wider text-gray-400 min-w-[60px]">From</span>
          <span className="break-all text-gray-800">
            {email.from_name ? `${email.from_name} <${email.from_address}>` : email.from_address}
          </span>
        </div>
        <div className="flex gap-2">
          <span className="text-xs font-medium uppercase tracking-wider text-gray-400 min-w-[60px]">To</span>
          <span className="break-all text-gray-800">{email.to_address}</span>
        </div>
      </div>

      {/* Body */}
      <div className="mb-5 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="min-h-[120px]">
          {email.html_body && email.html_body !== email.text_body ? (
            <div
              className="overflow-x-auto p-4 text-gray-800 [&_a]:text-blue-600 [&_img]:max-w-full [&_img]:h-auto [&_table]:max-w-full [&_table]:overflow-x-auto"
              dangerouslySetInnerHTML={{ __html: email.html_body }}
            />
          ) : email.text_body ? (
            <pre className="overflow-x-auto whitespace-pre-wrap break-words p-4 font-sans text-sm text-gray-800 leading-relaxed">
              {email.text_body}
            </pre>
          ) : (
            <div className="flex items-center justify-center p-4 text-sm text-gray-400 italic">
              No content
            </div>
          )}
        </div>
      </div>

      {/* Attachments */}
      {email.attachments && email.attachments.length > 0 && (
        <div className="mb-5 flex flex-wrap gap-2">
          {email.attachments.map(att => (
            <div key={att.id} className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700">
              <Paperclip size={13} className="text-gray-400" />
              <span className="max-w-[200px] truncate">{att.filename}</span>
              <span className="text-gray-400">({formatFileSize(att.size)})</span>
            </div>
          ))}
        </div>
      )}

      {/* Sent confirmation */}
      {sent && (
        <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          Reply sent to {replyToAddress || "recipient"}.
        </div>
      )}

      {/* Reply inline */}
      {showReply && (
        <div className="mb-6 bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Reply</h2>
            <button onClick={() => setShowReply(false)} className="rounded p-1 text-gray-400 hover:text-gray-700 transition-colors">
              <X size={18} />
            </button>
          </div>
          <div className="mb-3">
            <label className="mb-1 block text-xs font-medium text-gray-500">To</label>
            <input type="text" value={replyToAddress || "Unknown"} readOnly
              className="w-full border border-gray-200 bg-gray-50 rounded-lg p-2.5 text-sm text-gray-500" />
          </div>
          <div className="mb-3">
            <label className="mb-1 block text-xs font-medium text-gray-500">Subject</label>
            <input type="text" value={replySubject} onChange={e => setReplySubject(e.target.value)}
              className="w-full border border-gray-200 rounded-lg p-2.5 text-sm" />
          </div>
          <div className="mb-4">
            <label className="mb-1 block text-xs font-medium text-gray-500">Message</label>
            <textarea value={replyBody} onChange={e => setReplyBody(e.target.value)} rows={6}
              placeholder="Write your reply..."
              className="w-full resize-y border border-gray-200 rounded-lg p-2.5 text-sm" />
          </div>
          {sendError && <p className="mb-3 text-sm text-red-500">{sendError}</p>}
          <div className="flex items-center gap-3">
            <button onClick={handleSend} disabled={sending || !replyBody.trim()}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50">
              {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              {sending ? "Sending..." : "Send Reply"}
            </button>
            <button onClick={() => setShowReply(false)}
              className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Thread messages */}
      <div className="mb-2">
        <h2 className="text-lg font-semibold text-gray-900">Thread</h2>
      </div>
      {(!email.thread || email.thread.length === 0) ? (
        <div className="mb-4 bg-white border border-gray-200 rounded-lg p-6 text-center text-sm text-gray-400">
          No replies yet.
        </div>
      ) : (
        <div className="space-y-4">
          {(email.thread || []).map((msg) => {
            const isCurrent = msg.id === email.id
            const isIncoming = msg.from_address !== "admin@medsolutionhealthcare.com"
            return (
              <div key={msg.id} className={`bg-white border rounded-lg shadow-sm overflow-hidden ${isCurrent ? "ring-2 ring-blue-500" : "border-gray-200"}`}>
                <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-4 py-2.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className={`shrink-0 w-2 h-2 rounded-full ${isIncoming ? "bg-blue-500" : "bg-green-500"}`} />
                    <span className="truncate text-sm font-medium text-gray-800">
                      {msg.from_name || msg.from_address}
                    </span>
                    {isCurrent && (
                      <span className="shrink-0 rounded bg-blue-100 px-1.5 py-0.5 text-xs text-blue-700">This message</span>
                    )}
                  </div>
                  <span className="shrink-0 text-xs text-gray-400">{formatDate(msg.created_at)}</span>
                </div>
                <div className="min-h-[80px]">
                  {msg.html_body && msg.html_body !== msg.text_body ? (
                    <div
                      className="overflow-x-auto p-4 text-sm text-gray-800 [&_a]:text-blue-600 [&_img]:max-w-full [&_img]:h-auto [&_table]:max-w-full [&_table]:overflow-x-auto"
                      dangerouslySetInnerHTML={{ __html: msg.html_body }}
                    />
                  ) : msg.text_body ? (
                    <pre className="overflow-x-auto whitespace-pre-wrap break-words p-4 font-sans text-sm text-gray-800 leading-relaxed">
                      {msg.text_body}
                    </pre>
                  ) : (
                    <div className="flex items-center justify-center p-4 text-sm text-gray-400 italic">
                      No content
                    </div>
                  )}
                </div>
                {msg.attachments && msg.attachments.length > 0 && (
                  <div className="flex flex-wrap gap-2 border-t border-gray-100 px-4 py-2">
                    {msg.attachments.map(att => (
                      <span key={att.id} className="inline-flex items-center gap-1.5 px-2 py-1 rounded border border-gray-200 bg-gray-50 text-xs text-gray-500">
                        <Paperclip size={11} />
                        {att.filename}
                        <span className="text-gray-400">({formatFileSize(att.size)})</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
