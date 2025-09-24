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

const AdoptionSchema = z.object({
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

  const newAdoptionBannerForm = useForm<z.infer<typeof AdoptionSchema>>({
    resolver: zodResolver(AdoptionSchema),
    defaultValues: {
      image: "",
    },
  });

  const fetchAdoptionBanner = async () => {
    try {
      const { data } = await axios.get("/api/admin/site-settings");

      if (data.success) setImage(data.site.adoption_landing_banner);
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

  const onAdoptionBannerOneSubmit = async (
    form: z.infer<typeof AdoptionSchema>
  ) => {
    setLoading(true);
    try {
      const formData = new FormData();

      formData.append("banner", form.image);

      // const { data } = await axios.post('/api/admin/site-settings/adoption-landing-banner', formData, {)
    } catch (error) {}
  };

  useEffect(() => {
    setLoading(true);
    fetchAdoptionBanner();
  }, []);
}
