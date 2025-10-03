"use client";

import { useState } from "react";

interface ImageUploadProps {
  onUploadComplete: (url: string) => void;
  currentImage?: string;
}

export default function ImageUpload({
  onUploadComplete,
  currentImage,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to Cloudinary
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.url) {
        onUploadComplete(data.url);
      } else {
        alert("Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        {preview && (
          <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-neutral-700">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="flex-1">
          <label className="block">
            <input
              type="file"
              accept="image/*"
              onChange={handleUpload}
              disabled={uploading}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className={`inline-block px-6 py-3 rounded-lg font-semibold cursor-pointer transition font-geist ${
                uploading
                  ? "bg-neutral-700 text-neutral-400 cursor-not-allowed"
                  : "bg-white text-black hover:bg-neutral-100"
              }`}
            >
              {uploading ? "Uploading..." : "Choose Image"}
            </label>
          </label>
          <p className="text-neutral-400 text-sm mt-2 font-geist">
            Recommended: 1200x630px, Max 5MB
          </p>
        </div>
      </div>
    </div>
  );
}
