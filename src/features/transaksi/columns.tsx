import { formatDateWIB } from "@/utils/dateFormatter"
import { Badge } from "@radix-ui/themes"

export const transaksiColumns = [
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
        const status = value === 'antrian' ? 'Antrian' : value === 'dikerjakan' ? 'Dikerjakan' : value === 'selesai' ? 'Selesai' : value === 'diambil' ? 'Diambil' : 'Dibatalkan'

        return (
          <Badge color={status === 'Antrian' ? 'yellow' : status === 'Dikerjakan' ? 'blue' : status === 'Selesai' ? 'green' : status === 'Diambil' ? 'gray' : 'red'}>
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