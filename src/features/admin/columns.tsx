import { Badge } from "@radix-ui/themes"

export const adminTableColumns = [
    {
      header: 'No',
      cell: ({row}: {row: {index: number}}) => row.index + 1
    },
    {
      header: 'Nama',
      accessorKey: 'nama',
    },
    {
      header: 'Username',
      accessorKey: 'username',
    },
    {
      header: 'No Telepon',
      accessorKey: 'no_telepon',
    },
    {
      header: 'Role',
      accessorKey: 'role',
      cell: ({getValue}: {getValue: () => unknown}) => {
        const value = getValue() as string
        const role = value === 'admin' ? 'Admin' : 'Superuser'

        return (
          <Badge color={role === 'Admin' ? 'pink' : 'sky'}>
            {role}
          </Badge>
        )
      }
    },
  ]