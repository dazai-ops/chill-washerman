import bcrypt from "bcryptjs";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from '@/lib/supabase'
import { toast } from "sonner";
import { Admin, AdminListResponse, CreateAdminForm, UpdateAdminForm } from "@/models/admin.model";

export const getAdmin = createAsyncThunk<
  AdminListResponse, 
  void, 
  { rejectValue: string }
>(
  "admin/getAdmin",
  async (_, { rejectWithValue }) => {
    try{
      const { data, error } = await supabase
      .from("admin")
      .select(
        "id, nama, username, no_telepon, alamat_rumah, jumlah_input, last_login, created_at, role, is_login"
      )
      .order("role", { ascending: false })

      if (error) {
        toast.error('Terjadi kesalahan', {
          description: 'Gagal mengambil data admin',
        });
        return rejectWithValue(error.message)
      }

      return {
        result: data as Admin[],
        message: "Data admin berhasil diambil",
        status: "success",
        error: null
      }
    } catch(error) {
      toast.error('Status: Failed', {
        description: 'Call the IT department',
      });
      return rejectWithValue((error as Error).message)
    }
    
  }
)

export const addAdmin = createAsyncThunk<
  { result: CreateAdminForm; message: string, status: string, error: string | null },
  { password_hash: string }, 
  { rejectValue: string }
>(
  "admin/addAdmin",
  async (admin, { rejectWithValue }) => {
    try{
      const hashedPassword = await bcrypt.hash(admin.password_hash, 10)

      const payload = {
        ...admin,
        password_hash: hashedPassword,
      }

      const { data, error } = await supabase
        .from("admin")
        .insert(payload)
        .select("nama, username, role")

      if(error) {
        toast.error('Terjadi kesalahan',{
          description: 'Admin gagal ditambahkan',
        })
        return rejectWithValue(error.message)
      }

      toast.success('Admin baru ditambahkan')
      return {
        result: data[0] as CreateAdminForm,
        message: "Admin baru ditambahkan",
        status: "success",
        error: null
      }
    } catch (error) {
      toast.error('Status: Failed', {
        description: 'Call the IT department',
      });
      return rejectWithValue((error as Error).message)
    }
  }
)

export const deleteAdmin = createAsyncThunk<
  { result: Partial<Admin>; message: string, status: string, error: string | null }, 
  number, 
  { rejectValue: string }
>(
  "admin/deleteAdmin",
  async ( id, { rejectWithValue }) => {
    try{
      const { data, error } = await supabase
        .from("admin")
        .delete()
        .eq("id", id)
        .select("id, nama, username, role")

      if (error) {
        toast.error('Terjadi kesalahan',{
          description: 'Admin gagal dihapus',
        })
        return rejectWithValue(error.message)
      }

      toast.success('Admin berhasil dihapus')

      return {
        result: data[0],
        message: "Admin berhasil dihapus",
        status: "success",
        error: null
      }
    }catch (error) {
      toast.error('Status: Failed', {
        description: 'Call the IT department',
      });
      return rejectWithValue((error as Error).message)
    }
  }
)

export const updateAdmin = createAsyncThunk<
  { result: Admin ; message: string; status: string }, 
  { id: string, payload: Partial<UpdateAdminForm>},
  { rejectValue: string }
>(
  "admin/updateAdmin",
  async ({id, payload}, { rejectWithValue }) => {
    try{
      const { data, error } = await supabase
        .from("admin")
        .update(payload)
        .eq("id", id)
        .select("nama, username, role")
        
      if (error) {
        toast.error('Terjadi kesalahan',{
          description: 'Data admin gagal diubah',
        })
        return rejectWithValue(error.message)
      }

      toast.success('Data admin berhasil diubah')
      
      return {
        result: data[0] as Admin,
        message: "Data admin berhasil diubah",
        status: "success",
        error: null
      }
    }catch (error) {
      toast.error('Status: Failed', {
        description: 'Call the IT department',
      });
      return rejectWithValue((error as Error).message)
    }
  }
)

export const updateAdminRole = createAsyncThunk<
  { result: Admin; message: string, status: string, error: string | null }, 
  { id: number, role: string}, 
  { rejectValue: string }
>(
  "admin/updateAdminRole",
  async ({id, role}, { rejectWithValue }) => {
    try{
      const { data, error } = await supabase
        .from("admin")
        .update({role})
        .eq("id", id)
        .select("nama, username, role")

      if (error) {
        toast.error('Terjadi kesalahan',{
          description: 'Gagal mengubah role admin',
        })
        return rejectWithValue(error.message as string)
      }

      toast.success('Role admin berhasil diubah');

      return {
        result: data[0] as Admin,
        message: "Role admin berhasil diubah",
        status: "success",
        error: null
      }
    }catch (error) {
      toast.error('Status: Failed', {
        description: 'Call the IT department',
      });
      return rejectWithValue((error as Error).message)
    }
  }
)