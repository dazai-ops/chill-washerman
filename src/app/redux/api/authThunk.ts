import { createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "@/app/utils/supabaseClient";
import bcrypt from "bcryptjs";
import { toast } from "sonner";

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
      toast.error('Invalid credentials', {
        position: "top-center"
      });
      return rejectWithValue('Invalid credentials')
    }

    const passwordMatch = await bcrypt.compare(password, data.password_hash)
    
    if (error || !passwordMatch){ 
      toast.error('Invalid credentials', {
        position: "top-center"
      });
      return rejectWithValue('Invalid credentials')
    }

    toast.success('Login successful', {
      position: "top-center",
      description: "Redirecting..."
    })
    return data
  }
)