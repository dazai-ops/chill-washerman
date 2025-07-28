import { createSlice } from "@reduxjs/toolkit";
import { retriveAdmin, addAdmin, deleteAdmin } from "../api/adminThunk";

type Admin = {
  username: string;
  role: string
}

interface AdminState {
  adminCollection: Admin[]
  loading: boolean,
  error: string | null
  success: string | null
}

const initialState: AdminState = {
  adminCollection: [],
  loading: false, 
  error: null,
  success: null
}

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(retriveAdmin.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(retriveAdmin.fulfilled, (state, action) => {
        state.adminCollection = action.payload
        state.loading = false
      })
      .addCase(retriveAdmin.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(addAdmin.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(addAdmin.fulfilled, (state, action) => {
        state.loading = false
        state.success = action.payload.message
      })
      .addCase(addAdmin.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(deleteAdmin.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteAdmin.fulfilled, (state, action) => {
        state.loading = false
        state.success = action.payload.message
      })
      .addCase(deleteAdmin.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  }
})

export const {loading, error, success} = adminSlice.actions
export default adminSlice.reducer