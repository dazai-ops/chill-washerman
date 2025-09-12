//lib
import { toast } from "sonner";
import { supabase } from '@/lib/supabase'

//redux
import { createAsyncThunk } from "@reduxjs/toolkit";

//utils
import { ApiResponse, Transaction, TransactionDetail, CreateTransaction, CreateTransactionDetail, SingleTransaction } from "@/models/transaction.model";

export const getTransaction = createAsyncThunk<
  ApiResponse<Partial<Transaction[]>>, 
  Partial<{start_date: Date, end_date: Date, status_proses: string, is_archive: boolean}> | undefined,
  { rejectValue: string }
>(
  "transaction/getTransaction",
  async (params, { rejectWithValue }) => {

    try{
      let query = supabase
        .from("transaksi")
        .select(`
          id,
          kode_transaksi,
          nama_pelanggan,
          telepon_pelanggan,
          tanggal_masuk,
          tanggal_selesai,
          tanggal_keluar,
          total_harga,
          dibayarkan,
          status_pembayaran,
          status_proses,
          catatan,
          created_at,
          updated_at,
          is_archive,
          dibuat_oleh(
            id,
            nama
          ),
          updated_by(
            id,
            nama,
            username
          ),
          transaksi_detail(
            id,
            transaksi_parent,
            berat_kg,
            jumlah_item,
            layanan_setrika,
            catatan_pelanggan,
            catatan_admin,
            status_proses,
            created_at,
            updated_at,
            tanggal_selesai,
            jenis_pakaian(
              id,
              jenis_pakaian,
              satuan
            ),
            mesin_cuci(
              id,
              merk,
              seri
            ),
            updated_by(
              id,
              nama,
              username
            )
          )
        `)
      
      if(params?.start_date){
        const start = new Date(params?.start_date.setHours(0,0,0,0)).toISOString()
        query = query.gte("created_at", start)
      }

      if(params?.end_date){
        const end = new Date(params?.end_date.setHours(23,59,59,0)).toISOString()
        query = query.lte("created_at", end)
      }

      if(params?.status_proses){
        query = query.eq("status_proses", params.status_proses).eq("is_archive", false)
      }

      if(params?.is_archive){
        query = query.eq("is_archive", params.is_archive)
      }

      query = query.order("created_at", { ascending: false })

      const {data, error} = await query

      if (error) {
        toast.error('Terjadi kesalahan', {
          description: 'Data transaksi gagal diambil',
        });
        return rejectWithValue(error.message)
      }

      return {
        status: "success",
        message: "Data transaksi berhasil diambil",
        result: data as unknown as Transaction[]
      }

    } catch (error) {
      toast.error('Status: Failed', {
        description: 'Call the IT department',
      });
      return rejectWithValue((error as Error).message)
    }
  }
)

export const addTransaction = createAsyncThunk<
  { status: string; message: string },
  { transaction: Partial<CreateTransaction>, transactionDetail: Partial<CreateTransactionDetail[]>},
  { rejectValue: string }
>(
  "transaction/addTransaction",
  async ({transaction, transactionDetail}, { rejectWithValue }) => {
    try{
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const {sisa_bayar, kembalian, ...transactionPayload} = transaction
      const overviewPayload = {
        ...transactionPayload,
        dibuat_oleh:  transaction.dibuat_oleh?.id
      }

      const { data: overviewData, error: overviewError } = await supabase
        .from("transaksi")
        .insert([overviewPayload])
        .select()

      if(overviewError){
        toast.error('Terjadi kesalahan',{
          description: 'Gagal menambahkan transaksi',
        })
        return rejectWithValue(overviewError.message)

      } else if(overviewData){
        const transactionId = overviewData[0].id
        const detailPayload = transactionDetail.map((detail) => ({
          ...detail,
          jenis_pakaian: detail?.jenis_pakaian.id,
          transaksi_parent: Number(transactionId)
        }))
  
        const { data: detailData, error: detailError } = await supabase
          .from("transaksi_detail")
          .insert(detailPayload)
          .select()
  
        if(detailError){
          toast.error('Terjadi kesalahan',{
            description: 'Gagal menambahkan detail transaksi',
          })
          return rejectWithValue(detailError.message)

        } else if(detailData){
          if(overviewData && detailData){
            await supabase.rpc("increment_jumlah_input", {
              admin_id: overviewData[0].dibuat_oleh
            })
          }
        }

        toast.success('Transaksi berhasil ditambahkan')
        return {
          status: "success",
          message: "Transaksi berhasil ditambahkan"
        }
      }
      return {
        status: "success",
        message: "Transaksi berhasil ditambahkan"
      }

    } catch (error ) {
      toast.error('Status: Failed', {
        description: 'Call the IT department',
      });
      return rejectWithValue((error as Error).message)
    }
  }
)

