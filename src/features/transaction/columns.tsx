import { formatDate } from "@/utils/helpers/formatters/date"
import { Badge } from "@radix-ui/themes"

export const transactionTableColumns = [
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
        return formatDate(value, "long")
      }
    },
    {
      header: 'Status',
      accessorKey: 'status_proses',
      cell: ({getValue, row}) => {
        const value = getValue() as string
        const data = row.original as {is_archive?: boolean}

        if(data.is_archive){
          return <Badge color="red">Dibatalkan</Badge>
        }

        const map: Record<string, { label: string; color: 'orange' | 'iris' | 'brown' | 'green' | 'red' }> = {
          antrian: { label: 'Antrian', color: 'orange' },
          diproses: { label: 'Diproses', color: 'iris' },
          siap_diambil: { label: 'Siap Diambil', color: 'brown' },
          selesai: { label: 'Selesai', color: 'green' },
          pending: { label: 'Pending', color: 'red' },
        }

        const status = map[value] ?? {label: "Unknown", color: "gray"}

        return <Badge color={status.color}>{status.label}</Badge>
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