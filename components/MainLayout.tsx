"use client";

import { usePathname } from "next/navigation";
import mixpanel from "mixpanel-browser";
import { Link } from "@heroui/react";

import { Navbar } from "@/components/navbar";

const HIDE_LOGO_CREDIT_PATHS = [
  "/sign-in",
  "/sign-up",
  "/companies",
  "/question",
  "/terms",
  "/privacy",
  "/contact",
  "/settings",
  // Add any paths where you don't want the logo credit
];

export function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const shouldShowLogoCredit = !(
    pathname === "/" || // Exact match for home page
    HIDE_LOGO_CREDIT_PATHS.some((path) => pathname.startsWith(path))
  );

  const handleGithubClick = () => {
    mixpanel.track("Github Link Clicked");
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
      <Navbar />
      <main className="container mx-auto w-full max-w-7xl flex-grow px-4 pt-8 sm:px-6 sm:pt-16">{children}</main>
      {shouldShowLogoCredit && (
        <div className="container mx-auto w-full max-w-7xl px-6 py-4">
          <div className="text-end">
            <a className="text-xs text-default-400" href="https://logo.dev" rel="noreferrer" target="_blank">
              Logos provided by Logo.dev
            </a>
          </div>
        </div>
      )}

      {/* Footer section */}
      <footer className="container mx-auto w-full max-w-7xl px-6 py-4">
        <div className="text-center">
          <Link
            isExternal
            className="flex items-center justify-center text-sm text-default-500 hover:text-default-800"
            href="https://github.com/didtheyghostme/didtheyghostme"
            onPress={handleGithubClick}
          >
            {/* GitHub logo SVG */}
            <svg className="mr-1 h-4 w-4" fill="currentColor" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
              <path
                d={
                  "M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.54 5.47 7.59.4.07.55-.17.55-.38" +
                  " 0-.19-.01-.73-.01-1.43-2.24.49-2.71-1.08-2.71-1.08-.36-.91-.88-1.15" +
                  " -.88-1.15-.72-.49.05-.48.05-.48.8.06 1.22.82 1.22.82.71 1.22 1.86.87" +
                  " 2.31.67.07-.51.28-.87.51-1.07-1.78-.2-3.65-.89-3.65-3.95 0-.87.31" +
                  "-1.58.82-2.14-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82A7.56 7.56 0" +
                  " 018 2.5c.68 0 1.36.09 2 .26 1.53-1.03 2.2-.82 2.2-.82.44 1.1.16 1.92" +
                  " .08 2.12.51.56.82 1.27.82 2.14 0 3.06-1.87 3.75-3.65 3.95.29.25.55.74" +
                  " .55 1.49 0 1.08-.01 1.95-.01 2.21 0 .21.15.46.55.38C13.71 14.54 16" +
                  " 11.54 16 8c0-4.42-3.58-8-8-8z"
                }
              />
            </svg>
            <span className="underline">GitHub repository </span>
          </Link>
        </div>
      </footer>
    </div>
  );
}
