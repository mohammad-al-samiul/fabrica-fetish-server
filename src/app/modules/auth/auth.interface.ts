import { USER_ROLE } from "./auth.constant";

export type TJwtPayload = {
  email: string;
  profileImg?: string;
  role: string;
};

export type TUserRole = keyof typeof USER_ROLE;