export const deleteTransaction = createAsyncThunk<
  { status: string;message: string }, 
  { id: number},
  { rejectValue: string }
>(
  "transaction/deleteTransaction",
  async ({id}, { rejectWithValue }) => {
    try{
      const { error } = await supabase
        .from("transaksi")
        .delete()
        .eq("id", id)
        .select()
      if (error) {
        toast.error('Terjadi kesalahan',{
          description: 'Gagal menghapus transaksi',
        })
        return rejectWithValue(error.message)
      }

      toast.success('Transaksi berhasil dihapus')

      return {
        status: "success",
        message: "Transaksi berhasil dihapus"
      }
    }catch (error) {
      toast.error('Status: Failed', {
        description: 'Call the IT department',
      });
      return rejectWithValue((error as Error).message)
    }
  }
)

export const getSingleTransaction = createAsyncThunk<
  ApiResponse<SingleTransaction>,
  {id: number},
  {rejectValue: string}
>(
  "transaction/getSingleTransaction",
  async ({id}, { rejectWithValue }) => {
    try{
      const {data, error} = await supabase
        .from("transaksi")
        .select(`
          id,
          kode_transaksi,
          nama_pelanggan,
          telepon_pelanggan,
          tanggal_masuk,
          tanggal_selesai,
          tanggal_keluar,
          total_harga,
          dibayarkan,
          status_pembayaran,
          status_proses,
          catatan,
          created_at,
          updated_at,
          updated_by,
          dibuat_oleh(
            id,
            nama,
            username
          ),
          transaksi_detail(
            id,
            transaksi_parent,
            berat_kg,
            jumlah_item,
            layanan_setrika,
            catatan_pelanggan,
            catatan_admin,
            status_proses,
            created_at,
            updated_at,
            total_harga_layanan,
            acuan_harga,
            jenis_pakaian(*),
            updated_by(
              id,
              nama,
              username
            )
          )
        `)
        .eq("id", id)
        .single()

      if(error){
        toast.error('Terjadi kesalahan',{
          description: 'Gagal mengambil data transaksi',
        })
        return rejectWithValue(error.message) 
      }
      if(!data){
        toast.error('Terjadi kesalahan',{
          description: 'Data transaksi tidak ditemukan',
        })
        return rejectWithValue("Data transaksi tidak ditemukan")
      }

      const {transaksi_detail, dibuat_oleh, ...rest} = data
      
      let sisa_bayar
      let kembalian

      if(data.status_pembayaran === "lunas"){
        sisa_bayar = 0
        kembalian = data.dibayarkan - data.total_harga
      } else {
        sisa_bayar = data.total_harga - data.dibayarkan
        kembalian = 0
      }

      const transaction_overview = {
        ...rest,
        dibuat_oleh: dibuat_oleh,
        sisa_bayar: sisa_bayar,
        kembalian: kembalian
      }

      const transaction_detail = transaksi_detail.map((detail) => ({
        ...detail,
        jenis_pakaian: detail.jenis_pakaian,
        updated_by: detail.updated_by
      })) ?? []
      
      return {
        status: "success",
        message: "Data transaksi berhasil diambil",
        result: {
          overview: transaction_overview,
          detail: transaction_detail
        }
      }
    } catch (error) {
      toast.error('Status: Failed', {
        description: 'Call the IT department',
      });
      return rejectWithValue((error as Error).message)
    }
  }
)

export const updateTransaction = createAsyncThunk<
  { message: string, status: string}, 
  { id: number, overview: Partial<Transaction>, detailTransaction: Partial<TransactionDetail[]>, deletedDetail: number[]},
  { rejectValue: string }
