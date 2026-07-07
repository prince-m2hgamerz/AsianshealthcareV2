import Link from 'next/link'

export const metadata = {
  title: 'You\'re Offline',
  description: 'You are currently offline. Please check your connection.',
}

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M18.364 5.636a9 9 0 010 12.728m-2.829-2.829a5 5 0 000-7.07m-4.243 4.243a1 1 0 010-1.414M3 3l18 18"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          You&apos;re Offline
        </h1>

        <p className="text-gray-600 mb-8 text-lg">
          It looks like you&apos;ve lost your internet connection. Don&apos;t worry — once you&apos;re back online, you can continue where you left off.
        </p>

        <div className="space-y-4">
          <Link
            href="/"
            className="inline-block w-full sm:w-auto px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Try Again
          </Link>

          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-3">
              While offline, you can still:
            </p>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>&bull; View previously loaded pages</li>
              <li>&bull; Browse cached content</li>
              <li>&bull; Check your appointment information</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 text-xs text-gray-400">
          <p>Once connected, pull to refresh or tap Try Again above.</p>
        </div>
      </div>
    </div>
  )
}
