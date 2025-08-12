"use client"
import { useEffect, useState } from 'react'
import { DataTable } from '@/components/layout/DataTable/DataTable';
import { DataCard } from '@/components/layout/DataCard/DataCard';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { retriveAdmin, changeRole, deleteAdmin } from '@/lib/thunk/admin/adminThunk';
import { DropdownMenu, Spinner, Box, Flex, Card, Avatar, Text, Badge } from '@radix-ui/themes';
import { DotsVerticalIcon } from '@radix-ui/react-icons';
import { adminColumns } from '@/features/admin/columns';
import { formatDateWIB } from '@/utils/dateFormatter';

import Tabnav from '@/components/layout/TabNav/TabNav'
import AdminDetail from '@/components/modal/AdminModal/AdminDetailDialog';
import AddModal from '@/components/modal/AdminModal/AdminCreateModal';
import EditModal from '@/components/modal/AdminModal/AdminEditModal';
import ConfirmDelete from '@/components/dialog/ConfirmDelete/ConfirmDelete';
import ConfirmChange from '@/components/dialog/ConfirmChange/ConfirmChange';
import SegmentedControl from '@/components/layout/SegmentedControl/SegementedControl';


function AdminLayout() {
  const dispatch = useDispatch<AppDispatch>()
  const { loading, success } = useSelector((state: RootState) => state.admin)
  const [ segmented, setSegmented ] = useState('card')
  const admin = useSelector((state: RootState) => state.auth.user)
  
  const columns = adminColumns
  const data = useSelector((state: RootState) => state.admin.adminCollection)
  
  useEffect(() => {
    dispatch(retriveAdmin())
  }, [dispatch, success])

  return (
    <div className='w-full flex flex-col items-center'>
      <Tabnav />
      {loading ? <Spinner className='mt-8 mb-4'/> : null}
      <div className="w-full sm:w-[600px] md:w-[700px] lg:w-[1000px] mt-10">
        {segmented === 'table' ?  
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
                  {admin?.role === 'superuser' && (
                  <>
                    <EditModal data={row}/>
                    <DropdownMenu.Separator />
                    {row.role === 'admin' 
                      ? <ConfirmChange 
                          label='Set as Superuser' 
                          onConfirm={() => row.id && dispatch(changeRole({id: row.id, role: 'superuser'}))}
                        />
                      : <ConfirmChange 
                          label='Set as Admin' 
                          onConfirm={() => row.id && dispatch(changeRole({id: row.id, role: 'admin'}))}
                        />
                    }
                    <DropdownMenu.Separator />
                    <ConfirmDelete onConfirm={() => row.id && dispatch(deleteAdmin(row.id))}/>
                  </>
                  )}
                </DropdownMenu.Content>
              </DropdownMenu.Root>
            )}
            renderToolbar={
              <>
                <SegmentedControl segmented={segmented} setSegmented = {setSegmented}/>
                <AddModal/>
              </>
            }
          /> : 
          <DataCard
            data={data}
            renderCard={(row) => (
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
                        <AdminDetail data={row}/>
                        {admin?.role === 'superuser' &&(
                          <>
                            <EditModal data={row}/>
                            <DropdownMenu.Separator />
                            {row.role === 'admin' 
                              ? <ConfirmChange 
                                  label='Set as Superuser' 
                                  onConfirm={() => row.id && dispatch(changeRole({id: row.id, role: 'superuser'}))}
                                />
                              : <ConfirmChange 
                                  label='Set as Admin' 
                                  onConfirm={() => row.id && dispatch(changeRole({id: row.id, role: 'admin'}))}
                                />
                            }
                            <DropdownMenu.Separator />
                            <ConfirmDelete onConfirm={() => row.id && dispatch(deleteAdmin(row.id))}/>
                          </>
                        )}
                      </DropdownMenu.Content>
                    </DropdownMenu.Root>
                  </Flex>
                  <Box className='mt-2'>
                    <Badge>{row.role}</Badge>
                    <Box className='mt-2'>
                      <Text as="div" size="2" weight="bold">
                        {row.is_login ? (
                          <Badge color="jade" variant="soft">Sedang Online</Badge>
                        ) : row.last_login == null ?(
                          <Badge color="red" variant="soft">Belum login / Baru Ditambahkan</Badge>
                        ) : (
                          <Badge color="yellow" variant="soft">Last login: {row.last_login && formatDateWIB(row.last_login)}</Badge>
                        )}
                      </Text>
                      <Text as="div" size="1" color="gray">
                        Telepon: {row.no_telepon}
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
          />
        }
      </div>
    </div>
  )
}

export default AdminLayout