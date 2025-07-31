export interface MesinCuci {
  [key: string]: unknown;
  id: string;
  nama: string;
  merk: string;
  seri: string;
  jumlah_digunakan: number;
  status_mesin: string;
  tahun_pembuatan: string;
  tanggal_dibeli: string;
  terakhir_digunakan: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}