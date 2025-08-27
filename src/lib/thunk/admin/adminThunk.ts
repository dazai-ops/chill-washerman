import { createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from '@/lib/supabase'
import bcrypt from "bcryptjs";
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
        toast.error('Something went wrong', {
          description: 'Failed to retrive admin',
        });
        return rejectWithValue(error.message)
      }

      return {
        result: data as Admin[],
        message: "Admin retrieved successfully",
        status: "success",
        error: null
      }
    } catch(error) {
      toast.error('Failed to retrive admin', {
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
        toast.error('Something went wrong',{
          description: 'Failed to add admin',
        })
        return rejectWithValue(error.message)
      }

      toast.success('Admin added successfully')
      return {
        result: data[0] as CreateAdminForm,
        message: "Admin added successfully",
        status: "success",
        error: null
      }
    } catch (error) {
      toast.error('Failed to add admin', {
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
        toast.error('Something went wrong',{
          description: 'Failed to delete admin',
        })
        return rejectWithValue(error.message)
      }

      toast.success('Admin deleted successfully')

      return {
        result: data[0],
        message: "Admin deleted successfully",
        status: "success",
        error: null
      }
    }catch (error) {
      toast.error('Failed to delete admin', {
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
        toast.error('Something went wrong',{
          description: 'Failed to update admin',
        })
        return rejectWithValue(error.message)
      }

      toast.success('Admin updated successfully')
      
      return {
        result: data[0] as Admin,
        message: "Admin updated successfully",
        status: "success",
        error: null
      }
    }catch (error) {
      toast.error('Failed to update admin', {
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
        toast.error('Something went wrong',{
          description: 'Failed to change admin role',
        })
        return rejectWithValue(error.message as string)
      }

      toast.success('Role changed successfully');

      return {
        result: data[0] as Admin,
        message: "Admin role changed successfully",
        status: "success",
        error: null
      }
    }catch (error) {
      toast.error('Failed to change admin role', {
        description: 'Call the IT department',
      });
      return rejectWithValue((error as Error).message)
    }
  }
)