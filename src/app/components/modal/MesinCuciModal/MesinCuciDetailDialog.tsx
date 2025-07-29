import React from 'react'
import { Dialog, DataList, Badge, DropdownMenu } from '@radix-ui/themes'
import { EyeOpenIcon } from '@radix-ui/react-icons'
import { formatDateToDDMMYYYY, formatDateWIB } from '@/app/utils/dateFormatter'

interface MesinCuci {
  id: string;
  nama: string;
  merk: string;
  seri: string;
  jumlah_digunakan: number;
  status_mesin: string;
  tahun_pembuatan: number;
  tanggal_dibeli: string;
  terakhir_digunakan: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

function MesinCuciDetailDialog({data}: {data: MesinCuci}) {
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
            <DataList.Label minWidth="88px">Merk</DataList.Label>
            <DataList.Value>
              <Badge color="jade" variant="soft" radius="full">
                {data.merk}
              </Badge>
            </DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label minWidth="88px">Seri</DataList.Label>
            <DataList.Value>{data.seri}</DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label minWidth="88px">Total Digunakan</DataList.Label>
            <DataList.Value>{data.jumlah_digunakan || 0}</DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label minWidth="88px">Status</DataList.Label>
            <DataList.Value>
              {data.status_mesin === 'tidak_digunakan' ? 'Tidak Digunakan' : data.status_mesin === 'digunakan' ? 'Digunakan' : 'Diperbaiki'}
            </DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label minWidth="88px">Status Aktif</DataList.Label>
            <DataList.Value>
              {data.is_active === true ? 'Active' : 'Inactive'}
            </DataList.Value>
          </DataList.Item>
        </DataList.Root>

        <DropdownMenu.Separator />

        <DataList.Root>
          <DataList.Item>
            <DataList.Label minWidth="88px">Tahun Pembuatan</DataList.Label>
            <DataList.Value>
              {data.tahun_pembuatan}
            </DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label minWidth="88px">Tanggal Dibeli</DataList.Label>
            <DataList.Value>
              {formatDateToDDMMYYYY(data.tanggal_dibeli)}
            </DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label minWidth="88px">Tanggal Ditambahkan</DataList.Label>
            <DataList.Value>
              {formatDateWIB(data.created_at)}
            </DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label minWidth="88px">Terakhir Digunakan</DataList.Label>
            <DataList.Value>
              {data.status_mesin === 'digunakan' ? 'Sedang Digunakan' : formatDateWIB(data.terakhir_digunakan)}
            </DataList.Value>
          </DataList.Item>

        </DataList.Root>
      </Dialog.Content>
    </Dialog.Root>
  )
}

export default MesinCuciDetailDialog
