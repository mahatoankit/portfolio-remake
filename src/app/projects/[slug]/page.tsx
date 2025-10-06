"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Project } from "@/types/project";

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProject();
  }, [params.slug]);

  const fetchProject = async () => {
    try {
      const res = await fetch("/api/projects");
      const projects = await res.json();
      const foundProject = projects.find((p: Project) => p.slug === params.slug);
      
      if (foundProject) {
        setProject(foundProject);
      } else {
        router.push("/projects");
      }
    } catch (error) {
      console.error("Failed to fetch project:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-white text-xl font-geist animate-pulse">
          Loading project...
        </div>
      </div>
    );
  }

  if (!project) {
    return null;
  }

  return (
    <div className="min-h-screen bg-neutral-950">
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[500px] w-full overflow-hidden">
        {project.thumbnail && (
          <>
            {/* Background Image with Blur */}
            <Image
              src={project.thumbnail}
              alt={project.title}
              fill
              className="object-cover scale-110 blur-[3px] opacity-80"
              priority
            />
            {/* Darker gradient overlay for better text contrast */}
            <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/70 via-neutral-950/80 to-neutral-950" />
          </>
        )}
        {!project.thumbnail && (
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-900 to-neutral-950" />
        )}
        
        {/* Back Button */}
        <button
          onClick={() => router.push("/projects")}
          className="absolute top-8 left-8 z-10 px-6 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition font-geist font-semibold"
        >
          ← Back to Projects
        </button>

        {/* Title & Meta */}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 z-10">
          <div className="max-w-6xl mx-auto">
            {project.featured && (
              <span className="inline-block px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-semibold mb-4 font-geist">
                ⭐ Featured Project
              </span>
            )}
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-4 font-geist drop-shadow-2xl">
              {project.title}
            </h1>
            <p className="text-xl md:text-2xl text-neutral-200 max-w-3xl font-geist drop-shadow-lg">
              {project.description}
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto px-8 py-16">
        {/* Meta Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {/* Category */}
          <div className="bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 rounded-2xl p-6">
            <div className="text-neutral-400 text-sm font-semibold mb-2 font-geist">
              CATEGORY
            </div>
            <div className="text-white text-xl font-bold capitalize font-geist">
              {project.category}
            </div>
          </div>

          {/* GitHub Link */}
          {project.githubLink && (
            <a
              href={project.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 rounded-2xl p-6 hover:bg-neutral-800/50 transition group"
            >
              <div className="text-neutral-400 text-sm font-semibold mb-2 font-geist">
                SOURCE CODE
              </div>
              <div className="text-white text-xl font-bold font-geist group-hover:text-blue-400 transition flex items-center gap-2">
                GitHub →
              </div>
            </a>
          )}

          {/* Live URL */}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 rounded-2xl p-6 hover:bg-neutral-800/50 transition group"
            >
              <div className="text-neutral-400 text-sm font-semibold mb-2 font-geist">
                LIVE DEMO
              </div>
              <div className="text-white text-xl font-bold font-geist group-hover:text-green-400 transition flex items-center gap-2">
                Visit Site →
              </div>
            </a>
          )}
        </div>

        {/* Technologies */}
        {project.technologies && project.technologies.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-6 font-geist">
              Technologies Used
            </h2>
            <div className="flex flex-wrap gap-3">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-5 py-2.5 rounded-full bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 text-white font-semibold font-geist hover:bg-neutral-800/50 transition"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Markdown Content */}
        {project.content && (
          <div className="prose prose-invert prose-lg max-w-none">
            <div className="bg-neutral-900/30 backdrop-blur-sm border border-neutral-800 rounded-2xl p-8 md:p-12">
              <ReactMarkdown
                components={{
                  h1: ({ node, ...props }) => (
                    <h1
                      className="text-4xl font-extrabold text-white mb-6 mt-8 first:mt-0 font-geist"
                      {...props}
                    />
                  ),
                  h2: ({ node, ...props }) => (
                    <h2
                      className="text-3xl font-bold text-white mb-4 mt-8 font-geist"
                      {...props}
                    />
                  ),
                  h3: ({ node, ...props }) => (
                    <h3
                      className="text-2xl font-bold text-white mb-3 mt-6 font-geist"
                      {...props}
                    />
                  ),
                  p: ({ node, ...props }) => (
                    <p
                      className="text-neutral-300 text-lg leading-relaxed mb-4 font-geist"
                      {...props}
                    />
                  ),
                  ul: ({ node, ...props }) => (
                    <ul
                      className="list-disc list-inside text-neutral-300 mb-4 space-y-2 font-geist"
                      {...props}
                    />
                  ),
                  ol: ({ node, ...props }) => (
                    <ol
                      className="list-decimal list-inside text-neutral-300 mb-4 space-y-2 font-geist"
                      {...props}
                    />
                  ),
                  li: ({ node, ...props }) => (
                    <li className="text-neutral-300 font-geist" {...props} />
                  ),
                  a: ({ node, ...props }) => (
                    <a
                      className="text-blue-400 hover:text-blue-300 underline font-geist"
                      target="_blank"
                      rel="noopener noreferrer"
                      {...props}
                    />
                  ),
                  blockquote: ({ node, ...props }) => (
                    <blockquote
                      className="border-l-4 border-neutral-600 pl-4 italic text-neutral-400 my-4 font-geist"
                      {...props}
                    />
                  ),
                  code: ({ node, inline, className, children, ...props }: any) => {
                    const match = /language-(\w+)/.exec(className || "");
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={vscDarkPlus}
                        language={match[1]}
                        PreTag="div"
                        className="rounded-lg my-4 font-mono"
                        {...props}
                      >
                        {String(children).replace(/\n$/, "")}
                      </SyntaxHighlighter>
                    ) : (
                      <code
                        className="bg-neutral-800 text-blue-300 px-2 py-1 rounded font-mono text-sm"
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  },
                  img: ({ node, ...props }) => (
                    <span className="block my-6 rounded-lg overflow-hidden border border-neutral-800">
                      <img className="w-full" {...props} />
                    </span>
                  ),
                }}
              >
                {project.content}
              </ReactMarkdown>
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <button
            onClick={() => router.push("/projects")}
            className="px-8 py-4 rounded-full bg-white text-black font-bold text-lg hover:bg-neutral-200 transition font-geist"
          >
            View More Projects
          </button>
        </div>
      </div>
    </div>
  );
}
