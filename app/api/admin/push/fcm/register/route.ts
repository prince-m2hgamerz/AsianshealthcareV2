import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
  try {
    const { token, device_model, os_version, app_version } = await request.json()

    if (!token || typeof token !== 'string') {
      return NextResponse.json({ error: 'FCM token is required' }, { status: 400 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { error } = await supabase
      .from('fcm_tokens')
      .upsert(
        {
          token,
          device_model: device_model || null,
          os_version: os_version || null,
          app_version: app_version || null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'token' }
      )

    if (error) {
      console.error('FCM register: upsert failed:', error)
      return NextResponse.json({ error: 'Failed to register token' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('FCM register error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
