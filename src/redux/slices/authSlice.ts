import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { loginAdmin, logoutAdmin } from "@/lib/thunk/auth/authThunk";
import { Admin } from "@/models/admin.model";

interface AuthState {
  user: Admin | null
  loading: boolean
  error: string | null
  success: boolean
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  success: false
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers:{
    rehydrate: (state) => {
      const userStr = localStorage.getItem('auth')
      state.user = userStr ? JSON.parse(userStr) : null
      console.log(state.user, 'from rehydrate')
    },

    logout: (state) => {
      state.user = null
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(loginAdmin.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.success = true
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(logoutAdmin.fulfilled, (state) => {
        state.user = null
      })
      .addCase(logoutAdmin.rejected, (state, action) => {
        state.error = action.payload as string
      })
  }
})

export const {rehydrate, logout, clearError} = authSlice.actions
export default authSlice.reducer