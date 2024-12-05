import express from "express";
import validateRequest from "../../middleware/validateRequest";
import { OrderValidations } from "./order.validation";
import auth from "../../middleware/auth";
import { USER_ROLE } from "../auth/auth.constant";
import { OrderControllers } from "./order.controller";

const orderRouter = express.Router();

orderRouter.post(
  "/",
  validateRequest(OrderValidations.createOrderValidationSchema),
  auth(USER_ROLE.user),
  OrderControllers.createOrder
);

orderRouter.get(
  "/",
  auth(USER_ROLE.admin, USER_ROLE.user),
  OrderControllers.getAllOrders
);
orderRouter.delete("/:id", auth(USER_ROLE.user), OrderControllers.deleteOrder);

export default orderRouter;
