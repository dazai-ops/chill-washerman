import { createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from '@/app/utils/supabaseClient'
import bcrypt from "bcryptjs";

export interface Admin {
  username: string;
  role: string;
}

export const retriveAdmin = createAsyncThunk<
  Admin[], 
  void, 
  { rejectValue: string }
>(
  "admin/retriveAdmin",
  async (_, { rejectWithValue }) => {
    const { data, error } = await supabase
      .from("admin")
      .select("id, nama, username, no_telepon, alamat_rumah, jumlah_input, last_login, created_at, role")
    if (error) {
      return rejectWithValue(error.message)
    }
    return data as Admin[]
  }
)

export const addAdmin = createAsyncThunk<
  {newAdmin: Admin; message: string, }, 
  {password_hash: string}, 
  { rejectValue: string }
>(
  "admin/addAdmin",
  async (admin, { rejectWithValue }) => {
    try{
      const hashedPassword = await bcrypt.hash(admin.password_hash, 10)

      const adminPayload = {
        ...admin,
        password_hash: hashedPassword
      }

      const { data, error } = await supabase.from("admin").insert(adminPayload).select()

      if(error) return rejectWithValue(error.message)
      return {
        newAdmin: data[0] as Admin,
        message: "Admin added successfully"
      }
    } catch (error ) {
      return rejectWithValue("Failed to add admin")
    }
  }
)

export const deleteAdmin = createAsyncThunk<
  { deletedAdmin: Admin; message: string }, 
  string, 
  { rejectValue: string }
>(
  "admin/deleteAdmin",
  async (id, { rejectWithValue }) => {
    try{
      const { data, error } = await supabase.from("admin").delete().eq("id", id).select()
      if (error) return rejectWithValue(error.message)
      return {
        deletedAdmin: data[0],
        message: "Admin deleted successfully"
      }
    }catch (error) {
      return rejectWithValue("Failed to delete admin")
    }
  }
)