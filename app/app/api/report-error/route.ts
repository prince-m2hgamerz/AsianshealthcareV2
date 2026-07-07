import { NextResponse } from 'next/server'
import { sendTelegramErrorAlert } from '@/lib/telegram'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { message, stack, url, metadata } = body

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    await sendTelegramErrorAlert({
      message,
      url: url || request.headers.get('referer') || undefined,
      userAgent: request.headers.get('user-agent') || undefined,
      stack,
      metadata,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Report error API failed:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
