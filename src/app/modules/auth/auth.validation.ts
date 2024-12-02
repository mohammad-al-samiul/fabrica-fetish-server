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
    role: z.enum(["admin", "user"]).default("user").optional(),
  }),
});

const refreshTokenValidationSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: "Refresh token is required!",
    }),
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

const updateUserValidationSchema = z.object({
  body: z.object({
    name: z.string({ required_error: "Name is required!" }).optional(),
    phone: z.number({ required_error: "Phone is required!" }).optional(),
  }),
});
export const AuthValidations = {
  createUserValidationSchema,
  loginUserValidationSchema,
  refreshTokenValidationSchema,
  updateUserValidationSchema,
};
