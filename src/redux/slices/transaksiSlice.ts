import { createSlice } from "@reduxjs/toolkit";
import { Transaksi } from "@/models/transaksi.model";
import { deleteTransaksi, retriveTransaksi } from "@/lib/thunk/transaksi/transaksiThunk";

interface TransaksiState {
  transaksiCollection: Transaksi[]
  loading: boolean,
  error: string | null
  success: string | null
}

const initialState: TransaksiState = {
  transaksiCollection: [],
  loading: false, 
  error: null,
  success: null
}

const transaksiSlice = createSlice({
  name: "transaksi",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // retrive admin
      .addCase(retriveTransaksi.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(retriveTransaksi.fulfilled, (state, action) => {
        state.transaksiCollection = action.payload
        state.loading = false
      })
      .addCase(retriveTransaksi.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // add admin
      // .addCase(addMesinCuci.pending, (state) => {
      //   state.loading = true
      //   state.error = null
      //   state.success = null
      // })
      // .addCase(addMesinCuci.fulfilled, (state, action) => {
      //   state.loading = false
      //   state.success = action.payload.message
      // })
      // .addCase(addMesinCuci.rejected, (state, action) => {
      //   state.loading = false
      //   state.error = action.payload as string
      // })

      // delete admin
      .addCase(deleteTransaksi.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = null
      })
      .addCase(deleteTransaksi.fulfilled, (state, action) => {
        state.loading = false
        state.success = action.payload.message
      })
      .addCase(deleteTransaksi.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // //update admin
      // .addCase(updateMesinCuci.pending, (state) => {
      //   state.loading = true
      //   state.error = null
      //   state.success = null
      // })
      // .addCase(updateMesinCuci.fulfilled, (state, action) => {
      //   state.loading = false
      //   state.success = action.payload.message
      // })
      // .addCase(updateMesinCuci.rejected, (state, action) => {
      //   state.loading = false
      //   state.error = action.payload as string
      // })

      // // change role
      // .addCase(changeActive.pending, (state) => {
      //   state.loading = true
      //   state.error = null
      //   state.success = null
      // })
      // .addCase(changeActive.fulfilled, (state, action) => {
      //   state.loading = false
      //   state.success = action.payload.message
      // })
      // .addCase(changeActive.rejected, (state, action) => {
      //   state.loading = false
      //   state.error = action.payload as string
      // })
  }
})

export default transaksiSlice.reducer