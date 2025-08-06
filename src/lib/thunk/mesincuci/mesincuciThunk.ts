import { createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from '@/lib/supabase'
import { toast } from "sonner";
import { MesinCuci } from "@/models/mesincuci.model";

export const retriveMesinCuci = createAsyncThunk<
  MesinCuci[], 
  Partial<{status_mesin: string; is_active: string}> | undefined, 
  { rejectValue: string }
>(
  "mesinCuci/retriveMesinCuci",
  async (params, { rejectWithValue }) => {

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
      toast.error('Something went wrong', {
        description: 'Failed to retrive mesin cuci',
      });
      return rejectWithValue(error.message)
    }

    return data as MesinCuci[]
  }
)

export const addMesinCuci = createAsyncThunk<
  { mesinCuci: MesinCuci; message: string },
  MesinCuci,
  { rejectValue: string }
>(
  "mesinCuci/addAdmin",
  async (payload, { rejectWithValue }) => {
    try{

      const mesinCuciPayload ={
        ...payload,
        nama: payload.merk + " " + payload.seri
      }

      const { data, error } = await supabase.from("mesin_cuci").insert(mesinCuciPayload).select()

      if(error) {
        toast.error('Something went wrong',{
          description: 'Failed to add mesin cuci',
        })
        return rejectWithValue(error.message)
      }

      toast.success('mesin cuci added successfully')
      return {
        mesinCuci: data[0] as MesinCuci,
        message: "mesin cuci added successfully"
      }
    } catch (error ) {
      toast.error('Failed to add mesin cuci');
      return rejectWithValue((error as Error).message)
    }
  }
)

export const deleteMesinCuci = createAsyncThunk<
  { deletedMesinCuci: MesinCuci; message: string }, 
  string, 
  { rejectValue: string }
>(
  "admin/deleteMesinCuci",
  async (id, { rejectWithValue }) => {
    try{

      const { data: currentData, error: fetchError } = await supabase
        .from("mesin_cuci")
        .select("status_mesin")
        .eq("id", id)
        .single()

      if (fetchError) {
        toast.error('Something went wrong',{
          description: 'Failed to delete admin',
        })
        return rejectWithValue(fetchError.message)
      }

      if(currentData.status_mesin === 'digunakan'){
        toast.error('Failed to delete mesin cuci', {
          description: 'Mesin cuci sedang digunakan',
        });
        return rejectWithValue("Failed to delete mesin cuci")
      }
      
      const { data, error } = await supabase
        .from("mesin_cuci")
        .delete()
        .eq("id", id)
        .select()
      if (error) {
        toast.error('Something went wrong',{
          description: 'Failed to delete mesin cuci',
        })
        return rejectWithValue(error.message)
      }

      toast.success('Mesin cuci deleted successfully')

      return {
        deletedMesinCuci: data[0],
        message: "Mesin cuci deleted successfully"
      }
    }catch (error) {
      toast.error('Failed to delete mesin cuci');
      return rejectWithValue((error as Error).message)
    }
  }
)

export const updateMesinCuci = createAsyncThunk<
  { updatedAdmin: MesinCuci; message: string }, 
  { id: string, mesinCuci: Partial<MesinCuci>},
  { rejectValue: string }
>(
  "admin/updateAdmin",
  async ({id, mesinCuci}, { rejectWithValue }) => {
    try{
      const { data, error } = await supabase.from("mesin_cuci").update(mesinCuci).eq("id", id).select()
      if (error) {
        toast.error('Something went wrong',{
          description: 'Failed to update mesin cuci',
        })
        return rejectWithValue(error.message)
      }

      toast.success('Mesin cuci updated successfully')
      
      return {
        updatedAdmin: data[0],
        message: "Mesin cuci updated successfully"
      }
    }catch (error) {
      toast.error('Failed to update mesin cuci');
      return rejectWithValue((error as Error).message)
    }
  }
)

export const changeActive = createAsyncThunk<
  { changedMesinCuci: MesinCuci; message: string }, 
  {id: string, is_active: boolean}, 
  { rejectValue: string }
>(
  "admin/changeRole",
  async ({id, is_active}, { rejectWithValue }) => {
    try{
      const { data: currentData, error: fetchError } = await supabase
        .from("mesin_cuci")
        .select("status_mesin")
        .eq("id", id)
        .single()

      if(fetchError || !currentData) {
        toast.error('Something went wrong',{
          description: 'Failed to change mesin cuci',
        })
        return rejectWithValue(fetchError.message as string)
      }

      if(!is_active && currentData.status_mesin === 'digunakan'){
        toast.error('Failed to change mesin cuci', {
          description: 'Mesin cuci sedang digunakan',
        });
        return rejectWithValue("Failed to change mesin cuci")
      }

      const { data, error } = await supabase
        .from("mesin_cuci")
        .update({is_active})
        .eq("id", id)
        .select()

      if (error) {
        toast.error('Something went wrong',{
          description: 'Failed to change mesin cuci',
        })
        return rejectWithValue(error.message as string)
      }

      toast.success('Mesin cuci changed successfully');

      return {
        changedMesinCuci: data[0],
        message: "Mesin cuci changed successfully"
      }
    }catch (error) {
      toast.error('Failed to change mesin cuci');
      return rejectWithValue((error as Error).message)
    }
  }
)