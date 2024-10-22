/* eslint-disable @typescript-eslint/no-unused-vars */
import { ZodError } from "zod";
import config from "../config";
import handleZodError from "../errors/handleZodError";
import { ErrorRequestHandler } from "express";
import { TErrorSources } from "../types";
import handleValidationError from "../errors/handleValidatonError";
import handleCastError from "../errors/handleCastError";

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
  } else if (err?.name === "ValidationError") {
    const simplifiedError = handleValidationError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
  } else if (err?.name === "CastError") {
    const simplifiedError = handleCastError(err);
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
zod error

err : [
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

mongoose error

err : [
  errors : {
    name : {
      name : "validatorError",
      "message" : "path name is required",
      properties : {
        "message" : "path name is required",
        
      }
        kind : required,
        path : "name"
    }
  },
  _message : "academic department validation failed",
  name : "ValidationError",
  message : "academic department validation failed name : path 'name' is required"
]

cast error

err : {
  path : "_id",
  name : "CastError",
  message : "Cast to ObjectId for value"
}

*/
