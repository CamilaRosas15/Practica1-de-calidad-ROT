import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse, userAgent, NextRequest } from "next/server";

import { createRateLimitResponse } from "@/lib/errorHandling";
import { jobLimiters, othersLimiters, companyLimiters, settingsLimiters, createFallbackRateLimiters } from "@/lib/rateLimit";
import { RateLimitRouteType, OperationType } from "@/lib/rateLimitConfig";
import { MIXPANEL_COOKIE_NAME } from "@/lib/constants/mixpanelCookie";
import { getClientIp } from "@/lib/getClientIp";
import { API } from "@/lib/constants/apiRoutes";

// --- Route Matchers ---
const isProtectedRoute = createRouteMatcher(["/applications", "/settings"]);
const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isJobRoutes = createRouteMatcher(["/api/job(.*)"]);
const isCompanyRoutes = createRouteMatcher(["/api/company(.*)"]);
const isOtherRoutes = createRouteMatcher(["/api/comment(.*)", "/api/application(.*)"]);
const isSettingsRoutes = createRouteMatcher(["/api/settings(.*)"]);
const IS_UPSTASH_FAILED = process.env.NEXT_PUBLIC_IS_UPSTASH_FAILED === "true";

// --- Middleware Handlers ---

function handleAdminRoute(req: NextRequest, role: string | undefined | null): NextResponse | null {
  if (isAdminRoute(req)) {
    if (role !== "admin") {
      const url = new URL(process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL ?? "/sign-in", req.url);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }
  return null;
}

function getLimiterForRequest(req: NextRequest) {
  if (isJobRoutes(req)) return jobLimiters;
  if (isCompanyRoutes(req)) return companyLimiters;
  if (isSettingsRoutes(req)) return settingsLimiters;
  if (isOtherRoutes(req)) return othersLimiters;
  return null;
}

// **NUEVA FUNCIÓN AUXILIAR** para eliminar el ternario anidado y reducir la complejidad.
function getRouteTypeForRequest(req: NextRequest): RateLimitRouteType {
    if (isJobRoutes(req)) return "JOB";
    if (isCompanyRoutes(req)) return "COMPANY";
    if (isSettingsRoutes(req)) return "SETTINGS";
    return "OTHERS";
}

async function handleRateLimiting(req: NextRequest): Promise<NextResponse | null> {
  const limiters = getLimiterForRequest(req);
  if (!limiters) {
    return null;
  }

  const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
  const isRead = ["GET", "HEAD"].includes(req.method);
  
  // **MEJORA:** Usamos la nueva función, que es mucho más legible y tiene menor complejidad.
  const routeType = getRouteTypeForRequest(req);
  const operation: OperationType = isRead ? "READ" : "WRITE";

  const handleFallback = async () => {
    const [burst, sustained] = await createFallbackRateLimiters({ routeType, operation, ip });
    return burst.success && sustained.success;
  };

  if (IS_UPSTASH_FAILED) {
    if (!(await handleFallback())) {
      return NextResponse.json(createRateLimitResponse("fallback"), { status: 429 });
    }
    return null;
  }

  try {
    const burstLimiter = isRead ? limiters.burstRead : limiters.burstWrite;
    const sustainedLimiter = isRead ? limiters.sustainedRead : limiters.sustainedWrite;
    const [burstResult, sustainedResult] = await Promise.all([burstLimiter.limit(ip), sustainedLimiter.limit(ip)]);

    if (!burstResult.success || !sustainedResult.success) {
      return NextResponse.json(createRateLimitResponse("primary"), { status: 429 });
    }
  } catch (error) {
    console.warn("Upstash rate limiter failed:", error);
    if (!(await handleFallback())) {
      return NextResponse.json(createRateLimitResponse("fallback"), { status: 429 });
    }
  }

  return null;
}

function handlePageTracking(req: NextRequest, userId: string | null | undefined): NextResponse {
    const response = NextResponse.next();
    const url = new URL(req.url);

    const cookieStore = req.cookies;
    let deviceId = cookieStore.get(MIXPANEL_COOKIE_NAME)?.value;
    if (!deviceId) {
        deviceId = crypto.randomUUID();
        response.cookies.set({
            name: MIXPANEL_COOKIE_NAME, value: deviceId, path: "/", httpOnly: true,
            secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge: 60 * 60 * 24 * 365,
        });
    }

    const { device, browser, os, isBot, ua } = userAgent(req);
    const userAgentData = {
        $browser: browser.name, $browser_version: browser.version,
        $os: os.name, $os_version: os.version,
        $device: device.vendor, $model: device.model,
        userAgent: ua, isBot,
    };
    
    fetch(`${url.origin}${API.MIXPANEL_TRACK.pageView}`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            path: url.pathname, $current_url: req.url, referrer: req.headers.get("referer") || undefined,
            ip: getClientIp(req), $device_id: deviceId, isNewDeviceId: !cookieStore.get(MIXPANEL_COOKIE_NAME)?.value,
            callFrom: "middleware", ...userAgentData, ...(userId && { user_id: userId }),
            ...Object.fromEntries(url.searchParams.entries()),
        }),
    }).catch(console.error);
    
    return response;
}

// --- Middleware Principal Refactorizado ---

export default clerkMiddleware(async (auth, req) => {
  const session = auth();
  const userId = session?.userId;

  if (isProtectedRoute(req)) {
    if (!userId) {
      const redirectUrl = new URL(process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL ?? "/", req.url);
      return NextResponse.redirect(redirectUrl);
    }
    return NextResponse.next();
  }
  
  const userRole = session.sessionClaims?.metadata?.role as string | undefined;
  const adminResponse = handleAdminRoute(req, userRole);
  if (adminResponse) return adminResponse;

  const rateLimitResponse = await handleRateLimiting(req);
  if (rateLimitResponse) return rateLimitResponse;
  
  const url = new URL(req.url);
  const pathname = url.pathname;
  const isPageRequest = !pathname.startsWith("/api/") && !pathname.startsWith("/_next/") && !pathname.includes(".");
  const isPrefetch = req.headers.get("next-url") !== null;

  if (isPageRequest && !isPrefetch) {
    return handlePageTracking(req, userId);
  }

  return NextResponse.next();
});

// --- Config (sin cambios) ---
export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
  runtime: "nodejs",
};