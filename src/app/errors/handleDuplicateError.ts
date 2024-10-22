import { TErrorResponse, TErrorSources } from "../types";

const handleDuplicationError = (err: any): TErrorResponse => {
  const match = err.message.match(/([^]*)"/);
  const extracted_message = match && match[1];

  const errorSources: TErrorSources = [
    {
      path: "",
      message: `${extracted_message} is already exist!`,
    },
  ];

  const statusCode = 400;

  return {
    statusCode,
    message: "Duplicate Error",
    errorSources,
  };
};

export default handleDuplicationError;
