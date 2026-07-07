import { createClient } from '@supabase/supabase-js'
import { sendToAllDevices, type FcmPayload } from './send'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function sendFcmAlert(lead: Record<string, unknown>): Promise<void> {
  if (!process.env.FIREBASE_SERVICE_ACCOUNT_JSON && !process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    return
  }

  try {
    const supabase = getSupabase()
    const { data: tokens } = await supabase
      .from('fcm_tokens')
      .select('token')

    if (!tokens || tokens.length === 0) return

    const formType = (lead.form_type as string) || 'Lead'
    const name = (lead.name as string) || 'Unknown'

    const payload: FcmPayload = {
      title: `New ${formType}: ${name}`,
      body: `${formType} from ${(lead.country as string) || 'N/A'}`,
      url: '/admin',
      icon: '/newlogo/logo-mark.png',
    }

    const allTokens = tokens.map((t: { token: string }) => t.token)
    const result = await sendToAllDevices(allTokens, payload)

    if (result.invalidTokens.length > 0) {
      for (const token of result.invalidTokens) {
        await supabase.from('fcm_tokens').delete().eq('token', token)
      }
    }
  } catch (err) {
    console.error('FCM alert error:', err)
  }
}
