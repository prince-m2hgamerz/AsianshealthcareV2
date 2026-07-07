"use client";

export default function TestErrorPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-canvas">
      <div className="text-center space-y-6 p-8">
        <h1 className="text-heading-lg text-on-primary">Test Rollbar</h1>
        <p className="text-link-cool-2">Click the button to send a test error to Rollbar.</p>
        <button
          onClick={() => {
            throw new Error("Test error from Next.js App Router");
          }}
          className="btn-primary"
        >
          Trigger Test Error
        </button>
      </div>
    </div>
  );
}
