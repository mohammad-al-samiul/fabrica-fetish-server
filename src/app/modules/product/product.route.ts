import express, { NextFunction, Request, Response } from "express";
import validateRequest from "../../middleware/validateRequest";
import { ProductValidations } from "./product.validation";
import { ProductControllers } from "./product.controller";
import { multerUpload } from "../../config/multer.config";
import auth from "../../middleware/auth";
import { USER_ROLE } from "../auth/auth.constant";

const productRouter = express.Router();

productRouter.post(
  "/",
  multerUpload.single("image"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(ProductValidations.createProductValidationSchema),
  auth(USER_ROLE.admin),
  ProductControllers.createProduct
);

productRouter.get("/", ProductControllers.getAllProduct);
productRouter.get("/:id", ProductControllers.getSingleProduct);

productRouter.put(
  "/:id",
  multerUpload.single("image"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(ProductValidations.updateProductValidationSchema),
  auth(USER_ROLE.admin),
  ProductControllers.updateProduct
);

productRouter.delete(
  "/:id",
  auth(USER_ROLE.admin),
  ProductControllers.deleteProduct
);

export default productRouter;
