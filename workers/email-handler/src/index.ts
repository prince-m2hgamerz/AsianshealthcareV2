function extractBoundary(contentType: string | null): string | null {
  if (!contentType) return null;
  const m = contentType.match(/boundary\s*=\s*"?([^";\s]+)"?/i);
  return m ? m[1] : null;
}

function decodeQuotedPrintable(s: string): string {
  s = s.replace(/_/g, " ");
  s = s.replace(/=\r\n/g, "");
  const bytes: number[] = [];
  let i = 0;
  while (i < s.length) {
    if (s[i] === "=" && i + 2 < s.length) {
      const hex = s.slice(i + 1, i + 3);
      if (/^[0-9A-Fa-f]{2}$/.test(hex)) {
        bytes.push(parseInt(hex, 16));
        i += 3;
        continue;
      }
    }
    bytes.push(s.charCodeAt(i));
    i++;
  }
  return new TextDecoder().decode(new Uint8Array(bytes));
}

function parseMime(raw: string): { textBody: string; htmlBody: string } {
  let textBody = "";
  let htmlBody = "";

  const lines = raw.trimStart().split(/\r?\n/);
  let headerEnd = lines.findIndex((l, i) => l.trim() === "" && i > 0 && lines.slice(0, i).some((x) => x.trim() !== ""));
  if (headerEnd === -1) headerEnd = 0;

  const headers = lines.slice(0, headerEnd).join("\n");
  const boundary = extractBoundary(headers);

  if (!boundary) {
    const ctHeader = headers
      .split("\n")
      .find((l) => l.toLowerCase().startsWith("content-type:"));
    const isHtml = ctHeader?.toLowerCase().includes("text/html");

    const encoding = headers
      .split("\n")
      .find((l) => l.startsWith("content-transfer-encoding:"))
      ?.split(":")
      .pop()
      ?.trim()
      ?.replace(/;.*$/, "")
      .trim() || "7bit";

    let body = lines.slice(headerEnd + 1).join("\n").trim();
    if (encoding === "quoted-printable") {
      body = decodeQuotedPrintable(body);
    } else if (encoding === "base64") {
      try {
        body = atob(body.replace(/\s/g, ""));
      } catch {
        // keep original on decode failure
      }
    }

    if (isHtml) {
      htmlBody = body;
    } else {
      textBody = body;
    }
    return { textBody, htmlBody };
  }

  const parts = raw
    .split(new RegExp(`[\\r\\n]+--${escapeRegex(boundary)}`))
    .filter((p) => {
      const t = p.trim();
      return t !== "" && t !== "--";
    });

  for (const part of parts) {
    const partLines = part.trimStart().split(/\r?\n/);
    let partHeaderEnd = partLines.findIndex(
      (l, i) => l.trim() === "" && i > 0 && partLines.slice(0, i).some((x) => x.trim() !== "")
    );
    if (partHeaderEnd === -1) partHeaderEnd = 0;

    const partHeaders = partLines.slice(0, partHeaderEnd).join("\n").toLowerCase();
    const partBody = partLines.slice(partHeaderEnd + 1).join("\n").trim();

    const isText = partHeaders.includes("content-type:") && partHeaders.includes("text/plain");
    const isHtml = partHeaders.includes("content-type:") && partHeaders.includes("text/html");
    if (!isText && !isHtml) continue;

    const encoding = partHeaders
      .split("\n")
      .find((l) => l.startsWith("content-transfer-encoding:"))
      ?.split(":")
      .pop()
      ?.trim()
      ?.replace(/;.*$/, "")
      .trim() || "7bit";

    let decoded = partBody;
    if (encoding === "quoted-printable") {
      decoded = decodeQuotedPrintable(partBody);
    } else if (encoding === "base64") {
      try {
        decoded = atob(partBody.replace(/\s/g, ""));
      } catch {
        decoded = partBody;
      }
    }

    if (isHtml) {
      htmlBody = decoded;
    } else if (isText) {
      textBody = decoded;
    }
  }

  return { textBody, htmlBody };
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export interface Env {
  DB: D1Database;
  API_TOKEN: string;
}

async function fetchAttachmentCounts(DB: D1Database, emailIds: number[]) {
  if (emailIds.length === 0) return {};
  const placeholders = emailIds.map(() => "?").join(",");
  const rows = await DB.prepare(
    `SELECT email_id, COUNT(*) as count FROM attachments WHERE email_id IN (${placeholders}) GROUP BY email_id`
  ).bind(...emailIds).all<{ email_id: number; count: number }>();
  const map: Record<number, number> = {};
  for (const row of rows.results || []) {
    map[row.email_id] = row.count;
  }
  return map;
}

export default {
  async email(message: ForwardableEmailMessage, env: Env) {
    const fromAddr = message.from;
    const toAddr = message.to;
    const subject = message.headers.get("subject") || "(no subject)";

    const reader = message.raw.getReader();
    const decoder = new TextDecoder();
    let raw = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      raw += decoder.decode(value, { stream: true });
    }

    const { textBody, htmlBody } = parseMime(raw);

    const fromName = fromAddr.includes("<")
      ? fromAddr.match(/^"?([^"<]+)"?\s*</)?.[1]?.trim() || fromAddr
      : fromAddr;

    let parentId: number | null = null;
    const inReplyTo = message.headers.get("In-Reply-To");
    if (inReplyTo) {
      const parentMsgId = inReplyTo.replace(/^</, "").replace(/>$/, "").trim();
      const parent = await env.DB.prepare(
        `SELECT id FROM emails WHERE message_id = ?`
      ).bind(parentMsgId).first<{ id: number }>();
      if (parent) {
        parentId = parent.id;
      }
    }

    const cleanAddr = (addr: string): string =>
      addr.replace(/^.*<(\S+)>/, "$1").replace(">", "").trim() || "unknown@inbound";

    const stmt = env.DB.prepare(
      `INSERT INTO emails (message_id, from_name, from_address, to_address, subject, text_body, html_body, parent_id, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`
    );

    await stmt.bind(
      message.headers.get("Message-ID") || crypto.randomUUID(),
      fromName,
      cleanAddr(fromAddr),
      cleanAddr(toAddr),
      subject,
      textBody,
      htmlBody,
      parentId
    ).run();
  },

  async fetch(request: Request, env: Env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/health") {
      return Response.json({ status: "ok" });
    }

    const token = request.headers.get("x-api-token");

    if (token !== env.API_TOKEN) {
      return new Response("Unauthorized", { status: 401 });
    }

    // --- (labels CRUD removed) ---

    // --- (email-labels removed) ---

    // --- EMAIL ATTACHMENTS ---

    if (request.method === "GET" && url.pathname.match(/^\/api\/emails\/\d+\/attachments$/)) {
      const emailId = Number(url.pathname.split("/")[3]);
      const result = await env.DB.prepare(
        `SELECT * FROM attachments WHERE email_id = ? ORDER BY created_at ASC`
      ).bind(emailId).all();
      return Response.json({ attachments: result.results || [] });
    }

    // --- (email action removed) ---

    // --- EMAIL SEARCH (LIKE-based) ---

    if (request.method === "GET" && url.pathname === "/api/emails/search") {
      try {
        const q = url.searchParams.get("q") || "";
        const limit = Math.min(Number(url.searchParams.get("limit")) || 50, 100);
        const status = url.searchParams.get("status") || "inbox";

        if (!q.trim()) {
          return Response.json({ emails: [], nextCursor: null });
        }

        const pattern = `%${q}%`;
        const result = await env.DB.prepare(
          `SELECT id, from_name, from_address, subject, text_body,
                  is_read, starred, status, created_at
           FROM emails
           WHERE parent_id IS NULL AND status = ?
             AND (subject LIKE ? OR from_address LIKE ? OR from_name LIKE ?)
           ORDER BY id DESC LIMIT ?`
        ).bind(status, pattern, pattern, pattern, limit).all<{
          id: number; from_name: string; from_address: string; subject: string;
          text_body: string; is_read: number; starred: number; status: string; created_at: string;
        }>();

        const rows = result.results || [];
        const emailIds = rows.map(r => r.id);
        const attachmentCounts = await fetchAttachmentCounts(env.DB, emailIds);

        const emails = rows.map(row => ({
          ...row,
          attachment_count: attachmentCounts[row.id] || 0,
        }));

        const nextCursor = emails.length === limit ? emails[emails.length - 1].id : null;
        return Response.json({ emails, nextCursor });
      } catch (err) {
        return Response.json({ error: String(err) }, { status: 500 });
      }
    }

    // --- LIST EMAILS ---

    if (request.method === "GET" && url.pathname === "/api/emails") {
      const cursor = url.searchParams.get("cursor");
      const limit = Math.min(Number(url.searchParams.get("limit")) || 50, 100);
      const status = url.searchParams.get("status") || "inbox";

      let result;
      const baseSelect = `SELECT id, from_name, from_address, subject, text_body, is_read, starred, status, created_at`;
      const baseFrom = `FROM emails WHERE parent_id IS NULL AND status = ?`;

      if (cursor) {
        result = await env.DB.prepare(
          `${baseSelect} ${baseFrom} AND id < ? ORDER BY id DESC LIMIT ?`
        ).bind(status, Number(cursor), limit).all<{
          id: number; from_name: string; from_address: string; subject: string;
          text_body: string; is_read: number; starred: number; status: string; created_at: string;
        }>();
      } else {
        result = await env.DB.prepare(
          `${baseSelect} ${baseFrom} ORDER BY id DESC LIMIT ?`
        ).bind(status, limit).all<{
          id: number; from_name: string; from_address: string; subject: string;
          text_body: string; is_read: number; starred: number; status: string; created_at: string;
        }>();
      }

      const rows = result.results || [];
      const emailIds = rows.map(r => r.id);
      const attachmentCounts = await fetchAttachmentCounts(env.DB, emailIds);

      const emails = rows.map(row => ({
        ...row,
        attachment_count: attachmentCounts[row.id] || 0,
      }));

      const nextCursor = emails.length === limit ? emails[emails.length - 1].id : null;

      return Response.json({ emails, nextCursor });
    }

    if (request.method === "GET" && url.pathname.match(/^\/api\/emails\/\d+$/)) {
      const id = Number(url.pathname.split("/").pop());
      const result = await env.DB.prepare(
        `SELECT * FROM emails WHERE id = ?`
      ).bind(id).first();

      if (!result) {
        return new Response("Not found", { status: 404 });
      }

      await env.DB.prepare(`UPDATE emails SET is_read = 1 WHERE id = ?`).bind(id).run();

      // Fetch full thread
      const thread = await env.DB.prepare(`
        WITH RECURSIVE
          ancestors(id, parent_id) AS (
            SELECT id, parent_id FROM emails WHERE id = ?
            UNION ALL
            SELECT e.id, e.parent_id FROM emails e
            INNER JOIN ancestors a ON e.id = a.parent_id
          ),
          descendants(id, parent_id) AS (
            SELECT id, parent_id FROM emails
            WHERE parent_id IN (SELECT id FROM ancestors)
            UNION ALL
            SELECT e.id, e.parent_id FROM emails e
            INNER JOIN descendants d ON e.parent_id = d.id
          )
        SELECT id, parent_id, from_name, from_address, to_address, subject, text_body, html_body, is_read, starred, status, created_at
        FROM emails
        WHERE id IN (SELECT id FROM ancestors UNION SELECT id FROM descendants)
        ORDER BY created_at ASC
      `).bind(id).all();

      // Fetch attachments for this email
      const attachments = await env.DB.prepare(
        `SELECT * FROM attachments WHERE email_id = ? ORDER BY created_at ASC`
      ).bind(id).all();

      return Response.json({
        ...result,
        thread: thread.results || [],
        attachments: attachments.results || [],
      });
    }

    if (request.method === "DELETE" && url.pathname.match(/^\/api\/emails\/\d+$/)) {
      const id = url.pathname.split("/").pop();
      await env.DB.prepare(`DELETE FROM emails WHERE id = ?`).bind(Number(id)).run();
      return new Response("Deleted", { status: 200 });
    }

    if (request.method === "POST" && url.pathname === "/api/emails") {
      try {
        const body = await request.json() as {
          from_name?: string;
          from_address: string;
          to_address: string;
          subject?: string;
          text_body?: string;
          html_body?: string;
          parent_id?: number;
        };

        const messageId = crypto.randomUUID();
        await env.DB.prepare(
          `INSERT INTO emails (message_id, from_name, from_address, to_address, subject, text_body, html_body, parent_id, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`
        ).bind(
          messageId,
          body.from_name || null,
          body.from_address,
          body.to_address,
          body.subject || null,
          body.text_body || null,
          body.html_body || null,
          body.parent_id || null,
        ).run();

        return new Response("OK", { status: 201 });
      } catch (err) {
        return Response.json({ error: String(err) }, { status: 500 });
      }
    }

    return new Response("Not found", { status: 404 });
  },
};
