import { NextResponse } from "next/server";
import { checkAdmin } from "@/lib/admin-auth";

const WORKER_URL = process.env.EMAIL_WORKER_URL || "https://medsolution-email-handler.your-subdomain.workers.dev";
const WORKER_TOKEN = process.env.EMAIL_WORKER_TOKEN || "";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = await checkAdmin(_request);
  if (unauthorized) return unauthorized;

  try {
    const { id } = await params;
    const res = await fetch(`${WORKER_URL}/api/emails/${id}`, {
      headers: { "x-api-token": WORKER_TOKEN },
    });

    if (!res.ok) {
      if (res.status === 404) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }
      return NextResponse.json({ error: "Worker error" }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = await checkAdmin(_request);
  if (unauthorized) return unauthorized;

  try {
    const { id } = await params;
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
