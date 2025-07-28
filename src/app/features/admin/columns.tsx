import { Badge } from "@radix-ui/themes"

export const adminColumns = [
    {
      header: 'ID',
      accessorKey: 'id',
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
        const role = value === 'admin' ? 'admin' : 'superuser'

        return (
          <Badge color={role === 'admin' ? 'green' : 'yellow'}>
            {role}
          </Badge>
        )
      }
    },
  ]