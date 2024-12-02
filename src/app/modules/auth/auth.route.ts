import express, { NextFunction, Request, Response } from "express";
import validateRequest from "../../middleware/validateRequest";
import { AuthControllers } from "./auth.controller";
import { AuthValidations } from "./auth.validation";
import { multerUpload } from "../../config/multer.config";
import auth from "../../middleware/auth";
import { USER_ROLE } from "./auth.constant";
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

authRouter.get("/users", auth(USER_ROLE.admin), AuthControllers.getAllUser);

authRouter.get("/me", AuthControllers.getProfile);

authRouter.put(
  "/me",
  multerUpload.single("image"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    console.log("req", req.body);
    next();
  },
  //validateRequest(AuthValidations.updateUserValidationSchema),
  AuthControllers.updateProfile
);

authRouter.delete("/:id", auth(USER_ROLE.admin), AuthControllers.deleteUser);

authRouter.put("/:id", auth(USER_ROLE.admin), AuthControllers.updateUserRole);

export default authRouter;
