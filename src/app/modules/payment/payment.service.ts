import { TPaymentProps } from "./payment.interface";

import { v4 as uuidv4 } from "uuid";
import { Order } from "../order/order.model";
import { initiatePayment, verifyPayment } from "./payment.utils";
import mongoose, { startSession } from "mongoose";
import AppError from "../../errors/AppError";
import { Product } from "../product/product.model";

const confirmationServiceIntoDB = async (tnxId: string, status: string) => {
  const verifyResponse = await verifyPayment(tnxId);

  if (verifyResponse && verifyResponse.pay_status === "Successful") {
    const session = await mongoose.startSession();
    try {
      session.startTransaction();

      // Find the order by tnxId
      const order = await Order.findOne({ tnxId }).session(session);
      if (!order) {
        throw new AppError(404, "Order not found!");
      }

      // Iterate through the products in the order
      for (const product of order.products) {
        const productInDb = await Product.findOne({
          _id: product.productId,
        }).session(session);

        // Check if the product exists
        if (!productInDb) {
          throw new Error(`Product not found: ${product.title}`);
        }

        // Update product quantity in the database (decrease by the ordered amount)
        await Product.updateOne(
          { _id: product.productId },
          { $inc: { quantity: -product.quantity } },
          { session }
        );
      }
      // Update the order status to 'paid'
      await Order.findOneAndUpdate({ tnxId }, { status: "paid" }, { session });

      // Commit the transaction
      await session.commitTransaction();
    } catch (error: any) {
      // If any error occurs, abort the transaction
      await session.abortTransaction();
      throw new Error(error);
    } finally {
      // End the session
      session.endSession();
    }
  }

  if (status === "success") {
    return `
    <!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css"
      rel="stylesheet"
    />
    <link
      href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
      rel="stylesheet"
    />
    <title>Payment Confirmation</title>
    <style>
      ._success {
        box-shadow: 0 15px 25px #00000019;
        padding: 45px;
        width: 100%;
        text-align: center;
        margin: 40px auto;
        border-bottom: solid 4px #28a745;
      }

      ._success i {
        font-size: 55px;
        color: #28a745;
      }

      ._success h2 {
        margin-bottom: 12px;
        font-size: 40px;
        font-weight: 500;
        line-height: 1.2;
        margin-top: 10px;
      }

      ._success p {
        margin-bottom: 0px;
        font-size: 18px;
        color: #495057;
        font-weight: 500;
      }
      .btn-custom {
        background-color: #28a745;
        color: white;
        padding: 10px 20px;
        font-size: 18px;
        border-radius: 5px;
        text-decoration: none;
      }

      .btn-custom:hover {
        background-color: #218838;
        color: white;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-5">
          <div class="message-box _success">
            <i class="fa fa-check-circle" aria-hidden="true"></i>
            <h2>Your payment was successful</h2>
            <p>
              Thank you for your payment. we will <br />
              be in contact with more details shortly
            </p>
          </div>
        </div>
      </div>
      <hr />
    </div>
  </body>
</html>

    `;
  } else if (status === "failed") {
    return `
    <!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css"
      rel="stylesheet"
    />
    <link
      href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
      rel="stylesheet"
    />
    <title>Payment Confirmation</title>
    <style>
      ._failed {
        border-bottom: solid 4px red !important;
      }
      ._failed i {
        color: red !important;
      }

      ._success {
        box-shadow: 0 15px 25px #00000019;
        padding: 45px;
        width: 100%;
        text-align: center;
        margin: 40px auto;
        border-bottom: solid 4px #28a745;
      }

      ._success i {
        font-size: 55px;
        color: #28a745;
      }

      ._success h2 {
        margin-bottom: 12px;
        font-size: 40px;
        font-weight: 500;
        line-height: 1.2;
        margin-top: 10px;
      }

      ._success p {
        margin-bottom: 0px;
        font-size: 18px;
        color: #495057;
        font-weight: 500;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-5">
          <div class="message-box _success _failed">
            <i class="fa fa-times-circle" aria-hidden="true"></i>
            <h2>Your payment failed</h2>
            <p>Try again later</p>
          </div>
        </div>
      </div>
    </div>
  </body>
</html>

    `;
  }
};

const createPaymentIntoDb = async (paymentData: TPaymentProps) => {
  const session = await startSession();
  session.startTransaction();

  try {
    // Generate transaction ID
    const tnxId = `TXN-${uuidv4().split("-")[0]}`;

    // Create payment info object
    const paymentInfo = {
      tnxId,
      clientEmail: paymentData.clientEmail,
      clientName: paymentData?.clientName,
      clientPhoneNo: paymentData?.clientPhoneNo,
      address: paymentData?.address,
      totalCost: paymentData.totalCost,
    };

    // Initiate payment process (outside transaction as it might be an external API call)
    const paymentSession = await initiatePayment(paymentInfo);

    if (paymentSession.result) {
      await Order.findOneAndUpdate(
        { _id: paymentData?.orderId, status: "unpaid" },
        { tnxId },
        { session }
      );
    }
    await session.commitTransaction();
    session.endSession();

    return paymentSession;
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();
    throw new Error(error);
  }
};

export const paymentServices = {
  confirmationServiceIntoDB,
  createPaymentIntoDb,
};
