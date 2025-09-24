"use client";

import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { X, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import { FileUploadGallery } from "@/components/file-upload-gallery";
import { ImageGalleryAndPreview } from "@/components/image-gallery";
import { AlertDialogBox } from "@/components/alert-dialog";

import axios from "@/lib/axios";

export default function Page() {
  const [loading, setLoading] = useState<boolean>(true);
  const [images, setImages] = useState<any[]>([]);
  const [files, setFiles] = useState<any[]>([]);

  //Alert dialog state
  const [alertOpen, setAlertOpen] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Fetch images
  const fetchImages = async () => {
    try {
      const { data } = await axios.get("/api/admin/site-settings");

      if (data.success && data.site.vet_landing_slider.length > 0)
        setImages(data.site.vet_landing_slider);
    } catch (error) {
      console.error(error);
      toast({
        title: "Server Error",
        description: "Something went wrong! Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Remove image with filename
  const removeImage = async (image: string | null) => {
    if (image === null) return;
    setLoading(true);
    try {
      const { data } = await axios.delete(
        `/api/admin/site-settings/vet-landing-slider/${image}`
      );

      if (data.success) {
        toast({
          title: "Image deleted successfully",
          description: "The image has been deleted successfully",
        });

        return setImages(data.site.vet_landing_slider);
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Server Error",
        description: "Something went wrong! Please try again.",
        variant: "destructive",
      });
    } finally {
      setAlertOpen(false);
      setLoading(false);
    }
  };

  const onSubmit = async () => {
    setLoading(true);
    try {
      if (files.length === 0)
        return toast({
          title: "No images uploaded",
          description: "Please upload some images",
          variant: "destructive",
        });

      const formData = new FormData();

      Array.from(files).forEach((file) => {
        formData.append("slider", file);
      });

      const { data } = await axios.post(
        `/api/admin/site-settings/vet-landing-slider`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data.success) {
        toast({
          title: "Images uploaded successfully",
          description: "The images have been uploaded successfully",
        });
        setFiles([]);
        return fetchImages();
      } else
        return toast({
          title: "Error",
          description: "Something went wrong! Please try again.",
          variant: "destructive",
        });
    } catch (error) {
      console.error(error);
      toast({
        title: "Server Error",
        description: "Something went wrong! Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchImages();
  }, []);

  return (
    <div className="py-5">
      <h2 className="text-3xl">Vet Landing Slider</h2>
      <p className="mt-3 text-lg">
        This is the image slider for vet which comes up when the site first
        loads.
      </p>

      {images.length > 0 && (
        <div className="py-10">
          <h2 className="text-3xl">Uploaded Images</h2>
          <h4 className="text-lg font-medium text-gray-900 mb-4">
            Total Sliders:{" "}
            <span
              className={
                "font-bold " + (images.length === 10 && "text-red-600")
              }
            >
              {images.length}
            </span>
          </h4>
          <div className="relative">
            <ImageGalleryAndPreview
              galleryType="view"
              onRemove={(image: string | null) => {
                setAlertOpen(true);
                setSelectedImage(image);
              }}
              images={images}
            />
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => removeImage(image)}
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

      <div className="py-5">
        <h2 className="text-2xl">
          Drop or select images and hit on save to update the slider
        </h2>
        <div className="text-sm font-bold text-gray-500">
          Note: Keep the image sizes same so it doesn't break on the main site
        </div>
      </div>

      {images.length === 10 ? (
        <h2 className="text-lg font-light text-red-600">
          Maximum number of images uploaded for slider. Please remove some
          images to add new ones.
        </h2>
      ) : (
        <>
          <FileUploadGallery limit={10} setFileState={setFiles} />

          <div className="flex flex-row justify-end">
            <Button onClick={() => onSubmit()} disabled={loading}>
              {loading && <Loader2 className="animate-spin" />}
              Save Changes
            </Button>
          </div>
        </>
      )}

      {/* Alert Dialog Box for removing images */}
      <AlertDialogBox
        open={alertOpen}
        onOpenChange={setAlertOpen}
        title="Confirm Deletion"
        description="Are you sure you want to delete this image?"
        onConfirm={(e) => {
          e.preventDefault();
          removeImage(selectedImage);
        }}
      />
    </div>
  );
}
