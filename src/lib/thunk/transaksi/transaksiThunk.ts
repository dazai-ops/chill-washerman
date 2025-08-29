//lib
import { toast } from "sonner";
import { supabase } from '@/lib/supabase'

//redux
import { createAsyncThunk } from "@reduxjs/toolkit";

//utils
import { ApiResponse, Transaction, TransactionDetail, CreateTransaction, CreateTransactionDetail, SingleTransaction } from "@/models/transaksitwo.model";

export const getTransaction = createAsyncThunk<
  ApiResponse<Partial<Transaction[]>>, 
  void, 
  { rejectValue: string }
>(
  "transaction/getTransaction",
  async (_, { rejectWithValue }) => {
    const { data, error } = await supabase
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
        dibuat_oleh(
          id,
          nama
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
      .order("created_at", { ascending: false })

    if (error) {
      toast.error('Something went wrong', {
        description: 'Failed to retrive transaction',
      });
      return rejectWithValue(error.message)
    }

    return {
      status: "success",
      result: data as unknown as Transaction[],
      message: "Transaction retrieved successfully"
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
        toast.error('Something went wrong',{
          description: 'Failed to add transaction',
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
          toast.error('Something went wrong',{
            description: 'Failed to add detail transaction',
          })
          return rejectWithValue(detailError.message)

        } else if(detailData){
          if(overviewData && detailData){
            await supabase.rpc("increment_jumlah_input", {
              admin_id: overviewData[0].dibuat_oleh
            })
          }
        }

        toast.success('transaction added successfully')
        return {
          status: "success",
          message: "Transaction added successfully"
        }
      }
      return {
        status: "success",
        message: "Transaction added successfully"
      }

    } catch (error ) {
      toast.error('Failed to add transaction');
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
        toast.error('Something went wrong',{
          description: 'Failed to delete transaction',
        })
        return rejectWithValue(error.message)
      }

      toast.success('Transaction deleted successfully')

      return {
        status: "success",
        message: "Transaction deleted successfully"
      }
    }catch (error) {
      toast.error('Failed to delete transaction');
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
        toast.error('Something went wrong',{
          description: 'Failed to retrieve transaction',
        })
        return rejectWithValue(error.message) 
      }
      if(!data){
        toast.error('Transaction not found')
        return rejectWithValue("Transaction not found")
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
        message: "Transaction retrieved successfully",
        result: {
          overview: transaction_overview,
          detail: transaction_detail
        }
      }
    } catch (error) {
      toast.error('Failed to retrieve transaction', {
        description: (error as Error).message
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
        toast.error('Something went wrong',{
          description: 'Failed to update transaksi',
        })
        return rejectWithValue(error.message)
      }

      if(deletedDetail.length > 0){
        const { error: deleteError } = await supabase
          .from("transaksi_detail")
          .delete()
          .in("id", deletedDetail)
        if(deleteError){
          toast.error('Something went wrong',{
            description: 'Failed to delete detail transaksi',
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
            toast.error('Something went wrong',{
              description: 'Failed to update detail transaksi',
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
            toast.error('Something went wrong',{
              description: 'Failed to insert detail transaction',
            })
            return rejectWithValue(insertError.message)
          }
        }
      }

      toast.success('Transaction updated successfully')
      
      return {
        message: "Transaction updated successfully",
        status: "success"
      }
    }catch (error) {
      toast.error('Failed to update transaction', {
        description: (error as Error).message
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
        toast.error('Something went wrong',{
          description: 'Failed to update transaksi',
        })
        return rejectWithValue(error.message)
      }

      const {data: details, error: detailError} = await supabase
        .from("transaksi_detail")
        .select("status_proses")
        .eq("transaksi_parent", data[0].transaksi_parent)

      if(detailError){
        toast.error('Something went wrong',{
          description: 'Failed to update transaksi',
        })
        return rejectWithValue(detailError.message)
      }

      const allWaiting = details.every(d => d.status_proses === 'menunggu')
      const allDone = details.every(d => d.status_proses === 'selesai')

      if(allWaiting){
        await supabase
          .from("transaksi")
          .update({
            status_proses: 'antrian',
            updated_by: payload.updated_by,
            updated_at: new Date()
          })
          .eq("id", data[0].transaksi_parent)

        toast.success('Transaction status updated successfully')
        
        return {
          message: "Transaction status updated successfully",
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

        toast.success('Transaction status updated successfully')
        
        return {
          message: "Transaction status updated successfully",
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

      toast.success('Transaction status updated successfully')
      
      return {
        message: "Transaction status updated successfully",
        status: "success"
      }
    }catch (error) {
      toast.error('Failed to update transaction status', {
        description: (error as Error).message
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
        toast.error('Something went wrong',{
          description: 'Failed to update transaksi',
        })
        return rejectWithValue(error.message)
      }

      toast.success('Payment status updated successfully')
      
      return {
        message: "Payment status updated successfully",
        status: "success"
      }
    }catch (error) {
      toast.error('Failed to update payment status', {
        description: (error as Error).message
      });
      return rejectWithValue((error as Error).message)
    }
  }
)