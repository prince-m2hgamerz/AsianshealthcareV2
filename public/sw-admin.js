const CACHE_VERSION = 'v1'
const ADMIN_STATIC_CACHE = `medsolution-admin-static-${CACHE_VERSION}`
const ADMIN_DYNAMIC_CACHE = `medsolution-admin-dynamic-${CACHE_VERSION}`
const ADMIN_API_CACHE = `medsolution-admin-api-${CACHE_VERSION}`
const OFFLINE_URL = '/offline'

const STATIC_ASSETS = [
  '/admin',
  '/admin/login',
  '/offline',
  '/manifest-admin.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/icons/icon-72x72.png',
]

const PAGE_CACHE_REGEX = /\.(html?|css|js|json|xml|svg|ico|png|jpg|jpeg|webp|avif|gif|woff2?|ttf|eot)$/

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(ADMIN_STATIC_CACHE).then((cache) => {
      return cache.addAll(STATIC_ASSETS)
    })
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== ADMIN_STATIC_CACHE && key !== ADMIN_DYNAMIC_CACHE && key !== ADMIN_API_CACHE)
          .map((key) => caches.delete(key))
      )
    })
  )
  self.clients.claim()
})

function isNavigationRequest(request) {
  return request.mode === 'navigate'
}

function isAdminApiRequest(url) {
  return url.pathname.startsWith('/api/admin/')
}

function isStaticAsset(url) {
  return PAGE_CACHE_REGEX.test(url.pathname) || url.pathname.startsWith('/icons/')
}

self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  if (url.origin !== self.location.origin) return

  if (isAdminApiRequest(url)) {
    event.respondWith(networkFirstStrategy(request, ADMIN_API_CACHE))
    return
  }

  if (isStaticAsset(url)) {
    event.respondWith(cacheFirstStrategy(request))
    return
  }

  if (isNavigationRequest(request)) {
    event.respondWith(networkFirstNavigationStrategy(request))
    return
  }

  event.respondWith(networkFirstStrategy(request, ADMIN_DYNAMIC_CACHE))
})

async function cacheFirstStrategy(request) {
  const cached = await caches.match(request)
  if (cached) return cached

  try {
    const response = await fetch(request)
    if (response.ok) {
      const cache = await caches.open(ADMIN_DYNAMIC_CACHE)
      cache.put(request, response.clone())
    }
    return response
  } catch {
    return caches.match(OFFLINE_URL)
  }
}

async function networkFirstStrategy(request, cacheName) {
  try {
    const response = await fetch(request)
    if (response.ok) {
      const cache = await caches.open(cacheName)
      cache.put(request, response.clone())
    }
    return response
  } catch {
    const cached = await caches.match(request)
    if (cached) return cached
    if (request.mode === 'navigate') {
      return caches.match(OFFLINE_URL)
    }
    return new Response(JSON.stringify({ offline: true }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

async function networkFirstNavigationStrategy(request) {
  try {
    const response = await fetch(request)
    if (response.ok) {
      const cache = await caches.open(ADMIN_DYNAMIC_CACHE)
      cache.put(request, response.clone())
    }
    return response
  } catch {
    const cached = await caches.match(request)
    if (cached) return cached
    return caches.match(OFFLINE_URL)
  }
}

self.addEventListener('push', (event) => {
  if (!event.data) return

  try {
    const data = event.data.json()
    const options = {
      body: data.body ?? '',
      icon: data.icon ?? '/icons/icon-192x192.png',
      badge: data.badge ?? '/icons/icon-72x72.png',
      data: data.data ?? {},
      tag: data.tag ?? 'default',
      requireInteraction: data.requireInteraction ?? true,
      vibrate: data.vibrate ?? [200, 100, 200],
      actions: data.actions ?? [],
    }

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    )
  } catch {
    event.waitUntil(
      self.registration.showNotification('MedSolution Admin', {
        body: event.data.text(),
        icon: '/icons/icon-192x192.png',
      })
    )
  }
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  const notification = event.notification
  const action = event.action

  let urlToOpen = notification.data?.url ?? '/admin'

  if (action && notification.data?.actions?.[action]) {
    urlToOpen = notification.data.actions[action]
  }

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if (client.url.includes('/admin') && 'focus' in client) {
          return client.focus()
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(urlToOpen)
      }
    })
  )
})

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})
