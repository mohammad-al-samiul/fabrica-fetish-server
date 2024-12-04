import catchAsync from "../../utils/catchAsync";

import { paymentServices } from "./payment.service";

const confirmationController = catchAsync(async (req, res) => {
  const { tnxId, status } = req.query;

  const result = await paymentServices.confirmationServiceIntoDB(
    tnxId as string,
    status as string
  );

  res.send(result);
});

const createPaymentUrl = catchAsync(async (req, res) => {
  const paymentData = req.body;
  const result = await paymentServices.createPaymentIntoDb(paymentData);
  res.send(result);
});

export const paymentControllers = {
  createPaymentUrl,
  confirmationController,
};
