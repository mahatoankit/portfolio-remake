"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "../../../useAuth";
import { Experience } from "@/types/experience";
import { Calendar, Building2, UserCircle, FileText, Image as ImageIcon } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function EditExperience() {
  const { session, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const isNew = params.id === "new";

  const [formData, setFormData] = useState({
    company: "",
    role: "",
    description: "",
    logo: "",
    startDate: "",
    endDate: "",
  });

  const [startDateObj, setStartDateObj] = useState<Date | null>(null);
  const [endDateObj, setEndDateObj] = useState<Date | null>(null);
  const [isCurrentlyWorking, setIsCurrentlyWorking] = useState(false);

  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  // Helper function to parse date strings like "15 Jan 2024" or "Jan 2024" to Date object
  const parseMonthYear = (dateStr: string): Date | null => {
    if (!dateStr || dateStr.toLowerCase() === 'present') return null;
    
    const monthNames = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
    const parts = dateStr.toLowerCase().split(" ");
    
    // Format: "DD MMM YYYY" (e.g., "15 Jan 2024")
    if (parts.length === 3) {
      const day = parseInt(parts[0]);
      const monthIndex = monthNames.findIndex(m => parts[1].startsWith(m));
      const year = parseInt(parts[2]);
      
      if (!isNaN(day) && monthIndex !== -1 && !isNaN(year)) {
        return new Date(year, monthIndex, day);
      }
    }
    
    // Format: "MMM YYYY" (e.g., "Jan 2024") - for backward compatibility
    if (parts.length === 2) {
      const monthIndex = monthNames.findIndex(m => parts[0].startsWith(m));
      const year = parseInt(parts[1]);
      
      if (monthIndex !== -1 && !isNaN(year)) {
        return new Date(year, monthIndex, 1);
      }
    }
    
    return null;
  };

  // Helper function to format Date object to "DD MMM YYYY"
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
      fetchExperience();
    }
  }, [params.id, isNew]);

  const fetchExperience = async () => {
    try {
      const res = await fetch(`/api/experiences/${params.id}`);
      if (res.ok) {
        const data: Experience = await res.json();
        setFormData({
          company: data.company,
          role: data.role,
          description: data.description,
          logo: data.logo || "",
          startDate: data.startDate,
          endDate: data.endDate || "",
        });
        
        // Parse and set date objects
        setStartDateObj(parseMonthYear(data.startDate));
        setEndDateObj(parseMonthYear(data.endDate || ""));
        
        // Check if currently working (no end date or "Present")
        setIsCurrentlyWorking(!data.endDate || data.endDate.toLowerCase() === 'present');
      }
    } catch (error) {
      console.error("Error fetching experience:", error);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setFormData((prev) => ({ ...prev, logo: data.url }));
      } else {
        alert("Failed to upload logo");
      }
    } catch (error) {
      console.error("Error uploading logo:", error);
      alert("Error uploading logo");
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = isNew
        ? "/api/experiences"
        : `/api/experiences/${params.id}`;
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push("/admin/experiences");
      } else {
        alert("Failed to save experience");
      }
    } catch (error) {
      console.error("Error saving experience:", error);
      alert("Error saving experience");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-950">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-neutral-950 p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            {isNew ? "Add New Experience" : "Edit Experience"}
          </h1>
          <p className="text-neutral-400">
            Fill in the details of your professional experience
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Company Logo */}
          <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-6">
            <label className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
              <ImageIcon className="h-4 w-4" />
              Company Logo (Optional)
            </label>
            <div className="flex items-center gap-4">
              {formData.logo && (
                <div className="h-16 w-16 rounded-lg border border-neutral-700 bg-white overflow-hidden">
                  <img
                    src={formData.logo}
                    alt="Logo preview"
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  disabled={uploadingLogo}
                  className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-2 text-white file:mr-4 file:rounded-lg file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-white hover:file:bg-blue-700"
                />
                {uploadingLogo && (
                  <p className="mt-2 text-sm text-blue-400">Uploading...</p>
                )}
              </div>
            </div>
          </div>

          {/* Company Name */}
          <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-6">
            <label className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
              <Building2 className="h-4 w-4" />
              Company Name *
            </label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) =>
                setFormData({ ...formData, company: e.target.value })
              }
              required
              className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
              placeholder="e.g., Tech Innovations Inc."
            />
          </div>

          {/* Role */}
          <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-6">
            <label className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
              <UserCircle className="h-4 w-4" />
              Role/Position *
            </label>
            <input
              type="text"
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              required
              className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
              placeholder="e.g., Senior Full Stack Developer"
            />
          </div>

          {/* Start and End Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-6">
              <label className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
                <Calendar className="h-4 w-4" />
                Start Date *
              </label>
              <DatePicker
                selected={startDateObj}
                onChange={(date: Date | null) => {
                  setStartDateObj(date);
                  setFormData({ ...formData, startDate: formatDate(date) });
                }}
                dateFormat="dd MMM yyyy"
                required
                className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                placeholderText="Select start date"
              />
            </div>

            <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-6">
              <label className="text-sm font-semibold text-white mb-3 block">
                End Date
              </label>
              
              {/* Currently Working Checkbox */}
              <div className="mb-3">
                <label className="flex items-center gap-2 text-neutral-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isCurrentlyWorking}
                    onChange={(e) => {
                      setIsCurrentlyWorking(e.target.checked);
                      if (e.target.checked) {
                        setEndDateObj(null);
                        setFormData({ ...formData, endDate: "Present" });
                      } else {
                        setFormData({ ...formData, endDate: "" });
                      }
                    }}
                    className="w-4 h-4 rounded border-neutral-600 bg-neutral-800 text-blue-600 focus:ring-blue-500 focus:ring-offset-neutral-900"
                  />
                  <span className="text-sm">Currently Working Here</span>
                </label>
              </div>

              <DatePicker
                selected={endDateObj}
                onChange={(date: Date | null) => {
                  setEndDateObj(date);
                  setFormData({ ...formData, endDate: formatDate(date) });
                }}
                dateFormat="dd MMM yyyy"
                disabled={isCurrentlyWorking}
                className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-3 text-white focus:border-blue-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                placeholderText="Select end date"
              />
            </div>
          </div>

          {/* Description */}
          <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-6">
            <label className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
              <FileText className="h-4 w-4" />
              Job Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
              rows={6}
              className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-3 text-white focus:border-blue-500 focus:outline-none resize-none"
              placeholder="Describe your role, responsibilities, and achievements..."
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => router.push("/admin/experiences")}
              className="flex-1 rounded-lg border border-neutral-700 bg-neutral-800 px-6 py-3 text-white transition hover:bg-neutral-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-lg bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? "Saving..." : isNew ? "Create Experience" : "Update Experience"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
