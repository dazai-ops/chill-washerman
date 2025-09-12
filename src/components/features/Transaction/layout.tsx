"use client"

//lib
import { useEffect, useState } from 'react'
import { DotsVerticalIcon } from '@radix-ui/react-icons';
import { useDispatch, useSelector } from 'react-redux';
import { DropdownMenu, Box, Flex, Card, Avatar, Text, Badge, Button, Link } from '@radix-ui/themes';

//redux
import { AppDispatch, RootState } from '@/redux/store';
import { getTransaction , deleteTransaction, archiveTransaction} from '@/lib/thunk/transaction/transactionThunk';

//components
import { DataTable } from '@/components/layout/DataTable/DataTable';
import { DataCard } from '@/components/layout/DataCard/DataCard';
import Tabnav from '@/components/layout/TabNav/TabNav'
import TransactionDetailDialog from '@/components/modal/TransactionModal/TransactionDetailDialog';
import ConfirmDelete from '@/components/dialog/ConfirmDelete/ConfirmDelete';
import SegmentedControl from '@/components/layout/SegmentedControl/SegementedControl';
import FilterStatusTransaction from '@/components/layout/FilterStatusTransaction/FilterStatustransaction';

//utils
import { transactionTableColumns } from '@/features/transaction/columns';
import { formatDate } from '@/utils/helpers/formatters/date';
import ConfirmArchiveTransaction from '../../dialog/ConfirmArchiveTransaction/ConfirmArchiveTransaction';
import LoadingBars from '@/components/layout/LoadingBars/LoadingBars';


function TransaksiLayout() {
  const dispatch = useDispatch<AppDispatch>()
  const { loading, status, transactionList } = useSelector((state: RootState) => state.transaksi)
  const { user } = useSelector((state: RootState) => state.auth)
  const [ segmented, setSegmented ] = useState('card')
  const columns = transactionTableColumns

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
      {loading ? <LoadingBars/> : null}
      <div className="w-full sm:w-[600px] md:w-[700px] lg:w-[1300px] mt-10">
        {segmented === 'table' ?
          <DataTable 
            columns={columns} 
            data={transactionList}
            renderToolbar={
              <>
                <SegmentedControl segmented={segmented} setSegmented = {setSegmented}/>
                <FilterStatusTransaction/>
                <Button asChild size="3" color="gray" highContrast>
                  <Link href="/transaksi/create" target="_blank" underline='none'>
                    Tambah Transaksi...
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
                          {row.status_proses !== 'selesai' && (
                            <>
                              {row.is_archive === false ? (
                                <ConfirmArchiveTransaction
                                  label='Batalkan Transaksi'
                                  buttonLabel='Batalkan'
                                  onConfirm={() => row.id && dispatch(archiveTransaction({id: row.id, payload: {updated_by: user!.id, act: 'archive'}}))}
                                />
                              ) : (
                                <ConfirmArchiveTransaction
                                  label='Kembalikan Transaksi'
                                  description='Apakah anda yakin ingin mengembalikan transaksi ini?'
                                  buttonLabel='Kembalikan'
                                  onConfirm={() => row.id && dispatch(archiveTransaction({id: row.id, payload: {updated_by: user!.id, act: 'unarchive'}}))}
                                />
                              )}
                            </>
                          )}
                          <ConfirmDelete 
                            label='Hapus Transaksi'
                            onConfirm={() => row.id && dispatch(deleteTransaction({id: row.id}))}
                          />
                        </DropdownMenu.Content>
                      </DropdownMenu.Root>
                    </Flex>
                    <Box className='mt-2'>
                      {row.is_archive === true ? (
                        <Badge color="red" variant="soft">Dibatalkan</Badge>
                        ) : row.status_proses === 'selesai' ? (
                          <Badge color="green" variant="soft">Selesai</Badge>
                        ) : row.status_proses === 'diproses' ? (
                          <Badge color="iris" variant="soft">Diproses</Badge>
                        ) : row.status_proses === 'siap_diambil' ? (
                          <Badge color="brown" variant="soft">Siap Diambil</Badge>
                        ) : row.status_proses === 'dibatalkan' ? (
                          <Badge color="red" variant="soft">Dibatalkan</Badge>
                        ) : (
                          <Badge color="orange" variant="soft">Antrian</Badge>
                        )
                      }
                      <span>|</span>
                      <Badge color="yellow" variant="soft">{row.transaksi_detail.length} Layanan</Badge>
                      <Box className='mt-2'>
                        <Text as="div" size="1" color="gray">
                          Tgl Masuk: {row.tanggal_masuk != null ? formatDate(row.tanggal_masuk, "long") : '-'}
                        </Text>
                      </Box>
                      <Box className='mt-2'>
                        <Text as="div" size="1" color="gray">
                          Tgl Selesai: {row.tanggal_selesai != null ? formatDate(row.tanggal_selesai, "long") : '-'}
                        </Text>
                      </Box>
                      <Box className='mt-2'>
                        <Text as="div" size="1" color="gray">
                          Tgl Keluar: {row.tanggal_keluar != null ? formatDate(row.tanggal_keluar, "long") : '-'}
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
                <FilterStatusTransaction/>
                <Button asChild size="3" color="gray" highContrast>
                  <Link href="/transaksi/create" target="_blank" underline='none'>
                    Tambah Transaksi...
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