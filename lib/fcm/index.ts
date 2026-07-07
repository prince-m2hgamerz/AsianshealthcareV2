import { initializeApp, cert, applicationDefault, type App } from 'firebase-admin/app'
import { getMessaging } from 'firebase-admin/messaging'

let app: App | null = null

function getServiceAccount(): string | undefined {
  const envJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON
  if (envJson) return envJson

  const envKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  if (envKey) {
    try {
      return Buffer.from(envKey, 'base64').toString('utf-8')
    } catch {
      console.error('FCM: Failed to decode FIREBASE_SERVICE_ACCOUNT_KEY (expected base64)')
    }
  }
}

function getFirebaseApp(): App {
  if (app) return app

  const jsonString = getServiceAccount()

  if (jsonString) {
    try {
      const serviceAccount = JSON.parse(jsonString)
      app = initializeApp({
        credential: cert(serviceAccount),
      })
    } catch (err) {
      console.error('FCM: Failed to parse service account JSON:', err)
      throw err
    }
  } else {
    try {
      app = initializeApp({
        credential: applicationDefault(),
      })
    } catch (err) {
      console.error('FCM: Failed to initialize with default credentials:', err)
      throw err
    }
  }

  return app
}

export function getMessagingInstance() {
  return getMessaging(getFirebaseApp())
}
