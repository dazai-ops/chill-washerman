import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/redux/slices/authSlice";
import adminReducer from "@/redux/slices/adminSlice";
import mesinCuciReducer from "@/redux/slices/mesinCuciSlice";
import jenisPakaianReducer from "@/redux/slices/jenispakaianSlice";
import transaksiReducer from "@/redux/slices/transaksiSlice";
import modalControlReducer from "@/redux/slices/modalControl"
import singleFormReducer from "./slices/form-validation/singleForm"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
    mesinCuci: mesinCuciReducer,
    jenisPakaian: jenisPakaianReducer,
    transaksi: transaksiReducer,
    singleForm: singleFormReducer,

    modalControl: modalControlReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch