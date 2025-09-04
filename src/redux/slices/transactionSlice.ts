import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { deleteTransaction, getTransaction, addTransaction, getSingleTransaction, updateTransaction, updateDetailTransactionStatus, updatePaymentStatus, getTransactionForChart } from "@/lib/thunk/transaction/transactionThunk";
import { generateTransaksiCode } from "@/features/transaction/generateCode";
import { Transaction, CreateTransaction, CreateTransactionDetail, TransactionDetail  } from "@/models/transaction.model";

interface ChartItem {
  date: string,
  selesai: number,
  belum_selesai: number
}
interface TransaksiState {
  transactionList: Partial<Transaction[]>
  transactionOverview: Partial<CreateTransaction> | Partial<Transaction>
  transactionDetail: Partial<CreateTransactionDetail[]> | Partial<TransactionDetail[]>
  transactionDetailDelete: number[] 
  currentTransaction: Partial<Transaction> | null
  chartTransaction: ChartItem[]
  loading: boolean,
  error: string | null
  status: string | null
}

const initialState: TransaksiState = {
  transactionList: [],
  transactionOverview: {
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
  transactionDetail: [
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
  transactionDetailDelete: [],
  currentTransaction: null,
  chartTransaction: [],
  loading: false,
  error: null,
  status: "",
}

const transactionSlice = createSlice({
  name: "transaksi",
  initialState,
  reducers: {
    setTransactionOverviewField: <K extends keyof CreateTransaction> (
      state: TransaksiState,
      action: PayloadAction<{
        key: K,
        value: CreateTransaction[K]
      }>
    ) => {
      const { key, value } = action.payload
      const detail = state.transactionOverview

      if(!detail) return
      if(key === "dibuat_oleh" && typeof value === "object" && value !== null) {
        detail.dibuat_oleh = value as CreateTransaction["dibuat_oleh"]
      } else {
        detail[key] = value
      }
    },
    setTransactionDetailField: <K extends keyof CreateTransactionDetail> (
      state: TransaksiState,
      action: PayloadAction<{
        index: number,
        key: K,
        value: CreateTransactionDetail[K]
      }>
    ) => {
      const { index, key, value } = action.payload
      const detail = state.transactionDetail[index]

      if(!detail) return

      if(key === "jenis_pakaian" && typeof value === "object" && value !== null) {
        detail.jenis_pakaian = value as CreateTransactionDetail["jenis_pakaian"]
      } else {
        detail[key] = value
      }
    },
    addTransactionDetailForm: (state) => {
      state.transactionDetail.push({
        jenis_pakaian: {
          id: null,
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
    calculateServicePrice: (
      state,
      action: PayloadAction<{
        index: number,
      }>
    ) => {
      const {index} = action.payload
      const detail = state.transactionDetail[index]

      let total = 0

      if(detail) {
        if(detail.acuan_harga === 'berat') {
          total = detail.berat_kg * detail.jenis_pakaian?.harga_per_kg
        } else if(detail.acuan_harga === 'item') {
          total = detail.jumlah_item * detail.jenis_pakaian?.harga_per_item
        }
  
        if(detail.layanan_setrika) {
          total += total * 0.1
        }
        detail.total_harga_layanan = total || 0
      }
    },
    calculateTotalPrice: (state) => {
      let total = 0
      state.transactionDetail.forEach(detail => {
        if(detail?.total_harga_layanan){
          total += detail.total_harga_layanan
        }
      })
      state.transactionOverview.total_harga = total
    },
    calculateBalance : (state) => {
      let result = 0
      const totalharga = state.transactionOverview.total_harga || 0
      const dibayarkan = state.transactionOverview.dibayarkan || 0

      result = dibayarkan - totalharga

      if(result > 0) {
        state.transactionOverview.kembalian = result
        state.transactionOverview.sisa_bayar = 0
        state.transactionOverview.status_pembayaran = "lunas"
      } else {
        state.transactionOverview.kembalian = 0
        state.transactionOverview.sisa_bayar = Math.abs(result)
        state.transactionOverview.status_pembayaran = "belum_lunas"
      }

    },
    removeTransactionDetailForm: (state, action: PayloadAction<{index: number, id?: number}>) => {
      state.transactionDetail.splice(action.payload.index, 1)
      if(action.payload.id){
        state.transactionDetailDelete.push(action.payload.id)
      }
    },
    resetTransactionDetailForm: (state) => {
      state.transactionDetail = [
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
      state.transactionOverview = {
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
      state.transactionDetail = []
    },
    clearStatus: (state) => {
      state.status = null
    }
  },
  extraReducers: (builder) => {
    builder
      // retrive admin
      .addCase(getTransaction.pending, (state) => {
        state.loading = true
      })
      .addCase(getTransaction.fulfilled, (state, action) => {
        state.transactionList = action.payload.result
        state.loading = false
      })
      .addCase(getTransaction.rejected, (state) => {
        state.loading = false
      })

      // add admin
      .addCase(addTransaction.pending, (state) => {
        state.loading = true
      })
      .addCase(addTransaction.fulfilled, (state, action) => {
        state.loading = false
        state.status = action.payload?.status as string
      })
      .addCase(addTransaction.rejected, (state) => {
        state.loading = false
      })

      // delete admin
      .addCase(deleteTransaction.pending, (state) => {
        state.loading = true
        state.status = ''
      })
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.loading = false
        state.status = action.payload.status
      })
      .addCase(deleteTransaction.rejected, (state) => {
        state.loading = false
        state.status = ''
      })

      .addCase(getSingleTransaction.pending, (state) => {
        state.loading = true
      })
      .addCase(getSingleTransaction.fulfilled, (state, action) => {
        state.loading = false
        state.transactionOverview = action.payload.result.overview
        state.transactionDetail = action.payload.result.detail
      })
      .addCase(getSingleTransaction.rejected, (state) => {
        state.loading = false
      })

      .addCase(updateTransaction.pending, (state) => {
        state.loading = true
      })
      .addCase(updateTransaction.fulfilled, (state, action) => {
        state.loading = false
        state.status = action.payload.status
      })
      .addCase(updateTransaction.rejected, (state) => {
        state.loading = false
      })

      //
      .addCase(updateDetailTransactionStatus.pending, (state) => {
        state.loading = true
        state.status = null
      })
      .addCase(updateDetailTransactionStatus.fulfilled, (state, action) => {
        state.loading = false
        state.status = action.payload.status
      })
      .addCase(updateDetailTransactionStatus.rejected, (state) => {
        state.loading = false
      })

      //
      .addCase(updatePaymentStatus.pending, (state) => {
        state.loading = true
        state.status = null
      })
      .addCase(updatePaymentStatus.fulfilled, (state, action) => {
        state.loading = false
        state.status = action.payload.status
      })
      .addCase(updatePaymentStatus.rejected, (state) => {
        state.loading = false
      })

      .addCase(getTransactionForChart.pending, (state) => {
        state.loading = true
      })
      .addCase(getTransactionForChart.fulfilled, (state, action) => {
        state.loading = false
        state.chartTransaction = action.payload.result
      })
      .addCase(getTransactionForChart.rejected, (state) => {
        state.loading = false
      })
  }
})

export const {
  setTransactionOverviewField,
  setTransactionDetailField,
  addTransactionDetailForm,
  removeTransactionDetailForm,
  resetTransactionDetailForm,
  calculateServicePrice,
  calculateTotalPrice,
  calculateBalance,
  clearForm,
  clearStatus
} = transactionSlice.actions

export default transactionSlice.reducer