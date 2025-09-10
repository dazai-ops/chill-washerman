"use client";
import { Transaction, TransactionDetail } from "@/models/transaction.model";
import { formatDate } from "@/utils/helpers/formatters/date";
import { DownloadIcon } from "@radix-ui/react-icons";
import { Button } from "@radix-ui/themes";
import Papa  from "papaparse";
import { toast } from "sonner";

interface CsvButtonProps {
  data: Transaction[]
}

interface Row {
  kode_transaksi: string;
  created_at: string | undefined;
  nama_pelanggan: string;
  total_harga: string;
  status_pembayaran: string;
  status_proses: string;
  detail_jenis_pakaian: string
  detail_berat_kg: number;
  detail_jumlah_item: number;
  detail_status_proses: string | undefined;
}

export default function ExportCSVButton({data}: CsvButtonProps) {

  const handleExportCsv = () => {

    if(!data || !Array.isArray(data)) {
      return toast.error('Data transaksi tidak ditemukan')
    }

    const rows: Row[] = []
    data.forEach((trx: Transaction) => {
      trx.transaksi_detail.forEach((detail: TransactionDetail, index: number) => {
        if(index === 0) {
          rows.push({
            kode_transaksi: trx.kode_transaksi,
            created_at: trx.created_at ? formatDate(trx.created_at, 'long') : '',
            nama_pelanggan: trx.nama_pelanggan,
            total_harga: trx.total_harga as unknown as string,
            status_pembayaran: trx.status_pembayaran,
            status_proses: trx.status_proses,
            detail_jenis_pakaian: detail.jenis_pakaian?.jenis_pakaian,
            detail_berat_kg: detail.berat_kg,
            detail_jumlah_item: detail.jumlah_item,
            detail_status_proses: detail.status_proses
          })
        }else{
          rows.push({
            kode_transaksi: "",
            created_at: "",
            nama_pelanggan: "",
            total_harga: "",
            status_pembayaran: "",
            status_proses: "",
            detail_jenis_pakaian: detail.jenis_pakaian?.jenis_pakaian,
            detail_berat_kg: detail.berat_kg,
            detail_jumlah_item: detail.jumlah_item,
            detail_status_proses: detail.status_proses
          })
        }
      })
    })

    const rowsWithLabels = rows.map(r => ({
      "Kode Transaksi": r.kode_transaksi,
      "Tanggal Masuk": r.created_at,
      "Nama Pelanggan": r.nama_pelanggan,
      "Total Harga": r.total_harga,
      "Status Pembayaran": r.status_pembayaran,
      "Status Proses Transaksi": r.status_proses,
      "Jenis Pakaian": r.detail_jenis_pakaian,
      "Berat (kg)": r.detail_berat_kg,
      "Jumlah Item": r.detail_jumlah_item,
      "Status Proses Detail": r.detail_status_proses,
    }))
    const csv = Papa.unparse(rowsWithLabels)

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob)

    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", "rekapan.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Button 
      size="2"
      color="gray"
      highContrast
      onClick={handleExportCsv}
      className="px-4 py-2 bg-blue-500 text-white rounded-md"
    >
      <DownloadIcon/> Export CSV
    </Button>
  );
}
