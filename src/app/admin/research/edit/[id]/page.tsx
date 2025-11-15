"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "../../../useAuth";
import { Research } from "@/types/research";
import { BookOpen, Users, Building2, Calendar, FileText, Link as LinkIcon, Award, Tag, Image as ImageIcon, Hash } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function EditResearch() {
  const { session, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const isNew = params.id === "new";

  const [formData, setFormData] = useState({
    title: "",
    authors: [] as string[],
    journal: "",
    date: "",
    abstract: "",
    doi: "",
    pdfUrl: "",
    externalUrl: "",
    citations: 0,
    tags: [] as string[],
    thumbnail: "",
    featured: false,
  });

  const [dateObj, setDateObj] = useState<Date | null>(null);
  const [authorsInput, setAuthorsInput] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Helper function to parse date strings
  const parseDate = (dateStr: string): Date | null => {
    if (!dateStr) return null;
    
    const monthNames = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
    const parts = dateStr.toLowerCase().split(" ");
    
    if (parts.length === 3) {
      const day = parseInt(parts[0]);
      const monthIndex = monthNames.findIndex(m => parts[1].startsWith(m));
      const year = parseInt(parts[2]);
      
      if (!isNaN(day) && monthIndex !== -1 && !isNaN(year)) {
        return new Date(year, monthIndex, day);
      }
    }
    
    return null;
  };

  // Helper function to format Date object
  const formatDate = (date: Date | null): string => {
    if (!date) return "";
    
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const day = date.getDate();
    return `${day} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
  };

  useEffect(() => {
    if (!loading && !session) {
      router.push("/admin/login");
    }
  }, [session, loading, router]);

  useEffect(() => {
    if (!isNew && params.id) {
      fetchResearch();
    }
  }, [params.id, isNew]);

  const fetchResearch = async () => {
    try {
      const res = await fetch(`/api/research/${params.id}`);
      if (res.ok) {
        const data: Research = await res.json();
        setFormData({
          title: data.title,
          authors: data.authors,
          journal: data.journal,
          date: data.date,
          abstract: data.abstract,
          doi: data.doi || "",
          pdfUrl: data.pdfUrl || "",
          externalUrl: data.externalUrl || "",
          citations: data.citations,
          tags: data.tags,
          thumbnail: data.thumbnail || "",
          featured: data.featured,
        });
        
        setDateObj(parseDate(data.date));
        setAuthorsInput(data.authors.join(", "));
        setTagsInput(data.tags.join(", "));
      }
    } catch (error) {
      console.error("Error fetching research:", error);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const formDataUpload = new FormData();
    formDataUpload.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formDataUpload,
      });

      if (res.ok) {
        const data = await res.json();
        setFormData((prev) => ({ ...prev, thumbnail: data.url }));
      } else {
        alert("Failed to upload image");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Error uploading image");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    // Parse authors and tags from comma-separated strings
    const authorsArray = authorsInput
      .split(",")
      .map((a) => a.trim())
      .filter((a) => a.length > 0);

    const tagsArray = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    try {
      const url = isNew
        ? "/api/research"
        : `/api/research/${params.id}`;
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          authors: authorsArray,
          tags: tagsArray,
          citations: parseInt(formData.citations.toString()) || 0,
        }),
      });

      if (res.ok) {
        router.push("/admin/research");
      } else {
        alert("Failed to save publication");
      }
    } catch (error) {
      console.error("Error saving publication:", error);
      alert("Error saving publication");
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
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
            {isNew ? "Add New Publication" : "Edit Publication"}
          </h1>
          <p className="text-neutral-400">
            Fill in the details of your research publication
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Thumbnail */}
          <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-6">
            <label className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
              <ImageIcon className="h-4 w-4" />
              Thumbnail Image (Optional)
            </label>
            <div className="flex items-center gap-4">
              {formData.thumbnail && (
                <div className="h-24 w-24 rounded-lg border border-neutral-700 bg-neutral-800 overflow-hidden">
                  <img
                    src={formData.thumbnail}
                    alt="Thumbnail preview"
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full text-sm text-neutral-400 file:mr-4 file:rounded-lg file:border-0 file:bg-neutral-800 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-neutral-700"
                />
                {uploadingImage && (
                  <p className="mt-2 text-sm text-neutral-500">Uploading...</p>
                )}
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-6">
            <label className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
              <BookOpen className="h-4 w-4" />
              Publication Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
              className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
              placeholder="e.g., Deep Learning Approaches for Natural Language Processing"
            />
          </div>

          {/* Authors */}
          <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-6">
            <label className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
              <Users className="h-4 w-4" />
              Authors * <span className="text-xs text-neutral-500 font-normal">(comma-separated)</span>
            </label>
            <input
              type="text"
              value={authorsInput}
              onChange={(e) => setAuthorsInput(e.target.value)}
              required
              className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
              placeholder="e.g., John Doe, Jane Smith, Robert Johnson"
            />
          </div>

          {/* Journal and Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-6">
              <label className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
                <Building2 className="h-4 w-4" />
                Journal/Conference *
              </label>
              <input
                type="text"
                value={formData.journal}
                onChange={(e) =>
                  setFormData({ ...formData, journal: e.target.value })
                }
                required
                className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                placeholder="e.g., Nature, IEEE, ACM"
              />
            </div>

            <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-6">
              <label className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
                <Calendar className="h-4 w-4" />
                Publication Date *
              </label>
              <DatePicker
                selected={dateObj}
                onChange={(date: Date | null) => {
                  setDateObj(date);
                  setFormData({ ...formData, date: formatDate(date) });
                }}
                dateFormat="dd MMM yyyy"
                required
                className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                placeholderText="Select publication date"
              />
            </div>
          </div>

          {/* Abstract */}
          <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-6">
            <label className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
              <FileText className="h-4 w-4" />
              Abstract *
            </label>
            <textarea
              value={formData.abstract}
              onChange={(e) =>
                setFormData({ ...formData, abstract: e.target.value })
              }
              required
              rows={6}
              className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-3 text-white focus:border-blue-500 focus:outline-none resize-none"
              placeholder="Provide a brief summary of your research..."
            />
          </div>

          {/* DOI, PDF, External Link */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-6">
              <label className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
                <Hash className="h-4 w-4" />
                DOI
              </label>
              <input
                type="text"
                value={formData.doi}
                onChange={(e) =>
                  setFormData({ ...formData, doi: e.target.value })
                }
                className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                placeholder="10.1234/example"
              />
            </div>

            <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-6">
              <label className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
                <LinkIcon className="h-4 w-4" />
                PDF URL
              </label>
              <input
                type="url"
                value={formData.pdfUrl}
                onChange={(e) =>
                  setFormData({ ...formData, pdfUrl: e.target.value })
                }
                className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                placeholder="https://..."
              />
            </div>

            <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-6">
              <label className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
                <LinkIcon className="h-4 w-4" />
                Publisher Link
              </label>
              <input
                type="url"
                value={formData.externalUrl}
                onChange={(e) =>
                  setFormData({ ...formData, externalUrl: e.target.value })
                }
                className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                placeholder="https://..."
              />
            </div>
          </div>

          {/* Citations and Tags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-6">
              <label className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
                <Award className="h-4 w-4" />
                Citations Count
              </label>
              <input
                type="number"
                value={formData.citations}
                onChange={(e) =>
                  setFormData({ ...formData, citations: parseInt(e.target.value) || 0 })
                }
                min="0"
                className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                placeholder="0"
              />
            </div>

            <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-6">
              <label className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
                <Tag className="h-4 w-4" />
                Tags/Keywords <span className="text-xs text-neutral-500 font-normal">(comma-separated)</span>
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                placeholder="e.g., Machine Learning, NLP, AI"
              />
            </div>
          </div>

          {/* Featured */}
          <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) =>
                  setFormData({ ...formData, featured: e.target.checked })
                }
                className="w-5 h-5 rounded border-neutral-600 bg-neutral-800 text-blue-600 focus:ring-blue-500 focus:ring-offset-neutral-900"
              />
              <div>
                <span className="text-sm font-semibold text-white">Featured Publication</span>
                <p className="text-xs text-neutral-400">Highlight this publication on your publications page</p>
              </div>
            </label>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-lg bg-white px-6 py-3 font-medium text-black transition hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "Saving..." : isNew ? "Create Publication" : "Update Publication"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/admin/research")}
              className="rounded-lg border border-neutral-700 bg-neutral-800 px-6 py-3 font-medium text-white transition hover:bg-neutral-700"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
