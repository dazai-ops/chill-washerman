import React from 'react'
import { Dialog, DataList, Badge, DropdownMenu, Table, Box } from '@radix-ui/themes'
import { EyeOpenIcon } from '@radix-ui/react-icons'
import { formatDateToDDMMYYYY, formatDateWIB } from '@/utils/dateFormatter'
import { Admin } from '@/models/admin.model';
import { formatRupiah } from '@/utils/rupiahFormatter';
import { formatToTitleCase } from '@/utils/titleFormatter';
import { format } from 'path';

function LayananDetailDialog({data}) {
  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <DropdownMenu.Item onSelect={(e) => e.preventDefault()}>
          <EyeOpenIcon />Detail
        </DropdownMenu.Item>
      </Dialog.Trigger>

      <Dialog.Content maxWidth="600px">
        <Dialog.Title>{data.kode_transaksi}</Dialog.Title>
        
        <Dialog.Description size="2" mb="4">
          Detail
        </Dialog.Description>

        <DataList.Root>
          <DataList.Item>
            <DataList.Label minWidth="100px">Proses</DataList.Label>
            <DataList.Value>
              <Badge color={data.status_proses === 'menunggu' ? 'yellow' : data.status_proses === 'dikerjakan' ? 'blue' : data.status_proses === 'selesai' ? 'green' : 'gray'} variant="soft" radius="full">
                {formatToTitleCase(data.status_proses)}
              </Badge>
            </DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label minWidth="88px">Jenis Pakaian</DataList.Label>
            <DataList.Value>{data.jenis_pakaian.jenis_pakaian}</DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label minWidth="88px">Mesin Cuci</DataList.Label>
            <DataList.Value>{data.mesin_cuci.merk + ' ' + data.mesin_cuci.seri}</DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label minWidth="88px">Berat (kg)</DataList.Label>
            <DataList.Value>{data.berat_kg || '-'}</DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label minWidth="88px">Jumlah Item</DataList.Label>
            <DataList.Value>{data.jumlah_item || '-'}</DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label minWidth="88px">Layanan Setrika</DataList.Label>
            <DataList.Value>{data.layanan_setrika ? 'Ya' : 'Tidak'}</DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label minWidth="88px">Catatan Pelanggan</DataList.Label>
            <DataList.Value>{data.catatan_pelanggan || '-'}</DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label minWidth="88px">Catatan Admin</DataList.Label>
            <DataList.Value>{data.catatan_admin || '-'}</DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label minWidth="88px">Tgl Ditambahkan</DataList.Label>
            <DataList.Value>{formatDateWIB(data.created_at)}</DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label minWidth="88px">Tgl Diubah</DataList.Label>
            <DataList.Value>{formatDateWIB(data.updated_at) || '-'}</DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label minWidth="88px">Diubah Oleh</DataList.Label>
            <DataList.Value>{data.updated_by?.nama || '-'}</DataList.Value>
          </DataList.Item>
        </DataList.Root>

      </Dialog.Content>
    </Dialog.Root>
  )
}

export default LayananDetailDialog
