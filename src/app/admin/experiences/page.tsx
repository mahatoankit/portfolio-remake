"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../useAuth";
import { Experience } from "@/types/experience";
import { Pencil, Trash2, Plus, Briefcase } from "lucide-react";

export default function AdminExperiences() {
  const { session, loading } = useAuth();
  const router = useRouter();
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    if (!loading && !session) {
      router.push("/admin/login");
    }
  }, [session, loading, router]);

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const res = await fetch("/api/experiences");
      const data = await res.json();
      setExperiences(data);
    } catch (error) {
      console.error("Error fetching experiences:", error);
    } finally {
      setFetchLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this experience?")) return;

    try {
      const res = await fetch(`/api/experiences/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchExperiences();
      } else {
        alert("Failed to delete experience");
      }
    } catch (error) {
      console.error("Error deleting experience:", error);
      alert("Error deleting experience");
    }
  };

  if (loading || fetchLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-950">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  // Group experiences by year
  const groupedExperiences = experiences.reduce((acc, exp) => {
    if (!acc[exp.year]) {
      acc[exp.year] = [];
    }
    acc[exp.year].push(exp);
    return acc;
  }, {} as Record<string, Experience[]>);

  return (
    <div className="min-h-screen bg-neutral-950 p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Manage Experiences
            </h1>
            <p className="text-neutral-400">
              Add, edit, or delete your professional experiences
            </p>
          </div>
          <div className="flex gap-4">
            <Link
              href="/admin"
              className="rounded-lg bg-neutral-800 px-6 py-3 text-white transition hover:bg-neutral-700"
            >
              Back to Admin
            </Link>
            <Link
              href="/admin/experiences/edit/new"
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-700"
            >
              <Plus className="h-5 w-5" />
              Add Experience
            </Link>
          </div>
        </div>

        {/* Experiences List */}
        {Object.keys(groupedExperiences).length === 0 ? (
          <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-12 text-center">
            <Briefcase className="mx-auto h-16 w-16 text-neutral-600 mb-4" />
            <p className="text-xl text-neutral-400 mb-4">
              No experiences yet
            </p>
            <Link
              href="/admin/experiences/edit/new"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-700"
            >
              <Plus className="h-5 w-5" />
              Add Your First Experience
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.keys(groupedExperiences)
              .sort()
              .reverse()
              .map((year) => (
                <div key={year}>
                  <h2 className="text-2xl font-bold text-neutral-400 mb-4">
                    {year}
                  </h2>
                  <div className="grid gap-4">
                    {groupedExperiences[year].map((experience) => (
                      <div
                        key={experience.id}
                        className="group rounded-lg border border-neutral-800 bg-neutral-900 p-6 transition hover:border-neutral-700 hover:bg-neutral-800"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex gap-4 flex-1">
                            {experience.logo ? (
                              <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg bg-white shrink-0">
                                <img
                                  src={experience.logo}
                                  alt={experience.company}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 shrink-0">
                                <Briefcase className="h-6 w-6 text-white" />
                              </div>
                            )}
                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-white mb-1">
                                {experience.company}
                              </h3>
                              <p className="text-neutral-400 mb-2">
                                {experience.role}
                              </p>
                              <p className="text-sm text-neutral-500 mb-3">
                                {experience.duration}
                              </p>
                              <p className="text-sm text-neutral-400 line-clamp-2">
                                {experience.description}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <Link
                              href={`/admin/experiences/edit/${experience.id}`}
                              className="rounded-lg bg-blue-600 p-2 text-white transition hover:bg-blue-700"
                            >
                              <Pencil className="h-5 w-5" />
                            </Link>
                            <button
                              onClick={() => handleDelete(experience.id)}
                              className="rounded-lg bg-red-600 p-2 text-white transition hover:bg-red-700"
                            >
                              <Trash2 className="h-5 w-5" />
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
