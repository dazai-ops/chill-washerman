import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import adminReducer from "./slices/adminSlice";
import mesinCuciReducer from "./slices/mesinCuciSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
    mesinCuci: mesinCuciReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch