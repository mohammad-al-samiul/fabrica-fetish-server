import express from "express";
import validateRequest from "../../middleware/validateRequest";
import { ProductValidations } from "./product.validation";
import { ProductControllers } from "./product.controller";

const productRouter = express.Router();

productRouter.post(
  "/",
  validateRequest(ProductValidations.createProductValidationSchema),
  ProductControllers.createProduct
);

export default productRouter;
