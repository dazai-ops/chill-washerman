
import { Badge } from "@radix-ui/themes"
import { formatRupiah } from "@/utils/helpers/formatters/rupiah"

export const apparelTableColumns = [
    {
      header: 'No',
      cell: ({row}: {row: {index: number}}) => row.index + 1
    },
    {
      header: 'Jenis Pakaian',
      accessorKey: 'jenis_pakaian',
    },
    {
      header: 'Harga/item',
      accessorKey: 'harga_per_item',
      cell: ({getValue}: {getValue: () => unknown}) => {
        const value = getValue() as string || ''
        if(value === '') {
          return (
            <Badge>
              -
            </Badge>
          )
        }
        const formattedValue = formatRupiah(parseInt(value))
        return (
          <Badge>
            {formattedValue}
          </Badge>
        )
      }
    },
    {
      header: 'Harga/kg',
      accessorKey: 'harga_per_kg',
      cell: ({getValue}: {getValue: () => unknown}) => {
        const value = getValue() as string || ''
        if(value === '') {
          return (
            <Badge>
              -
            </Badge>
          )
        }
        const formattedValue = formatRupiah(parseInt(value))
        return (
          <Badge>
            {formattedValue}
          </Badge>
        )
      }
    },
    {
      header: 'Satuan',
      accessorKey: 'satuan',
    },
  ]