

// SVG Icon Props
export interface IconProps {
  color?: string;
  height?: string | number;
  width?: string | number;
}



// Redux States
export type UserDataType = {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  number: string;
  avatar: string;
}

export type AuthReduxState = {
  user: UserDataType | null;
  isLoading: boolean;
}



// User Authentication Types
export type verifyUserType = {
  isValid: boolean;
  data: UserDataType | null;
}