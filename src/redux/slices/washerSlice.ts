import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { addWasher, changeWasherStatus, deleteWasher, getWasher, updateWasher } from '@/lib/thunk/washer/washerThunk';
import { Washer } from "@/models/washer.model";

interface MesinCuciState {
  washerList: Washer[]
  washerForm: Partial<Washer>
  loading: boolean,
  error: string | null
  status: string | null
}

const initialState: MesinCuciState = {
  washerList: [],
  washerForm: {
    nama: "",
    merk: "",
    seri: "",
    is_active: false,
    tahun_pembuatan: "",
    tanggal_dibeli: "",
  },
  loading: false, 
  error: null,
  status: null
}

const washerSlice = createSlice({
  name: "washer",
  initialState,
  reducers: {
    setWasherForm: (state, action: PayloadAction<Partial<Washer>>) => {
      state.washerForm = {
        ...state.washerForm,
        ...action.payload
      }
    },
    resetWasherForm: (state) => {
      state.washerForm = {
        ...initialState.washerForm
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // retrive admin
      .addCase(getWasher.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getWasher.fulfilled, (state, action) => {
        state.washerList = action.payload.result
        state.loading = false
      })
      .addCase(getWasher.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // add admin
      .addCase(addWasher.pending, (state) => {
        state.loading = true
        state.error = null
        state.status = null
      })
      .addCase(addWasher.fulfilled, (state, action) => {
        state.loading = false
        state.status = action.payload.status
      })
      .addCase(addWasher.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // delete admin
      .addCase(deleteWasher.pending, (state) => {
        state.loading = true
        state.error = null
        state.status = null
      })
      .addCase(deleteWasher.fulfilled, (state, action) => {
        state.loading = false
        state.status = action.payload.status
      })
      .addCase(deleteWasher.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
        state.status = null
      })

      //update admin
      .addCase(updateWasher.pending, (state) => {
        state.loading = true
        state.error = null
        state.status = null
      })
      .addCase(updateWasher.fulfilled, (state, action) => {
        state.loading = false
        state.status = action.payload.status
      })
      .addCase(updateWasher.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
        state.status = null
      })

      // change role
      .addCase(changeWasherStatus.pending, (state) => {
        state.loading = true
        state.error = null
        state.status = null
      })
      .addCase(changeWasherStatus.fulfilled, (state, action) => {
        state.loading = false
        state.status = action.payload.status
      })
      .addCase(changeWasherStatus.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
        state.status = null
      })
  }
})

export const { setWasherForm, resetWasherForm } = washerSlice.actions

export default washerSlice.reducer