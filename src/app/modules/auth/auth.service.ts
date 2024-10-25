import config from "../../config";
import AppError from "../../errors/AppError";
import { TLoginUser, TUser } from "../user/user.interface";
import { User } from "../user/user.model";
import bcrypt from "bcrypt";
import { USER_ROLE } from "./auth.constant";

import { TJwtPayload } from "./auth.interface";
import { createToken } from "./auth.utils";
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

export const AuthServices = {
  registerUserIntoDB,
  loginUserIntoDB,
};
