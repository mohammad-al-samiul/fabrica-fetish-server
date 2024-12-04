import mongoose, { Schema, Document, Model } from "mongoose";
import { IOrder, IProduct } from "./order.interface";

// Define IProduct Schema
const ProductSchema = new Schema<IProduct>({
  productId: { type: String, required: true },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  image: { type: String, required: true },
  quantity: { type: Number, required: true },
});

// Define Order Schema
const OrderSchema = new Schema<IOrder>(
  {
    products: { type: [ProductSchema], required: true },
    user: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      address: { type: String, required: true },
      phone: { type: String, required: true },
      postCode: { type: String, required: true },
    },
    tnxId: {
      type: String,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["unpaid", "paid"],
      default: "unpaid",
    },
    date: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

// Create the Order Model
export const Order: Model<IOrder> = mongoose.model<IOrder>(
  "Order",
  OrderSchema
);
