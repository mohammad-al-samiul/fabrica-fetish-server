import AppError from "../../errors/AppError";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { SubscriptionService } from "./subscription.service";

const subscribeUser = catchAsync(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return sendResponse(res, {
      success: false,
      statusCode: 400,
      message: "Email is required",
      data: [],
    });
  }

  const result = await SubscriptionService.subscribeUserToNewsletter(email);

  // Send a confirmation email
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Subscription successful. A confirmation email has been sent.",
    data: result,
  });
});
export const SubscriptionController = {
  subscribeUser,
};
