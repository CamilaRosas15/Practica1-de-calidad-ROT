"use client";

import * as React from "react";
import { HeroUIProvider } from "@heroui/react";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";

export interface HeroUIProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

export function HeroUIProviders({ children, themeProps }: HeroUIProvidersProps) {
  const router = useRouter();

  return (
    <HeroUIProvider locale="en-GB" navigate={router.push}>
      <NextThemesProvider {...themeProps}>{children}</NextThemesProvider>
    </HeroUIProvider>
  );
}
