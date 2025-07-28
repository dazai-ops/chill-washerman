import { createSlice } from "@reduxjs/toolkit";
import { loginAdmin } from "../api/authThunk";

interface User{
  username: string
  role: string
}

interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers:{
    rehydrate: (state) => {
      const userStr = localStorage.getItem('user')
      state.user = userStr ? JSON.parse(userStr) : null
    },
    logout: (state) => {
      state.user = null
    },
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
    .addCase(loginAdmin.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  }
})

export const {rehydrate, logout, clearError} = authSlice.actions
export default authSlice.reducer