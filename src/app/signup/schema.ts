import { z } from "zod"

export const signupFormSchema = z
  .object({
    username: z
      .string()
      .min(5, { message: "Username should have minimum 5 character" })
      .max(12, { message: "Maximum 12 characters are allowed" })
      .regex(/^[a-zA-Z0-9]+$/, { message: "Username can contain only alphabets and numbers" }),
    email: z.string().email({ message: "Please enter a valid email" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string().min(8, { message: "Password must be at least 8 characters" }),
    name: z.string().min(3, { message: "Name must be at least 3 characters" }),
    countryCode: z.string().min(2, { message: "Country code is required" }),
    mobile: z
      .string()
      .min(10, { message: "Enter a valid mobile number" })
      .max(10, { message: "Enter number in 10 digits" }),
    institute: z.string().optional(),
    bio: z.string().optional(),
    location: z.string().optional(),
    company: z.string().optional(),
    github: z.string().optional(),
    twitter: z.string().optional(),
    website: z.string().optional(),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords is not matching",
        path: ["confirmPassword"],
      })
    }
  })

export const editProfileSchema = z.object({
  username: z
    .string()
    .min(5, { message: "Username should have minimum 5 character" })
    .max(12, { message: "Maximum 12 characters are allowed" })
    .regex(/^[a-zA-Z0-9]+$/, { message: "Username can contain only alphabets and numbers" }),
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  countryCode: z.string().min(2, { message: "Country code is required" }),
  mobile: z
    .string()
    .min(10, { message: "Enter a valid mobile number" })
    .max(10, { message: "Enter number in 10 digits" }),
  institute: z.string().optional(),
  bio: z.string().optional(),
  location: z.string().optional(),
  company: z.string().optional(),
  github: z.string().optional(),
  twitter: z.string().optional(),
  website: z.string().optional(),
})

export const editPasswordSchema = z
  .object({
    newPassword: z.string().min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string().min(8, { message: "Password must be at least 8 characters" }),
    oldPassword: z.string().min(8, { message: "Password must be at least 8 characters" }),
  })
  .superRefine(({ newPassword, confirmPassword }, ctx) => {
    if (newPassword !== confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords is not matching",
        path: ["confirmPassword"],
      })
    }
  })

export const resetPasswordSchema = z
  .object({
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string().min(8, { message: "Password must be at least 8 characters" }),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords is not matching",
        path: ["confirmPassword"],
      })
    }
  })

