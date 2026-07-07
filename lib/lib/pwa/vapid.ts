import webpush from 'web-push'

function getVapidKeys() {
  const publicKey = process.env.VAPID_PUBLIC_KEY
  const privateKey = process.env.VAPID_PRIVATE_KEY

  if (!publicKey || !privateKey) {
    if (typeof window !== 'undefined') {
      return null
    }
    throw new Error(
      'VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY must be set in environment variables. ' +
        'Run `node scripts/generate-vapid-keys.mjs` to generate them.'
    )
  }

  return { publicKey, privateKey }
}

export function getVapidPublicKey(): string | null {
  const keys = getVapidKeys()
  return keys?.publicKey ?? null
}

export function configureWebPush(): void {
  const keys = getVapidKeys()
  if (!keys) return

  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT ?? 'mailto:admin@medsolutionhealthcare.com',
    keys.publicKey,
    keys.privateKey
  )
}


