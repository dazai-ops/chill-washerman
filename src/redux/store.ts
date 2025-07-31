import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/redux/slices/authSlice";
import adminReducer from "@/redux/slices/adminSlice";
import mesinCuciReducer from "@/redux/slices/mesinCuciSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
    mesinCuci: mesinCuciReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch