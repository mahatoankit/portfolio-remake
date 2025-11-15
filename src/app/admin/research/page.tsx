"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../useAuth";
import { Research } from "@/types/research";
import Link from "next/link";
import { BookOpen, Plus, Pencil, Trash2, ExternalLink, Award } from "lucide-react";

export default function AdminResearch() {
  const { session, loading } = useAuth();
  const router = useRouter();
  const [research, setResearch] = useState<Research[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !session) {
      router.push("/admin/login");
    }
  }, [session, loading, router]);

  useEffect(() => {
    if (session) {
      fetchResearch();
    }
  }, [session]);

  const fetchResearch = async () => {
    try {
      const res = await fetch("/api/research");
      if (res.ok) {
        const data = await res.json();
        setResearch(data);
      }
    } catch (error) {
      console.error("Error fetching research:", error);
    } finally {
      setFetching(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this research publication?")) return;

    try {
      const res = await fetch(`/api/research/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setResearch(research.filter((r) => r.id !== id));
      } else {
        alert("Failed to delete research");
      }
    } catch (error) {
      console.error("Error deleting research:", error);
      alert("Error deleting research");
    }
  };

  // Group research by year
  const groupedResearch: { [year: string]: Research[] } = {};
  research.forEach((item) => {
    if (!groupedResearch[item.year]) {
      groupedResearch[item.year] = [];
    }
    groupedResearch[item.year].push(item);
  });

  const years = Object.keys(groupedResearch).sort((a, b) => parseInt(b) - parseInt(a));

  if (loading || fetching) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-6xl font-semibold text-white tracking-tight mb-2">
              Publications
            </h1>
            <p className="text-neutral-400">
              Manage your scientific publications and research papers
            </p>
          </div>
          <Link
            href="/admin/research/edit/new"
            className="flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:bg-neutral-200"
          >
            <Plus className="h-4 w-4" />
            Add Publication
          </Link>
        </div>

        {research.length === 0 ? (
          <div className="rounded-3xl border border-neutral-800/50 bg-neutral-900/30 backdrop-blur-xl p-16 text-center">
            <BookOpen className="mx-auto h-16 w-16 text-neutral-600 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              No publications yet
            </h3>
            <p className="text-neutral-400 mb-6">
              Start by adding your first publication
            </p>
            <Link
              href="/admin/research/edit/new"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:bg-neutral-200"
            >
              <Plus className="h-4 w-4" />
              Add First Publication
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {years.map((year) => (
              <div key={year}>
                <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">
                  {year}
                </h2>
                <div className="space-y-4">
                  {groupedResearch[year].map((item) => (
                    <div
                      key={item.id}
                      className="group rounded-3xl border border-neutral-800/50 bg-neutral-900/30 backdrop-blur-xl p-8 transition hover:bg-neutral-900/50"
                    >
                      <div className="flex items-start justify-between gap-6">
                        <div className="flex-1">
                          <div className="flex items-start gap-4 mb-4">
                            {item.thumbnail && (
                              <div className="h-20 w-20 rounded-xl overflow-hidden bg-neutral-800 flex-shrink-0">
                                <img
                                  src={item.thumbnail}
                                  alt={item.title}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                            )}
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-xl font-semibold text-white">
                                  {item.title}
                                </h3>
                                {item.featured && (
                                  <Award className="h-5 w-5 text-yellow-500" />
                                )}
                              </div>
                              <p className="text-neutral-400 text-sm mb-2">
                                {item.authors.join(", ")}
                              </p>
                              <p className="text-neutral-500 text-sm mb-3">
                                {item.journal} • {item.date}
                              </p>
                              <p className="text-neutral-300 text-sm line-clamp-2 mb-3">
                                {item.abstract}
                              </p>
                              <div className="flex items-center gap-4 text-xs text-neutral-400">
                                {item.citations > 0 && (
                                  <span>{item.citations} citations</span>
                                )}
                                {item.tags.length > 0 && (
                                  <div className="flex gap-2">
                                    {item.tags.slice(0, 3).map((tag, idx) => (
                                      <span
                                        key={idx}
                                        className="px-2 py-1 rounded-full bg-neutral-800/50 text-neutral-300"
                                      >
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          {item.externalUrl && (
                            <a
                              href={item.externalUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="rounded-full bg-white/5 p-3 text-neutral-400 transition hover:bg-white/10 hover:text-white"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          )}
                          <Link
                            href={`/admin/research/edit/${item.id}`}
                            className="rounded-full bg-white/5 p-3 text-neutral-400 transition hover:bg-white/10 hover:text-white"
                          >
                            <Pencil className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="rounded-full bg-white/5 p-3 text-neutral-400 transition hover:bg-red-500/20 hover:text-red-400"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
