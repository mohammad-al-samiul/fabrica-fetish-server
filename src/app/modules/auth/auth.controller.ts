import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";

const registerUser = catchAsync(async (req, res) => {
  const userInfo = req.body;
  const result = await AuthServices.registerUserIntoDB(userInfo);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "User is registered successfully!",
    data: result,
  });
});

const loginUser = catchAsync(async (req, res) => {
  const userInfo = req.body;
  const result = await AuthServices.loginUserIntoDB(userInfo);
  const { accessToken, refreshToken }: any = result;
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User is logged in successfully!",
    data: {
      accessToken,
      refreshToken,
    },
  });
});

export const AuthControllers = {
  registerUser,
  loginUser,
};
