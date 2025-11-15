"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../useAuth";
import { Blog } from "@/types/blog";
import Link from "next/link";
import { FileText, Plus, Pencil, Trash2, Eye, EyeOff, Award, Clock } from "lucide-react";

export default function AdminBlog() {
  const { session, loading } = useAuth();
  const router = useRouter();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !session) {
      router.push("/admin/login");
    }
  }, [session, loading, router]);

  useEffect(() => {
    if (session) {
      fetchBlogs();
    }
  }, [session]);

  const fetchBlogs = async () => {
    try {
      const res = await fetch("/api/blog");
      if (res.ok) {
        const data = await res.json();
        setBlogs(data);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setFetching(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;

    try {
      const res = await fetch(`/api/blog/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setBlogs(blogs.filter((b) => b.id !== id));
      } else {
        alert("Failed to delete blog");
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
      alert("Error deleting blog");
    }
  };

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Separate published and draft blogs
  const publishedBlogs = blogs.filter((b) => b.published);
  const draftBlogs = blogs.filter((b) => !b.published);

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
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-6xl font-semibold text-white tracking-tight mb-2">
              Blog Posts
            </h1>
            <p className="text-neutral-400">
              Write and manage your blog articles
            </p>
          </div>
          <Link
            href="/admin/blog/edit/new"
            className="flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:bg-neutral-200"
          >
            <Plus className="h-4 w-4" />
            New Post
          </Link>
        </div>

        {/* Blogs List */}
        {blogs.length === 0 ? (
          <div className="rounded-3xl border border-neutral-800/50 bg-neutral-900/30 backdrop-blur-xl p-16 text-center">
            <FileText className="mx-auto h-16 w-16 text-neutral-600 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              No blog posts yet
            </h3>
            <p className="text-neutral-400 mb-6">
              Start by creating your first blog post
            </p>
            <Link
              href="/admin/blog/edit/new"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:bg-neutral-200"
            >
              <Plus className="h-4 w-4" />
              Create First Post
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Published Blogs */}
            {publishedBlogs.length > 0 && (
              <div>
                <h2 className="text-3xl font-bold text-white mb-4 tracking-tight flex items-center gap-2">
                  <Eye className="h-6 w-6" />
                  Published ({publishedBlogs.length})
                </h2>
                <div className="space-y-4">
                  {publishedBlogs.map((blog) => (
                    <div
                      key={blog.id}
                      className="group rounded-3xl border border-neutral-800/50 bg-neutral-900/30 backdrop-blur-xl p-8 transition hover:bg-neutral-900/50"
                    >
                      <div className="flex items-start justify-between gap-6">
                        <div className="flex-1">
                          <div className="flex items-start gap-4 mb-4">
                            {blog.thumbnail && (
                              <div className="h-24 w-32 rounded-xl overflow-hidden bg-neutral-800 flex-shrink-0">
                                <img
                                  src={blog.thumbnail}
                                  alt={blog.title}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                            )}
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-xl font-semibold text-white">
                                  {blog.title}
                                </h3>
                                {blog.featured && (
                                  <Award className="h-5 w-5 text-yellow-500" />
                                )}
                              </div>
                              <p className="text-neutral-300 text-sm line-clamp-2 mb-3">
                                {blog.excerpt}
                              </p>
                              <div className="flex items-center gap-4 text-xs text-neutral-400">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {blog.readTime} min read
                                </span>
                                <span>{formatDate(blog.publishedAt || blog.createdAt)}</span>
                                <span>{blog.views} views</span>
                                {blog.tags.length > 0 && (
                                  <div className="flex gap-2">
                                    {blog.tags.slice(0, 3).map((tag, idx) => (
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

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <Link
                            href={`/blog/${blog.slug}`}
                            target="_blank"
                            className="rounded-full bg-white/5 p-3 text-neutral-400 transition hover:bg-white/10 hover:text-white"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          <Link
                            href={`/admin/blog/edit/${blog.id}`}
                            className="rounded-full bg-white/5 p-3 text-neutral-400 transition hover:bg-white/10 hover:text-white"
                          >
                            <Pencil className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(blog.id)}
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
            )}

            {/* Draft Blogs */}
            {draftBlogs.length > 0 && (
              <div>
                <h2 className="text-3xl font-bold text-white mb-4 tracking-tight flex items-center gap-2">
                  <EyeOff className="h-6 w-6" />
                  Drafts ({draftBlogs.length})
                </h2>
                <div className="space-y-4">
                  {draftBlogs.map((blog) => (
                    <div
                      key={blog.id}
                      className="group rounded-3xl border border-neutral-800/50 bg-neutral-900/30 backdrop-blur-xl p-8 transition hover:bg-neutral-900/50 opacity-75"
                    >
                      <div className="flex items-start justify-between gap-6">
                        <div className="flex-1">
                          <div className="flex items-start gap-4 mb-4">
                            {blog.thumbnail && (
                              <div className="h-24 w-32 rounded-xl overflow-hidden bg-neutral-800 flex-shrink-0">
                                <img
                                  src={blog.thumbnail}
                                  alt={blog.title}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                            )}
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-xl font-semibold text-white">
                                  {blog.title}
                                </h3>
                                <span className="text-xs px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                                  Draft
                                </span>
                              </div>
                              <p className="text-neutral-300 text-sm line-clamp-2 mb-3">
                                {blog.excerpt}
                              </p>
                              <div className="flex items-center gap-4 text-xs text-neutral-400">
                                <span>Last edited {formatDate(blog.updatedAt)}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <Link
                            href={`/admin/blog/edit/${blog.id}`}
                            className="rounded-full bg-white/5 p-3 text-neutral-400 transition hover:bg-white/10 hover:text-white"
                          >
                            <Pencil className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(blog.id)}
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
            )}
          </div>
        )}
      </div>
    </div>
  );
}
