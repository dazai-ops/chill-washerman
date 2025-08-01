import React from 'react'
import { Dialog, DataList, Badge, DropdownMenu, Table, Box } from '@radix-ui/themes'
import { EyeOpenIcon } from '@radix-ui/react-icons'
import { formatDateWIB } from '@/utils/dateFormatter'
import { formatRupiah } from '@/utils/rupiahFormatter';
import { formatToTitleCase } from '@/utils/titleFormatter';
import LayananDetailDialog from './LayananDetailDialog';
import { Transaksi } from '@/models/transaksi.model';

function TransaksiDetailDialog({data}: {data: Transaksi}) {
  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <DropdownMenu.Item onSelect={(e) => e.preventDefault()}>
          <EyeOpenIcon />Detail
        </DropdownMenu.Item>
      </Dialog.Trigger>

      <Dialog.Content maxWidth="700px">
        <Dialog.Title>{data.kode_transaksi}</Dialog.Title>
        <DropdownMenu.Separator />
        
        <Dialog.Description size="2" mb="4">
          Detail
        </Dialog.Description>

        <DataList.Root>
          <DataList.Item>
            <DataList.Label minWidth="100px">Proses</DataList.Label>
            <DataList.Value>
              <Badge color={data.status_proses === 'antrian' ? 'yellow' : data.status_proses === 'dikerjakan' ? 'blue' : data.status_proses === 'selesai' ? 'green' : 'gray'} variant="soft" radius="full">
                {formatToTitleCase(data.status_proses)}
              </Badge>
            </DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label minWidth="88px">Pelanggan</DataList.Label>
            <DataList.Value>{data.nama_pelanggan}</DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label minWidth="88px">Telepon</DataList.Label>
            <DataList.Value>{data.telepon_pelanggan}</DataList.Value>
          </DataList.Item>
        </DataList.Root>

        <DropdownMenu.Separator />

        <DataList.Root>
          <DataList.Item>
            <DataList.Label minWidth="88px">Tgl Masuk</DataList.Label>
            <DataList.Value>
              {formatDateWIB(data.tanggal_masuk)}
            </DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label minWidth="88px">Tgl Selesai</DataList.Label>
            <DataList.Value>
              {data.tanggal_selesai || '-' }
            </DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label minWidth="88px">Tgl Keluar</DataList.Label>
            <DataList.Value>
              {data.tanggal_keluar || '-' }
            </DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label minWidth="88px">Total Harga</DataList.Label>
            <DataList.Value>
              {formatRupiah(data.total_harga)}
            </DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label minWidth="88px">Dibayarkan</DataList.Label>
            <DataList.Value>
              {formatRupiah(data.dibayarkan)}
            </DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label minWidth="88px">Status Pembayaran</DataList.Label>
            <DataList.Value>
              {formatToTitleCase(data.status_pembayaran)}
            </DataList.Value>
          </DataList.Item>
        </DataList.Root>

        <DropdownMenu.Separator />
        {/* <DataList.Root width="100%"> */}
          <Box>
            <Table.Root size="1" variant='surface'>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell align='center'>Jenis Pakaian</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell align='center'>Mesin Cuci</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell align='center'>Status Proses</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell align='center'>Layanan Setrika</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell align='center'>Detail</Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {data.transaksi_detail.map((detail, index) => (
                  <Table.Row key={index}>
                    <Table.RowHeaderCell align='center'>{detail.jenis_pakaian.jenis_pakaian}</Table.RowHeaderCell>
                    <Table.Cell align='center'>{detail.mesin_cuci.merk + ' ' + detail.mesin_cuci.seri}</Table.Cell>
                    <Table.Cell align='center'>{formatToTitleCase(detail.status_proses)}</Table.Cell>
                    <Table.Cell align='center'>{detail.layanan_setrika ? 'Ya' : 'Tidak'}</Table.Cell>
                    <Table.Cell align='center'>
                      <LayananDetailDialog data={detail}/>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Box>
        {/* </DataList.Root> */}
      </Dialog.Content>
    </Dialog.Root>
  )
}

export default TransaksiDetailDialog
