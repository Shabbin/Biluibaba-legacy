"use client";

import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import axios from "@/lib/axios";

import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Loader2 } from "lucide-react";

const isFileDefined = typeof File !== "undefined";

const imageSchema = isFileDefined
  ? z.union([
      z.instanceof(File, { message: "Invalid file format" }),
      z.string().url({ message: "Invalid image URL" }),
    ])
  : z.string().url({ message: "Invalid image URL" });

const BannerSchema = z.object({
  image: imageSchema.refine(
    (value) => {
      if (typeof value === "string") {
        return value.length > 0; // Ensure non-empty URL
      }
      return isFileDefined && value instanceof File; // Avoid ReferenceError
    },
    { message: "At least one image is required" }
  ),
});

export default function Page() {
  const [loading, setLoading] = useState<boolean>(false);
  const [image, setImage] = useState<{ path: string; filename: string }>({
    path: "",
    filename: "",
  });

  const newProductBannerForm = useForm<z.infer<typeof BannerSchema>>({
    resolver: zodResolver(BannerSchema),
    defaultValues: {
      image: "",
    },
  });

  const fetchProductBanner = async () => {
    try {
      const { data } = await axios.get("/api/admin/site-settings");

      if (data.success) setImage(data.site.product_banner_one);
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

  const onSubmit = async (form: z.infer<typeof BannerSchema>) => {
    setLoading(true);
    try {
      const formData = new FormData();

      formData.append("banner", form.image);

      const { data } = await axios.post(
        "/api/admin/site-settings/product-banner-one",
        formData
      );

      if (data.success) {
        toast({
          title: "Success",
          description: "Product banner uploaded successfully",
        });

        fetchProductBanner();
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Server Error",
        description: "Failed to update product banner",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchProductBanner();
  }, []);

  return (
    <div className="py-5">
      <h2 className="text-4xl">Product Banner</h2>
      <p className="mt-3 text-lg">
        This is the banner just below the featured product
      </p>

      {image && <img src={image.path} />}

      <Form {...newProductBannerForm}>
        <form
          className="space-y-5 my-5"
          onSubmit={newProductBannerForm.handleSubmit(onSubmit)}
        >
          <FormField
            control={newProductBannerForm.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Banner Image</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    id="image"
                    multiple={false}
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      field.onChange(file || "");
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-row justify-end-end py-3">
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="animate-spin" />} Update
            </Button>
          </div>
        </form>
      </Form>

      <h2 className="text-4xl">Featured Product Category</h2>
      <p></p>
    </div>
  );
}
