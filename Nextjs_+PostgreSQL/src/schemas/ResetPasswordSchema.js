import { z } from "zod";

// 🔐 Zod schema (with cross-field validation)
export const resetPasswordSchema = z
  .object({
    token: z.string().min(10, "Invalid token"),
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm password is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // attaches error to confirmPassword field
  });