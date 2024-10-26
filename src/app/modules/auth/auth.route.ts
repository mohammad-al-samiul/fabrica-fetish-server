import express, { NextFunction, Request, Response } from "express";
import validateRequest from "../../middleware/validateRequest";
import { AuthControllers } from "./auth.controller";
import { AuthValidations } from "./auth.validation";
import { multerUpload } from "../../config/multer.config";

const authRouter = express.Router();

authRouter.post(
  "/register",
  multerUpload.single("image"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(AuthValidations.createUserValidationSchema),
  AuthControllers.registerUser
);

authRouter.post(
  "/login",
  validateRequest(AuthValidations.loginUserValidationSchema),
  AuthControllers.loginUser
);

authRouter.post(
  "/refresh-token",
  validateRequest(AuthValidations.refreshTokenValidationSchema),
  AuthControllers.refreshToken
);

export default authRouter;
