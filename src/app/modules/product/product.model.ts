import { model, Schema } from "mongoose";
import { TProduct, TRating } from "./product.interface";

const ratingSchema = new Schema<TRating>({
  rate: {
    type: Number,
    required: true,
  },
  count: {
    type: Number,
    required: true,
  },
});

const productSchema = new Schema<TProduct>({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  rating: {
    type: ratingSchema,
    required: true,
  },
});

export const Product = model<TProduct>("Product", productSchema);
