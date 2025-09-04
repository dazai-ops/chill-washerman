import { createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from '@/lib/supabase'
import { toast } from "sonner";
import { Apparel, ApparelListResponse } from "@/models/apparel.model";

export const getApparel = createAsyncThunk<
  ApparelListResponse, 
  void, 
  { rejectValue: string }
>(
  "Apparel/getApparel",
  async (_, { rejectWithValue }) => {
    try{
    const { data, error } = await supabase
      .from("pakaian")
      .select("*")
      .order("jenis_pakaian", { ascending: false })

    if (error) {
      toast.error('Something went wrong', {
        description: 'Failed to retrive jenis pakaian',
      });
      return rejectWithValue(error.message)
    }

    return {
      status: "success",
      message: "Data jenis pakaian berhasil diambil",
      result: data as Apparel[],
    }
    }catch (error) {
      toast.error('Status: Invalid', {
        description: 'Call the IT department',
      });
      return rejectWithValue((error as Error).message)
    }
    
  }
)

export const addApparel = createAsyncThunk<
  { result : Apparel; message: string, status: string },
  Apparel,
  { rejectValue: string }
>(
  "Apparel/addApparel",
  async (payload, { rejectWithValue }) => {
    try{
      const { data, error } = await supabase
        .from("pakaian")
        .insert(payload)
        .select()

      if(error) {
        toast.error('Terjadi kesalahan',{
          description: 'Gagal menambahkan jenis pakaian',
        })
        return rejectWithValue(error.message)
      }

      toast.success('Jenis pakaian ditambahkan')
      return {
        result: data[0] as Apparel,
        message: "Jenis pakaian ditambahkan",
        status: "success"
      }
    } catch (error ) {
      toast.error('Status: Invalid', {
        description: 'Call the IT department',
      });
      return rejectWithValue((error as Error).message)
    }
  }
)

export const deleteApparel = createAsyncThunk<
  { result: Apparel; message: string, status: string }, 
  string, 
  { rejectValue: string }
>(
  "Apparel/deleteApparel",
  async (id, { rejectWithValue }) => {
    try{
      const { data, error } = await supabase
        .from("pakaian")
        .delete()
        .eq("id", id)
        .select()

      if (error) {
        toast.error('Terjadi kesalahan',{
          description: 'Gagal menghapus jenis pakaian',
        })
        return rejectWithValue(error.message)
      }

      toast.success('Jenis pakaian berhasil dihapus')

      return {
        status: "success",
        result: data[0],
        message: "Jenis pakaian berhasil dihapus"
      }
    }catch (error) {
      toast.error('Status: Invalid', {
        description: 'Call the IT department',
      });
      return rejectWithValue((error as Error).message)
    }
  }
)

export const updateApparel = createAsyncThunk<
  { updatedAdmin: Apparel; message: string, status: string }, 
  { id: string | number, payload: Partial<Apparel>},
  { rejectValue: string }
>(
  "Apparel/updateApparel",
  async ({id, payload}, { rejectWithValue }) => {
    try{
      const { data, error } = await supabase
        .from("pakaian")
        .update(payload)
        .eq("id", id)
        .select()

      if (error) {
        toast.error('Terjadi kesalahan',{
          description: 'Gagal mengupdate jenis pakaian',
        })
        return rejectWithValue(error.message)
      }

      toast.success('Jenis pakaian berhasil diupdate')
      
      return {
        updatedAdmin: data[0],
        message: "Jenis pakaian berhasil diupdate",
        status: "success"
      }
    }catch (error) {
      toast.error('Gagal mengupdate jenis pakaian');
      return rejectWithValue((error as Error).message)
    }
  }
)
