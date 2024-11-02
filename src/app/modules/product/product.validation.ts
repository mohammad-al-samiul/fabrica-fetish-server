import { z } from "zod";

const ratingValidationSchema = z.object({
  rate: z
    .number({
      required_error: "Rating rate is required",
    })
    .min(0, "Rate must be at least 0")
    .max(5, "Rate cannot exceed 5"),
  count: z
    .number({
      required_error: "Rating count is required",
    })
    .min(0, "Count must be at least 0"),
});

const createProductValidationSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: "Title is required",
    }),
    price: z
      .number({
        required_error: "Price is required",
      })
      .positive("Price must be a positive number"),
    description: z.string({
      required_error: "Description is required",
    }),
    category: z.string({
      required_error: "Category is required",
    }),
    image: z.string({
      required_error: "Image URL is required",
    }),
    rating: ratingValidationSchema,
  }),
});

export const ProductValidations = {
  createProductValidationSchema,
};
