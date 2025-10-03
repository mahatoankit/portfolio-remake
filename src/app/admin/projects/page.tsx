"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { Project } from "@/types/project";
import { useAuth } from "../useAuth";

export default function AdminProjectsPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/admin/login");
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      setProjects(data);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setProjects(projects.filter((p) => p.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete project:", error);
    }
  };

  const toggleFeatured = async (project: Project) => {
    try {
      const res = await fetch(`/api/projects/${project.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: !project.featured }),
      });
      if (res.ok) {
        fetchProjects();
      }
    } catch (error) {
      console.error("Failed to update project:", error);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-white text-xl font-geist">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-neutral-950 px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-extrabold text-white mb-2 font-geist">
              Admin Panel - Projects
            </h1>
            <p className="text-neutral-400 font-geist">
              Manage your portfolio projects
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleLogout}
              className="px-6 py-3 rounded-full font-semibold border border-neutral-600 text-neutral-300 hover:bg-neutral-800 transition font-geist"
            >
              Logout
            </button>
            <button
              onClick={() => router.push("/admin/projects/edit/new")}
              className="bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-neutral-100 transition font-geist"
            >
              + New Project
            </button>
          </div>
        </div>

        {/* Projects Table */}
        <div className="bg-neutral-900/80 rounded-2xl border border-neutral-800 overflow-hidden">
          <table className="w-full">
            <thead className="bg-neutral-800/50 border-b border-neutral-700">
              <tr>
                <th className="text-left px-6 py-4 text-neutral-300 font-semibold font-geist">
                  Thumbnail
                </th>
                <th className="text-left px-6 py-4 text-neutral-300 font-semibold font-geist">
                  Title
                </th>
                <th className="text-left px-6 py-4 text-neutral-300 font-semibold font-geist">
                  Category
                </th>
                <th className="text-left px-6 py-4 text-neutral-300 font-semibold font-geist">
                  Featured
                </th>
                <th className="text-left px-6 py-4 text-neutral-300 font-semibold font-geist">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr
                  key={project.id}
                  className="border-b border-neutral-800 hover:bg-neutral-800/30 transition"
                >
                  <td className="px-6 py-4">
                    <img
                      src={project.thumbnail}
                      alt={project.title}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-white font-semibold font-geist">
                      {project.title}
                    </div>
                    <div className="text-neutral-400 text-sm font-geist">
                      {project.slug}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-neutral-300 font-geist">
                      {project.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleFeatured(project)}
                      className={`px-3 py-1 rounded-full text-sm font-semibold transition font-geist ${
                        project.featured
                          ? "bg-white text-black"
                          : "bg-neutral-700 text-neutral-300 hover:bg-neutral-600"
                      }`}
                    >
                      {project.featured ? "Featured" : "Not Featured"}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          router.push(`/admin/projects/edit/${project.id}`)
                        }
                        className="text-white hover:text-neutral-300 transition font-geist font-semibold"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(project.id)}
                        className="text-red-400 hover:text-red-300 transition font-geist font-semibold"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {projects.length === 0 && (
          <div className="text-center py-16 text-neutral-400 font-geist">
            No projects yet. Create your first project!
          </div>
        )}
      </div>
    </div>
  );
}
