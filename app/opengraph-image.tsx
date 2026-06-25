import { ImageResponse } from "@vercel/og";

export const runtime = "edge";
export const alt = "Med Solution Healthcare - Medical Tourism in India";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)",
          color: "#f5f5f5",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -100,
            right: -100,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(144,190,109,0.15) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -80,
            left: -80,
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(144,190,109,0.1) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 100,
            height: 100,
            borderRadius: 24,
            background: "rgba(144,190,109,0.15)",
            marginBottom: 24,
            border: "2px solid rgba(144,190,109,0.3)",
          }}
        >
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <rect x="18" y="6" width="12" height="36" rx="4" fill="#90BE6D" />
            <rect x="6" y="18" width="36" height="12" rx="4" fill="#90BE6D" />
          </svg>
        </div>
        <h1 style={{ fontSize: 56, fontWeight: 600, letterSpacing: "-0.02em", marginBottom: 12, textAlign: "center", lineHeight: 1.2 }}>
          Med Solution Healthcare
        </h1>
        <p style={{ fontSize: 24, color: "#90BE6D", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>
          Medical Tourism in India
        </p>
        <p style={{ fontSize: 18, color: "#9CA3AF", maxWidth: 600, textAlign: "center", lineHeight: 1.5 }}>
          Connect with India&apos;s top hospitals and doctors. Affordable, world-class healthcare for international patients.
        </p>
      </div>
    ),
    { ...size },
  );
}
