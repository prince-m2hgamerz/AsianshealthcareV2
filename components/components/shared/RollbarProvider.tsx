"use client";

import { Provider, ErrorBoundary } from "@rollbar/react";
import { clientConfig } from "@/lib/rollbar";

export default function RollbarProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider config={clientConfig}>
      <ErrorBoundary
        fallbackUI={({ error }) => (
          <div className="flex items-center justify-center min-h-screen bg-canvas">
            <div className="text-center space-y-4 p-8 max-w-md">
              <h1 className="text-heading-lg text-on-primary">Something went wrong</h1>
              <p className="text-link-cool-2 text-sm">
                {error?.message || "An unexpected error occurred."}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="btn-primary text-sm"
              >
                Reload page
              </button>
            </div>
          </div>
        )}
      >
        {children}
      </ErrorBoundary>
    </Provider>
  );
}
