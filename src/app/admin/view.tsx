import { useEffect, useState } from 'react'
import { DataTable } from '../components/DataTable';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { retriveAdmin } from '../redux/api/adminThunk';
import { DropdownMenu, Spinner } from '@radix-ui/themes';
import { DotsVerticalIcon } from '@radix-ui/react-icons';
import { adminColumns } from '../features/admin/columns';
import Tabnav from '../components/TabNav'
import AddModal from '../components/modal/adminModal/addModal';
import FailedAlert from '../components/alert/failed/FailedAlert';
import SucceedAlert from '../components/alert/succeed/SucceedAlert';

function AdminView() {
  const dispatch = useDispatch<AppDispatch>()
  const [selectedRow, setSelectedRow] = useState({});
  const { loading, error, success } = useSelector((state: RootState) => state.admin)
  
  const columns = adminColumns
  const data = useSelector((state: RootState) => state.admin.adminCollection)
  
  console.log(selectedRow)
  useEffect(() => {
    dispatch(retriveAdmin())
  }, [dispatch, success])

  return (
    <div className='w-full flex flex-col items-center'>
      <Tabnav />
      {loading ? <Spinner className='mt-8'/> : null}
      {error && <FailedAlert message={error} />}
      {success && <SucceedAlert message={success} />}
      <div className='w-[800px] mt-10'>
        <DataTable 
          columns={columns} 
          data={data}
          renderAction={(row) => (
            <DropdownMenu.Root>
              <DropdownMenu.Trigger onClick={() => setSelectedRow(row)}>
                <DotsVerticalIcon className='mt-0.5'/>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content>
                <DropdownMenu.Item>Detail</DropdownMenu.Item>
                <DropdownMenu.Separator />
                <DropdownMenu.Item color='yellow'>Set be Supersuser</DropdownMenu.Item>
                <DropdownMenu.Separator />
                <DropdownMenu.Item color="red">Delete</DropdownMenu.Item>
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

export default AdminView
