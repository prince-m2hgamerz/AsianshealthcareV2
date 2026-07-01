import { NextResponse } from 'next/server'
import { saveSubscription } from '@/lib/pwa'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { endpoint, keys, role } = body

    if (!endpoint || !keys?.p256dh || !keys?.auth) {
      return NextResponse.json(
        { error: 'Invalid subscription object' },
        { status: 400 }
      )
    }

    const userAgent = request.headers.get('user-agent')
    const saved = await saveSubscription(endpoint, keys.p256dh, keys.auth, userAgent, role)

    if (!saved) {
      return NextResponse.json(
        { error: 'Failed to save subscription' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Push subscribe error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
