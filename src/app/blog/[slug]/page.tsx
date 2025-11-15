"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Blog } from "@/types/blog";
import { Calendar, Clock, Eye, ArrowLeft, Share2 } from "lucide-react";


export default function BlogPost() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchBlog();
    }
  }, [slug]);

  const fetchBlog = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
      const res = await fetch(`${baseUrl}/api/blog`);
      if (res.ok) {
        const data = await res.json();
        const foundBlog = data.find((b: Blog) => b.slug === slug && b.published);
        
        if (foundBlog) {
          setBlog(foundBlog);
          // Increment view count
          incrementViews(foundBlog.id);
        }
      }
    } catch (error) {
      console.error("Error fetching blog:", error);
    } finally {
      setLoading(false);
    }
  };

  const incrementViews = async (id: number) => {
    try {
      await fetch(`/api/blog/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ views: (blog?.views || 0) + 1 }),
      });
    } catch (error) {
      console.error("Error incrementing views:", error);
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

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog?.title,
          text: blog?.excerpt,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Post Not Found</h1>
          <p className="text-neutral-400 mb-8">
            The blog post you're looking for doesn't exist.
          </p>
          <button
            onClick={() => router.push("/blog")}
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:bg-neutral-200"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-32 pb-20">
      <div className="mx-auto max-w-4xl px-8">
        {/* Back Button */}
        <button
          onClick={() => router.push("/blog")}
          className="mb-8 inline-flex items-center gap-2 text-neutral-400 hover:text-white transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Blog
        </button>

        {/* Header */}
        <article>
          <header className="mb-12">
            <h1 className="text-6xl font-bold text-white mb-6 tracking-tight">
              {blog.title}
            </h1>

            <p className="text-xl text-neutral-300 mb-8">
              {blog.excerpt}
            </p>

            <div className="flex flex-wrap items-center gap-6 text-sm text-neutral-400 mb-6">
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {formatDate(blog.publishedAt || blog.createdAt)}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {blog.readTime} min read
              </span>
              <span className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                {blog.views} views
              </span>
              <button
                onClick={handleShare}
                className="flex items-center gap-2 hover:text-white transition"
              >
                <Share2 className="h-4 w-4" />
                Share
              </button>
            </div>

            {blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {blog.tags.slice(0, 5).map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-full bg-neutral-800/50 text-neutral-400 text-sm"
                  >
                    {tag}
                  </span>
                ))}
                {blog.tags.length > 5 && (
                  <span className="px-3 py-1 rounded-full bg-neutral-800/50 text-neutral-500 text-sm">
                    +{blog.tags.length - 5} more
                  </span>
                )}
              </div>
            )}
          </header>

          {/* Featured Image */}
          {blog.thumbnail && (
            <div className="mb-12 rounded-3xl overflow-hidden bg-neutral-800">
              <img
                src={blog.thumbnail}
                alt={blog.title}
                className="w-full h-auto"
              />
            </div>
          )}

          {/* Content */}
          <div 
            className="prose prose-invert prose-lg max-w-none blog-content"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </article>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-neutral-800">
          <button
            onClick={() => router.push("/blog")}
            className="inline-flex items-center gap-2 rounded-full bg-neutral-800/50 px-6 py-3 text-sm font-medium text-white transition hover:bg-neutral-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to All Posts
          </button>
        </div>
      </div>

      {/* Custom CSS for Blog Content */}
      <style jsx global>{`
        .blog-content {
          color: white;
        }

        .blog-content p {
          color: rgb(212, 212, 212);
          margin: 1.5em 0;
          line-height: 1.8;
        }

        .blog-content h1 {
          font-size: 2.5em;
          font-weight: bold;
          margin: 2em 0 0.8em;
          color: white;
        }

        .blog-content h2 {
          font-size: 2em;
          font-weight: bold;
          margin: 1.8em 0 0.8em;
          color: white;
        }

        .blog-content h3 {
          font-size: 1.5em;
          font-weight: bold;
          margin: 1.5em 0 0.8em;
          color: white;
        }

        .blog-content ul, .blog-content ol {
          padding-left: 1.5em;
          margin: 1.5em 0;
          color: rgb(212, 212, 212);
        }

        .blog-content li {
          margin: 0.5em 0;
        }

        .blog-content code {
          background-color: rgba(23, 23, 23, 0.8);
          color: rgb(220, 220, 220);
          padding: 0.2em 0.4em;
          border-radius: 0.25em;
          font-family: monospace;
          font-size: 0.9em;
        }

        .blog-content pre {
          background-color: rgba(23, 23, 23, 0.8);
          color: rgb(220, 220, 220);
          padding: 1.5em;
          border-radius: 0.75em;
          overflow-x: auto;
          margin: 1.5em 0;
        }

        .blog-content pre code {
          background: none;
          padding: 0;
        }

        .blog-content blockquote {
          border-left: 4px solid rgb(115, 115, 115);
          padding-left: 1.5em;
          margin: 1.5em 0;
          color: rgb(163, 163, 163);
          font-style: italic;
        }

        .blog-content a {
          color: rgb(96, 165, 250);
          text-decoration: underline;
        }

        .blog-content a:hover {
          color: rgb(147, 197, 253);
        }

        .blog-content img {
          max-width: 100%;
          height: auto;
          border-radius: 0.75em;
          margin: 2em 0;
        }

        .blog-content hr {
          border: none;
          border-top: 1px solid rgb(64, 64, 64);
          margin: 3em 0;
        }

        .blog-content strong {
          font-weight: 600;
          color: white;
        }

        .blog-content em {
          font-style: italic;
        }
      `}</style>
    </div>
  );
}
