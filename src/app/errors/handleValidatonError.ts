import mongoose from "mongoose";
import { TErrorResponse, TErrorSources } from "../types";

const handleValidationError = (
  err: mongoose.Error.ValidationError
): TErrorResponse => {
  const errorSources: TErrorSources = Object.values(err.errors).map(
    (val: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
      return {
        path: val?.path,
        message: val.message,
      };
    }
  );

  const statusCode = 401;
  return {
    statusCode,
    message: "Validation Error",
    errorSources,
  };
};

export default handleValidationError;
