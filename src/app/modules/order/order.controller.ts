import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { OrderServices } from "./order.service";

const createOrder = catchAsync(async (req, res) => {
  const orderInfo = req.body;

  const result = await OrderServices.createOrderIntoDb(orderInfo);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Order created successfully!",
    data: result,
  });
});

const getAllOrders = catchAsync(async (req, res) => {
  const result = await OrderServices.getAllOrdersIntoDb();

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Orders retrieved successfully!",
    data: result,
  });
});

const deleteOrder = catchAsync(async (req, res) => {
  const result = await OrderServices.deleteOrderIntoDb(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Order deleted successfully!",
    data: result,
  });
});

export const OrderControllers = {
  createOrder,
  getAllOrders,
  deleteOrder,
};
