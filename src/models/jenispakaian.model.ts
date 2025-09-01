export interface Apparel {
  id: number | null
  jenis_pakaian?: string
  harga_per_item: number
  harga_per_kg: number
  satuan: string
  estimasi_waktu?: string
  created_at?: string
}

export interface ApparelListResponse {
  result: Apparel[]
  status: string
  message: string
  error?: string | null
}