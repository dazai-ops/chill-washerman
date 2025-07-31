export interface Admin {
  [key:string]: unknown
  id: string | undefined
  username?: string
  role?: string
  nama?: string
  no_telepon?: string
  alamat_rumah?: string
  last_login?: string
  jumlah_input?: number
  created_at?: string
}