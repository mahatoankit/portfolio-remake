"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "./useAuth";
import Link from "next/link";
import { FolderKanban, Briefcase, BookOpen, LogOut, FileText, PenLine } from "lucide-react";
import { signOut } from "next-auth/react";

export default function AdminDashboard() {
  const router = useRouter();
  const { session, loading } = useAuth();

  useEffect(() => {
    if (!loading && !session) {
      router.push("/admin/login");
    }
  }, [router, session, loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="mx-auto max-w-7xl px-8 py-16">
        {/* Header */}
        <div className="mb-16 flex items-center justify-between">
          <div>
            <h1 className="text-6xl font-semibold text-white mb-2 tracking-tight">
              Dashboard
            </h1>
            <p className="text-lg text-neutral-500">
              {session.user?.name || session.user?.email}
            </p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-900/50 backdrop-blur-xl px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-neutral-800 hover:border-neutral-700"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>

        {/* Management Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Projects Management */}
          <Link
            href="/admin/projects"
            className="group relative overflow-hidden rounded-3xl border border-neutral-800/50 bg-neutral-900/30 backdrop-blur-xl p-10 transition-all duration-500 hover:bg-neutral-900/50 hover:border-neutral-700"
          >
            <div className="relative z-10">
              <div className="mb-8 inline-flex items-center justify-center rounded-2xl bg-white/5 p-4 backdrop-blur-sm">
                <FolderKanban className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-3xl font-semibold text-white mb-3 tracking-tight">
                Projects
              </h2>
              <p className="text-neutral-400 leading-relaxed mb-6">
                Manage your portfolio projects, update details, and showcase your work.
              </p>
              <div className="text-white/80 text-sm font-medium flex items-center gap-2 group-hover:gap-3 transition-all">
                Manage
                <span className="text-base">→</span>
              </div>
            </div>
            
            {/* Subtle gradient on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </Link>

          {/* Experiences Management */}
          <Link
            href="/admin/experiences"
            className="group relative overflow-hidden rounded-3xl border border-neutral-800/50 bg-neutral-900/30 backdrop-blur-xl p-10 transition-all duration-500 hover:bg-neutral-900/50 hover:border-neutral-700"
          >
            <div className="relative z-10">
              <div className="mb-8 inline-flex items-center justify-center rounded-2xl bg-white/5 p-4 backdrop-blur-sm">
                <Briefcase className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-3xl font-semibold text-white mb-3 tracking-tight">
                Experience
              </h2>
              <p className="text-neutral-400 leading-relaxed mb-6">
                Track your professional journey and career milestones.
              </p>
              <div className="text-white/80 text-sm font-medium flex items-center gap-2 group-hover:gap-3 transition-all">
                Manage
                <span className="text-base">→</span>
              </div>
            </div>
            
            {/* Subtle gradient on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </Link>

          {/* Publications Management */}
          <Link
            href="/admin/research"
            className="group relative overflow-hidden rounded-3xl border border-neutral-800/50 bg-neutral-900/30 backdrop-blur-xl p-10 transition-all duration-500 hover:bg-neutral-900/50 hover:border-neutral-700"
          >
            <div className="relative z-10">
              <div className="mb-8 inline-flex items-center justify-center rounded-2xl bg-white/5 p-4 backdrop-blur-sm">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-3xl font-semibold text-white mb-3 tracking-tight">
                Publications
              </h2>
              <p className="text-neutral-400 leading-relaxed mb-6">
                Manage your scientific publications and research papers.
              </p>
              <div className="text-white/80 text-sm font-medium flex items-center gap-2 group-hover:gap-3 transition-all">
                Manage
                <span className="text-base">→</span>
              </div>
            </div>
            
            {/* Subtle gradient on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </Link>

          {/* Blog Management */}
          <Link
            href="/admin/blog"
            className="group relative overflow-hidden rounded-3xl border border-neutral-800/50 bg-neutral-900/30 backdrop-blur-xl p-10 transition-all duration-500 hover:bg-neutral-900/50 hover:border-neutral-700"
          >
            <div className="relative z-10">
              <div className="mb-8 inline-flex items-center justify-center rounded-2xl bg-white/5 p-4 backdrop-blur-sm">
                <PenLine className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-3xl font-semibold text-white mb-3 tracking-tight">
                Blog
              </h2>
              <p className="text-neutral-400 leading-relaxed mb-6">
                Write and publish blog posts with a seamless markdown editor.
              </p>
              <div className="text-white/80 text-sm font-medium flex items-center gap-2 group-hover:gap-3 transition-all">
                Manage
                <span className="text-base">→</span>
              </div>
            </div>
            
            {/* Subtle gradient on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </Link>
        </div>
      </div>
    </div>
  );
}
