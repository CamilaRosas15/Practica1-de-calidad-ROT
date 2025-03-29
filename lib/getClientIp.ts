import { NextRequest } from "next/server";

export function getClientIp(request: NextRequest) {
  const headersList = request.headers;

  const forwardedFor = headersList.get("x-forwarded-for");
  const realIp = headersList.get("x-real-ip");

  return forwardedFor?.split(",")[0]?.trim() || realIp?.trim() || "unknown";
}
