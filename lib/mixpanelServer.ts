import Mixpanel from "mixpanel";
import { cookies } from "next/headers";

import { MIXPANEL_COOKIE_NAME } from "@/lib/constants/mixpanelCookie";

// Create singleton instance
const mp = Mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_TOKEN!, {
  debug: process.env.NODE_ENV === "development",
});

/**
 * Track an event in Mixpanel with proper anonymous and user ID handling
 */
export async function mpServerTrack(eventName: string, properties: Record<string, any> = {}) {
  const cookieStore = await cookies();
  let deviceId = cookieStore.get(MIXPANEL_COOKIE_NAME)?.value;

  // Set device ID for all events
  if (deviceId) {
    properties.$device_id = deviceId;
  }

  // Handle user ID if provided
  if (properties.user_id) {
    properties.$user_id = properties.user_id;
    delete properties.user_id;
  }

  mp.track(eventName, properties);
}

export { mp };
