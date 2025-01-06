import { AuthReduxState, UserDataType } from '@/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';


const initialState: AuthReduxState = {
  user: null,
  isLoading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserDataType | null>) => {
      state.user = action.payload;
      state.isLoading = false;
    },
    logout: (state) => {
      state.user = null;
      state.isLoading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    }
  },
});

export const { setUser, logout, setLoading } = authSlice.actions;
export default authSlice.reducer;
