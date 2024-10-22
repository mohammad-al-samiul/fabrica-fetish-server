import { Response } from "express";

type TSendResponse<T> = {
  statusCode: number;
  success: boolean;
  message: string;
  token?: string;
  data: T;
};

const sendResponse = <T>(res: Response, data: TSendResponse<T>) => {
  res.status(data?.statusCode).json({
    success: data?.success,
    message: data?.message,
    token: data?.token,
    data: data?.data,
  });
};

export default sendResponse;
