"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function useAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const loading = status === "loading";
  const isAuthenticated = status === "authenticated";

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router]);

  return {
    isAuthenticated,
    loading,
    session,
  };
}
