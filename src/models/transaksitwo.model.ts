import {Apparel} from "./jenispakaian.model";
import { Washer } from "./mesincuci.model";

export interface BaseUser {
  id?: number | null
  nama?: string
  username?: string
}

export interface BaseEntity {
  id?: number | null
  created_at?: string
  updated_at?: string
  updated_by?: BaseUser
}

export interface Transaction extends BaseEntity{
  kode_transaksi: string
  nama_pelanggan: string
  telepon_pelanggan: string | null
  tanggal_masuk: string
  tanggal_selesai: string | null
  tanggal_keluar: string | null
  total_harga: number
  dibayarkan: number
  status_pembayaran: string
  status_proses: string
  catatan: string
  dibuat_oleh: BaseUser
  transaksi_detail: TransactionDetail[]

  sisa_bayar?: number
  kembalian?: number
}

export interface TransactionDetail extends BaseEntity {
  berat_kg: number
  jumlah_item: number
  layanan_setrika: boolean | null
  catatan_pelanggan: string
  catatan_admin: string
  status_proses?: string
  acuan_harga?: string
  total_harga_layanan: number
  transaksi_parent?: number | string
  mesin_cuci?: Washer
  jenis_pakaian: Apparel
  kode_transaksi?: string
  tanggal_selesai?: string
}

export interface ApiResponse<T> {
  result: T
  message: string
  status: string
  error?: string | null
}

export type CreateTransaction = Omit<Transaction, "created_at" | "updated_at" | "updated_by" | "transaksi_detail" | "tanggal_masuk" | "tanggal_selesai" | "tanggal_keluar" | "status_proses"> & {
  sisa_bayar?: number
  kembalian?: number
}
export type CreateTransactionDetail = Omit<TransactionDetail, "created_at" | "updated_at" | "updated_by" | "status_proses" | "mesin_cuci">
export type SingleTransaction = {
  overview: Omit<Transaction, "transaksi_detail" | "mesin_cuci">
  detail: Omit<TransactionDetail[], "jenis_pakaian" | "mesin_cuci" | "updated_by"> & {
    jenis_pakaian: Apparel[]
    updated_by: BaseUser[]
  }
}
