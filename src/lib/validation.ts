import { z } from "zod"

export const LoginFormValidation = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(1, { message: "Please enter your password" })
    .min(8, { message: "Password must contain at least 8 characters(s)" }),
})

export const SignupFormValidation = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters")
    .regex(
      /^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/,
      "Username invalid, it should contain 8-20 alphanumeric letters and be unique!"
    ),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(1, { message: "Please enter your password" })
    .min(8, { message: "Password must contain at least 8 characters(s)" }),
  terms: z
    .boolean()
    .default(false)
    .refine((value) => value === true, {
      message: "You must agree to terms and condition to proceed",
    }),
})

export const AddEditProductValidation = z.object({
  productName: z
    .string()
    .min(2, "Product name must be at least 2 characters")
    .max(50, "Product name must be at most 50 characters")
    .regex(
      /[a-zA-Z].*[a-zA-Z]/,
      "Product name must contain at least two letters"
    ),
  status: z.enum(["Active", "Draft", "Archived"]),
  productPrice: z.preprocess(
    (args) => (args === "" ? undefined : args),
    z.coerce
      .number({ invalid_type_error: "Price must be a number" })
      .positive("Price must be positive")
  ),
  stock: z.preprocess(
    (args) => (args === "" ? undefined : args),
    z.coerce
      .number({ invalid_type_error: "Price must be a number" })
      .positive("Price must be positive")
  ),
})
