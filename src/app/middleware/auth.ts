import config from "../config";
import AppError from "../errors/AppError";
import catchAsync from "../utils/catchAsync";
import jwt, { JwtPayload } from "jsonwebtoken";
type TRole = {
  user: string;
  admin: string;
};
const auth = (...requiredRoles: TRole[]) => {
  return catchAsync(async (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
      throw new AppError(401, "You are not authorized!");
    }
    jwt.verify(
      token,
      config.jwt_access_secret as string,
      function (err: any, decoded) {
        if (err) {
          throw new AppError(401, "You are unauthorized");
        }

        const { role } = decoded as JwtPayload;

        if (requiredRoles && !requiredRoles.includes(role)) {
          throw new AppError(401, "User is not authorized!");
        }
        req.user = decoded as JwtPayload;
      }
    );
    next();
  });
};

export default auth;
