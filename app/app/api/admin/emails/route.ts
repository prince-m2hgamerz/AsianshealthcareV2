import { NextResponse } from "next/server";
import { checkAdmin } from "@/lib/admin-auth";

const WORKER_URL = process.env.EMAIL_WORKER_URL || "https://medsolution-email-handler.your-subdomain.workers.dev";
const WORKER_TOKEN = process.env.EMAIL_WORKER_TOKEN || "";

export async function GET(request: Request) {
  const unauthorized = await checkAdmin(request);
  if (unauthorized) return unauthorized;

  try {
    const url = new URL(request.url);
    const params = new URLSearchParams();
    if (url.searchParams.get("cursor")) params.set("cursor", url.searchParams.get("cursor")!);
    if (url.searchParams.get("limit")) params.set("limit", url.searchParams.get("limit")!);
    if (url.searchParams.get("status")) params.set("status", url.searchParams.get("status")!);
    if (url.searchParams.get("search")) params.set("q", url.searchParams.get("search")!);

    const endpoint = url.searchParams.get("search")
      ? `${WORKER_URL}/api/emails/search?${params.toString()}`
      : `${WORKER_URL}/api/emails?${params.toString()}`;

    const res = await fetch(endpoint, {
      headers: { "x-api-token": WORKER_TOKEN },
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Worker error" }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const unauthorized = await checkAdmin(request);
  if (unauthorized) return unauthorized;

  try {
    const { id } = await request.json();
    const res = await fetch(`${WORKER_URL}/api/emails/${id}`, {
      method: "DELETE",
      headers: { "x-api-token": WORKER_TOKEN },
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Worker error" }, { status: res.status });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
