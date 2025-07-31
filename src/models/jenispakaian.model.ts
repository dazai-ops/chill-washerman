export interface JenisPakaian {
  [key: string]: string
  id: string
  jenis_pakaian: string
  harga_per_item: string
  harga_per_kg: string
  satuan: string
  estimasi_waktu: string
  created_at: string
}

export interface JenisPakaianCreateModalProps {
  jenis_pakaian: string
  satuan: string
  harga_per_item: string
  harga_per_kg: string
  estimasi_waktu: string
}