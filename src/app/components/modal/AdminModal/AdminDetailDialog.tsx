import React from 'react'
import { Dialog, DataList, Badge, DropdownMenu } from '@radix-ui/themes'
import { EyeOpenIcon } from '@radix-ui/react-icons'
import { formatDateWIB } from '@/app/utils/dateFormatter'

interface AdminDetailProps {
  id: number;
  nama: string;
  role: string;
  no_telepon: string;
  email: string;
  username: string;
  alamat_rumah: string;
  last_login: string;
  created_at: string;
  jumlah_input: number
}
function AdminDetailDialog({data}: {data: AdminDetailProps}) {
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
              <Badge color="jade" variant="soft" radius="full">
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
              {formatDateWIB(data.last_login)}
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
