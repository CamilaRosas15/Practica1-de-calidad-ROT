import useSWR, { SWRConfiguration } from "swr";

import { fetcher } from "@/lib/fetcher";

export const ANON_USER_ID = "anonymous"; // Sentinel value for anonymous users - more descriptive than null/undefined

export type ClerkAuthUserId = string | null | undefined;

type AuthDependentKey = readonly [RequestInfo, ClerkAuthUserId];

/**
 * Fetcher function that extracts the URL from the cache key tuple
 * and ignores the userId (which is only used for cache invalidation)
 */
export const authDependentFetcher = async <T = any>([url, _userId]: AuthDependentKey): Promise<T> => {
  return fetcher(url);
};

/**
 * SWR hook that includes auth state in the cache key
 *
 * @param url - The API endpoint to fetch data from
 * @param userId - The current user's ID (or ANON_USER_ID if not authenticated)
 * @param options - Standard SWR configuration options
 * @returns SWR response with data, error, and other SWR properties
 *
 * @example
 * // In a component:
 * const { userId } = useAuth();
 * const { data, error } = useSWRWithAuthKey('/api/user-data', userId);
 */
export const useSWRWithAuthKey = <T>(url: RequestInfo, userId: ClerkAuthUserId, options?: SWRConfiguration<T>) => {
  // Create a stable cache key that changes when auth state changes.
  // Use the sentinel value for anonymous users to ensure consistency.
  // If userId is undefined, it means the user is anonymous.
  const swrKey: AuthDependentKey | null = url ? ([url, userId ?? ANON_USER_ID] as const) : null;

  return useSWR<T>(swrKey, authDependentFetcher, options);
};
