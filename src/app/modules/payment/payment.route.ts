import express from "express";
import { paymentControllers } from "./payment.controller";
const router = express.Router();

router.post("/confirmation", paymentControllers.confirmationController);
router.post("/create-payment", paymentControllers.createPaymentUrl);

export const paymentRouter = router;
