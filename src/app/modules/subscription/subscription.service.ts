import AppError from "../../errors/AppError";
import { sendEmail } from "../../utils/subscribe.utils";
import { Subscription } from "./subscription.model";

const subscribeUserToNewsletter = async (email: string) => {
  const isSubscribed = await Subscription.findOne({ email });
  if (isSubscribed) {
    throw new AppError(400, "Email is already subscribed!");
  }

  await sendEmail(
    email,
    "Thank you for subscribing!",
    "Welcome to our newsletter! You'll now receive updates about our latest deals and offers."
  );

  const result = await Subscription.create({ email });
  return result;
};

export const SubscriptionService = {
  subscribeUserToNewsletter,
};
