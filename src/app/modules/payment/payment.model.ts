import { Schema, model } from "mongoose";
import { TPaymentInfo } from "./payment.interface";

// Define the payment schema
const paymentSchema = new Schema<TPaymentInfo>(
  {
    transactionId: {
      type: String,
      required: true,
    },
    clientEmail: {
      type: String,
      required: true,
    },
    amount: {
      type: String,
    },
    orderId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Export the Payment model
export const Payment = model<TPaymentInfo>("Payment", paymentSchema);
