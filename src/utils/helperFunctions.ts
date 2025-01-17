import { AxiosError } from "axios";
import { AxiosErrorType } from "../types";

export const axiosErrorHandler = (err: AxiosError): string => {

  const errorData = err.response?.data as AxiosErrorType;

  const message = errorData?.message || "Something went wrong. Please try again.";

  return message;

}