import { UserAuth } from "@/models/auth.model";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "sonner";

export const loginAdmin = createAsyncThunk(
  "auth/login",
  async ({username, password}: UserAuth, {rejectWithValue}) => {
    const res = await fetch('api/auth/login', {
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

    localStorage.setItem('auth', JSON.stringify(result.user))

    toast.success('Login successful', {
      duration: 1500,
      position: "top-center",
      description: "Redirecting..."
    })

    return result
  }
)

export const logoutAdmin = createAsyncThunk(
  "auth/logout",
  async ({id}: {id: string}, {rejectWithValue}) => {
    const res = await fetch('api/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({id})
    })

    const result = await res.json()
    console.log(result)

    if(!result.success){
      toast.error('Failed to logout', {
        position: "bottom-right"
      });
      return rejectWithValue('Failed to logout')
    }

    window.location.reload()
    localStorage.removeItem('auth')
    return result
  }
)