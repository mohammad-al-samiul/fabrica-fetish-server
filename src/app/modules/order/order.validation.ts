import { z } from "zod";

// Define the Product validation schema
const ProductSchema = z.object({
  productId: z.string({
    required_error: "Product ID is required",
  }),
  title: z.string({
    required_error: "Title is required",
  }),
  price: z
    .number({
      required_error: "Price is required",
    })
    .min(0, "Price must be a positive number"),
  category: z.string({
    required_error: "Category is required",
  }),
  image: z.string({
    required_error: "Image is required",
  }),
  quantity: z
    .number({
      required_error: "Quantity is required",
    })
    .int("Quantity must be an integer")
    .min(0, "Quantity cannot be negative"),
});

// Define the Create Order validation schema
const createOrderValidationSchema = z.object({
  body: z.object({
    products: z.array(ProductSchema, {
      required_error: "Products are required",
    }),
    user: z.object({
      name: z.string({
        required_error: "Name is required",
      }),
      email: z
        .string({
          required_error: "Email is required",
        })
        .email("Invalid email format"),
      address: z.string({
        required_error: "Address is required",
      }),
      phone: z.string({
        required_error: "Phone is required",
      }),
      postCode: z.string({
        required_error: "Postcode is required",
      }),
    }),
    totalAmount: z.number({
      required_error: "Postcode is required",
    }),
    status: z.enum(["unpaid", "paid"]).default("unpaid"),
    date: z.string({
      required_error: "Date is required",
    }),
  }),
});

// Define the Update Order validation schema
const updateOrderValidationSchema = z.object({
  body: z.object({
    products: z.array(ProductSchema).optional(),
    user: z
      .object({
        name: z.string().optional(),
        email: z.string().email().optional(),
        address: z.string().optional(),
        phone: z.string().optional(),
        postCode: z.string().optional(),
      })
      .optional(),
    totalAmount: z.number().optional(),
    status: z.enum(["unpaid", "paid"]).default("unpaid").optional(),
    date: z.date().optional(),
  }),
});

export const OrderValidations = {
  createOrderValidationSchema,
  updateOrderValidationSchema,
};
