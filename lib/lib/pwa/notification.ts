import webpush from 'web-push'
import { configureWebPush } from './vapid'
import { removeSubscription } from './subscription-manager'
import type { NotificationPayload } from '@/types/pwa'

export interface PushSubscriptionRow {
  id: string
  endpoint: string
  p256dh: string
  auth: string
}

export async function sendPushNotification(
  subscriptions: PushSubscriptionRow[],
  payload: NotificationPayload
): Promise<{ success: number; failed: number }> {
  configureWebPush()

  let success = 0
  let failed = 0

  const results = await Promise.allSettled(
    subscriptions.map((sub) =>
      webpush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: { p256dh: sub.p256dh, auth: sub.auth },
        },
        JSON.stringify(payload)
      )
    )
  )

  for (const result of results) {
    if (result.status === 'fulfilled') {
      success++
    } else {
      const reason = result.reason
      if (reason?.statusCode === 410) {
        const sub = subscriptions[results.indexOf(result)]
        if (sub?.endpoint) {
          removeSubscription(sub.endpoint)
        }
      }
      failed++
      console.error('Push notification failed:', reason)
    }
  }

  return { success, failed }
}
