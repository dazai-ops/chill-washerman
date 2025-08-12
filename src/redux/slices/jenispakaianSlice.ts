import { createSlice } from "@reduxjs/toolkit";
import { retriveJenisPakaian, updateJenisPakaian, addJenisPakaian, deleteJenisPakaian } from '@/lib/thunk/jenispakaian/jenispakaianThunk';
import { JenisPakaian } from "@/models/jenispakaian.model";

interface JenisPakaianState {
  jenisPakaianCollection: JenisPakaian[]
  loading: boolean,
  error: string | null
  success: string | null
}

const initialState: JenisPakaianState = {
  jenisPakaianCollection: [],
  loading: false, 
  error: null,
  success: null
}

const jenisPakaianSlice = createSlice({
  name: "jenisPakaian",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // retrive admin
      .addCase(retriveJenisPakaian.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(retriveJenisPakaian.fulfilled, (state, action) => {
        state.jenisPakaianCollection = action.payload
        state.loading = false
      })
      .addCase(retriveJenisPakaian.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // add admin
      .addCase(addJenisPakaian.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = null
      })
      .addCase(addJenisPakaian.fulfilled, (state, action) => {
        state.loading = false
        state.success = action.payload.message
      })
      .addCase(addJenisPakaian.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // delete admin
      .addCase(deleteJenisPakaian.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = null
      })
      .addCase(deleteJenisPakaian.fulfilled, (state, action) => {
        state.loading = false
        state.success = action.payload.message
      })
      .addCase(deleteJenisPakaian.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      //update admin
      .addCase(updateJenisPakaian.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = null
      })
      .addCase(updateJenisPakaian.fulfilled, (state, action) => {
        state.loading = false
        state.success = action.payload.status
      })
      .addCase(updateJenisPakaian.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  }
})

export default jenisPakaianSlice.reducer