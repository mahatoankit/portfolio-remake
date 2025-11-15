"use client";

import { useState, useEffect } from "react";
import { Blog } from "@/types/blog";
import Link from "next/link";
import { Calendar, Clock, Eye, ArrowRight, Sparkles, Search, X } from "lucide-react";

export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
      const res = await fetch(`${baseUrl}/api/blog`);
      if (res.ok) {
        const data = await res.json();
        // Only show published blogs
        setBlogs(data.filter((blog: Blog) => blog.published));
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Define fixed categories for filtering
  const categories = [
    { name: "All", slug: null },
    { name: "AI & ML", slug: "ai" },
    { name: "AgriTech", slug: "agritech" },
    { name: "FinTech", slug: "fintech" },
    { name: "Web Development", slug: "web" },
    { name: "DevOps", slug: "devops" },
    { name: "Cybersecurity", slug: "security" },
  ];

  // Filter blogs by category and search query
  const filteredBlogs = blogs.filter((blog) => {
    // Category matching - check if any blog tag matches the category
    const matchesCategory = selectedTag === null || blog.tags.some(tag => 
      tag.toLowerCase().includes(selectedTag.toLowerCase()) ||
      selectedTag.toLowerCase().includes(tag.toLowerCase())
    );
    
    const matchesSearch = searchQuery
      ? blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      : true;
    return matchesCategory && matchesSearch;
  });

  // Separate featured and regular blogs
  const featuredBlogs = filteredBlogs.filter((blog) => blog.featured);
  const regularBlogs = filteredBlogs.filter((blog) => !blog.featured);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-32 pb-20 px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="text-7xl font-bold text-white mb-6 tracking-tight">
            Blog
          </h1>
          <p className="text-xl text-neutral-400 max-w-2xl mx-auto mb-8">
            Thoughts, ideas, and stories about technology, design, and development
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search blog posts by title, content, or tags..."
                className="w-full rounded-full bg-neutral-900/50 backdrop-blur-xl border border-neutral-800 pl-12 pr-12 py-4 text-white placeholder-neutral-500 focus:border-neutral-600 focus:outline-none transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-neutral-800 transition"
                >
                  <X className="h-4 w-4 text-neutral-400" />
                </button>
              )}
            </div>
            {searchQuery && (
              <p className="mt-3 text-sm text-neutral-500">
                Found {filteredBlogs.length} {filteredBlogs.length === 1 ? 'post' : 'posts'} matching "{searchQuery}"
              </p>
            )}
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-12 flex flex-wrap gap-3 justify-center">
          {categories.map((category) => (
            <button
              key={category.name}
              onClick={() => setSelectedTag(category.slug)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition ${
                selectedTag === category.slug
                  ? "bg-white text-black"
                  : "bg-neutral-800/50 text-neutral-400 hover:bg-neutral-800"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {filteredBlogs.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-neutral-400 text-lg">
              {selectedTag
                ? `No posts found with tag "${selectedTag}"`
                : "No blog posts yet. Check back soon!"}
            </p>
          </div>
        ) : (
          <div className="space-y-16">
            {/* Featured Posts */}
            {featuredBlogs.length > 0 && (
              <div>
                <h2 className="text-3xl font-bold text-white mb-8 tracking-tight flex items-center gap-2">
                  <Sparkles className="h-6 w-6" />
                  Featured
                </h2>
                <div className="grid grid-cols-1 gap-8">
                  {featuredBlogs.map((blog) => (
                    <Link
                      key={blog.id}
                      href={`/blog/${blog.slug}`}
                      className="group"
                    >
                      <div className="rounded-3xl border border-neutral-800/50 bg-neutral-900/30 backdrop-blur-xl overflow-hidden transition-all hover:bg-neutral-900/50 hover:border-neutral-700">
                        <div className="grid md:grid-cols-2 gap-0">
                          {/* Image */}
                          {blog.thumbnail && (
                            <div className="relative h-64 md:h-full bg-neutral-800">
                              <img
                                src={blog.thumbnail}
                                alt={blog.title}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-yellow-500/90 text-black text-xs font-semibold">
                                Featured
                              </div>
                            </div>
                          )}

                          {/* Content */}
                          <div className="p-10">
                            <h3 className="text-3xl font-bold text-white mb-4 tracking-tight group-hover:text-neutral-300 transition">
                              {blog.title}
                            </h3>
                            <p className="text-neutral-300 mb-6 line-clamp-3">
                              {blog.excerpt}
                            </p>

                            <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-400 mb-6">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {formatDate(blog.publishedAt || blog.createdAt)}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {blog.readTime} min read
                              </span>
                              <span className="flex items-center gap-1">
                                <Eye className="h-4 w-4" />
                                {blog.views} views
                              </span>
                            </div>

                            {blog.tags.length > 0 && (
                              <div className="flex flex-wrap gap-2 mb-6">
                                {blog.tags.slice(0, 3).map((tag, idx) => (
                                  <span
                                    key={idx}
                                    className="px-3 py-1 rounded-full bg-neutral-800/50 text-neutral-400 text-xs"
                                  >
                                    {tag}
                                  </span>
                                ))}
                                {blog.tags.length > 3 && (
                                  <span className="px-3 py-1 rounded-full bg-neutral-800/50 text-neutral-500 text-xs">
                                    +{blog.tags.length - 3}
                                  </span>
                                )}
                              </div>
                            )}

                            <div className="flex items-center gap-2 text-white group-hover:gap-3 transition-all">
                              Read More
                              <ArrowRight className="h-4 w-4" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Regular Posts */}
            {regularBlogs.length > 0 && (
              <div>
                {featuredBlogs.length > 0 && (
                  <h2 className="text-3xl font-bold text-white mb-8 tracking-tight">
                    All Posts
                  </h2>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {regularBlogs.map((blog) => (
                    <Link
                      key={blog.id}
                      href={`/blog/${blog.slug}`}
                      className="group"
                    >
                      <div className="rounded-3xl border border-neutral-800/50 bg-neutral-900/30 backdrop-blur-xl overflow-hidden transition-all hover:bg-neutral-900/50 hover:border-neutral-700 h-full flex flex-col">
                        {/* Image */}
                        {blog.thumbnail && (
                          <div className="relative h-48 bg-neutral-800">
                            <img
                              src={blog.thumbnail}
                              alt={blog.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}

                        {/* Content */}
                        <div className="p-8 flex-1 flex flex-col">
                          <h3 className="text-2xl font-bold text-white mb-3 tracking-tight group-hover:text-neutral-300 transition">
                            {blog.title}
                          </h3>
                          <p className="text-neutral-300 mb-4 line-clamp-2 flex-1">
                            {blog.excerpt}
                          </p>

                          <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-400 mb-4">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDate(blog.publishedAt || blog.createdAt)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {blog.readTime} min
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {blog.views}
                            </span>
                          </div>

                          {blog.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                              {blog.tags.slice(0, 3).map((tag, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-1 rounded-full bg-neutral-800/50 text-neutral-400 text-xs"
                                >
                                  {tag}
                                </span>
                              ))}
                              {blog.tags.length > 3 && (
                                <span className="px-2 py-1 rounded-full bg-neutral-800/50 text-neutral-500 text-xs">
                                  +{blog.tags.length - 3}
                                </span>
                              )}
                            </div>
                          )}

                          <div className="flex items-center gap-2 text-white group-hover:gap-3 transition-all text-sm">
                            Read More
                            <ArrowRight className="h-4 w-4" />
                          </div>
                        </div>
                      </div>
                    </Link>
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
