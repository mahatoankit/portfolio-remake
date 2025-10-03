"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { Project } from "@/types/project";
import { useAuth } from "../../../useAuth";
import ImageUpload from "@/components/ImageUpload";
import "easymde/dist/easymde.min.css";

// Dynamically import SimpleMDE to avoid SSR issues
const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const isNew = params.id === "new";

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    thumbnail: "",
    technologies: [] as string[],
    githubLink: "",
    liveUrl: "",
    featured: false,
    category: "web" as Project["category"],
    slug: "",
    content: "", // Markdown content
  });

  const [techInput, setTechInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isNew) {
      fetchProject();
    }
  }, [params.id]);

  const fetchProject = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/projects");
      const projects = await res.json();
      const project = projects.find((p: Project) => p.id === Number(params.id));
      if (project) {
        setFormData({
          title: project.title,
          description: project.description,
          thumbnail: project.thumbnail,
          technologies: project.technologies || [],
          githubLink: project.githubLink || "",
          liveUrl: project.liveUrl || "",
          featured: project.featured,
          category: project.category,
          slug: project.slug,
          content: project.content || "",
        });
      }
    } catch (error) {
      console.error("Failed to fetch project:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const url = isNew ? "/api/projects" : `/api/projects/${params.id}`;
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          id: isNew ? undefined : params.id,
        }),
      });

      if (res.ok) {
        router.push("/admin/projects");
      } else {
        alert("Failed to save project");
      }
    } catch (error) {
      console.error("Failed to save project:", error);
      alert("Failed to save project");
    } finally {
      setSaving(false);
    }
  };

  const addTechnology = () => {
    if (techInput.trim() && !formData.technologies.includes(techInput.trim())) {
      setFormData({
        ...formData,
        technologies: [...formData.technologies, techInput.trim()],
      });
      setTechInput("");
    }
  };

  const removeTechnology = (tech: string) => {
    setFormData({
      ...formData,
      technologies: formData.technologies.filter((t) => t !== tech),
    });
  };

  const editorOptions = useMemo(() => {
    return {
      spellChecker: false,
      placeholder: "Write your project details in Markdown...",
      status: false,
      toolbar: [
        "bold",
        "italic",
        "heading",
        "|",
        "quote",
        "unordered-list",
        "ordered-list",
        "|",
        "link",
        "image",
        "|",
        "preview",
        "side-by-side",
        "fullscreen",
      ] as any,
    };
  }, []);

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
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-extrabold text-white font-geist">
            {isNew ? "Create New Project" : "Edit Project"}
          </h1>
          <div className="flex gap-4">
            <button
              onClick={() => router.push("/admin/projects")}
              className="px-6 py-3 rounded-full font-semibold border border-neutral-600 text-neutral-300 hover:bg-neutral-800 transition font-geist"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-neutral-100 transition font-geist disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Project"}
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="bg-neutral-900/80 rounded-2xl border border-neutral-800 p-8 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-white font-semibold mb-2 font-geist">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full bg-neutral-800 text-white px-4 py-3 rounded-lg border border-neutral-700 focus:border-white transition font-geist"
              placeholder="Project title"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-white font-semibold mb-2 font-geist">
              Slug
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) =>
                setFormData({ ...formData, slug: e.target.value })
              }
              className="w-full bg-neutral-800 text-white px-4 py-3 rounded-lg border border-neutral-700 focus:border-white transition font-geist"
              placeholder="project-slug"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-white font-semibold mb-2 font-geist">
              Short Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              className="w-full bg-neutral-800 text-white px-4 py-3 rounded-lg border border-neutral-700 focus:border-white transition font-geist"
              placeholder="Brief description for cards"
            />
          </div>

          {/* Category & Featured */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white font-semibold mb-2 font-geist">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    category: e.target.value as Project["category"],
                  })
                }
                className="w-full bg-neutral-800 text-white px-4 py-3 rounded-lg border border-neutral-700 focus:border-white transition font-geist"
              >
                <option value="web">Web</option>
                <option value="mobile">Mobile</option>
                <option value="AI/ML">AI/ML</option>
                <option value="data-science">Data Science</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-white font-semibold mb-2 font-geist">
                Featured
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) =>
                    setFormData({ ...formData, featured: e.target.checked })
                  }
                  className="w-6 h-6 rounded bg-neutral-800 border-neutral-700"
                />
                <span className="ml-3 text-neutral-300 font-geist">
                  Show in featured section
                </span>
              </label>
            </div>
          </div>

          {/* Thumbnail */}
          <div>
            <label className="block text-white font-semibold mb-2 font-geist">
              Thumbnail Image
            </label>
            <ImageUpload
              currentImage={formData.thumbnail}
              onUploadComplete={(url) =>
                setFormData({ ...formData, thumbnail: url })
              }
            />
            {formData.thumbnail && (
              <input
                type="text"
                value={formData.thumbnail}
                onChange={(e) =>
                  setFormData({ ...formData, thumbnail: e.target.value })
                }
                className="w-full bg-neutral-800 text-white px-4 py-3 rounded-lg border border-neutral-700 focus:border-white transition font-geist mt-2"
                placeholder="Or paste image URL"
              />
            )}
          </div>

          {/* Technologies */}
          <div>
            <label className="block text-white font-semibold mb-2 font-geist">
              Technologies
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addTechnology()}
                className="flex-1 bg-neutral-800 text-white px-4 py-3 rounded-lg border border-neutral-700 focus:border-white transition font-geist"
                placeholder="Add technology (press Enter)"
              />
              <button
                onClick={addTechnology}
                className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-neutral-100 transition font-geist"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.technologies.map((tech) => (
                <span
                  key={tech}
                  className="bg-neutral-800 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2 font-geist"
                >
                  {tech}
                  <button
                    onClick={() => removeTechnology(tech)}
                    className="text-neutral-400 hover:text-white"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white font-semibold mb-2 font-geist">
                GitHub Link
              </label>
              <input
                type="url"
                value={formData.githubLink}
                onChange={(e) =>
                  setFormData({ ...formData, githubLink: e.target.value })
                }
                className="w-full bg-neutral-800 text-white px-4 py-3 rounded-lg border border-neutral-700 focus:border-white transition font-geist"
                placeholder="https://github.com/..."
              />
            </div>
            <div>
              <label className="block text-white font-semibold mb-2 font-geist">
                Live URL
              </label>
              <input
                type="url"
                value={formData.liveUrl}
                onChange={(e) =>
                  setFormData({ ...formData, liveUrl: e.target.value })
                }
                className="w-full bg-neutral-800 text-white px-4 py-3 rounded-lg border border-neutral-700 focus:border-white transition font-geist"
                placeholder="https://..."
              />
            </div>
          </div>

          {/* Markdown Editor */}
          <div>
            <label className="block text-white font-semibold mb-2 font-geist">
              Project Details (Markdown)
            </label>
            <div className="markdown-editor">
              <SimpleMDE
                value={formData.content}
                onChange={(value) =>
                  setFormData({ ...formData, content: value })
                }
                options={editorOptions}
              />
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .markdown-editor .EasyMDEContainer {
          background: #262626;
          border-radius: 0.5rem;
          border: 1px solid #404040;
        }
        .markdown-editor .EasyMDEContainer .CodeMirror {
          background: #262626;
          color: #fff;
          border: none;
          font-family: 'Geist Mono', monospace;
        }
        .markdown-editor .editor-toolbar {
          background: #171717;
          border: none;
          border-bottom: 1px solid #404040;
        }
        .markdown-editor .editor-toolbar button {
          color: #a3a3a3 !important;
        }
        .markdown-editor .editor-toolbar button:hover {
          background: #262626;
          border-color: #404040;
        }
        .markdown-editor .editor-toolbar.fullscreen {
          background: #171717;
        }
        .markdown-editor .CodeMirror-fullscreen {
          background: #262626;
        }
      `}</style>
    </div>
  );
}
