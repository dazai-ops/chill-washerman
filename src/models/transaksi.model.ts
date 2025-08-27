import { Apparel } from "./jenispakaian.model"

export interface BaseUser {
  id?: number | null,
  nama?: string,
  username?: string
}

export interface BaseEntity {
  id?: number | null,
  created_at: string,
  updated_at: string
  updated_by?: BaseUser
}

export interface TransactionDetail extends BaseEntity {
  kode_transaksi?: string
  berat_kg: number
  jumlah_item: number
  layanan_setrika: boolean | null
  catatan_pelanggan: string
  catatan_admin: string
  status_proses?: string
  acuan_harga?: string
  total_harga_layanan?: number
  transaksi_parent?: number | string
  jenis_pakaian: Apparel[]
}

export interface Transaction {
  id?: number | null,
  kode_transaksi: string,
  nama_pelanggan: string,
  telepon_pelanggan: number | null,
  tanggal_masuk: string,
  tanggal_selesai: string | null,
  tanggal_keluar: string | null,
  total_harga: number,
  dibayarkan: number,
  status_pembayaran: string,
  status_proses: string,
  dibuat_oleh: BaseUser,
  created_at?: Date | string,
  updated_at?: Date | string,
  updated_by?: number
  sisa_bayar?: number,
  kembalian?: number,
  catatan?: string,
  transaksi_detail: TransactionDetail[],
}

export interface CreateTransactionOverview {
  id?: number | null
  dibuat_oleh: BaseUser
  kode_transaksi: string,
  nama_pelanggan: string,
  telepon_pelanggan: number | null,
  catatan: string
  dibayarkan: number,
  total_harga: number,
  sisa_bayar: number,
  status_pembayaran: string,
  kembalian?: number,
}

export interface CreateTransactionDetail {
  id?: number
  jenis_pakaian: Apparel
  berat_kg: number,
  jumlah_item: number,
  layanan_setrika: boolean,
  total_harga_layanan: number,
  catatan_pelanggan: string,
  catatan_admin: string
  transaksi_parent?: string
  acuan_harga?: string
}

export interface TransactionListResponse {
  result: Transaction[]
  message: string
  status: string
  error?: string | null
}

export interface SingleTransactionListResponse {
  result: {
    overview: Omit<Transaction, "transaksi_detail">,
    detail: TransactionDetail[]
  }
  message: string
  status: string
  error?: string | null
}