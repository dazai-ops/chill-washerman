import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getAdmin, addAdmin, deleteAdmin, updateAdminRole, updateAdmin } from "@/lib/thunk/admin/adminThunk";
import { Admin } from "@/models/admin.model";

interface AdminState {
  adminList: Admin[],
  adminForm: Partial<Admin>,
  loading: boolean,
  error: string | null
  status: string | null
}

const initialState: AdminState = {
  adminList: [],
  adminForm: {
    nama: "",
    username: "",
    role: "", 
    no_telepon: '',
    alamat_rumah: "",
  },
  loading: false, 
  error: null,
  status: null,
}

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setAdminForm: (state, action: PayloadAction<Partial<Admin>>) => {
      state.adminForm = {
        ...state.adminForm,
        ...action.payload
      }
    },
    resetAdminForm: (state) => {
      state.adminForm = {
        // nama: "",
        // username: "",
        // role: "", 
        // no_telepon: '',
        // alamat_rumah: "",
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // retrive admin
      .addCase(getAdmin.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getAdmin.fulfilled, (state, action) => {
        state.adminList = action.payload.result
        state.loading = false
      })
      .addCase(getAdmin.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // add admin
      .addCase(addAdmin.pending, (state) => {
        state.loading = true
        state.error = null
        state.status = null
      })
      .addCase(addAdmin.fulfilled, (state, action) => {
        state.loading = false
        state.status = action.payload.status
      })
      .addCase(addAdmin.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
        state.status = null
      })

      // delete admin
      .addCase(deleteAdmin.pending, (state) => {
        state.loading = true
        state.error = null
        state.status = null
      })
      .addCase(deleteAdmin.fulfilled, (state, action) => {
        state.loading = false
        state.status = action.payload.status
      })
      .addCase(deleteAdmin.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
        state.status = null
      })

      //update admin
      .addCase(updateAdmin.pending, (state) => {
        state.loading = true
        state.error = null
        state.status = null
      })
      .addCase(updateAdmin.fulfilled, (state, action) => {
        state.loading = false
        state.status = action.payload.status
      })
      .addCase(updateAdmin.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
        state.status = null
      })

      // change role
      .addCase(updateAdminRole.pending, (state) => {
        state.loading = true
        state.error = null
        state.status = null
      })
      .addCase(updateAdminRole.fulfilled, (state, action) => {
        state.loading = false
        state.status = action.payload.status
      })
      .addCase(updateAdminRole.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
        state.status = null
      })
  }
})

export const { setAdminForm, resetAdminForm } = adminSlice.actions

export default adminSlice.reducer