"use client"

//lib
import { useEffect, useState } from 'react'
import { DotsVerticalIcon } from '@radix-ui/react-icons';
import { useDispatch, useSelector } from 'react-redux';
import { DropdownMenu, Spinner, Box, Flex, Card, Avatar, Text, Badge, Button, Link } from '@radix-ui/themes';

//redux
import { AppDispatch, RootState } from '@/redux/store';
import { getTransaction , deleteTransaction} from '@/lib/thunk/transaksi/transaksiThunk';

//components
import { DataTable } from '@/components/layout/DataTable/DataTable';
import { DataCard } from '@/components/layout/DataCard/DataCard';
import Tabnav from '@/components/layout/TabNav/TabNav'
import TransactionDetailDialog from '@/components/modal/TransaksiModal/TransaksiDetailDialog';
import ConfirmDelete from '@/components/dialog/ConfirmDelete/ConfirmDelete';
import SegmentedControl from '@/components/layout/SegmentedControl/SegementedControl';

//utils
import { transactionColumns } from '@/features/transaksi/columns';
import { formatDateWIB } from '@/utils/dateFormatter';


function TransaksiLayout() {
  const dispatch = useDispatch<AppDispatch>()
  const { loading, status, transactionList } = useSelector((state: RootState) => state.transaksi)

  const [ segmented, setSegmented ] = useState('')
  const columns = transactionColumns

  useEffect(() => {
    if(status === 'success'){
      dispatch(getTransaction())
    }
  }, [dispatch, status])

  useEffect(() => {
    dispatch(getTransaction())
  }, [dispatch])

  return (
    <div className='w-full flex flex-col items-center'>
      <Tabnav />
      {loading ? <Spinner className='mt-8 mb-4'/> : null}
      <div className="w-full sm:w-[600px] md:w-[700px] lg:w-[1000px] mt-10">
        {segmented === 'table' ?
          <DataTable 
            columns={columns} 
            data={transactionList}
            renderAction={(row) => (
              row && (
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger>
                    <DotsVerticalIcon className='mt-0.5'/>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Content>
                    <TransactionDetailDialog data={row}/>
                    <DropdownMenu.Separator />
                    <ConfirmDelete onConfirm={() => row.id && dispatch(deleteTransaction({id: row.id}))}/>
                  </DropdownMenu.Content>
                </DropdownMenu.Root>
              )
            )}
            renderToolbar={
              <>
                <SegmentedControl segmented={segmented} setSegmented = {setSegmented}/>
                <Button asChild size="3" color="gray" highContrast>
                  <Link href="/transaksi/create" target="_blank" underline='none'>
                    Add new...
                  </Link>
                </Button>
              </>
            }
          /> : 
          <DataCard 
            data={transactionList}
            renderCard={(row) => (
              <>
                {row && (
                <Box maxWidth="350px">
                  <Card>
                    <Flex gap="3" align="center" justify="between">
                      <Flex gap="3" align="center">
                        <Avatar
                          size="2"
                          src="https://media.istockphoto.com/id/2220604143/id/vektor/flat-illustration-in-grayscale-avatar-user-profile-person-icon-gender-neutral-silhouette.jpg?s=612x612&w=0&k=20&c=Tl1AYJO-6C50uz5BG74vZYygE1mUOvwgMm93t3SOKq8="
                          radius="full"
                          fallback="T"
                        />
                        <Box>
                          <Text as="div" size="2" weight="bold">
                            {row.kode_transaksi}
                          </Text>
                          <Text as="div" size="2" color="gray">
                            {row.nama_pelanggan}
                          </Text>
                        </Box>
                      </Flex>
                      <DropdownMenu.Root>
                        <DropdownMenu.Trigger>
                            <DotsVerticalIcon />
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Content>
                          <TransactionDetailDialog data={row}/>
                          <DropdownMenu.Separator />
                          <ConfirmDelete onConfirm={() => row.id && dispatch(deleteTransaction({id: row.id}))}/>
                        </DropdownMenu.Content>
                      </DropdownMenu.Root>
                    </Flex>
                    <Box className='mt-2'>
                      <Badge className='mr-2'>{row.status_proses === 'antrian' ? 'Antrian' : row.status_proses === 'dicuci' ? 'Dicuci' : row.status_proses === 'selesai' ? 'Selesai' : row.status_proses === 'diambil' ? 'Diambil' : 'Dibatalkan'}</Badge>
                      <Badge color="yellow" variant="soft">Jumlah: {row.transaksi_detail.length} Layanan</Badge>
                      <Box className='mt-2'>
                        <Text as="div" size="1" color="gray">
                          Tgl Masuk: {row.tanggal_masuk != null ? formatDateWIB(row.tanggal_masuk) : '-'}
                        </Text>
                      </Box>
                      <Box className='mt-2'>
                        <Text as="div" size="1" color="gray">
                          Tgl Selesai: {row.tanggal_selesai != null ? formatDateWIB(row.tanggal_selesai) : '-'}
                        </Text>
                      </Box>
                      <Box className='mt-2'>
                        <Text as="div" size="1" color="gray">
                          Tgl Keluar: {row.tanggal_keluar != null ? formatDateWIB(row.tanggal_keluar) : '-'}
                        </Text>
                      </Box>
                    </Box>
                  </Card>
                </Box>
                )}
              </>
            )}
            renderToolbar={
              <>
                <SegmentedControl segmented={segmented} setSegmented = {setSegmented}/>
                <Button asChild size="3" color="gray" highContrast>
                  <Link href="/transaksi/create" target="_blank" underline='none'>
                    Add new...
                  </Link>
                </Button>
              </>
            }
          />
        }
      </div>
    </div>
  )
}

export default TransaksiLayout