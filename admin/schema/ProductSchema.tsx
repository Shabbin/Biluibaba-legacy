import { z } from "zod";

const isFileDefined = typeof File !== "undefined";

const imageSchema = isFileDefined
  ? z.union([
      z
        .instanceof(File)
        .refine(
          (file) =>
            ["image/jpeg", "image/png", "image/jpg"].includes(file.type),
          {
            message: "Only JPEG, JPG, or PNG files are allowed",
          }
        )
        .refine((file) => file.size <= 5 * 1024 * 1024, {
          message: "File size must be less than 5 MB",
        }),
      z.string().url({ message: "Image must be a valid URL" }),
    ])
  : z.string().url({ message: "Image must be a valid URL" });

export const ProductSchema = z.object({
  name: z.string().min(5, { message: "This field has to be filled." }),
  categories: z
    .array(z.string())
    .min(1, { message: "At least one category is required." })
    .max(3, { message: "A maximum of 3 categories are allowed." }),
  price: z
    .number({
      required_error: "Price is required",
      invalid_type_error: "Price must be a number",
    })
    .positive({ message: "Price should be positive" }),
  sale: z
    .number({
      required_error: "If there is no ongoing sale, please provide 0.",
      invalid_type_error: "Sale percentage should be a number",
    })
    .positive({ message: "Sale percentage should be positive" })
    .lte(100, { message: "Sale percentage should be less than 100" })
    .gte(0, { message: "Sale percentage should be positive" }),
  // images: z.array(
  //   z
  //     .custom<File>((value) => value instanceof File, {
  //       message: "Each item must be a file",
  //     })
  //     .refine(
  //       (file) => ["image/jpeg", "image/png", "image/jpg"].includes(file.type),
  //       {
  //         message: "Only image files are allowed",
  //       }
  //     )
  //     .refine((file) => file.size <= 5 * 1024 * 1024, {
  //       message: "File size must be less than 5 MB",
  //     })
  // ),
  images: z
    .array(imageSchema)
    .min(1, { message: "At least one product image is required" }),
  size: z
    .array(z.string().min(1, { message: "This field has to be filled." }))
    .min(1, { message: "At least one size is required" }),
  description: z
    .string()
    .min(100, { message: "This field has to be minimum of 100 characters" }),
  featured: z.string({
    required_error: "Please mention if this project will be featured or not",
    invalid_type_error: "Featured must be a type of boolean.",
  }),
  weight: z
    .number({
      required_error: "Weight is required",
      invalid_type_error: "Weight must be a number",
    })
    .positive({ message: "Weight should be positive" }),
  length: z
    .number({
      required_error: "Length is required",
      invalid_type_error: "Length must be a number",
    })
    .positive({ message: "Length should be positive" }),
  width: z
    .number({
      required_error: "Width is required",
      invalid_type_error: "Width must be a number",
    })
    .positive({ message: "Width should be positive" }),
  height: z
    .number({
      required_error: "Height is required",
      invalid_type_error: "Height must be a number",
    })
    .positive({ message: "Height should be positive" }),
  tags: z.array(z.string()).optional(),
});
