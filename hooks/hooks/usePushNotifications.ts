'use client'

import { useState, useEffect, useCallback } from 'react'
import type { ServiceWorkerRegistration } from '@/types/pwa'

type NotificationPermissionState = 'default' | 'granted' | 'denied' | 'unsupported'

interface UsePushNotificationsReturn {
  permission: NotificationPermissionState
  subscribed: boolean
  subscribing: boolean
  subscribe: () => Promise<boolean>
  unsubscribe: () => Promise<boolean>
}

export function usePushNotifications(sw: ServiceWorkerRegistration): UsePushNotificationsReturn {
  const [permission, setPermission] = useState<NotificationPermissionState>('unsupported')
  const [subscribed, setSubscribed] = useState(false)
  const [subscribing, setSubscribing] = useState(false)

  const supportsPush =
    typeof window !== 'undefined' &&
    'Notification' in window &&
    'serviceWorker' in navigator &&
    'PushManager' in window

  useEffect(() => {
    if (!supportsPush) return

    setPermission(Notification.permission as NotificationPermissionState)

    if (Notification.permission === 'granted' && sw.subscription) {
      setSubscribed(true)
    }
  }, [supportsPush, sw.subscription])

  const subscribe = useCallback(async (): Promise<boolean> => {
    if (!supportsPush || !sw.registration) return false

    if (Notification.permission === 'denied') {
      return false
    }

    if (Notification.permission === 'default') {
      const result = await Notification.requestPermission()
      setPermission(result as NotificationPermissionState)
      if (result !== 'granted') return false
    }

    try {
      setSubscribing(true)
      const subscription = await sw.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? ''
        ) as any,
      })

      const response = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscription.toJSON()),
      })

      if (!response.ok) {
        throw new Error('Failed to save subscription')
      }

      setSubscribed(true)
      return true
    } catch (err) {
      console.error('Push subscription failed:', err)
      return false
    } finally {
      setSubscribing(false)
    }
  }, [supportsPush, sw.registration])

  const unsubscribe = useCallback(async (): Promise<boolean> => {
    if (!sw.subscription) return false

    try {
      await sw.subscription.unsubscribe()
      const endpoint = sw.subscription.endpoint

      await fetch('/api/push/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ endpoint }),
      })

      setSubscribed(false)
      return true
    } catch (err) {
      console.error('Push unsubscription failed:', err)
      return false
    }
  }, [sw.subscription])

  return { permission, subscribed, subscribing, subscribe, unsubscribe }
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)))
}
