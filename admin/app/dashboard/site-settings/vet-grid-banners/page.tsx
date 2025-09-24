"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageGalleryAndPreview } from "@/components/image-gallery";
import { FileUploadGallery } from "@/components/file-upload-gallery";
import { AlertDialogBox } from "@/components/alert-dialog";

import { Loader2, X } from "lucide-react";

import axios from "@/lib/axios";

export default function Page() {
  const [loading, setLoading] = useState<boolean>(true);
  const [vetBannerOne, setVetBannerOne] = useState<File | string>("");
  const [vetBannerOnePreview, setVetBannerOnePreview] = useState<string | null>(
    ""
  );
  const [images, setImages] = useState<any[]>([]);
  const [files, setFiles] = useState<any[]>([]);

  const [alertOpen, setAlertOpen] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const fetchVetGridBanners = async () => {
    try {
      const { data } = await axios.get("/api/admin/site-settings");

      if (data.success) {
        setVetBannerOnePreview(data.site.vet_banner_one.path);
        setImages(data.site.vet_grid_banners);
      }
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
        `/api/admin/site-settings/vet-grid-banners/${image}`
      );

      if (data.success) {
        toast({
          title: "Image deleted successfully",
          description: "The image has been deleted successfully",
        });

        return setImages(data.site.vet_grid_banners);
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

  const onVetBannerOneSubmit = async () => {
    setLoading(true);
    try {
      if (vetBannerOne === "" || null)
        return toast({
          title: "No image uploaded",
          description: "Please upload an image",
          variant: "destructive",
        });

      const formData = new FormData();

      formData.append("banner", vetBannerOne);

      const { data } = await axios.post(
        "/api/admin/site-settings/vet-banner-one",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data.success) {
        toast({
          title: "Image uploaded successfully",
          description: "The image has been uploaded successfully",
        });

        return setVetBannerOnePreview(data.site.vet_banner_one.path);
      }
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

  const onVetGridBannerSubmit = async () => {
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
        formData.append("banner", file);
      });

      const { data } = await axios.post(
        `/api/admin/site-settings/vet-grid-banners`,
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
        return fetchVetGridBanners();
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
    fetchVetGridBanners();
  }, []);

  return (
    <div className="py-5">
      <h2 className="text-3xl">Vet Landing Banner One</h2>
      <p className="mt-3 text-lg">
        This is the first banner that comes up after expert vets
      </p>

      {vetBannerOnePreview && typeof vetBannerOnePreview === "string" && (
        <img src={vetBannerOnePreview} alt="Vet Banner One" className="mt-5" />
      )}

      <div className="mt-5 space-y-4">
        <h3 className="text-xl">Upload Image</h3>
        <Input
          type="file"
          accept="image/*"
          onChange={(event) => setVetBannerOne(event.target.files?.[0] || "")}
        />

        <div className="flex justify-end">
          <Button disabled={loading} onClick={() => onVetBannerOneSubmit()}>
            {loading && <Loader2 className="animate-spin" />}
            Save Changes
          </Button>
        </div>
      </div>

      <h2 className="text-3xl mt-5">Vet Grid Banners</h2>
      <p className="mt-3 text-lg">
        This is the grid vet banners that comes after the main banner
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

      {images.length === 3 ? (
        <h2 className="text-lg font-light text-red-600">
          Maximum number of images uploaded for slider. Please remove some
          images to add new ones.
        </h2>
      ) : (
        <>
          <FileUploadGallery limit={3} setFileState={setFiles} />

          <div className="flex flex-row justify-end">
            <Button onClick={() => onVetGridBannerSubmit()} disabled={loading}>
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
