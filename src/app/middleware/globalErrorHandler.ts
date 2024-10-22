/* eslint-disable @typescript-eslint/no-unused-vars */
import { ZodError } from "zod";
import config from "../config";
import handleZodError from "../errors/handleZodError";
import { ErrorRequestHandler } from "express";
import { TErrorSources } from "../types";

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let statusCode = 500;
  let message = "Something went wrong!";

  let errorSources: TErrorSources = [
    {
      path: "",
      message: "Something went wrong!",
    },
  ];

  if (err instanceof ZodError) {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
  }

  return res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    stack: config.node_env === "development" ? err?.stack : null,
  });
};

export default globalErrorHandler;

/*
error message pattern---
--------
success
message
errorSources : [
    path : '',
    message : ''
]
--------
error : [
    issues : [
        {
            code : "invalid code",
            path : [
                "body",
                "name"
            ],
            "message" : "Name is required"
        }
    ],
    "name" : "zodError"
]

*/
