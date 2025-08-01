import React from 'react'
import { Dialog, DataList, Badge, DropdownMenu } from '@radix-ui/themes'
import { EyeOpenIcon } from '@radix-ui/react-icons'
import { formatDateWIB } from '@/utils/dateFormatter'
import { JenisPakaian } from '@/models/jenispakaian.model'

function JenisPakaianDetailDialog({data}: {data: JenisPakaian}) {
  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <DropdownMenu.Item onSelect={(e) => e.preventDefault()}>
          <EyeOpenIcon />Detail
        </DropdownMenu.Item>
      </Dialog.Trigger>

      <Dialog.Content maxWidth="450px">
        <Dialog.Title>{data.jenis_pakaian}</Dialog.Title>
        <DropdownMenu.Separator />
        <Dialog.Description size="2" mb="4">
          Detail
        </Dialog.Description>

        <DataList.Root>
          <DataList.Item align="center">
            <DataList.Label minWidth="88px">Satuan</DataList.Label>
            <DataList.Value>
              <Badge color="jade" variant="soft" radius="full">
                {data.satuan}
              </Badge>
            </DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label minWidth="88px">Harga / (item)</DataList.Label>
            <DataList.Value>{data.harga_per_item}</DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label minWidth="88px">Harga / (kg)</DataList.Label>
            <DataList.Value>{data.harga_per_kg}</DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label minWidth="88px">Estimasi Pengerjaan</DataList.Label>
            <DataList.Value>
              {data.estimasi_waktu} Jam
            </DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label minWidth="88px">Ditambahkan</DataList.Label>
            <DataList.Value>
              {formatDateWIB(data.created_at)}
            </DataList.Value>
          </DataList.Item>
        </DataList.Root>

      </Dialog.Content>
    </Dialog.Root>
  )
}

export default JenisPakaianDetailDialog
