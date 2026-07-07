const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const ADMIN_CHAT_IDS = (process.env.TELEGRAM_ADMIN_CHAT_IDS || '').split(',').map(s => s.trim()).filter(Boolean)

function escapeMarkdown(text: string): string {
  return text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, '\\$&')
}

export async function sendTelegramAlert(lead: Record<string, unknown>): Promise<void> {
  if (!BOT_TOKEN || ADMIN_CHAT_IDS.length === 0) return

  const formType = (lead.form_type as string) || 'Lead'
  const name = (lead.name as string) || 'Unknown'
  const email = (lead.email as string) || '-'
  const phone = (lead.phone as string) || '-'
  const country = (lead.country as string) || '-'
  const treatment = (lead.treatment as string) || null
  const message = (lead.message as string) || null

  const icons: Record<string, string> = {
    Contact: '📬',
    Inquiry: '📋',
    'Doctor Opinion': '🩺',
    Insurance: '🛡️',
    Callback: '📞',
    Newsletter: '📰',
  }
  const icon = icons[formType] || '🔔'

  let text = `${icon} *New ${escapeMarkdown(formType)}*\n`
  text += `👤 *Name:* ${escapeMarkdown(name)}\n`
  text += `📧 *Email:* ${escapeMarkdown(email)}\n`
  text += `📞 *Phone:* ${escapeMarkdown(phone)}\n`
  text += `🌍 *Country:* ${escapeMarkdown(country)}\n`
  if (treatment) text += `🏥 *Treatment:* ${escapeMarkdown(treatment)}\n`
  if (message) {
    const truncated = message.length > 200 ? message.slice(0, 200) + '…' : message
    text += `\n💬 *Message:* ${escapeMarkdown(truncated)}`
  }

  const payload = {
    text,
    parse_mode: 'MarkdownV2' as const,
    disable_web_page_preview: true,
  }

  const results = await Promise.allSettled(
    ADMIN_CHAT_IDS.map(chatId =>
      fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, ...payload }),
      })
    )
  )

  for (const result of results) {
    if (result.status === 'rejected') {
      console.error('Telegram send failed:', result.reason)
    }
  }
}

export async function sendTelegramErrorAlert(error: {
  message: string
  url?: string
  userAgent?: string
  stack?: string
  metadata?: Record<string, unknown>
}): Promise<void> {
  if (!BOT_TOKEN || ADMIN_CHAT_IDS.length === 0) return

  let text = `🚨 *Website Error*\n\n`
  text += `💬 *Message:* ${escapeMarkdown(error.message)}\n`
  if (error.url) text += `🔗 *URL:* ${escapeMarkdown(error.url)}\n`
  if (error.userAgent) {
    const ua = error.userAgent.length > 80 ? error.userAgent.slice(0, 80) + '…' : error.userAgent
    text += `🖥️ *UA:* ${escapeMarkdown(ua)}\n`
  }
  if (error.metadata) {
    for (const [key, val] of Object.entries(error.metadata)) {
      text += `📌 *${escapeMarkdown(key)}:* ${escapeMarkdown(String(val))}\n`
    }
  }
  if (error.stack) {
    const lines = error.stack.split('\n').slice(0, 5).map(l => escapeMarkdown(l.trim())).join('\n')
    text += `\n\`\`\`\n${lines}\n\`\`\``
  }

  const results = await Promise.allSettled(
    ADMIN_CHAT_IDS.map(chatId =>
      fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: 'MarkdownV2',
          disable_web_page_preview: true,
        }),
      })
    )
  )

  for (const result of results) {
    if (result.status === 'rejected') {
      console.error('Telegram error alert send failed:', result.reason)
    }
  }
}
