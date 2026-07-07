'use client'

import { useMemo, Fragment } from "react"

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

function parseInlineCode(text: string): (string | { type: "code"; content: string })[] {
  const parts: (string | { type: "code"; content: string })[] = []
  let last = 0
  const re = /`([^`]+)`/g
  let m: RegExpExecArray | null
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index))
    parts.push({ type: "code", content: m[1] })
    last = m.index + m[0].length
  }
  if (last < text.length) parts.push(text.slice(last))
  return parts
}

function parseBold(text: string): (string | { type: "bold"; content: string })[] {
  const parts: (string | { type: "bold"; content: string })[] = []
  let last = 0
  const re = /\*\*([^*]+)\*\*/g
  let m: RegExpExecArray | null
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index))
    parts.push({ type: "bold", content: m[1] })
    last = m.index + m[0].length
  }
  if (last < text.length) parts.push(text.slice(last))
  return parts
}

function renderInline(line: string) {
  const boldParts = parseBold(line)
  return boldParts.map((part, i) => {
    if (typeof part === "string") {
      const codeParts = parseInlineCode(part)
      return (
        <Fragment key={i}>
          {codeParts.map((cp, j) =>
            typeof cp === "string" ? (
              <span key={j}>{cp}</span>
            ) : (
              <code
                key={j}
                className="bg-neutral-100 text-primary px-1.5 py-0.5 rounded text-sm font-mono text-[0.875em]"
              >
                {escapeHtml(cp.content)}
              </code>
            )
          )}
        </Fragment>
      )
    }
    return <strong key={i} className="font-semibold">{part.content}</strong>
  })
}

interface Block {
  type: "h1" | "h2" | "h3" | "h4" | "p" | "ul" | "ol" | "code" | "hr" | "table" | "blockquote"
  content?: string
  items?: string[]
  lang?: string
  rows?: string[][]
  headers?: string[]
}

function parseTableLines(lines: string[]): { headers: string[]; rows: string[][] } | null {
  if (lines.length < 2) return null
  const headerLine = lines[0]
  const sepLine = lines[1]
  if (!/^[\s|:.-]+$/.test(sepLine.replace(/\|/g, ""))) return null
  const headers = headerLine.split("|").map((h) => h.trim()).filter(Boolean)
  const rows: string[][] = []
  for (let i = 2; i < lines.length; i++) {
    const cells = lines[i].split("|").map((c) => c.trim()).filter(Boolean)
    if (cells.length > 0) rows.push(cells)
  }
  return { headers, rows }
}

function parseBlocks(markdown: string): Block[] {
  const lines = markdown.split("\n")
  const blocks: Block[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    // HR
    if (/^---$/.test(line.trim())) {
      blocks.push({ type: "hr" })
      i++
      continue
    }

    // Heading
    const headingMatch = line.match(/^(#{1,4})\s+(.+)$/)
    if (headingMatch) {
      const level = headingMatch[1].length as 1 | 2 | 3 | 4
      const type = `h${level}` as "h1" | "h2" | "h3" | "h4"
      blocks.push({ type, content: headingMatch[2] })
      i++
      continue
    }

    // Blockquote
    const bqMatch = line.match(/^>\s?(.*)$/)
    if (bqMatch) {
      const content: string[] = [bqMatch[1]]
      i++
      while (i < lines.length) {
        const m = lines[i].match(/^>\s?(.*)$/)
        if (!m) break
        content.push(m[1])
        i++
      }
      blocks.push({ type: "blockquote", content: content.join("\n") })
      continue
    }

    // Code block
    if (/^```/.test(line.trim())) {
      const langMatch = line.trim().match(/^```(\w*)/)
      const lang = langMatch?.[1] || ""
      const code: string[] = []
      i++
      while (i < lines.length && !/^```/.test(lines[i].trim())) {
        code.push(lines[i])
        i++
      }
      i++ // skip closing ```
      blocks.push({ type: "code", content: code.join("\n"), lang })
      continue
    }

    // Table
    if (lines[i + 1] && /^\|.*\|.*---/.test(lines[i + 1])) {
      const tableLines: string[] = []
      while (i < lines.length && lines[i].startsWith("|")) {
        tableLines.push(lines[i])
        i++
      }
      const table = parseTableLines(tableLines)
      if (table) {
        blocks.push({ type: "table", headers: table.headers, rows: table.rows })
      }
      continue
    }

    // List items
    if (/^\s*[-*+]\s+/.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^\s*[-*+]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*[-*+]\s+/, ""))
        i++
      }
      blocks.push({ type: "ul", items })
      continue
    }

    // Ordered list
    if (/^\s*\d+\.\s+/.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*\d+\.\s+/, ""))
        i++
      }
      blocks.push({ type: "ol", items })
      continue
    }

    // Empty line or paragraph
    if (line.trim() === "") {
      i++
      continue
    }

    // Paragraph (grab consecutive non-empty lines that aren't other block types)
    const para: string[] = [line]
    i++
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !/^#{1,4}\s/.test(lines[i]) &&
      !/^```/.test(lines[i]) &&
      !/^\s*[-*+]\s+/.test(lines[i]) &&
      !/^\s*\d+\.\s+/.test(lines[i]) &&
      !/^---$/.test(lines[i].trim()) &&
      !/^>\s/.test(lines[i]) &&
      !lines[i].startsWith("|")
    ) {
      para.push(lines[i])
      i++
    }
    blocks.push({ type: "p", content: para.join("\n") })
  }

  return blocks
}

function renderLink(text: string) {
  const parts: (string | { type: "link"; text: string; href: string })[] = []
  let last = 0
  const re = /\[([^\]]+)\]\(([^)]+)\)/g
  let m: RegExpExecArray | null
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index))
    parts.push({ type: "link", text: m[1], href: m[2] })
    last = m.index + m[0].length
  }
  if (last < text.length) parts.push(text.slice(last))
  return parts
}

function renderParagraphLine(text: string) {
  const linkParts = renderLink(text)
  return linkParts.map((part, i) => {
    if (typeof part === "string") {
      return <Fragment key={i}>{renderInline(part)}</Fragment>
    }
    return (
      <a
        key={i}
        href={part.href}
        className="text-accent underline hover:text-accent/80 transition"
        target={part.href.startsWith("http") ? "_blank" : undefined}
        rel={part.href.startsWith("http") ? "noopener noreferrer" : undefined}
      >
        {part.text}
      </a>
    )
  })
}

export default function MarkdownRenderer({ content }: { content: string }) {
  const blocks = useMemo(() => parseBlocks(content), [content])

  return (
    <div className="text-neutral-700 text-sm leading-relaxed space-y-4">
      {blocks.map((block, idx) => {
        switch (block.type) {
          case "h1":
            return (
              <h1 key={idx} className="font-heading text-display-md text-primary mt-8 mb-4 first:mt-0">
                {renderParagraphLine(block.content || "")}
              </h1>
            )
          case "h2":
            return (
              <h2 key={idx} className="font-heading text-heading-lg text-primary mt-6 mb-3">
                {renderParagraphLine(block.content || "")}
              </h2>
            )
          case "h3":
            return (
              <h3 key={idx} className="font-heading text-heading-md text-primary mt-5 mb-2">
                {renderParagraphLine(block.content || "")}
              </h3>
            )
          case "h4":
            return (
              <h4 key={idx} className="font-heading text-heading-sm text-primary mt-4 mb-2">
                {renderParagraphLine(block.content || "")}
              </h4>
            )
          case "p":
            return (
              <p key={idx}>
                {block.content?.split("\n").map((line, li) => (
                  <Fragment key={li}>
                    {li > 0 && <br />}
                    {renderParagraphLine(line)}
                  </Fragment>
                ))}
              </p>
            )
          case "ul":
            return (
              <ul key={idx} className="list-disc pl-6 space-y-1">
                {block.items?.map((item, ii) => (
                  <li key={ii}>{renderParagraphLine(item)}</li>
                ))}
              </ul>
            )
          case "ol":
            return (
              <ol key={idx} className="list-decimal pl-6 space-y-1">
                {block.items?.map((item, ii) => (
                  <li key={ii}>{renderParagraphLine(item)}</li>
                ))}
              </ol>
            )
          case "code":
            return (
              <pre key={idx} className="bg-neutral-50 border border-hairline-light rounded-lg p-4 overflow-x-auto text-sm font-mono leading-relaxed">
                <code>{escapeHtml(block.content || "")}</code>
              </pre>
            )
          case "hr":
            return <hr key={idx} className="border-hairline-light my-6" />
          case "blockquote":
            return (
              <blockquote key={idx} className="border-l-4 border-accent/30 pl-4 italic text-neutral-600">
                {renderParagraphLine(block.content || "")}
              </blockquote>
            )
          case "table":
            return (
              <div key={idx} className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-neutral-50">
                      {block.headers?.map((h, hi) => (
                        <th key={hi} className="border border-hairline-light px-3 py-2 text-left font-semibold text-primary">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows?.map((row, ri) => (
                      <tr key={ri} className="even:bg-neutral-50/50">
                        {row.map((cell, ci) => (
                          <td key={ci} className="border border-hairline-light px-3 py-2">
                            {renderParagraphLine(cell)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          default:
            return null
        }
      })}
    </div>
  )
}
