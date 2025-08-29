//lib
import React from 'react'
import Link from 'next/link'
import { Dialog, DataList, Badge, DropdownMenu, Table, Box, Flex, Button } from '@radix-ui/themes'
import { EyeOpenIcon } from '@radix-ui/react-icons'

//utils
import { formatDateWIB } from '@/utils/dateFormatter'
import { formatRupiah } from '@/utils/rupiahFormatter';
import { formatToTitleCase } from '@/utils/titleFormatter';
import { Transaction } from '@/models/transaksitwo.model';

//components
import ServiceDetailDialog from './LayananDetailDialog';
import LayananEditProses from '@/components/modal/TransaksiModal/LayananEditProses';
import SelesaikanTransaksiModal from './SelesaikanTransaksiModal';

function TransaksiDetailDialog({data}: {data: Partial<Transaction>}) {
  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <DropdownMenu.Item onSelect={(e) => e.preventDefault()}>
          <EyeOpenIcon />Detail
        </DropdownMenu.Item>
      </Dialog.Trigger>

      <Dialog.Content maxWidth="700px">
        <Flex justify={'between'} align={'center'}>
          <Dialog.Title>{data.kode_transaksi}</Dialog.Title>
          <Flex gap={"3"}>
            {data.status_proses !== 'selesai' && (
              <>
                <SelesaikanTransaksiModal data={data}/>
                <Link 
                  href={`/transaksi/edit/${data.id}`} 
                  target='_blank' 
                  className='mb-3'
                >
                  <Button color="yellow" variant='soft' size={"2"} >
                    Edit
                  </Button>
                </Link>
              </>
            )}
          </Flex>
        </Flex>
        <DropdownMenu.Separator />
        
        <Dialog.Description size="2" mb="4">
          Detail
        </Dialog.Description>

        <DataList.Root>
          <DataList.Item>
            <DataList.Label minWidth="100px">Proses</DataList.Label>
            <DataList.Value>
              <Badge 
                color={data.status_proses === 'antrian' ? 'yellow' 
                  : data.status_proses === 'dikerjakan' ? 'blue' 
                  : data.status_proses === 'selesai' ? 'green' : 'gray'
                } 
                variant="soft" 
                radius="full">
                {data.status_proses && formatToTitleCase(data.status_proses) }
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
              {data.tanggal_masuk &&formatDateWIB(data.tanggal_masuk) || '-' }
            </DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label minWidth="88px">Tgl Selesai</DataList.Label>
            <DataList.Value>
              {data.tanggal_selesai && formatDateWIB(data.tanggal_selesai) || '-' }
            </DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label minWidth="88px">Tgl Keluar</DataList.Label>
            <DataList.Value>
              {data.tanggal_keluar && formatDateWIB(data.tanggal_keluar) || '-' }
            </DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label minWidth="88px">Total Harga</DataList.Label>
            <DataList.Value>
              {data.total_harga && formatRupiah(data.total_harga) || '-' }
            </DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label minWidth="88px">Dibayarkan</DataList.Label>
            <DataList.Value>
              {data.dibayarkan && formatRupiah(data.dibayarkan) || '-' }
            </DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label minWidth="88px">Status Pembayaran</DataList.Label>
            <DataList.Value>
              {data.status_pembayaran && formatToTitleCase(data.status_pembayaran) || '-' }
            </DataList.Value>
          </DataList.Item>
        </DataList.Root>

        <DropdownMenu.Separator />
          <Box>
            <Table.Root size="1" variant='surface'>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell align='center'>Jenis Pakaian</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell align='center'>Status Proses</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell align='center'>Layanan Setrika</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell align='center'>Aksi</Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                { data.transaksi_detail && data.transaksi_detail.map((detail, index) => (
                  <Table.Row key={index}>
                    <Table.RowHeaderCell align='center'>{detail.jenis_pakaian.jenis_pakaian}</Table.RowHeaderCell>
                    <Table.Cell align='center'>{formatToTitleCase(detail.status_proses ? detail.status_proses : '')}</Table.Cell>
                    <Table.Cell align='center'>{detail.layanan_setrika ? 'Ya' : 'Tidak'}</Table.Cell>
                    <Table.Cell align='center' justify={'center'}>
                      <Flex justify={'center'} gap={"2"}>
                        <ServiceDetailDialog data={detail}/>
                        {data.status_proses !== 'selesai' && (
                          <LayananEditProses data={detail}/>
                        )}
                      </Flex>
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
