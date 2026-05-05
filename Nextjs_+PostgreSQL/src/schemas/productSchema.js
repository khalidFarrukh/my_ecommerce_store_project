import { z } from "zod";

const OptionSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Option name is required"),
  value: z.string().min(1, "Option value is required"),
});

const ImageSchema = z.object({
  id: z.string(),
  src: z.url("Invalid image URL"),
  alt: z.string().min(1, "Alt text is required").optional(),
});

const VariantSchema = z.object({
  id: z.string(),

  options: z.array(OptionSchema)
    .min(1, "At least one option is required"),

  price: z.number({
    invalid_type_error: "Price must be a number",
  }).nonnegative("Price cannot be negative"),

  discount: z.number()
    .min(0, "Discount cannot be less than 0")
    .max(100, "Discount cannot exceed 100"),

  stock: z.number()
    .int("Stock must be an integer")
    .nonnegative("Stock cannot be negative"),

  default: z.boolean(),

  images: z.array(ImageSchema)
    .min(1, "At least one image is required"),
});

const InfoSchema = z.object({
  material: z.string()
    .min(1, "Material is required"),

  weight: z.string()
    .min(1, "Weight is required")
    .regex(/^(?:\d+(\.\d+)?\s?kg|\d+\s?g)$/i, "Invalid weight format"),

  country_of_origin: z.string()
    .min(1, "Country of origin is required"),

  dimensions: z.string()
    .min(1, "Dimensions are required")
    .regex(/^\d+x\d+x\d+$/i, "Format must be LxWxH (e.g. 10x5x7)"),

  type: z.string()
    .min(1, "Type is required"),
});

export const BaseProductSchema = z.object({
  name: z.string()
    .min(3, "Product name must be at least 3 characters"),

  description: z.string()
    .min(10, "Description must be at least 10 characters"),

  variants: z.array(VariantSchema)
    .min(1, "At least one variant is required"),

  info: InfoSchema,

  category: z.string()
    .min(1, "Category is required"),

  status: z.enum(["draft", "active", "archive"]),
});

export const StrictProductSchema = BaseProductSchema.superRefine((data, ctx) => {

  // ❗ must have default variant
  const hasDefault = data.variants.some(v => v.default);
  if (!hasDefault && data.variants.length > 0) {
    ctx.addIssue({
      path: ["variants"],
      message: "One variant must be marked as default",
      code: z.ZodIssueCode.custom,
    });
  }

  // ❗ validate each variant deeper
  data.variants.forEach((variant, i) => {

    if (variant.stock === 0) {
      ctx.addIssue({
        path: ["variants", i, "stock"],
        message: "Stock should not be zero",
        code: z.ZodIssueCode.custom,
      });
    }

  });
});