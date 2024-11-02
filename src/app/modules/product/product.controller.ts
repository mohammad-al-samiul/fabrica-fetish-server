import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ProductServices } from "./product.service";

const createProduct = catchAsync(async (req, res) => {
  const productInfo = req.body;
  const file = req?.file;
  productInfo.image = file?.path;
  const result = await ProductServices.createProductIntoDb(productInfo);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Product created successfully!",
    data: result,
  });
});

const getAllProduct = catchAsync(async (req, res) => {
  const result = await ProductServices.getAllProductIntoDb();
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Product retrieved successfully!",
    data: result,
  });
});

const getSingleProduct = catchAsync(async (req, res) => {
  const result = await ProductServices.getSingleProductIntoDb(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Product retrieved successfully!",
    data: result,
  });
});

const updateProduct = catchAsync(async (req, res) => {
  const result = await ProductServices.updateProductIntoDb(
    req.params.id,
    req.body
  );

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Product updated successfully!",
    data: result,
  });
});

const deleteProduct = catchAsync(async (req, res) => {
  const result = await ProductServices.deleteProductIntoDb(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Product deleted successfully!",
    data: result,
  });
});

export const ProductControllers = {
  createProduct,
  getAllProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
};
