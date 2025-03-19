"use client";

import { ReactNode, useEffect } from "react";
// import { usePathname } from "next/navigation";
import mixpanel from "mixpanel-browser";
import { useUser } from "@clerk/nextjs";

import { MIXPANEL_COOKIE_NAME } from "@/lib/constants/mixpanelCookie";
import { setCookieAction } from "@/app/actions/setCookieAction";
import { getCookieAction } from "@/app/actions/getCookieAction";

type MixpanelProviderProps = {
  children: ReactNode;
};

export function MixpanelProvider({ children }: MixpanelProviderProps) {
  //   const pathname = usePathname();

  const { user, isLoaded } = useUser();

  // Initialize Mixpanel
  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN!;

    mixpanel.init(token, {
      debug: process.env.NODE_ENV === "development",
      track_pageview: "url-with-path",
      persistence: "localStorage",
      record_sessions_percent: Number(process.env.NEXT_PUBLIC_MIXPANEL_RECORD_SESSIONS_PERCENT ?? 1),
    });
  }, []);

  // Set Super Property for isSignedIn
  useEffect(() => {
    if (isLoaded) {
      const isSignedIn = !!user;

      const currentIsSignedIn = mixpanel.get_property("is_signed_in");

      if (isSignedIn !== currentIsSignedIn) {
        mixpanel.register({
          is_signed_in: isSignedIn, // true if user is signed in, false otherwise
        });
      }
    }
  }, [isLoaded, user]);

  // Identify user when they log in
  useEffect(() => {
    if (!isLoaded) return;

    const currentDistinctId = mixpanel.get_distinct_id();

    if (user) {
      if (currentDistinctId !== user.id) {
        // Set the user ID as distinct_id for all events after login
        const deviceId = currentDistinctId;

        mixpanel.identify(user.id);

        mixpanel.track("User Identified", {
          $user_id: user.id,
          $device_id: deviceId,
        });

        // Set the cookie to the device ID once
        setCookieAction(MIXPANEL_COOKIE_NAME, deviceId);
      }
    } else {
      // Only reset if we're transitioning from logged in to logged out
      // Not on initial load or browser refresh
      const wasLoggedIn = typeof currentDistinctId === "string" && currentDistinctId.startsWith("user_");

      if (wasLoggedIn) {
        mixpanel.reset();

        // After reset, get the new anonymous ID and update the cookie
        const newAnonymousId = mixpanel.get_distinct_id();

        setCookieAction(MIXPANEL_COOKIE_NAME, newAnonymousId);
      } else {
        // Anonymous user: set cookie only if it doesn't exist
        const existingCookie = getCookieAction(MIXPANEL_COOKIE_NAME);

        if (!existingCookie) {
          setCookieAction(MIXPANEL_COOKIE_NAME, currentDistinctId);
        }
      }
    }
  }, [isLoaded, user]);

  // Track page views
  //   useEffect(() => {
  //     if (pathname) {
  //       mixpanel.track("Page View", { path: pathname });
  //     }
  //   }, [pathname]);

  return <>{children}</>;
}
