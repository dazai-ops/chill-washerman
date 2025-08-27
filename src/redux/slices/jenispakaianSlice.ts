import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getApparel, updateApparel, addApparel, deleteApparel } from '@/lib/thunk/jenispakaian/jenispakaianThunk';
import { Apparel } from "@/models/jenispakaian.model";

interface ApparelState {
  apparelList: Apparel[],
  apparelForm: Partial<Apparel>,
  loading: boolean,
  error: string | null
  status: string | null
}

const initialState: ApparelState = {
  apparelList: [],
  apparelForm: {
    jenis_pakaian: "",
    satuan: "",
    harga_per_item: 0,
    harga_per_kg: 0,
    estimasi_waktu: "",
  },
  loading: false, 
  error: null,
  status: null
}

const jenisPakaianSlice = createSlice({
  name: "jenisPakaian",
  initialState,
  reducers: {
    setApparelForm: (state, action: PayloadAction<Partial<Apparel>>) => {
      state.apparelForm = {
        ...state.apparelForm,
        ...action.payload
      }
    },
    clearApparelForm: (state) => {
      state.apparelForm = {
        ...initialState.apparelForm
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // retrive admin
      .addCase(getApparel.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getApparel.fulfilled, (state, action) => {
        state.apparelList = action.payload.result
        state.loading = false
      })
      .addCase(getApparel.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // add admin
      .addCase(addApparel.pending, (state) => {
        state.loading = true
        state.error = null
        state.status = null
      })
      .addCase(addApparel.fulfilled, (state, action) => {
        state.loading = false
        state.status = action.payload.status
      })
      .addCase(addApparel.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // delete admin
      .addCase(deleteApparel.pending, (state) => {
        state.loading = true
        state.error = null
        state.status = null
      })
      .addCase(deleteApparel.fulfilled, (state, action) => {
        state.loading = false
        state.status = action.payload.status
      })
      .addCase(deleteApparel.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      //update admin
      .addCase(updateApparel.pending, (state) => {
        state.loading = true
        state.error = null
        state.status = null
      })
      .addCase(updateApparel.fulfilled, (state, action) => {
        state.loading = false
        state.status = action.payload.status
      })
      .addCase(updateApparel.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  }
})

export const { setApparelForm, clearApparelForm } = jenisPakaianSlice.actions
export default jenisPakaianSlice.reducer