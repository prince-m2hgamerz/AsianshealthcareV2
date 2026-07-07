import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
  try {
    const { token } = await request.json()

    if (!token || typeof token !== 'string') {
      return NextResponse.json({ error: 'FCM token is required' }, { status: 400 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { error } = await supabase
      .from('fcm_tokens')
      .delete()
      .eq('token', token)

    if (error) {
      console.error('FCM unregister: delete failed:', error)
      return NextResponse.json({ error: 'Failed to unregister token' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('FCM unregister error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
