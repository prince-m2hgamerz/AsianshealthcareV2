import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const ALLOWED_HOSTS = [
  "satyughealthcare.com",
  "www.vaidam.com",
  "medanta.s3.ap-south-1.amazonaws.com",
  "upload.wikimedia.org",
  "img.youtube.com",
  "images.unsplash.com",
  "getwellgo.com",
  "safartibbi.com",
  "www.joonsquare.com",
  "crossborderscare.com",
  "www.globalcarehealth.com",
  "medicircle.in",
];

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");
  if (!url) {
    return new NextResponse("Missing url parameter", { status: 400 });
  }

  let targetUrl: URL;
  try {
    targetUrl = new URL(url);
  } catch {
    return new NextResponse("Invalid url parameter", { status: 400 });
  }

  if (!ALLOWED_HOSTS.includes(targetUrl.hostname)) {
    return new NextResponse("Hostname not allowed", { status: 403 });
  }

  try {
    const response = await fetch(targetUrl.toString(), {
      headers: { "User-Agent": "M2H-Healthcare/1.0" },
    });

    if (!response.ok) {
      return new NextResponse("Failed to fetch image", { status: response.status });
    }

    const contentType = response.headers.get("content-type") || "image/jpeg";
    const buffer = await response.arrayBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch {
    return new NextResponse("Failed to fetch image", { status: 502 });
  }
}
