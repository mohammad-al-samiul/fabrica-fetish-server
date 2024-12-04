import { TProduct } from "./product.interface";
import { Product } from "./product.model";

export type TProductQueryParams = {
  category?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  limit?: number;
  page?: number;
};

const createProductIntoDb = async (payload: TProduct) => {
  const result = await Product.create(payload);
  return result;
};

const getAllProductIntoDb = async (query: TProductQueryParams) => {
  const {
    category,
    sortBy = "createdAt",
    sortOrder = "asc",
    limit = 20,
    // page = 1,
  } = query;

  // Build the filter based on the category if provided
  const filter = category ? { category } : {};

  // Execute the query with filter, sort, and pagination
  const result = await Product.find(filter)
    .sort({
      [sortBy]: sortOrder === "asc" ? 1 : -1,
    })
    .limit(limit);
  // .skip(skip);

  return result;
};

const getSingleProductIntoDb = async (id: string) => {
  const result = await Product.findOne({ _id: id });
  return result;
};

const updateProductIntoDb = async (id: string, payload: Partial<TProduct>) => {
  const result = await Product.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return result;
};

const deleteProductIntoDb = async (id: string) => {
  const result = await Product.findByIdAndDelete(
    { _id: id },
    {
      lean: true,
    }
  );

  return result;
};

export const ProductServices = {
  createProductIntoDb,
  getAllProductIntoDb,
  getSingleProductIntoDb,
  updateProductIntoDb,
  deleteProductIntoDb,
};
