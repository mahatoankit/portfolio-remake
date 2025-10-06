"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { Project } from "@/types/project";
import { useAuth } from "../../../useAuth";
import ImageUpload from "@/components/ImageUpload";
import "easymde/dist/easymde.min.css";
import { CheckCircle2, Clock, CalendarClock, Star, Trophy } from "lucide-react";

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
    status: "completed" as Project["status"],
    isSpotlight: false,
    slug: "",
    content: "", // Markdown content
  });

  const [techInput, setTechInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [showSpotlightConfirm, setShowSpotlightConfirm] = useState(false);
  const [existingSpotlight, setExistingSpotlight] = useState<Project | null>(null);

  // Auto-generate slug from title
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  };

  const handleTitleChange = (newTitle: string) => {
    setFormData({ ...formData, title: newTitle });
    // Only auto-generate slug if it hasn't been manually edited
    if (!slugManuallyEdited && isNew) {
      setFormData((prev) => ({ ...prev, title: newTitle, slug: generateSlug(newTitle) }));
    }
  };

  const handleSlugChange = (newSlug: string) => {
    setFormData({ ...formData, slug: newSlug });
    setSlugManuallyEdited(true);
  };

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
          status: project.status || "completed",
          isSpotlight: project.isSpotlight || false,
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
      // If marking as spotlight, check if another project is already spotlight
      if (formData.isSpotlight) {
        const res = await fetch("/api/projects");
        const projects = await res.json();
        const currentSpotlight = projects.find((p: Project) => 
          p.isSpotlight && p.id !== Number(params.id)
        );
        
        if (currentSpotlight) {
          setExistingSpotlight(currentSpotlight);
          setShowSpotlightConfirm(true);
          setSaving(false);
          return;
        }
      }
      
      await saveProject();
    } catch (error) {
      console.error("Failed to save project:", error);
      alert("Failed to save project");
      setSaving(false);
    }
  };

  const saveProject = async () => {
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

  const handleSpotlightReplace = async () => {
    setShowSpotlightConfirm(false);
    setSaving(true);
    await saveProject();
  };

  const handleSpotlightCancel = () => {
    setShowSpotlightConfirm(false);
    setFormData({ ...formData, isSpotlight: false });
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
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full bg-neutral-800 text-white px-4 py-3 rounded-lg border border-neutral-700 focus:border-white transition font-geist"
              placeholder="Project title"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-white font-semibold mb-2 font-geist">
              Slug {isNew && <span className="text-neutral-500 text-sm font-normal">(auto-generated, but editable)</span>}
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => handleSlugChange(e.target.value)}
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
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as Project["status"],
                  })
                }
                className="w-full bg-neutral-800 text-white px-4 py-3 rounded-lg border border-neutral-700 focus:border-white transition font-geist"
              >
                <option value="completed">✅ Completed</option>
                <option value="in-progress">🚧 In Progress</option>
                <option value="planned">📋 Planned</option>
              </select>
            </div>
          </div>

          {/* Featured & Spotlight */}
          <div className="grid grid-cols-2 gap-4">
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
            <div>
              <label className="block text-white font-semibold mb-2 font-geist">
                Spotlight (Latest & Greatest)
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isSpotlight}
                  onChange={(e) =>
                    setFormData({ ...formData, isSpotlight: e.target.checked })
                  }
                  className="w-6 h-6 rounded bg-neutral-800 border-neutral-700"
                />
                <span className="ml-3 text-neutral-300 font-geist">
                  ⭐ Mark as spotlight project
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

      {/* Spotlight Confirmation Dialog */}
      {showSpotlightConfirm && existingSpotlight && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-900 border border-neutral-700 rounded-2xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold text-white mb-4 font-geist">
              Replace Spotlight Project?
            </h3>
            <p className="text-neutral-300 mb-2 font-geist">
              <span className="font-semibold text-white">"{existingSpotlight.title}"</span> is currently marked as the spotlight project.
            </p>
            <p className="text-neutral-400 mb-6 font-geist">
              This will replace it with <span className="font-semibold text-white">"{formData.title}"</span>. Are you sure?
            </p>
            <div className="flex gap-4">
              <button
                onClick={handleSpotlightCancel}
                className="flex-1 px-6 py-3 rounded-lg bg-neutral-800 text-white hover:bg-neutral-700 transition font-geist font-semibold"
              >
                NO
              </button>
              <button
                onClick={handleSpotlightReplace}
                disabled={saving}
                className="flex-1 px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition font-geist font-semibold disabled:opacity-50"
              >
                {saving ? "REPLACING..." : "REPLACE"}
              </button>
            </div>
          </div>
        </div>
      )}

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
