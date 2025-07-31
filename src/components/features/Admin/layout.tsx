"use client"
import { useEffect } from 'react'
import { DataTable } from '@/components/layout/DataTable/DataTable';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { retriveAdmin, changeRole, deleteAdmin } from '@/lib/thunk/admin/adminThunk';
import { DropdownMenu, Spinner } from '@radix-ui/themes';
import { DotsVerticalIcon } from '@radix-ui/react-icons';
import { adminColumns } from '@/features/admin/columns';

import Tabnav from '@/components/layout/TabNav/TabNav'
import AdminDetail from '@/components/modal/AdminModal/AdminDetailDialog';
import AddModal from '@/components/modal/AdminModal/AdminCreateModal';
import EditModal from '@/components/modal/AdminModal/AdminEditModal';
import ConfirmDelete from '@/components/dialog/ConfirmDelete/ConfirmDelete';
import ConfirmChange from '@/components/dialog/ConfirmChange/ConfirmChange';

function AdminLayout() {
  const dispatch = useDispatch<AppDispatch>()
  const { loading, success } = useSelector((state: RootState) => state.admin)
  
  const columns = adminColumns
  const data = useSelector((state: RootState) => state.admin.adminCollection)
  
  useEffect(() => {
    dispatch(retriveAdmin())
  }, [dispatch, success])

  return (
    <div className='w-full flex flex-col items-center'>
      <Tabnav />
      {loading ? <Spinner className='mt-8 mb-4'/> : null}
      <div className="w-full sm:w-[600px] md:w-[700px] lg:w-[800px] mt-10">
        <DataTable 
          columns={columns} 
          data={data}
          renderAction={(row) => (
            <DropdownMenu.Root>
              <DropdownMenu.Trigger>
                <DotsVerticalIcon className='mt-0.5'/>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content>
                <AdminDetail data={row}/>
                <EditModal data={row}/>
                <DropdownMenu.Separator />
                {row.role === 'admin' 
                  ? <ConfirmChange label='Set as Superuser' onConfirm={() => dispatch(changeRole({id: row.id, role: 'superuser'}))}/>
                  : <ConfirmChange label='Set as Admin' onConfirm={() => dispatch(changeRole({id: row.id, role: 'admin'}))}/>
                }
                <DropdownMenu.Separator />
                <ConfirmDelete onConfirm={() => dispatch(deleteAdmin(row.id))}/>
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

export default AdminLayout