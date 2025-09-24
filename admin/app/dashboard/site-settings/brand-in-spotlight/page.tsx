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

export default function Page() {
  const [open, setIsOpen] = useState<boolean>(false);
  const [alertOpen, setAlertOpen] = useState<boolean>(false);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [brands, setBrands] = useState<any[]>([]);

  const newBrandUploadForm = useForm<z.infer<typeof UploadSchema>>({
    resolver: zodResolver(UploadSchema),
    defaultValues: {
      name: "",
      value: "",
      image: "",
    },
  });

  const fetchBrandInSpotlight = async () => {
    try {
      const { data } = await axios.get("/api/admin/site-settings");

      if (data.success && data.site.product_brands_in_spotlight.length > 0)
        setBrands(data.site.product_brands_in_spotlight);
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
      formData.append("slug", form.value);
      formData.append("brand", form.image);

      const { data } = await axios.post(
        "/api/admin/site-settings/brand-in-spotlight",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data.success) {
        toast({
          title: "Brand uploaded successfully",
          description: "The brand has been uploaded successfully",
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

  const deleteBrand = async (id: string | null) => {
    if (id === null) return;
    try {
      const { data } = await axios.delete(
        `/api/admin/site-settings/brand-in-spotlight/${id}`
      );

      if (data.success) {
        toast({
          title: "Brand deleted successfully",
          description: "The brand has been deleted successfully",
        });

        return fetchBrandInSpotlight();
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
    fetchBrandInSpotlight();
  }, []);

  return (
    <div className="py-5">
      <div className="flex flex-row items-center justify-between">
        <h2 className="text-4xl">Brand In Spotlight</h2>
        <Button onClick={() => setIsOpen(true)}>Upload New Brand</Button>
      </div>
      <p className="mt-3 text-lg">
        This is the brand in spotlight section of the main site.
      </p>

      {brands?.length > 0 && (
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
            {brands.map((brand) => (
              <TableRow key={brand._id}>
                <TableCell>
                  <img
                    src={brand.path}
                    alt={brand.name}
                    className="w-10 h-10 object-cover rounded-full"
                  />
                </TableCell>
                <TableCell>{brand.name}</TableCell>
                <TableCell>{brand.slug}</TableCell>
                <TableCell>
                  <Button
                    onClick={() => {
                      setAlertOpen(true);
                      setSelectedBrand(brand._id);
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
        title="Upload new brand in spotlight"
      >
        <Form {...newBrandUploadForm}>
          <form
            className="space-y-4 my-5"
            onSubmit={newBrandUploadForm.handleSubmit(onSubmit)}
          >
            <FormField
              control={newBrandUploadForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brand Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id="name"
                      placeholder="Enter brand name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={newBrandUploadForm.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brand Link</FormLabel>
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
              control={newBrandUploadForm.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brand Image</FormLabel>
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

            <div className="flex flex-row justify-end py-3">
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="animate-spin" />} Upload
              </Button>
            </div>
          </form>
        </Form>
      </SheetUpload>

      <AlertDialogBox
        open={alertOpen}
        onOpenChange={setAlertOpen}
        title="Confirm Deletion"
        description="Are you sure you want to delete this category?"
        onConfirm={(e) => {
          e.preventDefault();
          deleteBrand(selectedBrand);
        }}
      />
    </div>
  );
}
