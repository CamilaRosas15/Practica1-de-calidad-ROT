import { NextRequest, NextResponse } from "next/server";

import { mpServerTrack } from "@/lib/mixpanelServer";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Get the client IP from headers if not provided (prioritize x-forwarded-for which contains the original client IP)
    if (!data.ip) {
      const clientIp = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || request.headers.get("x-real-ip") || request.ip;

      data.ip = clientIp;
    }

    // Add user agent for browser detection

    await mpServerTrack("Page View Server", data);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error tracking page view:", error);

    return NextResponse.json({ success: false, error: "Failed to track page view" }, { status: 500 });
  }
}

// Ensure this runs in Node.js runtime
export const runtime = "nodejs";
