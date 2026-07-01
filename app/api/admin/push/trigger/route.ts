import { NextResponse } from 'next/server'
import { checkAdmin } from '@/lib/admin-auth'
import { getActiveSubscriptions } from '@/lib/pwa'
import { sendPushNotification } from '@/lib/pwa/notification'
import type { NotificationPayload } from '@/types/pwa'

export async function POST(request: Request) {
  const authError = await checkAdmin()
  if (authError) return authError

  try {
    const body: NotificationPayload = await request.json()

    if (!body.title || !body.body) {
      return NextResponse.json(
        { error: 'Title and body are required' },
        { status: 400 }
      )
    }

    const subscriptions = await getActiveSubscriptions('admin')

    if (subscriptions.length === 0) {
      return NextResponse.json({ sent: 0, total: 0 })
    }

    const result = await sendPushNotification(subscriptions, body)

    return NextResponse.json({ sent: result.success, total: subscriptions.length })
  } catch (error) {
    console.error('Failed to send admin push notification:', error)
    return NextResponse.json(
      { error: 'Failed to send notifications' },
      { status: 500 }
    )
  }
}
