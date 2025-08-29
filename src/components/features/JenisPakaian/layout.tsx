"use client"

//lib
import { useEffect, useState } from 'react'
import { DotsVerticalIcon } from '@radix-ui/react-icons';
import { jenisPakaianColumns } from '@/features/jenispakaian/columns';
import { useDispatch, useSelector } from 'react-redux';
import { DropdownMenu, Spinner, Box, Flex, Card, Avatar, Text, Badge } from '@radix-ui/themes';

//redux
import { AppDispatch, RootState } from '@/redux/store';
import { deleteApparel, getApparel } from '@/lib/thunk/jenispakaian/jenispakaianThunk';

// components
import { DataTable } from '@/components/layout/DataTable/DataTable';
import { DataCard } from '@/components/layout/DataCard/DataCard';
import JenisPakaianDetail from '@/components/modal/JenisPakaianModal/JenisPakaianDetailDialog';
import EditModal from '@/components/modal/JenisPakaianModal/JenisPakaianEditModal';
import ConfirmDelete from '@/components/dialog/ConfirmDelete/ConfirmDelete';
import SegmentedControl from '@/components/layout/SegmentedControl/SegementedControl';
import AddModal from '@/components/modal/JenisPakaianModal/JanisPakaianCreateModal';
import Tabnav from '@/components/layout/TabNav/TabNav'

//utils
import { formatRupiah } from '@/utils/rupiahFormatter';

function JenisPakaianLayout() {
  const dispatch = useDispatch<AppDispatch>()
  const { loading, status } = useSelector((state: RootState) => state.jenisPakaian)
  const [ segmented, setSegmented ] = useState('card')
  
  const columns = jenisPakaianColumns
  const {apparelList} = useSelector((state: RootState) => state.jenisPakaian)
  
  useEffect(() => {
    dispatch(getApparel())
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if(status === 'success'){
      dispatch(getApparel())
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status])

  return (
    <div className='w-full flex flex-col items-center'>
      <Tabnav />
      {loading ? <Spinner className='mt-8 mb-4'/> : null}
      <div className="w-full sm:w-[600px] md:w-[700px] lg:w-[1000px] mt-10">
        {segmented === 'table' ? (
          <DataTable 
            columns={columns} 
            data={apparelList}
            renderAction={(row) => (
              <DropdownMenu.Root>
                <DropdownMenu.Trigger>
                  <DotsVerticalIcon className='mt-0.5'/>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content>
                  <JenisPakaianDetail data={row}/>
                  <EditModal data={row}/>
                  <DropdownMenu.Separator />
                  <ConfirmDelete onConfirm={() => row.id && dispatch(deleteApparel(String(row.id)))}/>
                </DropdownMenu.Content>
              </DropdownMenu.Root>
            )}
            renderToolbar={
              <>
                <SegmentedControl segmented={segmented} setSegmented = {setSegmented}/>
                <AddModal/>
              </>
            }
          /> ) : 
          ( <DataCard
            data={apparelList}
            renderCard={(row) => (
              <Box maxWidth="350px">
                <Card>
                  <Flex gap="3" align="center" justify="between">
                    <Flex gap="3" align="center">
                      <Avatar
                        size="2"
                        src="https://images.unsplash.com/vector-1741591987052-608871d246a3?q=80&w=1756&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        radius="full"
                        fallback="T"
                      />
                      <Box>
                        <Text as="div" size="2" weight="bold">
                          {row.jenis_pakaian}
                        </Text>
                        <Text as="div" size="2" color="gray">
                          Satuan: {row.satuan}
                        </Text>
                      </Box>
                    </Flex>
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger>
                          <DotsVerticalIcon />
                      </DropdownMenu.Trigger>
                      <DropdownMenu.Content>
                        <JenisPakaianDetail data={row}/>
                        <EditModal data={row}/>
                        <ConfirmDelete onConfirm={() => row.id && dispatch(deleteApparel(String(row.id)))}/>
                      </DropdownMenu.Content>
                    </DropdownMenu.Root>
                  </Flex>
                  <Box className='mt-2'>
                    <Badge className='mr-2'>Harga / (kg): {formatRupiah(Number(row.harga_per_kg)) || '-'}</Badge>
                    <Badge>Harga / (item): {formatRupiah(Number(row.harga_per_item)) || '-'}</Badge>
                    <Badge color='green'>Estimasi Waktu: {row.estimasi_waktu} Menit</Badge>
                  </Box>
                </Card>
              </Box>
            )}
            renderToolbar={
              <>
                <SegmentedControl segmented={segmented} setSegmented = {setSegmented}/>
                <AddModal/>
              </>
            }
          /> )
        }
      </div>
    </div>
  )
}

export default JenisPakaianLayout