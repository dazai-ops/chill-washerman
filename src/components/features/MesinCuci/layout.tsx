"use client"
import { useEffect } from 'react'
import { DataTable } from '@/components/layout/DataTable/DataTable';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { DropdownMenu, Spinner } from '@radix-ui/themes';
import { ArchiveIcon, DotsVerticalIcon } from '@radix-ui/react-icons';

import { mesinCuciColumns } from '@/features/mesincuci/columns';
import { retriveMesinCuci, changeActive, deleteMesinCuci } from '@/lib/thunk/mesincuci/mesincuciThunk';
import Tabnav from '@/components/layout/TabNav/TabNav'
import ConfirmChange from '@/components/dialog/ConfirmChange/ConfirmChange';
import ConfirmDelete from '@/components/dialog/ConfirmDelete/ConfirmDelete';
import DetailDialog from '@/components/modal/MesinCuciModal/MesinCuciDetailDialog';
import EditModal from '@/components/modal/MesinCuciModal/MesinCuciEditModal';
import AddModal from '@/components/modal/MesinCuciModal/MesinCuciCreateModal';

function MesinCuciLayout() {
  const dispatch = useDispatch<AppDispatch>()
  const { loading, success } = useSelector((state: RootState) => state.mesinCuci)
  
  const columns = mesinCuciColumns
  const data = useSelector((state: RootState) => state.mesinCuci.mesinCuciCollection)
  
  useEffect(() => {
    dispatch(retriveMesinCuci())
  }, [dispatch, success])

  return (
    <div className='w-full flex flex-col items-center'>
      <Tabnav />
      {loading ? <Spinner className='mt-8'/> : null}
      <div className='w-[800px] mt-10'>
        <DataTable 
          columns={columns}
          data={data}
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
                  ? <ConfirmChange label='Set as Inactive' customIcon={<ArchiveIcon />} onConfirm={() => dispatch(changeActive({id: row.id, is_active: false}))} />
                  : <ConfirmChange label='Set as Active' onConfirm={() => dispatch(changeActive({id: row.id, is_active: true}))}/>
                }
                <DropdownMenu.Separator />
                <ConfirmDelete onConfirm={() => dispatch(deleteMesinCuci(row.id))}/>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          )}
          renderToolbar={
           <AddModal/>
          }
        />
      </div>
    </div>
  )
}

export default MesinCuciLayout
