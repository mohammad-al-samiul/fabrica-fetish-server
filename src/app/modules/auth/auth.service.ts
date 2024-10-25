import config from "../../config";
import AppError from "../../errors/AppError";
import { TLoginUser, TUser } from "../user/user.interface";
import { User } from "../user/user.model";
import bcrypt from "bcrypt";
import { USER_ROLE } from "./auth.constant";

import { TJwtPayload } from "./auth.interface";
import { createToken, verifyToken } from "./auth.utils";
import { profile } from "console";
const loginUserIntoDB = async (payload: TLoginUser) => {
  const user = await User.findOne({ email: payload.email });
  if (!user) {
    const user = await registerUserIntoDB(payload);

    const jwtPayload: TJwtPayload = {
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

export const AuthServices = {
  registerUserIntoDB,
  loginUserIntoDB,
  refreshTokenIntoDB,
};
