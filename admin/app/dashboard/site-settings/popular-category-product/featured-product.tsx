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

const FeaturedProductSchema = z.object({
  productId: z
    .string()
    .min(10, { message: "This field has to be 32 characters long." })
    .max(32, { message: "This field can't be longer than 32 characters" }),
});

export default function FeaturedProduct() {
  const [loading, setLoading] = useState<boolean>(false);

  const featuredProductForm = useForm<z.infer<typeof FeaturedProductSchema>>({
    resolver: zodResolver(FeaturedProductSchema),
    defaultValues: {
      productId: "",
    },
  });

  const fetchFeaturedProduct = async () => {
    try {
      const { data } = await axios.get(
        "/api/admin/site-settings"
      );

      console.log(data);

      if (data.success && data.id)
        featuredProductForm.reset({ productId: data.id });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (form: z.infer<typeof FeaturedProductSchema>) => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        "/api/admin/site-settings/featured-product",
        { productId: form.productId }
      );

      if (data.success)
        return toast({
          title: "Success",
          description: "Featured product updated successfully",
        });
    } catch (error) {
      console.error(error);
      toast({
        title: "Server Error",
        description: "Failed to update featured product",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchFeaturedProduct();
  }, []);

  return (
    <div className="py-5">
      <h2 className="text-4xl">Featured Product</h2>
      <p className="mt-3 text-lg">
        This is the featured product section. Provide the product id in the
        input box to showcase on site.
      </p>

      <Form {...featuredProductForm}>
        <form
          className="my-5 space-y-4"
          onSubmit={featuredProductForm.handleSubmit(onSubmit)}
        >
          <FormField
            control={featuredProductForm.control}
            name="productId"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="productId">Product ID</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    id="productId"
                    placeholder="Enter featured product id"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>

          <div className="flex flex-row justify-end-end py-3">
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="animate-spin" />} Update
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
