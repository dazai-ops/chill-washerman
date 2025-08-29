//lin
import React from 'react'
import { Dialog, DataList, Badge, DropdownMenu, Button } from '@radix-ui/themes'
import { EyeOpenIcon } from '@radix-ui/react-icons'

//utils
import { formatDateWIB } from '@/utils/dateFormatter'
import { formatToTitleCase } from '@/utils/titleFormatter';
import { TransactionDetail } from '@/models/transaksitwo.model';

function LayananDetailDialog({data}: {data: Partial<TransactionDetail> }) {
  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <DropdownMenu.Item onSelect={(e) => e.preventDefault()}>
          <Button variant="soft" color="blue" size={'1'}>
            <EyeOpenIcon />
          </Button>
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
              <Badge 
                color={
                  data.status_proses === 'menunggu' ? 'yellow' 
                  : data.status_proses === 'dikerjakan' ? 'blue' 
                  : data.status_proses === 'selesai' ? 'green' : 'gray'
                } 
                variant="soft" 
                radius="full"
              >
                {formatToTitleCase(data.status_proses ? data.status_proses : '')}
              </Badge>
            </DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label minWidth="88px">Jenis Pakaian</DataList.Label>
            <DataList.Value>{data.jenis_pakaian!.jenis_pakaian}</DataList.Value>
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
            <DataList.Value>{ data.created_at && formatDateWIB(data.created_at)}</DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label minWidth="88px">Tgl Diubah</DataList.Label>
            <DataList.Value>{ data.updated_at && formatDateWIB(data.updated_at) || '-'}</DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label minWidth="88px">Tgl Selesai</DataList.Label>
            <DataList.Value>{ data.tanggal_selesai && formatDateWIB(data.tanggal_selesai) || '-'}</DataList.Value>
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
