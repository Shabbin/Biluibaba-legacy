"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";

import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Tiptap from "@/components/tiptap";
import TagInput from "@/components/tag-input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { AlertDialogBox } from "@/components/alert-dialog";

import { ProductSchema } from "@/schema/ProductSchema";

import { productCategories } from "@/app/_components/products/categories";

import axios from "@/lib/axios";

import { Loader2, X } from "lucide-react";

export default function Page({ product }: { product?: any }) {
  const [loading, setLoading] = useState<boolean>(false);
  const [updateLoading, setUpdateLoading] = useState<boolean>(false);

  const newProductForm = useForm<z.infer<typeof ProductSchema>>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      name: product?.name || "",
      categories: product?.categories.map((c: any) => ({
        parent: c.parent,
        category: c.category,
        sub: c.sub,
      })) || [{ parent: "", category: "", sub: "" }],
      images: [{ file: null }],
      description: product?.description || "",
      price: product?.price.toString() || "",
      discount: product?.discount.toString() || "",
      quantity: product?.quantity.toString() || "",
      size: product?.size.toString() || "",
      tags: product?.tags || [],
    },
  });

  const {images: newProductImages} = newProductForm.watch()

  const category = useFieldArray({
    control: newProductForm.control,
    name: "categories",
  });
  const images = useFieldArray({
    control: newProductForm.control,
    name: "images",
  });

  async function onSubmit(form: z.infer<typeof ProductSchema>) {
    setLoading(true);
    const formData = new FormData();

    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("price", form.price.toString());
    formData.append("size", form.size.toString());
    formData.append("discount", form.discount.toString());
    formData.append("quantity", form.quantity.toString());

    form.categories.forEach((category, index) => {
      formData.append(`categories[${index}][parent]`, category.parent);
      formData.append(`categories[${index}][category]`, category.category);
      formData.append(`categories[${index}][sub]`, category.sub);
    });

    form.tags?.forEach((tag, index) => {
      formData.append(`tags[${index}]`, tag);
    });

    form.images.forEach((image, index) => {
      if (image.file) formData.append("images", image.file);
    });

    try {
      let { data } = await axios.post("/api/product/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (data.success) {
        toast({
          title: "Success",
          description: "Product uploaded successfully",
        });

        return window.location.reload();
      } else {
        toast({
          title: "Error",
          description: "Failed to upload product.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again!",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  async function onUpdate(form: z.infer<typeof ProductSchema>) {
    setUpdateLoading(true);

    try {
      const { data } = await axios.post("/api/product/update", {
        productId: product.productId,
        name: form.name,
        description: form.description,
        price: form.price.toString(),
        size: form.size.toString(),
        discount: form.discount.toString(),
        quantity: form.quantity.toString(),
        categories: form.categories,
        tags: form.tags,
      });

      if (data.success) {
        toast({
          title: "Success",
          description: "Product updated successfully",
        });

        return window.location.reload();
      } else {
        toast({
          title: "Error",
          description: "Failed to update product",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again!",
        variant: "destructive",
      });
    } finally {
      setUpdateLoading(false);
    }
  }

  return (
    <div className="p-6">
      {!product?.name ? (
        <div className="flex items-center gap-2 mb-6">
          <div className="h-7 w-1 rounded-full bg-[#FF8A80]" />
          <h2 className="text-xl font-semibold">Upload New Product</h2>
        </div>
      ) : null}
      <Form {...newProductForm}>
        <form
          className="space-y-6"
          onSubmit={newProductForm.handleSubmit(onSubmit)}
        >
          <FormField
            control={newProductForm.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name</FormLabel>
                <FormControl>
                  <Input
                    id="name"
                    placeholder="Enter product name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4">
            <FormLabel>Product Categories</FormLabel>
            <div className="space-y-4">
              {category.fields.map((field, index) => (
                <div key={field.id} className="flex items-end gap-3 p-4 rounded-xl bg-muted/30 border border-border/40">
                  <div className="w-full">
                    <FormItem>
                      <FormLabel>Parent Category</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={async (value) => {
                            newProductForm.setValue(
                              `categories.${index}.parent`,
                              value
                            );
                            await newProductForm.trigger(`categories.${index}`);
                          }}
                          defaultValue={product?.categories[index]?.parent}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Parent Category" />
                          </SelectTrigger>
                          <SelectContent>
                            {productCategories.map((parent) => (
                              <SelectItem key={parent.slug} value={parent.slug}>
                                {parent.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage>
                        {
                          newProductForm.formState.errors.categories?.[index]
                            ?.parent?.message
                        }
                      </FormMessage>
                    </FormItem>
                  </div>

                  <div className="w-full">
                    <FormItem>
                      <FormLabel>Product Type</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={async (value) => {
                            newProductForm.setValue(
                              `categories.${index}.category`,
                              value
                            );
                            await newProductForm.trigger(`categories.${index}`);
                          }}
                          defaultValue={product?.categories[index]?.category}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Type" />
                          </SelectTrigger>
                          <SelectContent>
                            {productCategories
                              .find(
                                (cat) =>
                                  cat.slug ===
                                  newProductForm.getValues(
                                    `categories.${index}.parent`
                                  )
                              )
                              ?.categories.map((c) => (
                                <SelectItem key={c.slug} value={c.slug}>
                                  {c.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage>
                        {
                          newProductForm.formState.errors.categories?.[index]
                            ?.category?.message
                        }
                      </FormMessage>
                    </FormItem>
                  </div>

                  <div className="w-full">
                    <FormItem>
                      <FormLabel>Sub Category</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={async (value) => {
                            newProductForm.setValue(
                              `categories.${index}.sub`,
                              value
                            );
                            await newProductForm.trigger(`categories.${index}`);
                          }}
                          defaultValue={product?.categories[index]?.sub}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select sub category" />
                          </SelectTrigger>
                          <SelectContent>
                            {productCategories
                              .find(
                                (cat) =>
                                  cat.slug ===
                                  newProductForm.getValues(
                                    `categories.${index}.parent`
                                  )
                              )
                              ?.categories.find(
                                (c) =>
                                  c.slug ===
                                  newProductForm.getValues(
                                    `categories.${index}.category`
                                  )
                              )
                              ?.items.map((item) => (
                                <SelectItem key={item.slug} value={item.slug}>
                                  {item.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage>
                        {
                          newProductForm.formState.errors.categories?.[index]
                            ?.sub?.message
                        }
                      </FormMessage>
                    </FormItem>
                  </div>

                  <Button
                    variant="destructive"
                    onClick={() => category.remove(index)}
                    type="button"
                    disabled={category.fields.length === 1}
                  >
                    Remove
                  </Button>
                </div>
              ))}

              {category.fields.length < 4 && (
                <Button
                  onClick={() =>
                    category.append({ parent: "", category: "", sub: "" })
                  }
                  type="button"
                >
                  Add Category
                </Button>
              )}
            </div>
          </div>

          <FormField
            control={newProductForm.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Price</FormLabel>
                <FormControl>
                  <Input
                    id="price"
                    placeholder="Enter product price"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={newProductForm.control}
            name="size"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Size (in grams)</FormLabel>
                <FormControl>
                  <Input
                    id="size"
                    placeholder="Enter product size"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={newProductForm.control}
            name="discount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Discount (if any)</FormLabel>
                <FormControl>
                  <Input
                    id="discount"
                    placeholder="Enter product discount"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={newProductForm.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Quantity</FormLabel>
                <FormControl>
                  <Input
                    id="quantity"
                    placeholder="Enter product quantity"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4">
            <FormLabel>Product Images</FormLabel>
            {product?.images ? (  
              <div className="flex flex-wrap gap-3 my-2">
                {product.images.map((image: any) => (
                  <div key={image.id} className="relative group">
                    <img
                      src={image.path}
                      alt={image.alt}
                      className="w-20 h-20 object-cover rounded-xl ring-1 ring-border/60"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {newProductImages&&newProductImages?.length > 0 && (
                  <div className="flex flex-wrap gap-3 my-2">
                    {newProductImages.map((image, index) => (
                      image.file && (
                        <div key={index} className="relative group">
                          <img
                            src={URL.createObjectURL(image.file)}
                            alt={`Preview ${index + 1}`}
                            className="w-32 h-20 object-cover rounded-md ring-1 ring-border/60"
                          />
                        </div>
                      )
                    ))}
                  </div>
                )}
                {images.fields.map((field, index) => (
                  <div key={field.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border/40">
                    <FormItem className="w-full">
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/jpeg, image/png, image/jpg"
                          onChange={(e) => {
                            newProductForm.setValue(
                              `images.${index}.file`,
                              e.target.files?.[0] || null
                            );
                          }}
                        />
                      </FormControl>
                      <FormMessage>
                        {newProductForm.formState.errors.images?.[index]?.file
                          ?.message ||
                          newProductForm.formState.errors.images?.[index]
                            ?.message}
                      </FormMessage>
                    </FormItem>

                    <Button
                      variant="destructive"
                      type="button"
                      disabled={images.fields.length === 1}
                      onClick={() => images.remove(index)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                {images.fields.length < 4 && (
                  <Button
                    type="button"
                    onClick={() => images.append({ file: null })}
                  >
                    Add More Image
                  </Button>
                )}
              </div>
            )}
          </div>

          <FormField
            control={newProductForm.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product description</FormLabel>
                <FormControl>
                  <Tiptap
                    description={field.value}
                    onChange={field.onChange}
                    placeholder="Enter product description here"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={newProductForm.control}
            name="tags"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Product tags</FormLabel>
                <FormControl>
                  <TagInput value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end pt-6 border-t border-border/60">
            {product?.name !== "" ? (
              <Button
                disabled={updateLoading}
                onClick={() => onUpdate(newProductForm.getValues())}
                size="lg"
              >
                {updateLoading && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
                Update Product
              </Button>
            ) : (
              <Button type="submit" disabled={loading} size="lg">
                {loading && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
                Upload Product
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
