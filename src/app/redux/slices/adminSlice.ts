import { createSlice } from "@reduxjs/toolkit";
import { retriveAdmin, addAdmin, deleteAdmin, changeRole, updateAdmin } from "../api/adminThunk";

type Admin = {
  id: string;
  username: string;
  role: string
  nama: string;
  no_telepon: string;
  alamat_rumah: string;
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
      // retrive admin
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

      // add admin
      .addCase(addAdmin.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = null
      })
      .addCase(addAdmin.fulfilled, (state, action) => {
        state.loading = false
        state.success = action.payload.message
      })
      .addCase(addAdmin.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // delete admin
      .addCase(deleteAdmin.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = null
      })
      .addCase(deleteAdmin.fulfilled, (state, action) => {
        state.loading = false
        state.success = action.payload.message
      })
      .addCase(deleteAdmin.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      //update admin
      .addCase(updateAdmin.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = null
      })
      .addCase(updateAdmin.fulfilled, (state, action) => {
        state.loading = false
        state.success = action.payload.message
      })
      .addCase(updateAdmin.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // change role
      .addCase(changeRole.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = null
      })
      .addCase(changeRole.fulfilled, (state, action) => {
        state.loading = false
        state.success = action.payload.message
      })
      .addCase(changeRole.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  }
})

export default adminSlice.reducer