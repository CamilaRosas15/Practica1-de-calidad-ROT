import { NextRequest, NextResponse } from "next/server";

import { mpServerTrack } from "@/lib/mixpanelServer";
import { sharedRedis } from "@/lib/rateLimit";
import { getClientIp } from "@/lib/getClientIp";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Deduplication check
    const dedupeKey = `dedupe:${data.$device_id}:${data.path}`;

    try {
      const result = await sharedRedis.set(dedupeKey, "1", {
        nx: true, // Only set if not exists
        ex: 1, // 1 second expiration
      });

      if (result !== "OK") {
        return NextResponse.json({ success: true, message: "Duplicate event skipped" }, { status: 200 });
      }
    } catch (redisError) {
      console.error("Redis dedupe failed:", redisError);
      // Continue tracking anyway to avoid losing data
    }

    // Enrich with server-side IP if missing
    if (!data.ip) {
      data.ip = getClientIp(request);
    }

    await mpServerTrack("Page View Server", data);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error tracking page view:", error);

    return NextResponse.json({ success: false, error: "Failed to track page view" }, { status: 500 });
  }
}

// Ensure this runs in Node.js runtime
export const runtime = "nodejs";
