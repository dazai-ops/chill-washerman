//lib
import React from 'react'
import Link from 'next/link'
import { Dialog, DataList, Badge, DropdownMenu, Table, Box, Flex, Button } from '@radix-ui/themes'
import { EyeOpenIcon } from '@radix-ui/react-icons'

//utils
import { formatDate } from '@/utils/helpers/formatters/date'
import { formatRupiah } from '@/utils/helpers/formatters/rupiah';
import { formatToTitleCase } from '@/utils/helpers/formatters/titleCase';
import { Transaction } from '@/models/transaction.model';

//components
import ServiceDetailDialog from '@/components/modal/TransactionModal/ServiceDetailDialog';
import ServiceProcessEditModal from '@/components/modal/TransactionModal/ServiceProcessEditModal';
import CompleteTransactionModal from '@/components/modal/TransactionModal/CompleteTransactionModal';

interface TransactionDetailDialogProps{
  data: Transaction
}

const TransactionDetailDialog = ({data}: TransactionDetailDialogProps) => {
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
                <CompleteTransactionModal data={data}/>
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
              {data.status_proses === 'selesai' ? (
                <Badge color="green" variant="soft">Selesai</Badge>
                ) : data.status_proses === 'diproses' ? (
                  <Badge color="iris" variant="soft">Diproses</Badge>
                ) : data.status_proses === 'siap_diambil' ? (
                  <Badge color="brown" variant="soft">Siap Diambil</Badge>
                ) : data.status_proses === 'dibatalkan' ? (
                  <Badge color="red" variant="soft">Dibatalkan</Badge>
                ) : (
                  <Badge color="orange" variant="soft">Antrian</Badge>
                )
              }
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
              {data.tanggal_masuk &&formatDate(data.tanggal_masuk, "long") || '-' }
            </DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label minWidth="88px">Tgl Selesai</DataList.Label>
            <DataList.Value>
              {data.tanggal_selesai && formatDate(data.tanggal_selesai, "long") || '-' }
            </DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label minWidth="88px">Tgl Keluar</DataList.Label>
            <DataList.Value>
              {data.tanggal_keluar && formatDate(data.tanggal_keluar, "long") || '-' }
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
                          <ServiceProcessEditModal data={detail}/>
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

export default TransactionDetailDialog
