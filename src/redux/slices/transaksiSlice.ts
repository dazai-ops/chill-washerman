import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CreateTransaksiDetail, CreateTransaksiOverview, Transaksi } from "@/models/transaksi.model";
import { deleteTransaksi, retriveTransaksi, addTransaksi } from "@/lib/thunk/transaksi/transaksiThunk";
import { generateTransaksiCode } from "@/utils/generateCode";
interface TransaksiState {
  transaksiCollection: Transaksi[]
  transaksiOverview: CreateTransaksiOverview
  transaksiDetailList: CreateTransaksiDetail[]
  loading: boolean,
  error: string | null
  success: boolean
}

const initialState: TransaksiState = {
  transaksiCollection: [],
  transaksiOverview: {
    dibuat_oleh: {
      id: null,
      nama: ""
    },
    kode_transaksi: generateTransaksiCode(),
    nama_pelanggan: "",
    telepon_pelanggan: null,
    catatan: "",
    total_harga: 0,
    dibayarkan: 0,
    sisa_bayar: 0,
    kembalian: 0,
    status_pembayaran: "belum_lunas"
  },
  transaksiDetailList: [
    {
      jenis_pakaian: {
        id: null,
        jenis_pakaian: "",
        harga_per_item: 0,
        harga_per_kg: 0,
        satuan: ""
      },
      jumlah_item: 0,
      berat_kg: 0,
      layanan_setrika: false,
      total_harga_layanan: 0,
      catatan_admin: "",
      catatan_pelanggan: "",
      transaksi_parent: "",
      acuan_harga: "",
    }
  ],
  loading: false,
  error: null,
  success: false,
}

const transaksiSlice = createSlice({
  name: "transaksi",
  initialState,
  reducers: {
    setOverview: (
      state,
      action: PayloadAction<{
        key: keyof CreateTransaksiOverview,
        value: string | number | boolean | object
      }>
    ) => {
      const { key, value } = action.payload
      const detail = state.transaksiOverview

      if(!detail) return
      if(key === "dibuat_oleh" && typeof value === "object" && value !== null) {
        detail.dibuat_oleh = value as CreateTransaksiOverview["dibuat_oleh"]
      } else {
        detail[key] = value
      }
    },
    setDetailedField: (
      state,
      action: PayloadAction<{
        index: number,
        key: keyof CreateTransaksiDetail,
        value: string | number | boolean | object
      }>
    ) => {
      const { index, key, value } = action.payload
      const detail = state.transaksiDetailList[index]

      if(!detail) return

      if(key === "jenis_pakaian" && typeof value === "object" && value !== null) {
        detail.jenis_pakaian = value as CreateTransaksiDetail["jenis_pakaian"]
      } else {
        detail[key] = value
      }
    },
    addTransaksiDetailForm: (state) => {
      state.transaksiDetailList.push({
        jenis_pakaian: {
          id: null,
          jenis_pakaian: "",
          harga_per_item: 0,
          harga_per_kg: 0,
          satuan: ""
        },
        jumlah_item: 0,
        berat_kg: 0,
        layanan_setrika: false,
        total_harga_layanan: 0,
        catatan_admin: "",
        catatan_pelanggan: "",
        transaksi_parent: "",
        acuan_harga: ""
      })
    },
    calculatePriceService: (
      state,
      action: PayloadAction<{
        index: number,
      }>
    ) => {
      const {index} = action.payload
      const detail = state.transaksiDetailList[index]

      let total = 0
      if(detail.acuan_harga === 'berat') {
        total = detail.berat_kg * detail.jenis_pakaian?.harga_per_kg
      } else if(detail.acuan_harga === 'item') {
        total = detail.jumlah_item * detail.jenis_pakaian?.harga_per_item
      }

      if(detail.layanan_setrika) {
        total += total * 0.1
      }
      detail.total_harga_layanan = total || 0
    },
    calculateTotalPrice: (state) => {
      let total = 0
      state.transaksiDetailList.forEach(detail => {
        total += detail.total_harga_layanan
      })
      state.transaksiOverview.total_harga = total
    },
    calculateChangePrice : (state) => {
      let result = 0
      const totalharga = state.transaksiOverview.total_harga
      const dibayarkan = state.transaksiOverview.dibayarkan

      result = dibayarkan - totalharga

      console.log(result)
      if(result > 0) {
        state.transaksiOverview.kembalian = result
        state.transaksiOverview.sisa_bayar = 0
        state.transaksiOverview.status_pembayaran = "lunas"
      } else {
        state.transaksiOverview.kembalian = 0
        state.transaksiOverview.sisa_bayar = Math.abs(result)
        state.transaksiOverview.status_pembayaran = "belum_lunas"
      }

    },
    removeTransaksiDetailForm: (state, action: PayloadAction<number>) => {
      state.transaksiDetailList.splice(action.payload, 1)
    },
    resetTransaksiDetailForm: (state) => {
      state.transaksiDetailList = [
        {
          jenis_pakaian: {
            id: null,
            jenis_pakaian: "",
            harga_per_item: 0,
            harga_per_kg: 0,
            satuan: ""
          },
          jumlah_item: 0,
          berat_kg: 0,
          layanan_setrika: false,
          total_harga_layanan: 0,
          catatan_admin: "",
          catatan_pelanggan: "",
          transaksi_parent: "",
          acuan_harga: ""
        }
      ]
    },
    clearForm: (state) => {
      state.transaksiOverview = {
        dibuat_oleh: {
          id: null,
          nama: ""
        },
        dibayarkan: 0,
        kembalian: 0,
        sisa_bayar: 0,
        total_harga: 0,
        status_pembayaran: "",
        catatan: "",
        kode_transaksi: generateTransaksiCode(),
        nama_pelanggan: "",
        telepon_pelanggan: null
      }
      state.transaksiDetailList = []
    }
  },
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
      .addCase(addTransaksi.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = false
      })
      .addCase(addTransaksi.fulfilled, (state) => {
        state.loading = false
        state.success = true
      })
      .addCase(addTransaksi.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      // delete admin
      .addCase(deleteTransaksi.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = false
      })
      .addCase(deleteTransaksi.fulfilled, (state) => {
        state.loading = false
        state.success = false
      })
      .addCase(deleteTransaksi.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  }
})

export const {
  setOverview,
  setDetailedField,
  addTransaksiDetailForm,
  removeTransaksiDetailForm,
  resetTransaksiDetailForm,
  calculatePriceService,
  calculateTotalPrice,
  calculateChangePrice,
  clearForm
} = transaksiSlice.actions

export default transaksiSlice.reducer