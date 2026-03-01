"use client";

import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import axios from "@/lib/axios";

import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Loader2 } from "lucide-react";

const ProductAdSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  button_text: z.string().min(1, "Button text is required"),
  button_link: z.string().min(1, "Button link is required"),
  image: z
    .union([z.instanceof(File), z.string()])
    .optional(),
});

type ProductAdFormValues = z.infer<typeof ProductAdSchema>;

export default function Page() {
  const [loading, setLoading] = useState<boolean>(false);
  const [currentImage, setCurrentImage] = useState<string>("");

  const form = useForm<ProductAdFormValues>({
    resolver: zodResolver(ProductAdSchema),
    defaultValues: {
      title: "",
      description: "",
      button_text: "",
      button_link: "",
      image: "",
    },
  });

  const fetchProductAd = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/admin/site-settings");

      if (data.success && data.site?.product_ad) {
        const ad = data.site.product_ad;
        form.reset({
          title: ad.title ?? "",
          description: ad.description ?? "",
          button_text: ad.button_text ?? "",
          button_link: ad.button_link ?? "",
          image: "",
        });
        setCurrentImage(ad.image?.path ?? "");
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

  const onSubmit = async (values: ProductAdFormValues) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("button_text", values.button_text);
      formData.append("button_link", values.button_link);

      if (values.image instanceof File) {
        formData.append("image", values.image);
      }

      const { data } = await axios.post(
        "/api/admin/site-settings/product-ad",
        formData
      );

      if (data.success) {
        toast({
          title: "Success",
          description: "Product ad updated successfully.",
        });
        if (data.site?.product_ad?.image?.path) {
          setCurrentImage(data.site.product_ad.image.path);
        }
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Server Error",
        description: "Failed to update product ad.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductAd();
  }, []);

  return (
    <div className="py-5 max-w-2xl">
      <h2 className="text-4xl font-bold">Homepage Product Ad</h2>
      <p className="mt-3 text-muted-foreground text-lg">
        Customize the promotional ad block that appears on the homepage between
        Featured Products and the Best Sellers sections.
      </p>

      {currentImage && (
        <div className="my-6 rounded-xl overflow-hidden border max-w-sm">
          <p className="text-sm text-muted-foreground px-3 pt-3">Current Image</p>
          <img src={currentImage} alt="Current ad" className="w-full object-cover" />
        </div>
      )}

      <Form {...form}>
        <form
          className="space-y-5 my-6"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Treat Them Right" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Short description shown on the ad"
                    rows={3}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="button_text"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Button Text</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Shop Now" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="button_link"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Button Link</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. /products" {...field} />
                </FormControl>
                <FormDescription>
                  Path or full URL the button should link to.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ad Image (optional)</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      field.onChange(file ?? "");
                    }}
                  />
                </FormControl>
                <FormDescription>
                  Displayed on the left panel of the ad. Leave blank to keep
                  the existing image or use the default background colour.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end pt-2">
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="animate-spin mr-2" />} Save
              Changes
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
