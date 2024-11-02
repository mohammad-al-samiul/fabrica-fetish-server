import { TProduct } from "./product.interface";
import { Product } from "./product.model";

const createProductIntoDb = async (payload: TProduct) => {
  const result = await Product.create(payload);
  return result;
};

const getAllProductIntoDb = async () => {
  const result = await Product.find();
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
