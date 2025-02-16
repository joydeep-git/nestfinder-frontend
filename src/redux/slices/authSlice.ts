import { AuthReduxState, UserDataType } from '@/types/index.ts';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import cookies from "browser-cookies";


const initialState: AuthReduxState = {
  user: null,
  isLoading: true,
  darkMode: false
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUserState: (state, action: PayloadAction<UserDataType | null>) => {
      state.user = action.payload;
      state.isLoading = false;
    },
    logoutState: (state) => {
      state.user = null;
      state.isLoading = false;
      cookies.erase("token");
    },
    setLoadingState: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setDarkMode: (state, action: PayloadAction<boolean>) => {
      state.darkMode = action.payload;
    }
  },
});

const authReducer = authSlice.reducer;

export const { setUserState, logoutState, setLoadingState, setDarkMode } = authSlice.actions;

export default authReducer;