>(
  "transaction/updateTransaction",
  async ({id, overview, detailTransaction, deletedDetail}, { rejectWithValue }) => {
    try{
      
      const { error } = await supabase
        .from("transaksi")
        .update(overview)
        .eq("id", id)
        .select()
        
      if (error) {
        toast.error('Terjadi kesalahan',{
          description: 'Gagal mengupdate transaksi',
        })
        return rejectWithValue(error.message)
      }

      if(deletedDetail.length > 0){
        const { error: deleteError } = await supabase
          .from("transaksi_detail")
          .delete()
          .in("id", deletedDetail)
        if(deleteError){
          toast.error('Terjadi kesalahan',{
            description: 'Gagal menghapus detail transaksi',
          })
          return rejectWithValue(deleteError.message)
        }
      }

      for (const detail of detailTransaction){
        if(detail && detail.id){
          const detailUpdate = {
            ...detail,
            jenis_pakaian: detail.jenis_pakaian?.id,
            updated_at: new Date(),
            updated_by: overview.updated_by
          }
          const {error: updateError } = await supabase
            .from("transaksi_detail")
            .update([detailUpdate])
            .eq("id", detail.id)

          if(updateError){
            toast.error('Terjadi kesalahan',{
              description: 'Gagal mengupdate detail transaksi',
            })
            return rejectWithValue(updateError.message)
          }
        } else {
          const detailInsert = {
            ...detail,
            transaksi_parent: id,
            jenis_pakaian: detail?.jenis_pakaian?.id
          }
          const {error: insertError } = await supabase
            .from("transaksi_detail")
            .insert([detailInsert])

          if(insertError){
            toast.error('Terjadi kesalahan',{
              description: 'Gagal menambahkan detail transaksi',
            })
            return rejectWithValue(insertError.message)
          }
        }
      }

      const {data: detailData, error: detailError} = await supabase
        .from("transaksi_detail")
        .select("status_proses")
        .eq("transaksi_parent", id)

      if(detailError){
        toast.error('Terjadi kesalahan',{
          description: 'Gagal mengambil data detail transaksi',
        })
        return rejectWithValue(detailError.message)
      }

      let newStatusProses = "diproses"
      let newTanggalSelesai = null
      if(detailData && detailData.length > 0 && detailData.every(d => d.status_proses === "selesai")){
        newStatusProses = "siap_diambil"
        newTanggalSelesai = new Date()
      }

      const {error: statusError} = await supabase
        .from("transaksi")
        .update({
          status_proses: newStatusProses,
          tanggal_selesai: newTanggalSelesai,
          updated_at: new Date(),
        })
        .eq("id", id)

      if(statusError){
        toast.error('Terjadi kesalahan',{
          description: 'Gagal mengupdate status transaksi',
        })
        return rejectWithValue(statusError.message)
      }
      
      toast.success('Transaksi berhasil diupdate')
      
      return {
        message: "Transaksi berhasil diupdate",
        status: "success"
      }
    }catch (error) {
      toast.error('Status: Failed', {
        description: 'Call the IT department',
      });
      return rejectWithValue((error as Error).message)
    }
  }
)

export const updateDetailTransactionStatus = createAsyncThunk<
  { message: string, status: string}, 
  { id: number, payload: {status_proses: string, updated_by: string, mesin_cuci: string} },
  { rejectValue: string }
>(
  "transaction/updateDetailTransactionStatus",
  async ({id, payload}, { rejectWithValue }) => {
    try{
      const { data, error } = await supabase
        .from("transaksi_detail")
        .update({
          status_proses: payload.status_proses, 
          updated_by: payload.updated_by, 
          mesin_cuci: payload.mesin_cuci,
          updated_at: new Date(),
          tanggal_selesai: payload.status_proses === 'selesai' ? new Date() : null
        })
        .eq("id", id)
        .select()
        
      if (error) {
        toast.error('Terjadi kesalahan',{
          description: 'Status layanan gagal diubah',
        })
        return rejectWithValue(error.message)
      }

      const {data: details, error: detailError} = await supabase
        .from("transaksi_detail")
        .select("status_proses")
        .eq("transaksi_parent", data[0].transaksi_parent)

      if(detailError){
        toast.error('Terjadi kesalahan',{
          description: 'Status layanan gagal diubah',
        })
        return rejectWithValue(detailError.message)
      }

      const allWaiting = details.every(d => d.status_proses === 'menunggu')
      const allDone = details.every(d => d.status_proses === 'selesai')
      const allProcess = details.every(d => d.status_proses === 'dicuci' || d.status_proses === 'dikeringkan' || d.status_proses === 'disetrika')

      if(allWaiting){
        await supabase
          .from("transaksi")
          .update({
            status_proses: 'antrian',
            updated_by: payload.updated_by,
            updated_at: new Date(),
            tanggal_selesai: null
          })
          .eq("id", data[0].transaksi_parent)

        toast.success('Status layanan berhasil diubah')
        
        return {
          message: "Status layanan berhasil diubah",
          status: "success"
        }
      }

      if(allDone){
        await supabase
          .from("transaksi")
          .update({
            status_proses: 'siap_diambil',
            updated_by: payload.updated_by,
            updated_at: new Date(),
            tanggal_selesai: new Date()
          })
          .eq("id", data[0].transaksi_parent)

        toast.success('Status layanan berhasil diubah')
        
        return {
          message: "Status layanan berhasil diubah",
          status: "success"
        }
      }

      if(allProcess){
        await supabase
          .from("transaksi")
          .update({
            status_proses: 'diproses',
            updated_by: payload.updated_by,
            updated_at: new Date(),
            tanggal_selesai: null
          })
          .eq("id", data[0].transaksi_parent)

        toast.success('Status layanan berhasil diubah')
        
        return {
          message: "Status layanan berhasil diubah",
          status: "success"
        }
      }

      await supabase
        .from("transaksi")
        .update({
          status_proses: 'diproses',
          updated_by: payload.updated_by,
          updated_at: new Date()
        })
        .eq("id", data[0].transaksi_parent)

      toast.success('Status layanan berhasil diubah')
      
      return {
        message: "Status layanan berhasil diubah",
        status: "success"
      }
    }catch (error) {
      toast.error('Status: Failed', {
        description: 'Call the IT department',
      });
      return rejectWithValue((error as Error).message)
    }
  }
)

