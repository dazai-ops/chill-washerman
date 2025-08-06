export interface JenisPakaian {
  id?: number
  jenis_pakaian: string
  harga_per_item: number | string
  harga_per_kg: number | string
  satuan: string
  estimasi_waktu: number | string
  created_at?: string
}