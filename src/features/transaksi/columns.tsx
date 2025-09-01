import { formatDateWIB } from "@/utils/dateFormatter"
import { Badge } from "@radix-ui/themes"

export const transactionColumns = [
    {
      header: 'No',
      cell: ({row}: {row: {index: number}}) => row.index + 1
    },
    {
      header: 'Kode',
      accessorKey: 'kode_transaksi',
    },
    {
      header: 'Nama Pelanggan',
      accessorKey: 'nama_pelanggan',
    },
    {
      header: 'Tanggal Masuk',
      accessorKey: 'tanggal_masuk',
      cell: ({getValue}: {getValue: () => unknown}) => {
        const value = getValue() as string
        return formatDateWIB(value)
      }
    },
    {
      header: 'Status',
      accessorKey: 'status_proses',
      cell: ({getValue}: {getValue: () => unknown}) => {
        const value = getValue() as string
        const status = value === 'antrian' ? 'Antrian' : value === 'diproses' ? 'Diproses' : value === 'siap_diambil' ? 'Siap Diambil' : value === 'selesai' ? 'Selesai' : 'Dibatalkan'

        return (
          <Badge color={status === 'Antrian' ? 'yellow' : status === 'Diproses' ? 'blue' : status === 'Siap Diambil' ? 'gray' : status === 'Selesai' ? 'green' : 'red'}>
            {status}
          </Badge>
        )
      }
    },
    {
      header: 'Total',
      accessorKey: 'transaksi_detail',
      cell: ({ getValue }) => {
        const details = getValue();
        return details?.length ?? 0;
      }
    }
  ]