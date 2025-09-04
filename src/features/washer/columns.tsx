import { Badge } from "@radix-ui/themes"

export const washerTableColumns = [
    {
      header: 'No',
      cell: ({row}: {row: {index: number}}) => row.index + 1
    },
    {
      header: 'Merk',
      accessorKey: 'merk',
    },
    {
      header: 'Seri',
      accessorKey: 'seri',
    },
    {
      header: 'Status',
      accessorKey: 'status_mesin',
      cell: ({getValue}: {getValue: () => unknown}) => {
        const value = getValue() as string
        const status = value === 'digunakan' ? 'Digunakan' : value === 'tidak_digunakan' ? 'Tidak Digunakan' : 'Dalam Perbaikan'

        return (
          <Badge color={status === 'Digunakan' ? 'red' : status === 'Tidak Digunakan' ? 'green' : 'yellow'}>
            {status}
          </Badge>
        )
      }
    },
    {
      header: 'Is Active',
      accessorKey: 'is_active',
      cell: ({getValue}: {getValue: () => unknown}) => {
        const value = getValue() as string

        return (
          <Badge color={value ? 'green' : 'yellow'}>
            {value ? 'Active' : 'Inactive'}
          </Badge>
        )
      }
    },
  ]