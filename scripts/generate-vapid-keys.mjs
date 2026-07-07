import webpush from 'web-push'
import { writeFileSync, existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const vapidKeys = webpush.generateVAPIDKeys()

console.log('\n=== VAPID Keys Generated ===\n')
console.log('VAPID_PUBLIC_KEY:')
console.log(vapidKeys.publicKey)
console.log('\nVAPID_PRIVATE_KEY:')
console.log(vapidKeys.privateKey)
console.log('\n')

const envPath = resolve(__dirname, '..', '.env.local')
const existing = existsSync(envPath) ? '' : ''

const entries = `# PWA Web Push VAPID Keys
VAPID_PUBLIC_KEY=${vapidKeys.publicKey}
VAPID_PRIVATE_KEY=${vapidKeys.privateKey}
VAPID_SUBJECT=mailto:admin@asianshealthcare.com
`

if (existing) {
  writeFileSync(envPath, entries, { flag: 'a' })
  console.log(`Appended VAPID keys to ${envPath}`)
} else {
  writeFileSync(envPath, entries)
  console.log(`Created ${envPath} with VAPID keys`)
}
