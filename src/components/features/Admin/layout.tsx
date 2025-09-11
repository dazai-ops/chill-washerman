"use client"

// lib
import { useEffect, useState } from 'react'
import { DropdownMenu, Box, Flex, Card, Avatar, Text, Badge } from '@radix-ui/themes';
import { DotsVerticalIcon } from '@radix-ui/react-icons';

// redux
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { getAdmin, updateAdminRole, deleteAdmin } from '@/lib/thunk/admin/adminThunk';

//utils
import { adminTableColumns } from '@/features/admin/columns';
import { formatDate } from '@/utils/helpers/formatters/date';

//components
import { DataTable } from '@/components/layout/DataTable/DataTable';
import { DataCard } from '@/components/layout/DataCard/DataCard';
import Tabnav from '@/components/layout/TabNav/TabNav'
import SegmentedControl from '@/components/layout/SegmentedControl/SegementedControl';
import AdminDetailDialog from '@/components/modal/AdminModal/AdminDetailDialog';
import AdminCreateModal from '@/components/modal/AdminModal/AdminCreateModal';
import AdminEditModal from '@/components/modal/AdminModal/AdminEditModal';
import ConfirmDeleteDialog from '@/components/dialog/ConfirmDelete/ConfirmDelete';
import ConfirmChangeDialog from '@/components/dialog/ConfirmChange/ConfirmChange';
import LoadingBars from '@/components/layout/LoadingBars/LoadingBars';

const AdminLayout = () => {
  const tableColumns = adminTableColumns
  const dispatch = useDispatch<AppDispatch>()

  const admin = useSelector((state: RootState) => state.auth.user)
  const { loading, status, adminList } = useSelector((state: RootState) => state.admin)
  const [ segmented, setSegmented ] = useState('card')
 
  useEffect(() => {
    dispatch(getAdmin())
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  useEffect(() => {
    if(status === 'success'){
      dispatch(getAdmin())
    }
  }, [status, dispatch])

  // DEBUG -----------------------
  // useEffect(() => {
  //   if(adminList.length > 0){
  //     console.log(adminList)
  //   }
  // }, [adminList])
  // DEBUG -----------------------
  return (
    <div className='w-full flex flex-col items-center'>
      <Tabnav />
      {loading ? <LoadingBars/> : null}
        <div className="w-full sm:w-[600px] md:w-[700px] lg:w-[1300px] px-3 mt-10">
          {segmented === 'table' ?  
            <DataTable 
              columns={tableColumns} 
              data={adminList}
              renderAction={(row) => (
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger>
                    <DotsVerticalIcon className='mt-0.5'/>
                  </DropdownMenu.Trigger>
                    <DropdownMenu.Content>
                      <AdminDetailDialog data={row}/>
                      {admin?.role === 'superuser' && (
                      <>
                        <AdminEditModal 
                          data={row}
                        />
                        <DropdownMenu.Separator />
                          {row.role === 'admin' 
                            ? <ConfirmChangeDialog 
                                label='Set as Superuser' 
                                onConfirm={() => row.id && dispatch(updateAdminRole({id: row.id, role: 'superuser'}))}
                              />
                            : <ConfirmChangeDialog 
                                label='Set as Admin' 
                                onConfirm={() => row.id && dispatch(updateAdminRole({id: row.id, role: 'admin'}))}
                              />
                          }
                        <DropdownMenu.Separator />
                        <ConfirmDeleteDialog onConfirm={() => row.id && dispatch(deleteAdmin(row.id))}/>
                        </>
                        )}
                    </DropdownMenu.Content>
                </DropdownMenu.Root>
              )}
              renderToolbar={
                <>
                  <SegmentedControl segmented={segmented} setSegmented = {setSegmented}/>
                  <AdminCreateModal/>
                </>
              }
            /> : 
            <DataCard
              data={adminList}
              renderCard={(row) => (
                <Box maxWidth="350px" className='sm:w-full'>
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
                            {row.nama}
                          </Text>
                          <Text as="div" size="2" color="gray">
                            {row.username}
                          </Text>
                        </Box>
                      </Flex>
                      <DropdownMenu.Root>
                        <DropdownMenu.Trigger>
                            <DotsVerticalIcon />
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Content>
                          <AdminDetailDialog data={row}/>
                          {admin?.role === 'superuser' &&(
                            <>
                              <AdminEditModal data={row}/>
                              <DropdownMenu.Separator />
                              {row.role === 'admin' 
                                ? <ConfirmChangeDialog 
                                    label='Set as Superuser' 
                                    onConfirm={() => row.id && dispatch(updateAdminRole({id: row.id, role: 'superuser'}))}
                                  />
                                : <ConfirmChangeDialog 
                                    label='Set as Admin' 
                                    onConfirm={() => row.id && dispatch(updateAdminRole({id: row.id, role: 'admin'}))}
                                  />
                              }
                              <DropdownMenu.Separator />
                              <ConfirmDeleteDialog 
                                label="Hapus Admin"
                                onConfirm={() => row.id && dispatch(deleteAdmin(row.id))}
                              />
                            </>
                          )}
                        </DropdownMenu.Content>
                      </DropdownMenu.Root>
                    </Flex>
                    <Box className='mt-2'>
                      {row.role === 'superuser' ? (
                        <Badge color="sky" variant="soft">Superuser</Badge>
                      ): (
                        <Badge color="pink" variant="soft">Admin</Badge>
                      )}
                      <Flex direction={'column'} className='mt-2'>
                        <Text size="2" weight="bold">
                          {row.is_login ? (
                            <Badge color="jade" variant="soft">Sedang Online</Badge>
                          ) : row.last_login == null ?(
                            <Badge color="red" variant="soft">Belum login / Baru Ditambahkan</Badge>
                          ) : (
                            <Badge color="yellow" variant="soft">Last login: {row.last_login && formatDate(row.last_login, "long")}</Badge>
                          )}
                        </Text>
                        <Text>
                          <Badge color='gray'>
                            Telepon: {row.no_telepon}
                          </Badge>
                        </Text>
                      </Flex>
                    </Box>
                  </Card>
                </Box>
              )}
              renderToolbar={
                <>
                  <SegmentedControl segmented={segmented} setSegmented = {setSegmented}/>
                  <AdminCreateModal/>
                </>
              }
            />
          }
        </div>
    </div>
  )
}

export default AdminLayout