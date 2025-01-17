import { ReactNode } from "react";
import { motion } from "motion/react";


// SVG Icon Props
export interface IconProps {
  color?: string;
  height?: string | number;
  width?: string | number;
  className?: string;
}



// Motion Wrapper Type
export interface MotionWrapperProps {
  children?: ReactNode;
  className?: string;
  animate?: Parameters<typeof motion.div>[0]['animate'];
  initial?: Parameters<typeof motion.div>[0]['initial'];
  transition?: Parameters<typeof motion.div>[0]['transition'];
}



// Redux States
export type UserDataType = {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  number: string;
  avatar: string;
  createdAt: string;
  updatedAt: string;
  _v: number;
}

export type AuthReduxState = {
  user: UserDataType | null;
  isLoading: boolean;
  darkMode: boolean;
}



// User Authentication Types
// export type VerifyUserType = {
//   isValid: boolean;
//   success: true;
//   data: UserDataType;
// }



// All API response Type
export interface AxiosResponseType {
  success: true;
  message: string;
  data: UserDataType;
}



// Axios Error Types
export interface AxiosErrorType {
  success: boolean;
  status: number;
  message: string;
  stack?: string;
}