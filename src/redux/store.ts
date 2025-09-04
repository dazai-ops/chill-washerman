import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/redux/slices/authSlice";
import adminReducer from "@/redux/slices/adminSlice";
import washerReducer from "@/redux/slices/washerSlice";
import apparelReducer from "@/redux/slices/apparelSlice";
import transactionReducer from "@/redux/slices/transactionSlice";
import singleFormReducer from "@/redux/slices/form-validation/singleForm";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
    washer: washerReducer,
    apparel: apparelReducer,
    transaksi: transactionReducer,

    validateSingleForm: singleFormReducer,
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch