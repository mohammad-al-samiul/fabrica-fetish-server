import express from "express";
import { SubscriptionController } from "./subscription.controller";

const subscriptionRouter = express.Router();

subscriptionRouter.post("/subscribe", SubscriptionController.subscribeUser);

export default subscriptionRouter;
