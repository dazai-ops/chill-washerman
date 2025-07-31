import React from 'react'
import { Dialog, DataList, Badge, DropdownMenu } from '@radix-ui/themes'
import { EyeOpenIcon } from '@radix-ui/react-icons'
import { formatDateWIB } from '@/utils/dateFormatter'
import { Admin } from '@/lib/thunk/admin/adminThunk';

function AdminDetailDialog({data}: {data: Admin}) {
  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <DropdownMenu.Item onSelect={(e) => e.preventDefault()}>
          <EyeOpenIcon />Detail
        </DropdownMenu.Item>
      </Dialog.Trigger>

      <Dialog.Content maxWidth="450px">
        <Dialog.Title>{data.nama}</Dialog.Title>
        <DropdownMenu.Separator />
        
        <Dialog.Description size="2" mb="4">
          Detail
        </Dialog.Description>

        <DataList.Root>
          <DataList.Item align="center">
            <DataList.Label minWidth="88px">Role</DataList.Label>
            <DataList.Value>
              <Badge color={data.role === 'admin' ? 'green' : 'yellow'} variant="soft" radius="full">
                {data.role}
              </Badge>
            </DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label minWidth="88px">No Telepon</DataList.Label>
            <DataList.Value>{data.no_telepon}</DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label minWidth="88px">Username</DataList.Label>
            <DataList.Value>{data.username}</DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label minWidth="88px">Last Login</DataList.Label>
            <DataList.Value>
              {data.last_login != null && formatDateWIB(data.last_login) || <Badge color="jade" variant="soft" radius="full">Sedang Online</Badge> }
            </DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label minWidth="88px">Jumlah Input</DataList.Label>
            <DataList.Value>
              <Badge color="blue" variant="soft" radius="full">
                {data.jumlah_input || 0}
              </Badge>
            </DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label minWidth="88px">Alamat Rumah</DataList.Label>
            <DataList.Value>
              {data.alamat_rumah}
            </DataList.Value>
          </DataList.Item>
        </DataList.Root>

      </Dialog.Content>
    </Dialog.Root>
  )
}

export default AdminDetailDialog
