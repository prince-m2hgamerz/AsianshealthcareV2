import { createServiceRoleClient } from '@/lib/supabase/server'
import type { PushSubscriptionData } from '@/types/pwa'

export async function getActiveSubscriptions(role?: string): Promise<PushSubscriptionData[]> {
  const supabase = createServiceRoleClient()

  let query = supabase
    .from('push_subscriptions')
    .select('*')
    .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)
    .order('created_at', { ascending: false })

  if (role) {
    query = query.eq('role', role)
  }

  const { data, error } = await query

  if (error) {
    console.error('Failed to fetch subscriptions:', error)
    return []
  }

  return data ?? []
}

export async function saveSubscription(
  endpoint: string,
  p256dh: string,
  auth: string,
  userAgent: string | null,
  role?: string
): Promise<boolean> {
  const supabase = createServiceRoleClient()

  const { error } = await supabase.from('push_subscriptions').upsert(
    {
      endpoint,
      p256dh,
      auth,
      user_agent: userAgent,
      role: role ?? 'user',
    },
    { onConflict: 'endpoint' }
  )

  if (error) {
    console.error('Failed to save subscription:', error)
    return false
  }

  return true
}

export async function removeSubscription(endpoint: string): Promise<boolean> {
  const supabase = createServiceRoleClient()

  const { error } = await supabase
    .from('push_subscriptions')
    .delete()
    .eq('endpoint', endpoint)

  if (error) {
    console.error('Failed to remove subscription:', error)
    return false
  }

  return true
}

export async function cleanupExpiredSubscriptions(): Promise<number> {
  const supabase = createServiceRoleClient()

  const { data, error } = await supabase
    .from('push_subscriptions')
    .delete()
    .lt('expires_at', new Date().toISOString())
    .select('id')

  if (error) {
    console.error('Failed to clean expired subscriptions:', error)
    return 0
  }

  return data?.length ?? 0
}
