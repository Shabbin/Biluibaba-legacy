import React, { useState, useCallback, useEffect } from "react";
import { Upload, X, AlertCircle } from "lucide-react";
import { ImageGalleryAndPreview } from "@/components/image-gallery";

// Define the ImageFile and FileWithPreview types
import type { ImageFile, FileWithPreview } from "@/types/image";

interface FileUploadGalleryProps {
  limit?: number;
  initialImages?: ImageFile[];
  setFileState: React.Dispatch<React.SetStateAction<any[]>>;
}

export function FileUploadGallery({
  limit = Infinity,
  initialImages = [],
  setFileState,
}: FileUploadGalleryProps) {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initialFiles = initialImages.map((img) => {
      const file = new File([], img.name, {
        type: "image/*",
      }) as FileWithPreview;
      file.preview = img.url;
      return file;
    });
    setFiles(initialFiles);
  }, [JSON.stringify(initialImages)]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      handleFiles(selectedFiles);
    }
  };

  const handleFiles = useCallback(
    (newFiles: File[]) => {
      setError(null);
      const imageFiles = newFiles.filter((file) =>
        file.type.startsWith("image/")
      );

      if (files.length + imageFiles.length > limit) {
        setError(
          `You can only upload up to ${limit} image${limit === 1 ? "" : "s"}`
        );
        return;
      }

      const filesWithPreviews = imageFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      setFiles((prev) => [...prev, ...filesWithPreviews]);
    },
    [files.length, limit]
  );

  useEffect(() => {
    setFileState(files);
  }, [files]);

  const removeFile = useCallback(
    (fileToRemove: FileWithPreview) => {
      // Don't revoke URL for initial images
      if (!initialImages.some((img) => img.url === fileToRemove.preview)) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      setFiles((prev) => prev.filter((file) => file !== fileToRemove));
      setError(null);
    },
    [initialImages]
  );

  const remainingSlots = limit - files.length;

  return (
    <div className="max-w-full mx-auto py-6">
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {remainingSlots > 0 && (
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 transition-colors ${
            isDragging
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-gray-400"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            multiple={remainingSlots > 1}
            accept="image/*"
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />

          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Drag and drop images here
            </h3>
            <p className="mt-1 text-xs text-gray-500">
              Or click to select files
              {limit < Infinity && (
                <span className="block mt-1">
                  {remainingSlots} slot{remainingSlots === 1 ? "" : "s"}{" "}
                  remaining
                </span>
              )}
            </p>
          </div>
        </div>
      )}

      {files.length > 0 && (
        <div className="mt-8">
          <h4 className="text-lg font-medium text-gray-900 mb-4">
            Uploaded Images ({files.length}
            {limit < Infinity && ` of ${limit}`})
          </h4>
          <div className="relative">
            <ImageGalleryAndPreview
              galleryType="upload"
              images={files.map((file) => {
                return { path: file.preview };
              })}
            />
            {files.map((file, index) => (
              <button
                key={index}
                onClick={() => removeFile(file)}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-all transform translate-y-1 group-hover:translate-y-0 z-10"
                style={{
                  top: `${Math.floor(index / 4) * 100}%`,
                  right: `${(index % 4) * 25}%`,
                }}
              >
                <X className="h-4 w-4" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
