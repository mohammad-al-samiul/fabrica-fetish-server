import authRouter from "../modules/auth/auth.route";
import express from "express";
import productRouter from "../modules/product/product.route";
import orderRouter from "../modules/order/order.route";
import subscriptionRouter from "../modules/subscription/subscribe.route";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: authRouter,
  },
  {
    path: "/products",
    route: productRouter,
  },
  {
    path: "/orders",
    route: orderRouter,
  },
  {
    path: "/subscriptions",
    route: subscriptionRouter,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
