//lib
import { toast } from "sonner";
import { supabase } from '@/lib/supabase'

//redux
import { createAsyncThunk } from "@reduxjs/toolkit";

//utils
import { TransactionDetail } from '@/models/transaksi.model';
import { ApiResponse, Transaction, CreateTransaction, CreateTransactionDetail, SingleTransaction } from "@/models/transaksitwo.model";

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

export const addTransaction = createAsyncThunk(
  "transaction/addTransaction",
  async (
    {transaction, transactionDetail}: {transaction: CreateTransaction, transactionDetail: CreateTransactionDetail[]}, 
    { rejectWithValue }
  ) => {
    try{
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const {sisa_bayar, kembalian, ...transactionPayload} = transaction
      const overviewPayload = {
        ...transactionPayload,
        dibuat_oleh: transaction.dibuat_oleh.id
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
          jenis_pakaian: detail.jenis_pakaian.id,
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
          dibuat_oleh(*),
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
            mesin_cuci(*),
            updated_by(*)
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
        dibuat_oleh: dibuat_oleh[0] ?? null,
        sisa_bayar: sisa_bayar,
        kembalian: kembalian
      }

      const detail = transaksi_detail ?? []
      
      return {
        status: "success",
        message: "Transaction retrieved successfully",
        result: {
          overview: transaction_overview,
          detail: detail
        }
      }
    } catch (error) {
      toast.error('Failed to retrieve transaction');
      return rejectWithValue((error as Error).message)
    }
  }
)

export const updateTransaction = createAsyncThunk<
  { message: string, res: string}, 
  { id: number, overview: Partial<Transaction>, detailTransaction: Partial<TransactionDetail>[], deletedDetail: []},
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
        if(detail.id){
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
            jenis_pakaian: detail.jenis_pakaian?.id
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
        res: "ok"
      }
    }catch (error) {
      toast.error('Failed to update transaction', {
        description: (error as Error).message
      });
      return rejectWithValue((error as Error).message)
    }
  }
)