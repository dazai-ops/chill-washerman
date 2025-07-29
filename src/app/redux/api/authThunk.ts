import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "sonner";

interface LoginPayload {
  username: string;
  password: string;
}

export const loginAdmin = createAsyncThunk(
  "auth/login",
  async ({username, password}: LoginPayload, {rejectWithValue}) => {
    const res = await fetch('redux/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({username, password})
    })

    const result = await res.json()

    if(!res.ok || !result.success){
      toast.error('Invalid credentials', {
        position: "top-center"
      });
      return rejectWithValue('Invalid credentials')
    }

    toast.success('Login successful', {
      position: "top-center",
      description: "Redirecting..."
    })

    return result
  }
)