import { createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from '@/lib/supabase'
import { toast } from "sonner";
import { Washer, WasherListResponse } from '@/models/washer.model';

export const getWasher = createAsyncThunk<
  WasherListResponse, 
  Partial<{status_mesin: string; is_active: string}> | undefined, 
  { rejectValue: string }
>(
  "mesinCuci/getWasher",
  async (params, { rejectWithValue }) => {

    try{
      let query = supabase
        .from("mesin_cuci")
        .select("*")

      if(params?.status_mesin){
        query = query.eq("status_mesin", params.status_mesin)
      }

      if(params?.is_active){
        query = query.eq("is_active", params.is_active === "true")
      }

      query = query.order("is_active", { ascending: false })
      const { data, error } = await query

      if (error) {
        toast.error('Terjadi kesalahan', {
          description: 'Gagal mengambil data mesin cuci',
        });
        return rejectWithValue(error.message)
      }
      return {
        result: data as Washer[],
        message: "Mesin cucis retrived successfully",
        status: "success",
        error: null
      }
    }catch(error){
      toast.error('Status: Invalid', {
        description: 'Call the IT department',
      })
      return rejectWithValue((error as Error).message)
    }
    
  }
)

export const addWasher = createAsyncThunk<
  { result: Washer; message: string, status: string, error: string | null },
  Washer,
  { rejectValue: string }
>(
  "mesinCuci/addWasher",
  async (payload, { rejectWithValue }) => {
    try{
      const mesinCuciPayload ={
        ...payload,
        nama: payload.merk + " " + payload.seri
      }

      const { data, error } = await supabase.from("mesin_cuci").insert(mesinCuciPayload).select()

      if(error) {
        toast.error('Terjadi kesalahan',{
          description: 'Gagal menambahkan mesin cuci',
        })
        return rejectWithValue(error.message)
      }

      toast.success('Mesin cuci ditambahkan')
      return {
        result: data[0] as Washer,
        message: "Mesin cuci ditambahkan",
        status: "success",
        error: null
      }
    } catch (error ) {
      toast.error('Status: Invalid', {
        description: 'Call the IT department',
      });
      return rejectWithValue((error as Error).message)
    }
  }
)

export const deleteWasher = createAsyncThunk<
  { result: Washer; message: string, status: string, error: string | null }, 
  number, 
  { rejectValue: string }
>(
  "admin/deleteWasher",
  async (id, { rejectWithValue }) => {
    try{

      const { data: currentData, error: fetchError } = await supabase
        .from("mesin_cuci")
        .select("status_mesin")
        .eq("id", id)
        .single()

      if (fetchError) {
        toast.error('Terjadi kesalahan',{
          description: 'Gagal menghapus mesin cuci',
        })
        return rejectWithValue(fetchError.message)
      }

      if(currentData.status_mesin === 'digunakan'){
        toast.error('Terjadi kesalahan', {
          description: 'Mesin cuci sedang digunakan',
        });
        return rejectWithValue("Gagal menghapus mesin cuci")
      }
      
      const { data, error } = await supabase
        .from("mesin_cuci")
        .delete()
        .eq("id", id)
        .select()
      if (error) {
        toast.error('Terjadi kesalahan',{
          description: 'Gagal menghapus mesin cuci',
        })
        return rejectWithValue(error.message)
      }

      toast.success('Berhasil menghapus mesin cuci')

      return {
        result: data[0],
        message: "Berhasil menghapus mesin cuci",
        status: "success",
        error: null
      }
    }catch (error) {
      toast.error('Status: Invalid', {
        description: 'Call the IT department',
      });
      return rejectWithValue((error as Error).message)
    }
  }
)

export const updateWasher = createAsyncThunk<
  { result: Washer; message: string, status: string }, 
  { id: string, mesinCuci: Partial<Washer>},
  { rejectValue: string }
>(
  "admin/updateWasher",
  async ({id, mesinCuci}, { rejectWithValue }) => {
    try{
      const { data, error } = await supabase
        .from("mesin_cuci")
        .update(mesinCuci)
        .eq("id", id)
        .select()
        
      if (error) {
        toast.error('Terjadi kesalahan',{
          description: 'Gagal mengupdate mesin cuci',
        })
        return rejectWithValue(error.message)
      }

      toast.success('Berhasil mengupdate mesin cuci')
      
      return {
        result: data[0],
        message: "Berhasil mengupdate mesin cuci",
        status: "success"
      }
    }catch (error) {
      toast.error('Status: Invalid', {
        description: 'Call the IT department',
      });
      return rejectWithValue((error as Error).message)
    }
  }
)

export const changeWasherStatus = createAsyncThunk<
  { result: Washer; message: string, status: string, error: string | null }, 
  {id: number, is_active: boolean}, 
  { rejectValue: string }
>(
  "admin/changeWasherStatus",
  async ({id, is_active}, { rejectWithValue }) => {
    try{
      const { data: currentData, error: fetchError } = await supabase
        .from("mesin_cuci")
        .select("status_mesin")
        .eq("id", id)
        .single()

      if(fetchError || !currentData) {
        toast.error('Terjadi kesalahan',{
          description: 'Gagal mengubah status mesin cuci',
        })
        return rejectWithValue(fetchError.message as string)
      }

      if(!is_active && currentData.status_mesin === 'digunakan'){
        toast.error('Terjadi kesalahan', {
          description: 'Mesin cuci sedang digunakan',
        });
        return rejectWithValue("Gagal mengubah status mesin cuci")
      }

      const { data, error } = await supabase
        .from("mesin_cuci")
        .update({is_active})
        .eq("id", id)
        .select()

      if (error) {
        toast.error('Terjadi kesalahan',{
          description: 'Gagal mengubah status mesin cuci',
        })
        return rejectWithValue(error.message as string)
      }

      toast.success('Status mesin cuci berhasil diubah');
      
      return {
        result: data[0],
        message: "Status mesin cuci berhasil diubah",
        status: "success",
        error: null
      }
    }catch (error) {
      toast.error('Gagal mengubah status mesin cuci');
      return rejectWithValue((error as Error).message)
    }
  }
)