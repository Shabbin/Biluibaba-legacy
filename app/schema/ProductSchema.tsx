import { z } from "zod";

export const ProductSchema = z.object({
  name: z.string().min(5, { message: "This field has to be filled." }),
  categories: z.array(
    z.object({
      parent: z.string().min(1, { message: "Parent category is required" }),
      category: z.string().min(1, { message: "Product type is required" }),
      sub: z.string().min(1, { message: "Product category is required" }),
    })
  ),
  price: z
    .string()
    .min(1, { message: "Price must be greater than 0" })
    .refine((val) => !Number.isNaN(parseInt(val, 10)), {
      message: "Expected number, received a string",
    }),
  size: z
    .string()
    .min(1, { message: "Size must be greater than 0" })
    .refine((val) => !Number.isNaN(parseInt(val, 10)), {
      message: "Expected number, received a string",
    }),
  discount: z
    .string()
    .min(0, { message: "Discount must be greater than 0" })
    .optional()
    .refine((val) => !val || !Number.isNaN(parseInt(val, 10)), {
      message: "Expected number, received a string",
    }),
  quantity: z
    .string()
    .min(1, { message: "Quantity must be greater than 0" })
    .refine((val) => !Number.isNaN(parseInt(val, 10)), {
      message: "Expected number, received a string",
    }),
  images: z
    .array(
      z.object({
        file: z
          .custom<File>((value) => value instanceof File, {
            message: "Each item must be a file",
          })
          .refine(
            (file) =>
              ["image/jpeg", "image/png", "image/jpg"].includes(file.type),
            {
              message: "Only image files are allowed",
            }
          )
          .refine((file) => file === null || file.size <= 5 * 1024 * 1024, {
            message: "File size must be less than 5 MB",
          })
          .nullable(),
      })
    )
    .min(1, { message: "At least one image is required" })
    .max(4, { message: "You can add up to 4 images" }),
  description: z
    .string()
    .min(100, { message: "This field has to be minimum of 100 characters" }),
  tags: z.array(z.string()).optional(),
});
