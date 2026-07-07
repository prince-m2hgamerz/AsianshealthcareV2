import { getMessagingInstance } from './index'

export interface FcmPayload {
  title: string
  body: string
  url?: string
  icon?: string
}

export async function sendToDevice(
  token: string,
  payload: FcmPayload
): Promise<boolean> {
  try {
    const messaging = getMessagingInstance()
    await messaging.send({
      token,
      notification: {
        title: payload.title,
        body: payload.body,
      },
      data: {
        url: payload.url ?? '/admin',
        title: payload.title,
        body: payload.body,
      },
      android: {
        notification: {
          channelId: 'admin_alerts',
          priority: 'high',
          clickAction: payload.url ?? '/admin',
        },
      },
    })
    return true
  } catch (err) {
    const error = err as { code?: string }
    if (error.code === 'messaging/registration-token-not-registered') {
      console.warn(`FCM: Token no longer registered, removing`)
    } else {
      console.error('FCM: Send failed:', err)
    }
    return false
  }
}

export async function sendToMultipleDevices(
  tokens: string[],
  payload: FcmPayload
): Promise<{ success: number; failed: number; invalidTokens: string[] }> {
  if (tokens.length === 0) return { success: 0, failed: 0, invalidTokens: [] }

  const invalidTokens: string[] = []
  let success = 0
  let failed = 0

  for (const token of tokens) {
    const ok = await sendToDevice(token, payload)
    if (ok) {
      success++
    } else {
      failed++
      invalidTokens.push(token)
    }
  }

  return { success, failed, invalidTokens }
}

export async function sendToAllDevices(
  tokens: string[],
  payload: FcmPayload
): Promise<{ success: number; failed: number; invalidTokens: string[] }> {
  return sendToMultipleDevices(tokens, payload)
}
