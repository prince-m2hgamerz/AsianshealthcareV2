'use client'

import { useEffect, useState, useCallback } from 'react'
import { usePathname } from 'next/navigation'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}

function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

function getInstallInstructions() {
  const ua = navigator.userAgent.toLowerCase()
  if (ua.includes('edg')) return 'Click the ⋯ menu → Apps → Install this site as an app'
  if (ua.includes('chrome')) return 'Click the ⋮ menu → Install "MedSolution Admin"'
  if (ua.includes('firefox')) return 'Firefox does not support PWA installation on desktop.'
  if (ua.includes('safari')) return 'Tap the Share icon → Add to Home Screen'
  return 'Use your browser\'s menu to install this app.'
}

export default function InstallAdminPWA() {
  const [showManual, setShowManual] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstallable, setIsInstallable] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isPushSupported, setIsPushSupported] = useState(false)
  const [isPushSubscribed, setIsPushSubscribed] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)
  const [swRegistered, setSwRegistered] = useState(false)
  const [showFallback, setShowFallback] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const isRunningStandalone = window.matchMedia('(display-mode: standalone)').matches
      || (window.navigator as { standalone?: boolean }).standalone === true
    setIsInstalled(isRunningStandalone)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    setIsPushSupported('serviceWorker' in navigator && 'PushManager' in window)
  }, [])

  const registerAdminSw = useCallback(async () => {
    if (!('serviceWorker' in navigator)) return null
    try {
      const registration = await navigator.serviceWorker.register('/sw-admin.js', {
        scope: '/admin',
      })
      await navigator.serviceWorker.ready
      setSwRegistered(true)
      return registration
    } catch (e) {
      console.error('Failed to register admin SW:', e)
      return null
    }
  }, [])

  useEffect(() => {
    registerAdminSw()
  }, [registerAdminSw])

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setIsInstallable(true)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  useEffect(() => {
    const handler = () => setIsInstalled(true)
    window.addEventListener('appinstalled', handler)
    return () => window.removeEventListener('appinstalled', handler)
  }, [])

  useEffect(() => {
    if (isInstallable || isInstalled) {
      setShowFallback(false)
      return
    }
    const timer = setTimeout(() => setShowFallback(true), 5000)
    return () => clearTimeout(timer)
  }, [isInstallable, isInstalled])

  const subscribeToPush = useCallback(async () => {
    if (!isPushSupported) return
    setIsRegistering(true)
    try {
      const registration = await registerAdminSw()
      if (!registration) return

      const existingSubscription = await registration.pushManager.getSubscription()
      if (existingSubscription) {
        setIsPushSubscribed(true)
        setIsRegistering(false)
        return
      }

      const publicKeyResponse = await fetch('/api/push/vapid-public-key')
      if (!publicKeyResponse.ok) {
        setIsRegistering(false)
        return
      }
      const { publicKey } = await publicKeyResponse.json()

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      })

      const subJson = subscription.toJSON()
      const response = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          endpoint: subJson.endpoint,
          keys: subJson.keys,
          role: 'admin',
        }),
      })

      if (response.ok) {
        setIsPushSubscribed(true)
      }
    } catch (e) {
      console.error('Failed to subscribe to push:', e)
    } finally {
      setIsRegistering(false)
    }
  }, [isPushSupported, registerAdminSw])

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      setIsInstallable(false)
      setIsInstalled(true)
    }
    setDeferredPrompt(null)
  }, [deferredPrompt])

  if (pathname === '/admin/login') return null

  return (
    <div className="px-3 py-2">
      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
        Mobile App
      </div>
      <div className="space-y-1.5">
          {!isInstalled && isInstallable && (
            <button
              onClick={handleInstall}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v12m0 0l-4-4m4 4l4-4M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
              </svg>
              Install Admin App
            </button>
          )}
          {!isInstalled && !isInstallable && showFallback && swRegistered && (
            <div>
              <button
                onClick={() => setShowManual((v) => !v)}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v12m0 0l-4-4m4 4l4-4M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
                </svg>
                Install Admin App
              </button>
              {showManual && (
                <p className="mt-1.5 px-3 py-2 text-xs text-gray-500 bg-gray-800/50 rounded-lg leading-relaxed">
                  {getInstallInstructions()}
                </p>
              )}
            </div>
          )}
        {isPushSupported && !isPushSubscribed && (
          <button
            onClick={subscribeToPush}
            disabled={isRegistering}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {isRegistering ? 'Enabling...' : 'Enable Push Notifications'}
          </button>
        )}
        {isPushSubscribed && (
          <div className="flex items-center gap-2 px-3 py-2 text-sm text-green-400">
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Notifications On
          </div>
        )}
        {isInstalled && !isPushSubscribed && !isPushSupported && (
          <div className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500">
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            App Installed
          </div>
        )}
      </div>
    </div>
  )
}
