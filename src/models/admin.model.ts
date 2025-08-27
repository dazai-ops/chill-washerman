export interface Admin {
  id: number
  username: string
  role: string
  nama: string
  no_telepon: string
  alamat_rumah: string
  jumlah_input: number
  last_login: string
  is_login: boolean
  created_at: string
}

export type CreateAdminForm = Omit<Admin, "id" | "jumlah_input" | "is_login" | "last_login" | "created_at">
export type UpdateAdminForm = Omit<Admin, "id" | "role" | "jumlah_input" | "is_login" | "last_login" | "created_at">
export interface AdminListResponse {
  result: Admin[]
  message: string
  status: string
  error?: string | null
}