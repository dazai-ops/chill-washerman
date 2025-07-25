import { createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "@/app/utils/supabaseClient";
import bcrypt from "bcryptjs";

interface LoginPayload {
  username: string;
  password: string;
}

export const loginAdmin = createAsyncThunk(
  "auth/login",
  async ({username, password}: LoginPayload, {rejectWithValue}) => {
    const {data,error} = await supabase
      .from('admin')
      .select('*')
      .eq('username', username)
      .single()

      
    if (error || !data){
      return rejectWithValue('Invalid credentials')
    }

    const passwordMatch = await bcrypt.compare(password, data.password_hash)
    
    if (error || !passwordMatch){ 
      return rejectWithValue('Invalid credentials')
    }

    return data
  }
)