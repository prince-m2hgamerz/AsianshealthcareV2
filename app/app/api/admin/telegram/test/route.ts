import { NextResponse } from 'next/server'
import { checkAdmin } from '@/lib/admin-auth'
import { sendTelegramAlert } from '@/lib/telegram'

export async function POST() {
  const authError = await checkAdmin()
  if (authError) return authError

  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatIds = process.env.TELEGRAM_ADMIN_CHAT_IDS

  if (!token) {
    return NextResponse.json({ error: 'TELEGRAM_BOT_TOKEN not set' }, { status: 400 })
  }
  if (!chatIds) {
    return NextResponse.json({ error: 'TELEGRAM_ADMIN_CHAT_IDS not set' }, { status: 400 })
  }

  await sendTelegramAlert({
    name: 'Test',
    email: 'admin@medsolutionhealthcare.com',
    phone: '-',
    country: '-',
    form_type: 'Test',
    message: 'This is a test message from MedSolution Healthcare. If you see this, Telegram notifications are working!',
  } as Record<string, unknown>)

  return NextResponse.json({ success: true, message: 'Test Telegram sent!' })
}
