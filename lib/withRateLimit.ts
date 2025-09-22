import { cookies } from "next/headers";
import { auth } from "@clerk/nextjs/server";

import { ERROR_MESSAGES } from "./errorHandling";
import { 
  companyLimiters, 
  createFallbackRateLimiters, 
  isUpstashDailyLimitError, 
  jobLimiters, 
  othersLimiters, 
  settingsLimiters 
} from "./rateLimit";
import { RateLimitRouteType } from "./rateLimitConfig";
import { mpServerTrack } from "@/lib/mixpanelServer";

type EndpointName = "CreateJob" | "CreateCompany" | "CreateComment" | "TrackApplication" | "ReportAdmin" | "UpdateInterviewRounds" | "UpdateComment" | "UpdateUserPreferences";


//Determina el tipo de ruta basado en el nombre del endpoint.
function getRouteTypeForEndpoint(endpointName: EndpointName): RateLimitRouteType {
  if (endpointName === "CreateJob") return "JOB";
  if (endpointName === "CreateCompany") return "COMPANY";
  if (endpointName === "UpdateUserPreferences") return "SETTINGS";
  return "OTHERS";
}

//Centraliza el seguimiento de eventos cuando se excede el límite de tasa.
async function trackRateLimitExceeded(details: {
  limiterType: "Primary" | "Fallback";
  routeType: RateLimitRouteType;
  endpointName: EndpointName;
  ip: string;
  userId?: string | null;
  result: { limit: number; remaining: number };
  windowType: "BURST" | "SUSTAINED";
}) {
  await mpServerTrack("Rate limit exceeded", {
    limiter_type: details.limiterType,
    route_type: details.routeType,
    endpoint_name: details.endpointName,
    attempts_made: details.result.limit - details.result.remaining,
    window_type: details.windowType,
    ip_address: details.ip,
    ...(details.userId ? { user_id: details.userId } : {}),
  });
}

//Valida el límite de tasa primario (Upstash).
async function checkPrimaryRateLimit(ip: string, routeType: RateLimitRouteType, endpointName: EndpointName, userId: string) {
  const limiters = {
    JOB: jobLimiters,
    COMPANY: companyLimiters,
    OTHERS: othersLimiters,
    SETTINGS: settingsLimiters,
  }[routeType];

  const [burstResult, sustainedResult] = await Promise.all([
    limiters.burstWrite.limit(ip),
    limiters.sustainedWrite.limit(ip),
  ]);

  if (!burstResult.success || !sustainedResult.success) {
    const failedResult = burstResult.success ? sustainedResult : burstResult;
    const windowType = burstResult.success ? "SUSTAINED" : "BURST";
    
    await trackRateLimitExceeded({
      limiterType: "Primary",
      routeType,
      endpointName,
      ip,
      userId,
      result: failedResult,
      windowType,
    });
    throw new Error(ERROR_MESSAGES.TOO_MANY_REQUESTS);
  }
}

//Valida el límite de tasa de respaldo (en memoria).
async function checkFallbackRateLimit(ip: string, routeType: RateLimitRouteType, endpointName: EndpointName, userId: string) {
  const [burstFallback, sustainedFallback] = await createFallbackRateLimiters({ routeType, operation: "WRITE", ip });

  if (!burstFallback.success || !sustainedFallback.success) {
    const failedResult = !burstFallback.success ? burstFallback : sustainedFallback;
    const windowType = !burstFallback.success ? "BURST" : "SUSTAINED";

    await trackRateLimitExceeded({
      limiterType: "Fallback",
      routeType,
      endpointName,
      ip,
      userId,
      result: failedResult,
      windowType,
    });
    throw new Error(ERROR_MESSAGES.TOO_MANY_REQUESTS);
  }
}

// --- Función Principal Refactorizada ---

export async function withRateLimit<T>(action: (user_id: string) => Promise<T>, endpointName: EndpointName): Promise<T> {
  const { userId } = auth();
  const ip = cookies().get("x-real-ip")?.value ?? "127.0.0.1";

  if (!userId) {
    await mpServerTrack("Authentication error rate limit", {
      endpoint_name: endpointName,
      ip_address: ip,
    });
    throw new Error("User not authenticated");
  }

  const routeType = getRouteTypeForEndpoint(endpointName);

  try {
    await checkPrimaryRateLimit(ip, routeType, endpointName, userId);
  } catch (error) {
    if (isUpstashDailyLimitError(error)) {
      await checkFallbackRateLimit(ip, routeType, endpointName, userId);
    } else {
      throw error;
    }
  }

  return action(userId);
}