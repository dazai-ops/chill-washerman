import { createSlice } from "@reduxjs/toolkit";
import { addMesinCuci, changeActive, deleteMesinCuci, retriveMesinCuci, updateMesinCuci } from '@/lib/thunk/mesincuci/mesincuciThunk';
import { MesinCuci } from "@/models/mesincuci.model";

interface MesinCuciState {
  mesinCuciCollection: MesinCuci[]
  loading: boolean,
  error: string | null
  success: string | null
}

const initialState: MesinCuciState = {
  mesinCuciCollection: [],
  loading: false, 
  error: null,
  success: null
}

const mesinCuciSlice = createSlice({
  name: "mesinCuci",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // retrive admin
      .addCase(retriveMesinCuci.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(retriveMesinCuci.fulfilled, (state, action) => {
        state.mesinCuciCollection = action.payload
        state.loading = false
      })
      .addCase(retriveMesinCuci.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // add admin
      .addCase(addMesinCuci.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = null
      })
      .addCase(addMesinCuci.fulfilled, (state, action) => {
        state.loading = false
        state.success = action.payload.message
      })
      .addCase(addMesinCuci.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // delete admin
      .addCase(deleteMesinCuci.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = null
      })
      .addCase(deleteMesinCuci.fulfilled, (state, action) => {
        state.loading = false
        state.success = action.payload.message
      })
      .addCase(deleteMesinCuci.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      //update admin
      .addCase(updateMesinCuci.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = null
      })
      .addCase(updateMesinCuci.fulfilled, (state, action) => {
        state.loading = false
        state.success = action.payload.message
      })
      .addCase(updateMesinCuci.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // change role
      .addCase(changeActive.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = null
      })
      .addCase(changeActive.fulfilled, (state, action) => {
        state.loading = false
        state.success = action.payload.message
      })
      .addCase(changeActive.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  }
})

export default mesinCuciSlice.reducer