import mongoose from "mongoose";
import { IOrder } from "./order.interface";
import { Order } from "./order.model";
import { Product } from "../product/product.model";
import { JwtPayload } from "jsonwebtoken";
import { User } from "../user/user.model";
import AppError from "../../errors/AppError";

const createOrderIntoDb = async (payload: IOrder) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Create the order
    const order = await Order.create([payload], { session });

    // Update the product quantities
    for (const product of payload.products) {
      const productInDb = await Product.findOne({
        _id: product.productId,
      }).session(session);

      // Check if the product exists
      if (!productInDb) {
        throw new Error(`Product not found: ${product.title}`);
      }

      // Check if there is enough stock
      if (productInDb.quantity < product.quantity) {
        throw new Error(`Insufficient stock for product: ${product.title}`);
      }
    }

    // Commit the transaction
    await session.commitTransaction();
    return order;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

const getAllOrdersIntoDb = async (decodedInfo: JwtPayload) => {
  const { email, role } = decodedInfo;
  const user = await User.findOne({ email, role });
  if (!user) {
    throw new AppError(401, "User is not authorized!");
  }

  let result;
  if (role === "admin") {
    result = await Order.find();
  } else {
    result = await Order.find({ "user.email": email });
  }

  return result;
};

const deleteOrderIntoDb = async (id: string) => {
  const order = await Order.findOne({ _id: id });
  if (!order) {
    throw new Error("Order is not found by this ID");
  }
  const result = await Order.findByIdAndDelete(
    { _id: id },
    {
      lean: true,
    }
  );
  return result;
};

// const updateOrderIntoDb = async (id: string, payload: Partial<IOrder>) => {
//   const session = await mongoose.startSession();

//   try {
//     session.startTransaction();

//     // Retrieve the existing order
//     const existingOrder = await Order.findById(id).session(session);

//     if (!existingOrder) {
//       throw new Error("Order not found");
//     }

//     // If products are being updated, adjust the quantities accordingly
//     if (payload.products) {
//       for (const product of payload.products) {
//         const productInDb = await Product.findById(product._id).session(
//           session
//         );

//         if (!productInDb) {
//           throw new Error(`Product not found: ${product._id}`);
//         }

//         // Decrease product quantity
//         if (productInDb.quantity < product.quantity) {
//           throw new Error(`Insufficient stock for product: ${product._id}`);
//         }
//         productInDb.quantity -= product.quantity;
//         await productInDb.save({ session });
//       }
//     }

//     // Update the order with new information
//     const updatedOrder = await Order.findByIdAndUpdate(id, payload, {
//       new: true,
//       session,
//     });

//     // Commit the transaction
//     await session.commitTransaction();
//     return updatedOrder;
//   } catch (error) {
//     await session.abortTransaction();
//     throw error;
//   } finally {
//     session.endSession();
//   }
// };

export const OrderServices = {
  createOrderIntoDb,
  getAllOrdersIntoDb,
  deleteOrderIntoDb,
};
