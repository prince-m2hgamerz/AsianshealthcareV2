import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { checkAdmin } from '@/lib/admin-auth'
import { sendToAllDevices } from '@/lib/fcm/send'
import type { FcmPayload } from '@/lib/fcm/send'

export async function POST(request: Request) {
  const authError = await checkAdmin(request)
  if (authError) return authError

  try {
    const body: FcmPayload & { token?: string } = await request.json()

    if (!body.title || !body.body) {
      return NextResponse.json({ error: 'Title and body are required' }, { status: 400 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // If a specific token is provided, send only to that device
    if (body.token) {
      const { sendToDevice } = await import('@/lib/fcm/send')
      const ok = await sendToDevice(body.token, {
        title: body.title,
        body: body.body,
        url: body.url,
        icon: body.icon,
      })
      return NextResponse.json({ success: ok, sent: ok ? 1 : 0, total: 1, removed: 0 })
    }

    // Broadcast to all registered FCM tokens
    const { data: tokens } = await supabase
      .from('fcm_tokens')
      .select('token')

    if (!tokens || tokens.length === 0) {
      return NextResponse.json({ success: true, sent: 0, total: 0, removed: 0 })
    }

    const allTokens = tokens.map((t: { token: string }) => t.token)
    const result = await sendToAllDevices(allTokens, {
      title: body.title,
      body: body.body,
      url: body.url,
      icon: body.icon,
    })

    // Remove invalid tokens from the database
    if (result.invalidTokens.length > 0) {
      for (const invalidToken of result.invalidTokens) {
        await supabase.from('fcm_tokens').delete().eq('token', invalidToken)
      }
    }

    return NextResponse.json({
      success: true,
      sent: result.success,
      total: allTokens.length,
      removed: result.invalidTokens.length,
    })
  } catch (err) {
    console.error('FCM send error:', err)
    return NextResponse.json({ error: 'Failed to send FCM notifications' }, { status: 500 })
  }
}
