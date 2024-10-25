import { z } from "zod";

const createUserValidationSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: "Name is required",
    }),
    email: z
      .string({
        required_error: "Email is required",
      })
      .email({ message: "Invalid Email" }),
    password: z
      .string({
        required_error: "Password is required",
      })
      .min(6, "Password must be at least 6 characters"),
    phone: z.number().optional(),
    address: z.string().optional(),
    role: z.enum(["admin", "user"]).default("user"),
  }),
});

const loginUserValidationSchema = z.object({
  body: z.object({
    email: z.string({
      required_error: "Email is required",
    }),
    password: z.string({
      required_error: "Password is required",
    }),
  }),
});

export const UserValidation = {
  createUserValidationSchema,
  loginUserValidationSchema,
};
