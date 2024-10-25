import express from "express";
import validateRequest from "../../middleware/validateRequest";
import { AuthControllers } from "./auth.controller";
import { AuthValidations } from "./auth.validation";

const authRouter = express.Router();

authRouter.post(
  "/register",
  validateRequest(AuthValidations.createUserValidationSchema),
  AuthControllers.registerUser
);

authRouter.post(
  "/login",
  validateRequest(AuthValidations.loginUserValidationSchema),
  AuthControllers.loginUser
);

export default authRouter;
