export interface TransaksiDetail {
  id: number
  berat_kg: number
  jumlah_item: number
  layanan_setrika: boolean | null
  catatan_pelanggan: string
  catatan_admin: string
  status_proses: string
  created_at: string
  updated_at: string
  mesin_cuci: {
    id: number
    merk: string
    seri: string
  }[]
  jenis_pakaian: {
    id: number
    satuan: string
    jenis_pakaian: string
  }[]
  updated_by: null | {
    id: number
    nama: string
    username: string
  }[]
}

export interface Transaksi {
  id: number,
  kode_transaksi: string,
  nama_pelanggan: string,
  telepon_pelanggan: string,
  tanggal_masuk: string,
  tanggal_selesai: string | null,
  tanggal_keluar: string | null,
  total_harga: number,
  dibayarkan: number,
  status_pembayaran: string,
  status_proses: string,
  dibuat_oleh: {
    id: number,
    nama: string
  }[],
  transaksi_detail: TransaksiDetail[],
  created_at?: string,
  updated_at?: string
}

export interface CreateTransaksiOverview {
  dibuat_oleh: {
    id: null | number | string,
    nama: string
  },
  kode_transaksi: string,
  nama_pelanggan: string,
  telepon_pelanggan: number | null,
  catatan: string
  dibayarkan: number,
  total_harga: number,
  sisa_bayar: number,
  kembalian: number,
  status_pembayaran: string,
}

export interface CreateTransaksiDetail {
  jenis_pakaian: {
    id: string | number | null,
    jenis_pakaian: string
    harga_per_item: number
    harga_per_kg: number
    satuan: string
  },
  berat_kg: number,
  jumlah_item: number,
  layanan_setrika: boolean | null,
  mesin_cuci?: number | string,
  total_harga_layanan: number,
  catatan_pelanggan: string,
  catatan_admin: string
  transaksi_parent: number | string

  acuan_harga? : string
}