import config from "../config";
import AppError from "../errors/AppError";
import { TUserRole } from "../modules/auth/auth.interface";

import catchAsync from "../utils/catchAsync";
import jwt, { JwtPayload } from "jsonwebtoken";

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
      throw new AppError(401, "You are not authorized!");
    }
    jwt.verify(
      token,
      config.jwt_access_secret as string,
      function (err, decoded) {
        if (err) {
          throw new AppError(401, "You are unauthorized");
        }

        const { role } = decoded as JwtPayload;

        if (
          requiredRoles.length > 0 &&
          !requiredRoles.includes(role as TUserRole)
        ) {
          throw new AppError(401, "User is not authorized!");
        }
        req.user = decoded as JwtPayload;
      }
    );
    next();
  });
};

export default auth;
