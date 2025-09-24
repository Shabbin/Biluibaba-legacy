"use client";

import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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

import axios from "@/lib/axios";

import { UploadSchema } from "@/schema/UploadSchema";

import { Loader2 } from "lucide-react";

export default function FeaturedProduct() {
  const [open, setIsOpen] = useState<boolean>(false);
  const [alertOpen, setAlertOpen] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [popularCategory, setPopularCategory] = useState<any[]>([]);

  const newFeaturedCategorySchema = useForm<z.infer<typeof UploadSchema>>({
    resolver: zodResolver(UploadSchema),
    defaultValues: {
      name: "",
      value: "",
      image: "",
    },
  });

  const fetchFeaturedCategory = async () => {
    try {
      const { data } = await axios.get("/api/admin/site-settings");

      if (data.success && data.site.popular_product_category.length > 0)
        setPopularCategory(data.site.popular_product_category);
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

  const onSubmit = async (form: z.infer<typeof UploadSchema>) => {
    setLoading(true);
    try {
      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("value", form.value);
      formData.append("category", form.image);

      const { data } = await axios.post(
        "/api/admin/site-settings/popular-category",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data.success) {
        toast({
          title: "Category uploaded successfully",
          description: "The category has been uploaded successfully",
        });

        return window.location.reload();
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Server Error",
        description: "Something went wrong! Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsOpen(false);
      setLoading(false);
    }
  };

  return <div></div>;
}
