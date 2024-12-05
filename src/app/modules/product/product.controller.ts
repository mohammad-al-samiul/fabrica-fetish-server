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
  const { category, sortBy, sortOrder, limit, page } = req.query;
  const queryParams = {
    category: category as string,
    sortBy: sortBy as string,
    sortOrder: sortOrder as "asc" | "desc",
    limit: limit ? parseInt(limit as string, 10) : undefined,
    page: page ? parseInt(page as string, 10) : undefined,
  };

  const result = await ProductServices.getAllProductIntoDb(queryParams);
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
  const productInfo = req.body;
  const file = req?.file;
  productInfo.image = file?.path;

  const result = await ProductServices.updateProductIntoDb(
    req.params.id,
    productInfo
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
