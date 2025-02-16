import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useSelector, useDispatch } from 'react-redux';
import authReducer from "@/redux/slices/authSlice";
import filterReducer from '@/redux/slices/filterSlice';



export const store = configureStore({
  reducer: {
    auth: authReducer,
    filter: filterReducer,
  },
  middleware: (defaultMiddleware) => defaultMiddleware({ serializableCheck: false }),
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
