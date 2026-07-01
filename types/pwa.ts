export interface PushSubscriptionData {
  id: string
  endpoint: string
  p256dh: string
  auth: string
  user_agent: string | null
  role: string | null
  created_at: string
  expires_at: string | null
}

export interface NotificationPayload {
  title: string
  body: string
  icon?: string
  badge?: string
  data?: Record<string, unknown>
  tag?: string
  requireInteraction?: boolean
  vibrate?: number[]
}

export interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}

export type OnlineStatusState = 'online' | 'offline' | 'slow-connection'

export interface ServiceWorkerRegistration {
  registration: globalThis.ServiceWorkerRegistration | null
  subscription: PushSubscription | null
  status: 'unsupported' | 'unregistered' | 'registering' | 'registered' | 'error'
  error?: string
}
