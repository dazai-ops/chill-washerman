"use client"

//lib
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { DropdownMenu, Spinner, Box, Flex, Card, Avatar, Text, Badge } from '@radix-ui/themes';
import { ArchiveIcon, DotsVerticalIcon } from '@radix-ui/react-icons';

//redux
import { AppDispatch, RootState } from '@/redux/store';
import { getWasher, changeWasherStatus, deleteWasher } from '@/lib/thunk/mesincuci/mesincuciThunk';

//components
import { DataTable } from '@/components/layout/DataTable/DataTable';
import { DataCard } from '@/components/layout/DataCard/DataCard';
import ConfirmChangeDialog from '@/components/dialog/ConfirmChange/ConfirmChange';
import ConfirmDeleteDialog from '@/components/dialog/ConfirmDelete/ConfirmDelete';
import DetailDialog from '@/components/modal/MesinCuciModal/MesinCuciDetailDialog';
import EditModal from '@/components/modal/MesinCuciModal/MesinCuciEditModal';
import AddModal from '@/components/modal/MesinCuciModal/MesinCuciCreateModal';
import SegmentedControl from '@/components/layout/SegmentedControl/SegementedControl';
import Tabnav from '@/components/layout/TabNav/TabNav'

//utils
import { mesinCuciColumns } from '@/features/mesincuci/columns';
import { formatDateWIB } from '@/utils/dateFormatter';

function MesinCuciLayout() {
  const columns = mesinCuciColumns
  const dispatch = useDispatch<AppDispatch>()
  const [segmented, setSegmented]  = useState('card')

  const { washerList, loading, status } = useSelector((state: RootState) => state.mesinCuci)
  
  useEffect(() => {
    dispatch(getWasher())
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
  useEffect(() => {
    if(status === 'success'){
      dispatch(getWasher())
    }
  }, [dispatch, status])

  return (
    <div className='w-full flex flex-col items-center'>
      <Tabnav />
      {loading ? <Spinner className='mt-8'/> : null}
      <div className='w-full sm:w-[600px] md:w-[700px] lg:w-[1000px] mt-10'>
        {segmented === 'table' ?
          <DataTable 
            columns={columns}
            data={washerList}
            renderAction={(row) => (
              <DropdownMenu.Root>
                <DropdownMenu.Trigger>
                  <DotsVerticalIcon className='mt-0.5'/>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content>
                  <DetailDialog data={row}/>
                  <EditModal data={row}/>
                  <DropdownMenu.Separator />
                  {row.is_active === true 
                    ? <ConfirmChangeDialog label='Set as Inactive' customIcon={<ArchiveIcon />} onConfirm={() => dispatch(changeWasherStatus({id: row.id, is_active: false}))} />
                    : <ConfirmChangeDialog label='Set as Active' onConfirm={() => dispatch(changeWasherStatus({id: row.id, is_active: true}))}/>
                  }
                  <DropdownMenu.Separator />
                  <ConfirmDeleteDialog onConfirm={() => dispatch(deleteWasher(row.id))}/>
                </DropdownMenu.Content>
              </DropdownMenu.Root>
            )}
            renderToolbar={
              <>
                <SegmentedControl segmented={segmented} setSegmented={setSegmented}/>
                <AddModal/>
              </>
            }
          />
         : <DataCard
            data={washerList}
            renderCard={(row) => (
              <Box maxWidth="350px">
                <Card>
                  <Flex gap="3" align="center" justify="between">
                    <Flex gap="3" align="center">
                      <Avatar
                        size="3"
                        src="https://images.unsplash.com/vector-1752426419751-cfed640878e9?q=80&w=580&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        radius="full"
                        fallback="T"
                      />
                      <Box>
                        <Text as="div" size="2" weight="bold">
                          {row.merk}
                        </Text>
                        <Text as="div" size="2" color="gray">
                          {row.seri}
                        </Text>
                      </Box>
                    </Flex>
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger>
                        <DotsVerticalIcon className='mt-0.5'/>
                      </DropdownMenu.Trigger>
                      <DropdownMenu.Content>
                        <DetailDialog data={row}/>
                        <EditModal data={row}/>
                        <DropdownMenu.Separator />
                        {row.is_active === true 
                          ? <ConfirmChangeDialog label='Set as Inactive' customIcon={<ArchiveIcon />} onConfirm={() => dispatch(changeWasherStatus({id: row.id, is_active: false}))} />
                          : <ConfirmChangeDialog label='Set as Active' onConfirm={() => dispatch(changeWasherStatus({id: row.id, is_active: true}))}/>
                        }
                        <DropdownMenu.Separator />
                        <ConfirmDeleteDialog onConfirm={() => dispatch(deleteWasher(row.id))}/>
                      </DropdownMenu.Content>
                    </DropdownMenu.Root>
                  </Flex>
                  <Box className='mt-2'>
                    <Flex gap="2">
                      <Badge color={row.is_active === true ? 'green' : 'red'}>{row.is_active === true ? 'Active' : 'Inactive'}</Badge>
                      <Badge color={row.status_mesin === 'digunakan' ? 'red' : 'green'}>{row.status_mesin === 'digunakan' ? 'Digunakan' : 'Tidak Digunakan'}</Badge>
                    </Flex>
                    <Box className='mt-2'>
                      
                      <Text as="div" size="1" color="gray">
                        {row.status_mesin === 'digunakan' ? '-' : row.terakhir_digunakan === null ? 'Belum Digunakan' : 'Last Used: ' + formatDateWIB(row.terakhir_digunakan)}
                      </Text>
                    </Box>
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
          />}
      </div>
    </div>
  )
}

export default MesinCuciLayout