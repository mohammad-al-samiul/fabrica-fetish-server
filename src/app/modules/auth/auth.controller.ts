import config from "../../config";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";

const registerUser = catchAsync(async (req, res) => {
  const userInfo = req.body;
  const file = req?.file;
  userInfo.profileImg = file?.path;
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

  res.cookie("refreshToken", refreshToken, {
    secure: config.node_env === "production",
    httpOnly: true,
  });
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

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  console.log("refreshToken", refreshToken);
  const result = await AuthServices.refreshTokenIntoDB(refreshToken);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Access Token retrieved successfully!",
    data: result,
  });
});

export const AuthControllers = {
  registerUser,
  loginUser,
  refreshToken,
};
