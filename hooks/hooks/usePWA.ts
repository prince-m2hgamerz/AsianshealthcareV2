'use client'

import { useState, useEffect, useCallback } from 'react'
import type { InstallPromptEvent, ServiceWorkerRegistration } from '@/types/pwa'

interface PWAState {
  canInstall: boolean
  isInstalled: boolean
  isOffline: boolean
  swRegistration: ServiceWorkerRegistration
  supportsPWA: boolean
}

export function usePWA(): PWAState & { install: () => Promise<void> } {
  const [canInstall, setCanInstall] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isOffline, setIsOffline] = useState(!globalThis?.navigator?.onLine)
  const [swRegistration, setSwRegistration] = useState<ServiceWorkerRegistration>({
    registration: null,
    subscription: null,
    status: 'unsupported',
  })
  const [deferredPrompt, setDeferredPrompt] = useState<InstallPromptEvent | null>(null)
  const supportsPWA = typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window

  useEffect(() => {
    if (typeof window === 'undefined') return

    setIsOffline(!navigator.onLine)

    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  useEffect(() => {
    if (!supportsPWA) return

    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as InstallPromptEvent)
      setCanInstall(true)
    }

    window.addEventListener('beforeinstallprompt', handler)

    window.addEventListener('appinstalled', () => {
      setIsInstalled(true)
      setCanInstall(false)
      setDeferredPrompt(null)
    })

    navigator.serviceWorker.ready.then((registration) => {
      setSwRegistration((prev) => ({
        ...prev,
        registration,
        status: 'registered',
      }))
      registration.pushManager.getSubscription().then((sub) => {
        setSwRegistration((prev) => ({ ...prev, subscription: sub }))
      })
    })

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
    }
  }, [supportsPWA])

  const install = useCallback(async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      setCanInstall(false)
      setIsInstalled(true)
    }
    setDeferredPrompt(null)
  }, [deferredPrompt])

  useEffect(() => {
    if (!supportsPWA) return

    const register = async () => {
      try {
        setSwRegistration((prev) => ({ ...prev, status: 'registering' }))
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
        })
        setSwRegistration((prev) => ({
          ...prev,
          registration,
          status: 'registered',
        }))

        const sub = await registration.pushManager.getSubscription()
        setSwRegistration((prev) => ({ ...prev, subscription: sub }))
      } catch (err) {
        setSwRegistration((prev) => ({
          ...prev,
          status: 'error',
          error: err instanceof Error ? err.message : 'Failed to register service worker',
        }))
      }
    }

    if (document.readyState === 'complete') {
      register()
    } else {
      window.addEventListener('load', register)
      return () => window.removeEventListener('load', register)
    }
  }, [supportsPWA])

  return {
    canInstall,
    isInstalled,
    isOffline,
    swRegistration,
    supportsPWA,
    install,
  }
}
