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

const getAllUser = catchAsync(async (req, res) => {
  const result = await AuthServices.getAllUserFromDB();
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User retrieved successfully!",
    data: result,
  });
});

const getProfile = catchAsync(async (req, res) => {
  const token = req.headers.authorization;
  const result = await AuthServices.getProfileFromDB(token!);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User profile retrieved successfully!",
    data: result,
  });
});

const updateProfile = catchAsync(async (req, res) => {
  const userInfo = req.body;
  const file = req?.file;
  userInfo.profileImg = file?.path;

  console.log(userInfo);

  const token = req.headers.authorization as string;
  const result = await AuthServices.updateProfileFromDB(userInfo, token);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Profile updated successfully!",
    data: result,
  });
});

const deleteUser = catchAsync(async (req, res) => {
  const result = await AuthServices.deleteUserFromDb(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Users deleted successfully!",
    data: result,
  });
});

const updateUserRole = catchAsync(async (req, res) => {
  const result = await AuthServices.updateUserRole(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Users role updated successfully!",
    data: result,
  });
});

export const AuthControllers = {
  registerUser,
  loginUser,
  refreshToken,
  getAllUser,
  getProfile,
  updateProfile,
  deleteUser,
  updateUserRole,
};
