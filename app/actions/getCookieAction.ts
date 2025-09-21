"use server";

import { cookies } from "next/headers";

export async function getCookieAction(name: string) {
  const cookieStore = cookies();

  return cookieStore.get(name)?.value;
}
