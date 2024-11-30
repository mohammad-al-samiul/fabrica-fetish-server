import { model, Schema } from "mongoose";
import { TProduct, TRating } from "./product.interface";
import AppError from "../../errors/AppError";

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

const productSchema = new Schema<TProduct>(
  {
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
    quantity: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    rating: {
      type: ratingSchema,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

productSchema.pre("save", async function (next) {
  const isProductExist = await Product.findOne({ title: this?.title });
  if (isProductExist) {
    throw new AppError(409, "A Product is already exist with the name");
  }
  next();
});

productSchema.pre("findOneAndUpdate", async function (next) {
  const query = this?.getQuery();

  const isProductExist = await Product.findOne(query);
  if (!isProductExist) {
    throw new AppError(404, "Product not found!");
  }
  next();
});

productSchema.pre("findOneAndDelete", async function (next) {
  const query = this?.getQuery(); //query :  { _id: '66b638236c23db76e9a9fb66' }

  const isProductExist = await Product.findOne(query);
  if (!isProductExist) {
    throw new AppError(404, "Product not found!");
  }
  next();
});

export const Product = model<TProduct>("Product", productSchema);
