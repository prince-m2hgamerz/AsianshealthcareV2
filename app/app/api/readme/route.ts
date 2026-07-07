import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const path = join(process.cwd(), "README.md");
    const content = readFileSync(path, "utf-8");
    return NextResponse.json({ content });
  } catch {
    return NextResponse.json(
      { error: "Failed to read README.md" },
      { status: 500 }
    );
  }
}
