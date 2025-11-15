"use client";

import { SessionProvider } from "next-auth/react";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider
      refetchInterval={0} // Disable automatic refetching
      refetchOnWindowFocus={false} // Don't refetch when window regains focus
      basePath="/api/auth" // Explicitly set the base path
    >
      {children}
    </SessionProvider>
  );
}
