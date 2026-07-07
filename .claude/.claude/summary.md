
## Goal
- Receive and reply to emails via a Next.js admin interface backed by a Cloudflare Workers email handler with Resend sending; label/star/archive/trash/compose were removed in earlier rounds, then search and delete were re-added per user request

## Constraints & Preferences
- Admin-only routes via `checkAdmin()` middleware
- Worker API requires `x-api-token` header
- Env vars: `EMAIL_WORKER_URL`, `EMAIL_WORKER_TOKEN`, `RESEND_API_KEY`, `ADMIN_EMAIL`, `RESEND_FROM_EMAIL`
- D1 database with simplified tables: only `emails` and `attachments` (no labels, email_labels, FTS5)
- Cursor‑based pagination for email listing
- Search uses `LIKE` on subject / from_address / from_name (no FTS5)
- Delete is hard delete from DB, no soft-delete / trash

## Progress
### Done
- Fixed `decodeQuotedPrintable` in worker's `parseMime` — now collects bytes into `Uint8Array` and decodes with `TextDecoder()` instead of `String.fromCharCode`, fixing `Â` / `â` / `=20` UTF-8 artifacts
- Added `DELETE` to `app/api/admin/emails/[id]/route.ts` — forwards to worker `/api/emails/:id`, returns 200
- Added delete button with confirmation dialog to `app/admin/emails/[id]/page.tsx` — uses `useRouter` redirect to inbox after deletion
- Rewrote `app/admin/emails/page.tsx` with search bar (debounced `q` param, 300 ms) and per-row delete button; removed sidebar, compose, star, bulk actions
- Worker `/api/emails/search` now uses `LIKE %keyword%` on subject, from_address, from_name (no FTS5 dependency)
- Removed all label CRUD, email-labels routes, action routes (archive/trash/star), unread-count, and debug parse-mime endpoints from worker
- Removed label fetching/response from worker list and detail endpoints
- All earlier deletions still in effect: no compose modal, no star/archive/trash action route, no label routes, no label/email_label tables, no FTS5 table

### In Progress
- _(none)_

### Blocked
- _(none)_

## Key Decisions
- Search uses `LIKE` instead of FTS5 because the FTS5 table was already removed from schema and user wanted a simple keyword filter
- Delete is hard DELETE from DB (no status column change) because user explicitly asked to "delete from DB"
- Quoted-printable decoder fixed to decode raw bytes as UTF-8 via `TextDecoder` — previous per-byte `String.fromCharCode` produced `Â` / `Ã` for any 2-byte UTF-8 char
- Delete button shows confirmation dialog before sending the DELETE request, then redirects to inbox list
- `starred` and `status` columns remain in DB schema for potential future use but are stripped from all UI/API surface

## Next Steps
~ Verify encoding fix by sending a test email with accented characters (résumé, déjà vu) and confirming no `Â` / `Ã` artifacts in the detail page
~ Test delete from both inbox list row button and detail page confirmation dialog
~ Test search with various keywords, including accented characters
~ Optionally remove `starred`/`status` columns entirely if not needed later

## Critical Context
- `RESEND_FROM_EMAIL` and `ADMIN_EMAIL` env vars are still used for outbound email and sent-email metadata
- Search with `LIKE` is case-insensitive for ASCII but not for Unicode in SQLite/D1 — accented searches may behave unexpectedly
- Existing D1 databases using the old schema (with labels / FTS5 tables) will need a separate migration or manual cleanup if re-created from scratch
- The worker's `parseMime` function is the single point where inbound email raw content is decoded; the fix ensures `text_body` and `html_body` are clean UTF-8 strings

## Relevant Files
- `app/admin/emails/page.tsx` — inbox list with search bar, per-row delete button, load-more pagination
- `app/admin/emails/[id]/page.tsx` — detail view with delete button (confirmation dialog), reply form, thread display
- `app/api/admin/emails/route.ts` — GET with cursor/limit/status/q, DELETE with JSON `{ id }`
- `app/api/admin/emails/[id]/route.ts` — GET single email, DELETE single email (no labels/action routes)
- `app/api/admin/emails/[id]/attachments/route.ts` — kept for viewing attachments
- `app/api/admin/send-email/route.ts` — kept for sending replies
- `workers/email-handler/src/index.ts` — inbound storage, listing, detail+thread, attachments, search (LIKE), delete, sent-email storage; no labels/action/debug routes (396 lines)
- `workers/email-handler/schema.sql` — only `emails` and `attachments` tables; no labels, email_labels, or FTS5
