import React, { useState } from "react";
import { Maximize2, X } from "lucide-react";

import type { FileWithPreview } from "@/types/image";

// Image File Type from backend
interface ImageFile {
  filename?: string;
  path: string;
  _id?: string;
}

// Gallery Type = "view" | "upload"
// If it is "upload", then the images are displayed in a gallery grid
// If it is "view", then the images are displayed in a gallery grid with remove buttons
interface ImageGalleryAndPreviewProps {
  images: ImageFile[];
  className?: string;
  galleryType: "view" | "upload";
  onRemove?: (image: string | null) => void;
}

export function ImageGalleryAndPreview({
  images,
  className = "",
  galleryType,
  onRemove,
}: ImageGalleryAndPreviewProps) {
  console.log(images);

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const openPreview = (image: string) => setPreviewImage(image);
  const closePreview = () => setPreviewImage(null);

  return (
    <>
      {/* Gallery Grid */}
      <div
        className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ${className}`}
      >
        {images.map((image, index) => (
          <div
            key={index}
            className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100"
          >
            <img
              src={image.path}
              alt={`Image ${index + 1}`}
              className="w-full h-full object-cover cursor-pointer transition-transform group-hover:scale-105"
              onClick={() => openPreview(image.path)}
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity" />
            <button
              onClick={() => openPreview(image.path)}
              className="absolute top-2 left-2 p-1.5 rounded-full bg-gray-800 text-white opacity-0 group-hover:opacity-100 transition-all transform translate-y-1 group-hover:translate-y-0"
            >
              <Maximize2 className="h-4 w-4" />
            </button>

            {galleryType === "view" && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove?.(image.filename || null);
                }}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-all transform translate-y-1 group-hover:translate-y-0"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={closePreview}
        >
          <div className="relative max-w-7xl max-h-[90vh] mx-4">
            <button
              onClick={closePreview}
              className="absolute -top-12 right-0 p-2 text-white hover:text-gray-300 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
            <img
              src={previewImage}
              alt="Preview"
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </>
  );
}
