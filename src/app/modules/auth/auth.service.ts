import config from "../../config";
import AppError from "../../errors/AppError";
import { TLoginUser, TUser } from "../user/user.interface";
import { User } from "../user/user.model";
import bcrypt from "bcrypt";
import { USER_ROLE } from "./auth.constant";
import jwt from "jsonwebtoken";
import { TJwtPayload } from "./auth.interface";
import { createToken, verifyToken } from "./auth.utils";
import { JwtPayload } from "jsonwebtoken";

const loginUserIntoDB = async (payload: TLoginUser) => {
  const user = await User.findOne({ email: payload.email });
  if (!user) {
    const user = await registerUserIntoDB(payload);

    const jwtPayload: TJwtPayload = {
      name: user?.name,
      email: user?.email,
      role: user?.role!,
      profileImg: user?.profileImg,
    };

    const accessToken = createToken(
      jwtPayload,
      config.jwt_access_secret as string,
      config.jwt_access_expires_in as string
    );

    const refreshToken = createToken(
      jwtPayload,
      config.jwt_refresh_secret as string,
      config.jwt_refresh_expires_in as string
    );

    return {
      accessToken,
      refreshToken,
    };
  } else {
    if (payload.password) {
      const isPasswordMatch = await bcrypt.compare(
        payload.password,
        user.password!
      );
      if (!isPasswordMatch) {
        throw new AppError(401, "Your password is incorrect!");
      }
      const jwtPayload: TJwtPayload = {
        name: user?.name,
        email: user?.email,
        role: user?.role!,
        profileImg: user?.profileImg,
      };

      const accessToken = createToken(
        jwtPayload,
        config.jwt_access_secret as string,
        config.jwt_access_expires_in as string
      );

      const refreshToken = createToken(
        jwtPayload,
        config.jwt_refresh_secret as string,
        config.jwt_refresh_expires_in as string
      );

      //console.log({ accessToken, refreshToken });

      return {
        accessToken,
        refreshToken,
      };
    }
  }
};

const registerUserIntoDB = async (payload: Partial<TUser>) => {
  if (payload.password) {
    payload.password = await bcrypt.hash(
      payload.password,
      Number(config.bcrypt_salt_rounds)
    );
  }
  const user = await User.create({ ...payload, role: USER_ROLE.user });
  return user;
};

const refreshTokenIntoDB = async (token: string) => {
  const decoded = await verifyToken(token, config.jwt_refresh_secret as string);
  const { email } = decoded as TJwtPayload;
  const user = await User.findOne({ email: email });

  if (!user) {
    throw new AppError(404, "User not found!");
  }

  const jwtPayload: TJwtPayload = {
    name: user?.name,
    email: user.email,
    role: user.role!,
    profileImg: user.profileImg,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_refresh_expires_in as string
  );

  return {
    accessToken,
  };
};

const getAllUserFromDB = async () => {
  const result = await User.find();
  return result;
};

//get user profile with access token
const getProfileFromDB = async (token: string) => {
  const { email, role } = jwt.verify(
    token,
    config.jwt_access_secret as string
  ) as JwtPayload;
  const user = await User.findOne({ email, role });
  return user;
};

const updateProfileFromDB = async (payload: Partial<TUser>, token: string) => {
  const { email, role } = jwt.verify(
    token,
    config.jwt_access_secret as string
  ) as JwtPayload;
  const isUserExist = await User.findOne({ email, role });
  if (!isUserExist) {
    throw new AppError(401, "You are not authorized");
  }
  const result = await User.findOneAndUpdate({ email, role }, payload, {
    new: true,
  }).select("-isDeleted -createdAt -updatedAt -__v");
  return result;
};

const updateUserRole = async (id: string) => {
  const user = await User.findById(id);
  if (!user) {
    throw new AppError(404, "Invalid user id");
  }
  let role;
  if (user?.role === "user") {
    role = "admin";
  } else {
    role = "user";
  }
  const result = await User.findByIdAndUpdate(id, { role });
  return result;
};

const deleteUserFromDb = async (id: string) => {
  const user = await User.findById(id);
  if (!user) {
    throw new AppError(404, "Invalid user id");
  }
  const result = await User.findByIdAndDelete(id);
  return result;
};

export const AuthServices = {
  registerUserIntoDB,
  loginUserIntoDB,
  refreshTokenIntoDB,
  getAllUserFromDB,
  getProfileFromDB,
  updateProfileFromDB,
  updateUserRole,
  deleteUserFromDb,
};
