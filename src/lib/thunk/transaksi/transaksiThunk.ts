import { CreateTransaksiDetail, CreateTransaksiOverview, Transaksi, TransaksiDetail } from '@/models/transaksi.model';
import { createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from '@/lib/supabase'
import { toast } from "sonner";

export const retriveTransaksi = createAsyncThunk<
  Transaksi[], 
  void, 
  { rejectValue: string }
>(
  "transaksi/retriveTransaksi",
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
        description: 'Failed to retrive transaksi',
      });
      return rejectWithValue(error.message)
    }

    return data as unknown as Transaksi[]
  }
)

export const addTransaksi = createAsyncThunk(
  "transaksi/addTransaksi",
  async ({transaksi, transaksiDetail}: {transaksi: CreateTransaksiOverview, transaksiDetail: CreateTransaksiDetail}, { rejectWithValue }) => {
    // return console.log(transaksi, transaksiDetail)
    try{
      const { data: transaksiData, error: transaksiError } = await supabase
        .from("transaksi")
        .insert([transaksi])
        .select()

      if(transaksiError){
        toast.error('Something went wrong',{
          description: 'Failed to add transaksi',
        })
        return rejectWithValue(transaksiError.message)
      }

      const transaksiId = transaksiData[0].id
      console.log(transaksiId)
      const detailWithParent = {
        ...transaksiDetail,
        transaksi_parent: Number(transaksiId)
      }

      const { data: transaksiDetailData, error: transaksiDetailError } = await supabase
        .from("transaksi_detail")
        .insert(detailWithParent)
        .select()

      if(transaksiDetailError){
        toast.error('Something went wrong',{
          description: 'Failed to add detail transaksi',
        })
        return rejectWithValue(transaksiDetailError.message)
      }

      toast.success('transaksi added successfully')
      return {
        transaksi: transaksiDetailData[0] as Transaksi,
        message: "transaksi added successfully"
      }
    } catch (error ) {
      toast.error('Failed to add transaksi');
      return rejectWithValue((error as Error).message)
    }
  }
)

// export const addMesinCuci = createAsyncThunk<
//   { mesinCuci: MesinCuci; message: string },
//   MesinCuci,
//   { rejectValue: string }
// >(
//   "mesinCuci/addAdmin",
//   async (payload, { rejectWithValue }) => {
//     try{

//       const mesinCuciPayload ={
//         ...payload,
//         nama: payload.merk + " " + payload.seri
//       }

//       const { data, error } = await supabase.from("mesin_cuci").insert(mesinCuciPayload).select()

//       if(error) {
//         toast.error('Something went wrong',{
//           description: 'Failed to add mesin cuci',
//         })
//         return rejectWithValue(error.message)
//       }

//       toast.success('mesin cuci added successfully')
//       return {
//         mesinCuci: data[0] as MesinCuci,
//         message: "mesin cuci added successfully"
//       }
//     } catch (error ) {
//       toast.error('Failed to add mesin cuci');
//       return rejectWithValue((error as Error).message)
//     }
//   }
// )

export const deleteTransaksi = createAsyncThunk<
  { deletedTransaksi: Transaksi; message: string }, 
  { id: number},
  { rejectValue: string }
>(
  "transaksi/deleteTransaksi",
  async ({id}, { rejectWithValue }) => {
    try{
      const { data, error } = await supabase
        .from("transaksi")
        .delete()
        .eq("id", id)
        .select()
      if (error) {
        toast.error('Something went wrong',{
          description: 'Failed to delete transaksi',
        })
        return rejectWithValue(error.message)
      }

      toast.success('Transaksi deleted successfully')

      return {
        deletedTransaksi: data[0],
        message: "Transaksi deleted successfully"
      }
    }catch (error) {
      toast.error('Failed to delete transaksi');
      return rejectWithValue((error as Error).message)
    }
  }
)

// export const updateMesinCuci = createAsyncThunk<
//   { updatedAdmin: MesinCuci; message: string }, 
//   { id: string, mesinCuci: Partial<MesinCuci>},
//   { rejectValue: string }
// >(
//   "admin/updateAdmin",
//   async ({id, mesinCuci}, { rejectWithValue }) => {
//     try{
//       const { data, error } = await supabase.from("mesin_cuci").update(mesinCuci).eq("id", id).select()
//       if (error) {
//         toast.error('Something went wrong',{
//           description: 'Failed to update mesin cuci',
//         })
//         return rejectWithValue(error.message)
//       }

//       toast.success('Mesin cuci updated successfully')
      
//       return {
//         updatedAdmin: data[0],
//         message: "Mesin cuci updated successfully"
//       }
//     }catch (error) {
//       toast.error('Failed to update mesin cuci');
//       return rejectWithValue((error as Error).message)
//     }
//   }
// )

// export const changeActive = createAsyncThunk<
//   { changedMesinCuci: MesinCuci; message: string }, 
//   {id: string, is_active: boolean}, 
//   { rejectValue: string }
// >(
//   "admin/changeRole",
//   async ({id, is_active}, { rejectWithValue }) => {
//     try{
//       const { data: currentData, error: fetchError } = await supabase
//         .from("mesin_cuci")
//         .select("status_mesin")
//         .eq("id", id)
//         .single()

//       if(fetchError || !currentData) {
//         toast.error('Something went wrong',{
//           description: 'Failed to change mesin cuci',
//         })
//         return rejectWithValue(fetchError.message as string)
//       }

//       if(!is_active && currentData.status_mesin === 'digunakan'){
//         toast.error('Failed to change mesin cuci', {
//           description: 'Mesin cuci sedang digunakan',
//         });
//         return rejectWithValue("Failed to change mesin cuci")
//       }

//       const { data, error } = await supabase
//         .from("mesin_cuci")
//         .update({is_active})
//         .eq("id", id)
//         .select()

//       if (error) {
//         toast.error('Something went wrong',{
//           description: 'Failed to change mesin cuci',
//         })
//         return rejectWithValue(error.message as string)
//       }

//       toast.success('Mesin cuci changed successfully');

//       return {
//         changedMesinCuci: data[0],
//         message: "Mesin cuci changed successfully"
//       }
//     }catch (error) {
//       toast.error('Failed to change mesin cuci');
//       return rejectWithValue((error as Error).message)
//     }
//   }
// )