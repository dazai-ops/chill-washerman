import { createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from '@/lib/supabase'
import { toast } from "sonner";
import { Apparel, ApparelListResponse } from "@/models/jenispakaian.model";

export const getApparel = createAsyncThunk<
  ApparelListResponse, 
  void, 
  { rejectValue: string }
>(
  "Apparel/getApparel",
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

    return {
      status: "success",
      message: "Jenis pakaian retrieved successfully",
      result: data as Apparel[],
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
        toast.error('Something went wrong',{
          description: 'Failed to add jenis pakaian',
        })
        return rejectWithValue(error.message)
      }

      toast.success('Jenis pakaian added successfully')
      return {
        result: data[0] as Apparel,
        message: "Jenis pakaian added successfully",
        status: "success"
      }
    } catch (error ) {
      toast.error('Failed to add jenis pakaian');
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
        toast.error('Something went wrong',{
          description: 'Failed to delete jenis pakaian',
        })
        return rejectWithValue(error.message)
      }

      toast.success('Jenis pakaian deleted successfully')

      return {
        status: "success",
        result: data[0],
        message: "Jenis pakaian deleted successfully"
      }
    }catch (error) {
      toast.error('Failed to delete jenis pakaian');
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
        toast.error('Something went wrong',{
          description: 'Failed to update jenis pakaian',
        })
        return rejectWithValue(error.message)
      }

      toast.success('Jenis pakaian updated successfully')
      
      return {
        updatedAdmin: data[0],
        message: "Jenis pakaian updated successfully",
        status: "success"
      }
    }catch (error) {
      toast.error('Failed to update jenis pakaian');
      return rejectWithValue((error as Error).message)
    }
  }
)
