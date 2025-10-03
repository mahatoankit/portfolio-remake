"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "./useAuth";

export default function AdminDashboard() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      // Redirect to projects management after authentication check
      router.push("/admin/projects");
    }
  }, [router, isAuthenticated, loading]);

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>
  );
}
