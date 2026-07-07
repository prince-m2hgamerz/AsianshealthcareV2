"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Inbox, Loader2, Search, Trash2 } from "lucide-react"

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
  if (days < 7) return d.toLocaleDateString("en-US", { weekday: "short" })
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

interface Email {
  id: number
  from_name: string
  from_address: string
  subject: string
  text_body: string
  is_read: number
  created_at: string
  attachment_count: number
}

export default function AdminEmailsPage() {
  const router = useRouter()
  const [emails, setEmails] = useState<Email[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cursor, setCursor] = useState<number | null>(null)
  const [hasMore, setHasMore] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [search, setSearch] = useState("")
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const fetchEmails = useCallback(async (cursorVal?: number) => {
    if (cursorVal) {
      setLoadingMore(true)
    } else {
      setLoading(true)
      setError(null)
    }
    try {
      const params = new URLSearchParams({ limit: "20" })
      if (cursorVal) params.set("cursor", String(cursorVal))
      const res = await fetch(`/api/admin/emails?${params}`)
      if (!res.ok) throw new Error("Failed to fetch")
      const data = await res.json()
      if (cursorVal) {
        setEmails((prev) => [...prev, ...(data.emails || [])])
      } else {
        setEmails(data.emails || [])
      }
      setCursor(data.nextCursor)
      setHasMore(data.hasMore)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [])

  const fetchSearch = useCallback(async (q: string, cursorVal?: number) => {
    if (cursorVal) {
      setLoadingMore(true)
    } else {
      setLoading(true)
      setError(null)
    }
    try {
      const params = new URLSearchParams({ q, limit: "20" })
      if (cursorVal) params.set("cursor", String(cursorVal))
      const res = await fetch(`/api/admin/emails?${params}`)
      if (!res.ok) throw new Error("Failed to fetch")
      const data = await res.json()
      if (cursorVal) {
        setEmails((prev) => [...prev, ...(data.emails || [])])
      } else {
        setEmails(data.emails || [])
      }
      setCursor(data.nextCursor)
      setHasMore(data.hasMore)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [])

  useEffect(() => {
    if (search.trim()) {
      const timer = setTimeout(() => fetchSearch(search.trim()), 300)
      return () => clearTimeout(timer)
    } else {
      fetchEmails()
    }
  }, [search, fetchSearch, fetchEmails])

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm("Delete this email? This cannot be undone.")) return
    setDeletingId(id)
    try {
      const res = await fetch(`/api/admin/emails/${id}`, { method: "DELETE" })
      if (res.ok) {
        setEmails((prev) => prev.filter((e) => e.id !== id))
      }
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => (search.trim() ? fetchSearch(search.trim()) : fetchEmails())}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Inbox size={24} className="text-blue-600" />
          {search.trim() ? `Search: "${search.trim()}"` : "Inbox"}
        </h1>
        <button
          onClick={() => (search.trim() ? fetchSearch(search.trim()) : fetchEmails())}
          className="px-3 py-1.5 text-sm text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
        >
          Refresh
        </button>
      </div>

      {/* Search bar */}
      <div className="relative mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search emails by subject or sender..."
          className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {emails.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg">{search.trim() ? "No matching emails" : "No emails yet"}</p>
          <p className="text-sm mt-1">
            {search.trim() ? "Try a different search term" : "Incoming emails will appear here"}
          </p>
        </div>
      ) : (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          {emails.map((email) => (
            <div
              key={email.id}
              onClick={() => router.push(`/admin/emails/${email.id}`)}
              className={`flex items-center gap-4 px-4 py-3 border-b border-gray-100 last:border-b-0 cursor-pointer hover:bg-gray-50 transition-colors group ${!email.is_read ? "bg-blue-50" : ""}`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  {!email.is_read && <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />}
                  <span className={`truncate ${!email.is_read ? "font-semibold text-gray-900" : "text-gray-700"}`}>
                    {email.from_name || email.from_address}
                  </span>
                  {email.attachment_count > 0 && (
                    <span className="text-gray-400 flex-shrink-0" title="Has attachments">📎</span>
                  )}
                </div>
                <p className={`truncate mt-0.5 text-sm ${!email.is_read ? "font-medium text-gray-900" : "text-gray-500"}`}>
                  {email.subject || "(No subject)"}
                </p>
              </div>
              <span className="text-xs text-gray-400 flex-shrink-0 whitespace-nowrap">
                {formatDate(email.created_at)}
              </span>
              <button
                onClick={(e) => handleDelete(email.id, e)}
                disabled={deletingId === email.id}
                className="opacity-0 group-hover:opacity-100 p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-all disabled:opacity-50"
                title="Delete"
              >
                {deletingId === email.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
              </button>
            </div>
          ))}
        </div>
      )}

      {hasMore && (
        <div className="text-center mt-4">
          <button
            onClick={() => (search.trim() ? fetchSearch(search.trim(), cursor!) : fetchEmails(cursor!))}
            disabled={loadingMore}
            className="px-6 py-2 text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-50"
          >
            {loadingMore ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  )
}
