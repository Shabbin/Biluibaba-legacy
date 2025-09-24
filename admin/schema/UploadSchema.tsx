import { z } from "zod";

const isFileDefined = typeof File !== "undefined";

const imageSchema = isFileDefined
  ? z.union([
      z.instanceof(File, { message: "Invalid file format" }),
      z.string().url({ message: "Invalid image URL" }),
    ])
  : z.string().url({ message: "Invalid image URL" });

export const UploadSchema = z.object({
  name: z.string().min(2, { message: "This field has to be filled." }),
  value: z.string().min(1, { message: "This field has to be filled." }),
  image: imageSchema.refine(
    (value) => {
      if (typeof value === "string") {
        return value.length > 0;
      }
      return isFileDefined && value instanceof File;
    },
    { message: "At least one image is required" }
  ),
});
