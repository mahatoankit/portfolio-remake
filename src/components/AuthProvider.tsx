"use client";

import { SessionProvider } from "next-auth/react";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider
      refetchInterval={5 * 60} // Refetch session every 5 minutes instead of constantly
      refetchOnWindowFocus={false} // Don't refetch when window regains focus
      basePath="/api/auth" // Explicitly set the base path
    >
      {children}
    </SessionProvider>
  );
}
