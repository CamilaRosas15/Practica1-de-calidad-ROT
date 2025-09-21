"use server";

import { cookies } from "next/headers";

export async function setCookieAction(name: string, value: string) {
  const cookieStore = cookies();

  cookieStore.set(name, value);
}
