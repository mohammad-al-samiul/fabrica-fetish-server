export type TUser = {
  name: string;
  email: string;
  password?: string;
  phone?: number;
  profileImg?: string;
  address?: string;
  role?: "admin" | "user";
  isDeleted?: boolean;
};

export type TLoginUser = {
  email: string;
  password?: string;
};

export type TUpdateUser = {
  name?: string;
  password?: string;
  phone?: number;
  profileImg?: string;
  address?: string;
};
