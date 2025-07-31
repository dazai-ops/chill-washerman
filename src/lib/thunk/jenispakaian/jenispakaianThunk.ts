import { createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from '@/lib/supabase'
import { toast } from "sonner";
import { JenisPakaian, JenisPakaianCreateModalProps } from "@/models/jenispakaian.model";

export const retriveJenisPakaian = createAsyncThunk<
  JenisPakaian[], 
  void, 
  { rejectValue: string }
>(
  "jenisPakaian/retriveJenisPakaian",
  async (_, { rejectWithValue }) => {
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

    return data as JenisPakaian[]
  }
)

export const addJenisPakaian = createAsyncThunk<
  { jenisPakaian : JenisPakaianCreateModalProps; message: string },
  JenisPakaianCreateModalProps,
  { rejectValue: string }
>(
  "jenisPakaian/addAdmin",
  async (payload, { rejectWithValue }) => {
    try{

      const { data, error } = await supabase.from("pakaian").insert(payload).select()

      if(error) {
        toast.error('Something went wrong',{
          description: 'Failed to add jenis pakaian',
        })
        return rejectWithValue(error.message)
      }

      toast.success('Jenis pakaian added successfully')
      return {
        jenisPakaian: data[0] as JenisPakaian,
        message: "Jenis pakaian added successfully"
      }
    } catch (error ) {
      toast.error('Failed to add jenis pakaian');
      return rejectWithValue((error as Error).message)
    }
  }
)

export const deleteJenisPakaian = createAsyncThunk<
  { deleteJenisPakaian: JenisPakaian; message: string }, 
  string, 
  { rejectValue: string }
>(
  "jenisPakaian/deleteJenisPakaian",
  async (id, { rejectWithValue }) => {
    try{
      
      const { data, error } = await supabase
        .from("pakaian")
        .delete()
        .eq("id", id)
        .select()

      if (error) {
        toast.error('Something went wrong',{
          description: 'Failed to delete jenis pakaian',
        })
        return rejectWithValue(error.message)
      }

      toast.success('Jenis pakaian deleted successfully')

      return {
        deleteJenisPakaian: data[0],
        message: "Jenis pakaian deleted successfully"
      }
    }catch (error) {
      toast.error('Failed to delete jenis pakaian');
      return rejectWithValue((error as Error).message)
    }
  }
)

export const updateJenisPakaian = createAsyncThunk<
  { updatedAdmin: JenisPakaian; message: string }, 
  { id: string, jenisPakaian: Partial<JenisPakaian>},
  { rejectValue: string }
>(
  "admin/updateAdmin",
  async ({id, jenisPakaian}, { rejectWithValue }) => {
    try{
      const { data, error } = await supabase.from("pakaian").update(jenisPakaian).eq("id", id).select()
      if (error) {
        toast.error('Something went wrong',{
          description: 'Failed to update jenis pakaian',
        })
        return rejectWithValue(error.message)
      }

      toast.success('Jenis pakaian updated successfully')
      
      return {
        updatedAdmin: data[0],
        message: "Jenis pakaian updated successfully"
      }
    }catch (error) {
      toast.error('Failed to update jenis pakaian');
      return rejectWithValue((error as Error).message)
    }
  }
)
