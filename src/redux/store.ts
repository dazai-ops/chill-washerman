import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/redux/slices/authSlice";
import adminReducer from "@/redux/slices/adminSlice";
import mesinCuciReducer from "@/redux/slices/mesinCuciSlice";
import jenisPakaianReducer from "@/redux/slices/jenispakaianSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
    mesinCuci: mesinCuciReducer,
    jenisPakaian: jenisPakaianReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch