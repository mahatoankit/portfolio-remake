"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "../../../useAuth";
import { Blog } from "@/types/blog";
import { ImageIcon, Upload, X, Save, Eye, Sparkles, Bold, Italic, List, ListOrdered, Link as LinkIcon, Image as ImageIconTip, Code, Quote, Heading1, Heading2, Heading3 } from "lucide-react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";

export default function EditBlog() {
  const { session, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const isNew = id === "new";

  const [formData, setFormData] = useState<Partial<Blog>>({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    thumbnail: "",
    tags: [],
    published: false,
    featured: false,
    readTime: 5,
  });

  const [tagInput, setTagInput] = useState("");
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [uploadingInlineImage, setUploadingInlineImage] = useState(false);
  const [saving, setSaving] = useState(false);

  // Initialize TipTap editor
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Image,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-400 underline',
        },
      }),
      Placeholder.configure({
        placeholder: 'Start writing your blog post...',
      }),
    ],
    content: formData.content || '',
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none min-h-[400px] p-4',
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const text = editor.getText();
      const readTime = Math.max(1, Math.ceil(text.split(/\s+/).length / 200));
      setFormData({
        ...formData,
        content: html,
        readTime,
      });
    },
  });

  // Update editor content when blog is fetched
  useEffect(() => {
    if (editor && formData.content && editor.isEmpty) {
      editor.commands.setContent(formData.content);
    }
  }, [editor, formData.content]);

  useEffect(() => {
    if (!loading && !session) {
      router.push("/admin/login");
    }
  }, [session, loading, router]);

  useEffect(() => {
    if (!isNew && session) {
      fetchBlog();
    }
  }, [id, isNew, session]);

  const fetchBlog = async () => {
    try {
      const res = await fetch(`/api/blog/${id}`);
      if (res.ok) {
        const data = await res.json();
        setFormData(data);
        setTagInput(data.tags.join(", "));
      }
    } catch (error) {
      console.error("Error fetching blog:", error);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData({
      ...formData,
      title,
      slug: generateSlug(title),
    });
  };

  const handleInlineImageUpload = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = async (e: any) => {
      const file = e.target.files?.[0];
      if (!file || !editor) return;

      setUploadingInlineImage(true);
      try {
        const formDataUpload = new FormData();
        formDataUpload.append("file", file);
        formDataUpload.append("upload_preset", "portfolio-preset");

        const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`;

        const res = await fetch(cloudinaryUrl, {
          method: "POST",
          body: formDataUpload,
        });

        if (res.ok) {
          const data = await res.json();
          editor.chain().focus().setImage({ src: data.secure_url }).run();
        } else {
          alert("Failed to upload image");
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("Error uploading image");
      } finally {
        setUploadingInlineImage(false);
      }
    };

    input.click();
  };

  const setLink = () => {
    if (!editor) return;
    
    const url = window.prompt('Enter URL:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingThumbnail(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);
      formDataUpload.append("upload_preset", "portfolio-preset");

      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`;

      const res = await fetch(cloudinaryUrl, {
        method: "POST",
        body: formDataUpload,
      });

      if (res.ok) {
        const data = await res.json();
        setFormData({ ...formData, thumbnail: data.secure_url });
      } else {
        alert("Failed to upload image");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Error uploading image");
    } finally {
      setUploadingThumbnail(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent, publish: boolean = false) => {
    e.preventDefault();
    setSaving(true);

    try {
      const tags = tagInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const body = {
        ...formData,
        tags,
        published: publish,
      };

      const url = isNew ? "/api/blog" : `/api/blog/${id}`;
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        router.push("/admin/blog");
      } else {
        const errorData = await res.json();
        alert(errorData.error || "Failed to save blog");
      }
    } catch (error) {
      console.error("Error saving blog:", error);
      alert("Error saving blog");
    } finally {
      setSaving(false);
    }
  };



  if (loading) {
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
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-6xl font-semibold text-white tracking-tight mb-2">
            {isNew ? "Create New Post" : "Edit Post"}
          </h1>
          <p className="text-neutral-400">
            {isNew ? "Write and publish a new blog article" : "Update your blog post"}
          </p>
        </div>

        <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-8">
          {/* Title & Slug */}
          <div className="rounded-3xl border border-neutral-800/50 bg-neutral-900/30 backdrop-blur-xl p-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={handleTitleChange}
                  className="w-full rounded-2xl bg-neutral-800/50 px-4 py-3 text-white placeholder-neutral-500 border border-neutral-700 focus:border-neutral-500 focus:outline-none"
                  placeholder="Enter blog title..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Slug (URL)
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  className="w-full rounded-2xl bg-neutral-800/50 px-4 py-3 text-white placeholder-neutral-500 border border-neutral-700 focus:border-neutral-500 focus:outline-none"
                  placeholder="auto-generated-from-title"
                  required
                />
                <p className="text-xs text-neutral-500 mt-1">
                  URL: /blog/{formData.slug || "your-slug"}
                </p>
              </div>
            </div>
          </div>

          {/* Excerpt */}
          <div className="rounded-3xl border border-neutral-800/50 bg-neutral-900/30 backdrop-blur-xl p-8">
            <label className="block text-sm font-medium text-neutral-300 mb-2">
              Excerpt (Short Description)
            </label>
            <textarea
              value={formData.excerpt}
              onChange={(e) =>
                setFormData({ ...formData, excerpt: e.target.value })
              }
              rows={3}
              className="w-full rounded-2xl bg-neutral-800/50 px-4 py-3 text-white placeholder-neutral-500 border border-neutral-700 focus:border-neutral-500 focus:outline-none resize-none"
              placeholder="A brief summary of your blog post..."
              required
            />
            <p className="text-xs text-neutral-500 mt-1">
              {formData.excerpt?.length || 0} characters (recommended: 150-160)
            </p>
          </div>

          {/* Content Editor */}
          <div className="rounded-3xl border border-neutral-800/50 bg-neutral-900/30 backdrop-blur-xl p-8">
            <label className="block text-sm font-medium text-neutral-300 mb-4">
              Blog Content
            </label>
            
            {/* Editor Toolbar */}
            {editor && (
              <div className="mb-4 flex flex-wrap gap-2 p-3 rounded-2xl bg-neutral-800/50 border border-neutral-700">
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  className={`p-2 rounded-lg transition ${
                    editor.isActive('bold') ? 'bg-white text-black' : 'text-neutral-400 hover:bg-neutral-700'
                  }`}
                  title="Bold"
                >
                  <Bold className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  className={`p-2 rounded-lg transition ${
                    editor.isActive('italic') ? 'bg-white text-black' : 'text-neutral-400 hover:bg-neutral-700'
                  }`}
                  title="Italic"
                >
                  <Italic className="h-4 w-4" />
                </button>
                
                <div className="w-px h-8 bg-neutral-700 mx-1" />
                
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                  className={`p-2 rounded-lg transition ${
                    editor.isActive('heading', { level: 1 }) ? 'bg-white text-black' : 'text-neutral-400 hover:bg-neutral-700'
                  }`}
                  title="Heading 1"
                >
                  <Heading1 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                  className={`p-2 rounded-lg transition ${
                    editor.isActive('heading', { level: 2 }) ? 'bg-white text-black' : 'text-neutral-400 hover:bg-neutral-700'
                  }`}
                  title="Heading 2"
                >
                  <Heading2 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                  className={`p-2 rounded-lg transition ${
                    editor.isActive('heading', { level: 3 }) ? 'bg-white text-black' : 'text-neutral-400 hover:bg-neutral-700'
                  }`}
                  title="Heading 3"
                >
                  <Heading3 className="h-4 w-4" />
                </button>

                <div className="w-px h-8 bg-neutral-700 mx-1" />
                
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleBulletList().run()}
                  className={`p-2 rounded-lg transition ${
                    editor.isActive('bulletList') ? 'bg-white text-black' : 'text-neutral-400 hover:bg-neutral-700'
                  }`}
                  title="Bullet List"
                >
                  <List className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleOrderedList().run()}
                  className={`p-2 rounded-lg transition ${
                    editor.isActive('orderedList') ? 'bg-white text-black' : 'text-neutral-400 hover:bg-neutral-700'
                  }`}
                  title="Numbered List"
                >
                  <ListOrdered className="h-4 w-4" />
                </button>

                <div className="w-px h-8 bg-neutral-700 mx-1" />
                
                <button
                  type="button"
                  onClick={setLink}
                  className={`p-2 rounded-lg transition ${
                    editor.isActive('link') ? 'bg-white text-black' : 'text-neutral-400 hover:bg-neutral-700'
                  }`}
                  title="Insert Link"
                >
                  <LinkIcon className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={handleInlineImageUpload}
                  disabled={uploadingInlineImage}
                  className="p-2 rounded-lg text-neutral-400 hover:bg-neutral-700 transition disabled:opacity-50"
                  title="Insert Image"
                >
                  {uploadingInlineImage ? (
                    <Upload className="h-4 w-4 animate-pulse" />
                  ) : (
                    <ImageIconTip className="h-4 w-4" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                  className={`p-2 rounded-lg transition ${
                    editor.isActive('codeBlock') ? 'bg-white text-black' : 'text-neutral-400 hover:bg-neutral-700'
                  }`}
                  title="Code Block"
                >
                  <Code className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleBlockquote().run()}
                  className={`p-2 rounded-lg transition ${
                    editor.isActive('blockquote') ? 'bg-white text-black' : 'text-neutral-400 hover:bg-neutral-700'
                  }`}
                  title="Quote"
                >
                  <Quote className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Editor Content */}
            <div className="rounded-2xl bg-neutral-800/50 border border-neutral-700 min-h-[400px]">
              <EditorContent editor={editor} />
            </div>
            
            <p className="text-xs text-neutral-500 mt-2">
              Estimated read time: {formData.readTime} {formData.readTime === 1 ? "minute" : "minutes"}
            </p>
          </div>

          {/* Thumbnail */}
          <div className="rounded-3xl border border-neutral-800/50 bg-neutral-900/30 backdrop-blur-xl p-8">
            <label className="block text-sm font-medium text-neutral-300 mb-4">
              Featured Image
            </label>
            
            {formData.thumbnail ? (
              <div className="relative w-full h-64 rounded-2xl overflow-hidden bg-neutral-800">
                <img
                  src={formData.thumbnail}
                  alt="Thumbnail"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, thumbnail: "" })}
                  className="absolute top-4 right-4 p-2 bg-red-500/90 hover:bg-red-600 rounded-full text-white transition"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-neutral-700 rounded-2xl cursor-pointer hover:border-neutral-600 transition bg-neutral-800/30">
                <div className="flex flex-col items-center justify-center py-4">
                  {uploadingThumbnail ? (
                    <div className="text-neutral-400">Uploading...</div>
                  ) : (
                    <>
                      <ImageIcon className="h-12 w-12 text-neutral-600 mb-2" />
                      <p className="text-sm text-neutral-400">
                        Click to upload thumbnail
                      </p>
                      <p className="text-xs text-neutral-500 mt-1">
                        PNG, JPG, or GIF (max. 5MB)
                      </p>
                    </>
                  )}
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleThumbnailUpload}
                  disabled={uploadingThumbnail}
                />
              </label>
            )}
          </div>

          {/* Tags & Metadata */}
          <div className="rounded-3xl border border-neutral-800/50 bg-neutral-900/30 backdrop-blur-xl p-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  className="w-full rounded-2xl bg-neutral-800/50 px-4 py-3 text-white placeholder-neutral-500 border border-neutral-700 focus:border-neutral-500 focus:outline-none"
                  placeholder="nextjs, typescript, web development"
                />
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) =>
                      setFormData({ ...formData, featured: e.target.checked })
                    }
                    className="w-5 h-5 rounded border-neutral-700 bg-neutral-800/50 text-white focus:ring-2 focus:ring-white/20"
                  />
                  <span className="text-sm text-neutral-300 group-hover:text-white transition flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    Featured Post
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => router.push("/admin/blog")}
              className="rounded-full bg-neutral-800/50 px-6 py-3 text-sm font-medium text-neutral-300 transition hover:bg-neutral-800"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-full bg-neutral-700 px-6 py-3 text-sm font-medium text-white transition hover:bg-neutral-600 disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {saving ? "Saving..." : "Save as Draft"}
            </button>

            <button
              type="button"
              onClick={(e) => handleSubmit(e, true)}
              disabled={saving}
              className="flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:bg-neutral-200 disabled:opacity-50"
            >
              <Eye className="h-4 w-4" />
              {saving ? "Publishing..." : formData.published ? "Update & Publish" : "Publish"}
            </button>
          </div>
        </form>
      </div>

      {/* Custom CSS for TipTap Editor */}
      <style jsx global>{`
        .tiptap {
          color: white;
        }

        .tiptap p {
          margin: 1em 0;
        }

        .tiptap h1 {
          font-size: 2.5em;
          font-weight: bold;
          margin: 1.5em 0 0.5em;
          color: white;
        }

        .tiptap h2 {
          font-size: 2em;
          font-weight: bold;
          margin: 1.3em 0 0.5em;
          color: white;
        }

        .tiptap h3 {
          font-size: 1.5em;
          font-weight: bold;
          margin: 1.2em 0 0.5em;
          color: white;
        }

        .tiptap ul, .tiptap ol {
          padding-left: 1.5em;
          margin: 1em 0;
        }

        .tiptap li {
          margin: 0.5em 0;
        }

        .tiptap code {
          background-color: rgba(23, 23, 23, 0.8);
          color: rgb(220, 220, 220);
          padding: 0.2em 0.4em;
          border-radius: 0.25em;
          font-family: monospace;
        }

        .tiptap pre {
          background-color: rgba(23, 23, 23, 0.8);
          color: rgb(220, 220, 220);
          padding: 1em;
          border-radius: 0.5em;
          overflow-x: auto;
          margin: 1em 0;
        }

        .tiptap pre code {
          background: none;
          padding: 0;
        }

        .tiptap blockquote {
          border-left: 4px solid rgb(115, 115, 115);
          padding-left: 1em;
          margin: 1em 0;
          color: rgb(163, 163, 163);
          font-style: italic;
        }

        .tiptap a {
          color: rgb(96, 165, 250);
          text-decoration: underline;
        }

        .tiptap img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5em;
          margin: 1em 0;
        }

        .tiptap p.is-editor-empty:first-child::before {
          color: rgb(115, 115, 115);
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}
