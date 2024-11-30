import mongoose from "mongoose";
import { IOrder } from "./order.interface";
import { Order } from "./order.model";
import { Product } from "../product/product.model";

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

      // Update only the quantity field
      await Product.updateOne(
        { _id: product.productId },
        { $inc: { quantity: -product.quantity } }, // Decrease quantity by the ordered amount
        { session }
      );
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

const getAllOrdersIntoDb = async () => {
  const result = await Order.find();
  return result;
};

const getSingleOrderIntoDb = async (id: string) => {
  const result = await Order.findById(id);
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
  getSingleOrderIntoDb,
};
