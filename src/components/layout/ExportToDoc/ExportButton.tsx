"use client";

import * as XLSX from "xlsx";
import { toast } from "sonner";
import { DownloadIcon } from "@radix-ui/react-icons";
import { Button } from "@radix-ui/themes";
import { formatToTitleCase } from "@/utils/helpers/formatters/titleCase";
import { formatDate } from "@/utils/helpers/formatters/date";
import Papa  from "papaparse";

interface Row {
  "Nomer Transaksi": string;
  "Kode Transaksi": string;
  "Tanggal Masuk": string | undefined;
  "Tanggal Selesai": string | undefined;
  "Tanggal Keluar": string | undefined;
  "Nama Pelanggan": string;
  "Total Harga": string;
  "Status Pembayaran": string;
  "Status Proses": string;
  "Jenis Pakaian": string;
  "Nomer Detail": string;
  "Berat (Kg)": number;
  "Jumlah (Item)": number;
  "Detail Status Proses": string;
}

type TransactionDetail = {
  jenis_pakaian: { jenis_pakaian: string };
  berat_kg: number;
  jumlah_item: number;
  status_proses: string;
};

type Transaction = {
  kode_transaksi: string;
  nama_pelanggan: string;
  total_harga: number;
  status_pembayaran: string;
  status_proses: string;
  created_at: string;
  tanggal_selesai: string;
  tanggal_keluar: string;
  transaksi_detail: TransactionDetail[];
};

export default function ExportHistory({ data, docType }: { data: Transaction[], docType: string }) {
  const handleExport = () => {
    if (data.length === 0) {
      toast.error("Terjadi kesalahan", {
        description: "Tidak ada data transaksi untuk diunduh, silahkan pilih rentan waktu yang lain",
        position: "top-center",
      });
      return;
    }

    const rows: Row[] = [];

    data.forEach((trx, indexTrx) => {
      trx.transaksi_detail.forEach((detail, index) => {
        if (index === 0) {
          rows.push({
            "Nomer Transaksi": indexTrx + 1 as unknown as string,
            "Kode Transaksi": trx.kode_transaksi,
            "Tanggal Masuk": trx.created_at ? formatDate(trx.created_at, 'long') : '',
            "Nama Pelanggan": trx.nama_pelanggan,
            "Tanggal Selesai": trx.tanggal_selesai ? formatDate(trx.tanggal_selesai, 'long') : '',
            "Total Harga": trx.total_harga as unknown as string,
            "Status Pembayaran": formatToTitleCase(trx.status_pembayaran),
            "Status Proses": formatToTitleCase(trx.status_proses),
            "Tanggal Keluar": trx.tanggal_keluar ? formatDate(trx.tanggal_keluar, 'long') : '',
            "Jenis Pakaian": detail.jenis_pakaian.jenis_pakaian,
            "Nomer Detail": `${indexTrx + 1}.${index + 1}`,
            "Berat (Kg)": detail.berat_kg,
            "Jumlah (Item)": detail.jumlah_item,
            "Detail Status Proses": formatToTitleCase(detail.status_proses),
          });
        } else {
          rows.push({
            "Nomer Transaksi": "",
            "Kode Transaksi": "",
            "Tanggal Masuk": "",
            "Nama Pelanggan": "",
            "Tanggal Selesai": "",
            "Total Harga": "",
            "Status Pembayaran": "",
            "Status Proses": "",
            "Tanggal Keluar": "",
            "Nomer Detail": `${indexTrx + 1}.${index + 1}`,
            "Jenis Pakaian": detail.jenis_pakaian.jenis_pakaian,
            "Berat (Kg)": detail.berat_kg,
            "Jumlah (Item)": detail.jumlah_item,
            "Detail Status Proses": formatToTitleCase(detail.status_proses),
          });
        }
      });
    });

    if(docType === 'xlsx') {
      // Convert ke worksheet
      const worksheet = XLSX.utils.json_to_sheet(rows);
  
      // Buat workbook
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Rekapan");
  
      // Simpan ke file .xlsx
      XLSX.writeFile(workbook, "Rekapan.xlsx");
    } else if (docType === 'csv') {
      const csv = Papa.unparse(rows)

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob)

      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", "Rekapan.csv")
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  };

  return (
    <Button 
      size="2"
      color="gray"
      highContrast={docType === 'xlsx' ? false : true}
      onClick={handleExport}
    >
      <DownloadIcon/>{docType === 'xlsx' ? 'XLSX' : 'CSV'}
    </Button>
  );
}
