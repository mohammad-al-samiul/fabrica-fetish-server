import jwt from "jsonwebtoken";
import { TJwtPayload } from "./auth.interface";

const createToken = (
  jwtPayload: TJwtPayload,
  secret: string,
  expiresIn: string
) => {
  return jwt.sign(jwtPayload, secret, { expiresIn });
};

export default createToken;
