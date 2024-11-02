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
    message: "Product create successfully!",
    data: result,
  });
});

export const ProductControllers = {
  createProduct,
};
