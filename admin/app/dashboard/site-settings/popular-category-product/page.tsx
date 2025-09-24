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
import {
  Table,
  TableCaption,
  TableHeader,
  TableHead,
  TableCell,
  TableBody,
  TableRow,
} from "@/components/ui/table";
import { SheetUpload } from "@/components/upload-sheet";
import { AlertDialogBox } from "@/components/alert-dialog";

import { UploadSchema } from "@/schema/UploadSchema";

import { Loader2 } from "lucide-react";

import FeaturedProduct from "@/app/dashboard/site-settings/popular-category-product/featured-product";

export default function Page() {
  const [open, setIsOpen] = useState<boolean>(false);
  const [alertOpen, setAlertOpen] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [popularCategory, setPopularCategory] = useState<any[]>([]);

  const newCategoryUploadForm = useForm<z.infer<typeof UploadSchema>>({
    resolver: zodResolver(UploadSchema),
    defaultValues: {
      name: "",
      value: "",
      image: "",
    },
  });

  const fetchPopularCategory = async () => {
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

  const deleteCategory = async (id: string | null) => {
    if (id === null) return;
    try {
      const { data } = await axios.delete(
        `/api/admin/site-settings/popular-category/${id}`
      );

      if (data.success) {
        toast({
          title: "Category deleted successfully",
          description: "The category has been deleted successfully",
        });

        return fetchPopularCategory();
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
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchPopularCategory();
  }, []);

  return (
    <div className="py-5">
      <div className="flex flex-row items-center justify-between">
        <h2 className="text-4xl">Popular Category</h2>
        <Button onClick={() => setIsOpen(true)}>Upload New Category</Button>
      </div>
      <p className="mt-3 text-lg">
        This is the popular category section of the main site.
      </p>

      {popularCategory?.length > 0 && (
        <Table className="my-5">
          <TableCaption>Popular Categories</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Link</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {popularCategory.map((category) => (
              <TableRow key={category._id}>
                <TableCell>
                  <img
                    src={category.image}
                    alt={category.category}
                    className="w-10 h-10 object-cover rounded-full"
                  />
                </TableCell>
                <TableCell>{category.category}</TableCell>
                <TableCell>{category.categorySlug}</TableCell>
                <TableCell>
                  <Button
                    onClick={() => {
                      setAlertOpen(true);
                      setSelectedCategory(category._id);
                    }}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <SheetUpload
        open={open}
        setIsOpen={setIsOpen}
        title="Upload new popular category"
      >
        <Form {...newCategoryUploadForm}>
          <form
            className="space-y-4 my-5"
            onSubmit={newCategoryUploadForm.handleSubmit(onSubmit)}
          >
            <FormField
              control={newCategoryUploadForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id="name"
                      placeholder="Enter category name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={newCategoryUploadForm.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Link</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id="value"
                      placeholder="Enter category link"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={newCategoryUploadForm.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Image</FormLabel>
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
                {loading && <Loader2 className="animate-spin" />} Upload
              </Button>
            </div>
          </form>
        </Form>
      </SheetUpload>

      <FeaturedProduct />

      <AlertDialogBox
        open={alertOpen}
        onOpenChange={setAlertOpen}
        title="Confirm Deletion"
        description="Are you sure you want to delete this category?"
        onConfirm={(e) => {
          e.preventDefault();
          deleteCategory(selectedCategory);
        }}
      />
    </div>
  );
}
