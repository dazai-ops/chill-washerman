import { UserAuth } from "@/models/auth.model";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "sonner";

export const loginAdmin = createAsyncThunk(
  "auth/login",
  async ({username, password}: UserAuth, {rejectWithValue}) => {
    try{
      const res = await fetch('api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({username, password})
      })

      const result = await res.json()

      if(!res.ok || !result.success){
        toast.error('Gagal untuk login', {
          position: "top-center",
          description: "Username atau password salah"
        });
        return rejectWithValue('Gagal untuk login')
      }

      localStorage.setItem('auth', JSON.stringify(result.user))

      toast.success('Login berhasil', {
        duration: 1500,
        position: "top-center",
        description: "Selamat datang, " + result.user.nama
      })

      return result
    } catch (error) {
        toast.error('Status: Failed', {
          description: 'Call the IT department',
        });
      return rejectWithValue((error as Error).message)
    }
  }
)

export const logoutAdmin = createAsyncThunk(
  "auth/logout",
  async ({id}: {id: number}, {rejectWithValue}) => {
    try{
      const res = await fetch('api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({id})
      })

      const result = await res.json()

      if(!result.success){
        toast.error('Gagal untuk logout', {
          position: "bottom-right",
          description: "Hubungi Tim IT"
        });
        return rejectWithValue('Gagal untuk logout')
      }

      window.location.reload()
      localStorage.removeItem('auth')
      return result
    } catch (error) {
      toast.error('Status: Failed', {
        description: 'Call the IT department',
      });
      return rejectWithValue((error as Error).message)
    }
  }
)