export const updatePaymentStatus = createAsyncThunk<
  { message: string, status: string}, 
  { id: number, payload: {status_proses: string, updated_by: number} },
  { rejectValue: string }
>(
  "transaction/updatePaymentStatus",
  async ({id, payload}, { rejectWithValue }) => {
    try{
      const { error } = await supabase
        .from("transaksi")
        .update({
          status_proses: payload.status_proses, 
          updated_by: payload.updated_by, 
          updated_at: new Date(),
          tanggal_keluar: new Date()
        })
        .eq("id", id)
        .select()
        
      if (error) {
        toast.error('Terjadi kesalahan',{
          description: 'Gagal mengupdate status pembayaran',
        })
        return rejectWithValue(error.message)
      }

      toast.success('Status transaksi berhasil diubah')
      
      return {
        message: "Status transaksi berhasil diubah",
        status: "success"
      }
    }catch (error) {
      toast.error('Status: Failed', {
        description: 'Call the IT department',
      });
      return rejectWithValue((error as Error).message)
    }
  }
)

export const getTransactionForChart = createAsyncThunk<
  { result: {date: string, selesai: number, belum_selesai: number}[], message: string, status: string },
  Partial<{start_date: Date, end_date: Date}> | undefined,
  { rejectValue: string }
>(
  "transaction/getTransactionForChart",
  async (params, { rejectWithValue} ) => {
    try {
      let query = supabase
        .from("transaksi")
        .select("created_at, status_proses")

      if(params?.start_date){
        const start = new Date(params?.start_date.setHours(0,0,0,0)).toISOString()
        query = query.gte("created_at", start)
      }

      if(params?.end_date){
        const end = new Date(params?.end_date.setHours(23,59,59,0)).toISOString()
        query = query.lte("created_at", end)
      }

      query = query
        .gte("created_at", new Date(new Date().setMonth(new Date().getMonth() - 3)).toISOString())
        .order("created_at", { ascending: true })

      const {data, error} = await query

      if(error){
        toast.error('Terjadi kesalahan',{
          description: 'Gagal mengambil data transaksi',
        })
        return rejectWithValue(error.message)
      }

      const grouped = data.reduce((acc: Record<string, {date: string, selesai: number, belum_selesai: number}>, row) => {
        const date = row.created_at.split("T")[0]
        if(!acc[date]) acc[date] = { date, selesai: 0, belum_selesai: 0}

        if(row.status_proses === 'selesai') {
          acc[date].selesai += 1
        } else {
          acc[date].belum_selesai += 1
        }

        return acc
      },{})

      const result = Object.values(grouped)
      console.log(result)

      return {
        result: result,
        message: "Data transaksi berhasil diambil",
        status: "success"
      }
    } catch (error) {
      toast.error('Status: Failed', {
        description: 'Call the IT department',
      });
      return rejectWithValue((error as Error).message)
    }
  }
)

export const archiveTransaction = createAsyncThunk<
  { message: string, status: string}, 
  { id: number, payload: {updated_by: number, act: string} },
  { rejectValue: string }
>(
  "transaction/archiveTransaction",
  async ({id, payload}, { rejectWithValue }) => {
    try{
      const { error } = await supabase
        .from("transaksi")
        .update({
          is_archive: payload.act === 'archive' ? true : false,
          updated_by: payload.updated_by,
          updated_at: new Date()
        })
        .eq("id", id)
        .select()
        
      if (error) {
        toast.error('Terjadi kesalahan',{
          description: 'Gagal mengubah transaksi',
        })
        return rejectWithValue(error.message)
      }

      toast.success(`Transaksi berhasil ${payload.act === 'archive' ? 'dibatalkan' : 'kembalikan'}`)
      
      return {
        message: `Transaksi berhasil ${payload.act === 'archive' ? 'dibatalkan' : 'kembalikan'}`,
        status: "success"
      }
    }catch (error) {
      toast.error('Status: Failed', {
        description: 'Call the IT department',
      });
      return rejectWithValue((error as Error).message)
    }
  }
)