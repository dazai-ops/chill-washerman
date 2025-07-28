import { createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from '@/app/utils/supabaseClient'
import bcrypt from "bcryptjs";
import { toast } from "sonner";

export interface Admin {
  id: string;
  username: string;
  role: string;
  nama: string;
  no_telepon: string;
  alamat_rumah: string;
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
      .order("role", { ascending: false })

    if (error) {
      toast.error('Something went wrong', {
        description: 'Failed to retrive admin',
      });
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

      if(error) {
        toast.error('Something went wrong',{
          description: 'Failed to add admin',
        })
        return rejectWithValue(error.message)
      }

      toast.success('Admin added successfully')
      return {
        newAdmin: data[0] as Admin,
        message: "Admin added successfully"
      }
    } catch (error ) {
      toast.error('Failed to add admin');
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
      if (error) {
        toast.error('Something went wrong',{
          description: 'Failed to delete admin',
        })
        return rejectWithValue(error.message)
      }

      toast.success('Admin deleted successfully')

      return {
        deletedAdmin: data[0],
        message: "Admin deleted successfully"
      }
    }catch (error) {
      toast.error('Failed to delete admin');
      return rejectWithValue("Failed to delete admin")
    }
  }
)

export const updateAdmin = createAsyncThunk<
  { updatedAdmin: Admin; message: string }, 
  { id: string, admin: Partial<Admin>},
  { rejectValue: string }
>(
  "admin/updateAdmin",
  async ({id, admin}, { rejectWithValue }) => {
    console.log(id, admin)
    try{
      const { data, error } = await supabase.from("admin").update(admin).eq("id", id).select()
      if (error) {
        toast.error('Something went wrong',{
          description: 'Failed to update admin',
        })
        return rejectWithValue(error.message)
      }

      toast.success('Admin updated successfully')
      
      return {
        updatedAdmin: data[0],
        message: "Admin updated successfully"
      }
    }catch (error) {
      toast.error('Failed to update admin');
      return rejectWithValue("Failed to update admin")
    }
  }
)

export const changeRole = createAsyncThunk<
  { changedAdmin: Admin; message: string }, 
  {id: string, role: string}, 
  { rejectValue: string }
>(
  "admin/changeRole",
  async ({id, role}, { rejectWithValue }) => {
    try{
      const { data, error } = await supabase
        .from("admin")
        .update({role})
        .eq("id", id)
        .select()

      if (error) {
        toast.error('Something went wrong',{
          description: 'Failed to change admin role',
        })
        return rejectWithValue(error.message as string)
      }

      toast.success('Role changed successfully');

      return {
        changedAdmin: data[0],
        message: "Admin role changed successfully"
      }
    }catch (error) {
      toast.error('Failed to change admin role');
      return rejectWithValue("Failed to change admin role")
    }
  }
)