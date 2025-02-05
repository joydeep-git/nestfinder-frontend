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
export interface UserProfileUpdateType {
  username: string;
  firstName: string;
  lastName: string;
  number: string;
}



export type AuthReduxState = {
  user: UserDataType | null;
  isLoading: boolean;
  darkMode: boolean;
}



export interface UserProfileDataType extends UserProfileUpdateType {
  email: string;
  avatar: string;
}

export interface mongoDbAddedData {
  _id: string;
  createdAt: string;
  updatedAt: string;
  _v: number;
}



export interface UserDataType extends UserProfileDataType, mongoDbAddedData {};



// Product Data Type
export interface CreateProductType {
  name: string;
  description: string;
  address: string;
  regularPrice: number;
  discountAmount: number;
  bathrooms: number;
  bedrooms: number;
  furnished: boolean;
  parking: boolean;
  type: string;
  offer: boolean;
  imageUrls: string[];
  userRef: string;
}

export interface ProductDataType extends CreateProductType, mongoDbAddedData { };



// All Success API response Type
export interface ApiSuccessType {
  success: true;
  message: string;
}

export interface AuthSuccessType extends ApiSuccessType {
  data: UserDataType
}

export interface ProductSuccessType extends ApiSuccessType {
  data: ProductDataType
}




// Axios Error Types
export interface AxiosErrorResponseType {
  success: boolean;
  status: number;
  message: string;
  stack?: string;
}



// All Routes Data type
export interface DropdownOptionType {
  icon: ReactNode;
  title: string;
  url: string;
}


