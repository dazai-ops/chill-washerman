//lib
import { toast } from 'sonner'
import { useEffect, useState } from 'react'
import { Pencil1Icon } from '@radix-ui/react-icons';
import { Button, Flex, AlertDialog, Grid, TextField, Text, TextArea, Select, DropdownMenu, Box } from '@radix-ui/themes'

//redux
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/redux/store'
import { updateAdmin } from '@/lib/thunk/admin/adminThunk'

//utils
import { Admin } from '@/models/admin.model'
import { validateForm } from '@/utils/form-validation/validateForm'
import { FieldRules } from '@/utils/form-validation/validation.model'
import { setErrors, clearErrors } from '@/redux/slices/form-validation/singleForm'

//component
import ErrorMessage from '@/components/ui/FieldError/ErrorMessage'
import ConfirmChange from '@/components/dialog/ConfirmChange/ConfirmChange';
import { setAdminForm } from '@/redux/slices/adminSlice';


const rules: Record<string, FieldRules> = {
  nama: ['required'],
  no_telepon: ['required'],
  alamat_rumah: ['required'],
  username: ['required'],
  role: ['required'],
}

const AdminEditModal = ({data}: {data: Admin}) => {
  const [open, setOpen] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const dispatch = useDispatch<AppDispatch>()
  const {adminForm, status} = useSelector((state:RootState) => state.admin)
  const errors = useSelector((state:RootState) => state.validateSingleForm.errors)

  useEffect(() => {
    if(data) {
      dispatch(clearErrors())
      dispatch(setAdminForm({
        nama: data.nama,
        username: data.username,
        role: data.role,
        no_telepon: data.no_telepon,
        alamat_rumah: data.alamat_rumah 
      }))
    }
  }, [data, dispatch])

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {name, value} = e.target
    dispatch(setAdminForm({
      ...adminForm,
      [name]: value
    }))
  }

  const handleFormVerify = (e : React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    dispatch(clearErrors())

    const formError = validateForm(adminForm, rules)
    if(formError.length > 0) {
      dispatch(setErrors(formError))
      setDisabled(true)
      setShowConfirm(false)
    } else {
      setShowConfirm(true)
      toast.success('Data sudah terverifikasi', {
        description: 'Klik update untuk melanjutkan',
        position: "top-center"
      })
    }  
  }

  const getErrorMessage = (fieldName: string) => {
    return errors.find((err) => err.field === fieldName)?.message
  }

  useEffect(() => {
    if(!open) {
      dispatch(clearErrors())
    }
  }, [open, dispatch])

  useEffect(() => {
    setDisabled(false)
    if(showConfirm){
      setShowConfirm(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adminForm])

  useEffect(() => {
    if(status === "success") {
      setOpen(false)
    }
  }, [status])

  // DEBUG -------------
  // useEffect(() => {
  //   console.log(adminForm)
  // }, [adminForm])
  // DEBUG ------------

  return (
    <AlertDialog.Root open={open}>
      <AlertDialog.Trigger>
        <DropdownMenu.Item 
          color='yellow' 
          onClick={() => setOpen(true)} 
          onSelect={(e) => e.preventDefault()}
        >
          <Pencil1Icon />Edit
        </DropdownMenu.Item>
      </AlertDialog.Trigger>
      <AlertDialog.Content maxWidth="600px">
        <AlertDialog.Title>Edit Admin</AlertDialog.Title>

        <AlertDialog.Description >
          Ubah data yang diperlukan
        </AlertDialog.Description>

        <form>
          <Flex direction="column" gap="3" className='mt-4'>
            <Grid gap="1">
              <Flex className='w-full' gap="3">
                <Box className='w-full'>
                  <Text size="2" weight="bold">Nama</Text>
                  <TextField.Root 
                    size="3" 
                    className={`mb-1 ${getErrorMessage('nama') ? 'border border-red-500' : ''}`}
                    name='nama' 
                    onChange={handleFormChange} 
                    defaultValue={adminForm.nama}
                  />
                  <ErrorMessage
                    message={getErrorMessage('nama') ?? ''}
                    className="mt-[-2px]"
                  />
                </Box>
                <Box className='w-full'>
                  <Text size="2" weight="bold">Nomer Telepon</Text>
                  <TextField.Root 
                    size="3" 
                    className={`mb-1 ${getErrorMessage('no_telepon') ? 'border border-red-500' : ''}`}
                    name='no_telepon' 
                    type='number' 
                    onChange={handleFormChange} 
                    defaultValue={adminForm.no_telepon}
                  />
                  <ErrorMessage message={getErrorMessage('no_telepon') ?? ''}/>
                </Box>
              </Flex>
              <Flex className='w-full' gap="3">
                <Box className='w-full'>
                  <Text size="2" weight="bold">Username</Text>
                  <TextField.Root 
                    size="3" 
                    className={`mb-1 ${getErrorMessage('username') ? 'border border-red-500' : ''}`}
                    name='username' 
                    onChange={handleFormChange} 
                    defaultValue={adminForm.username}
                  />
                  <ErrorMessage message={getErrorMessage('username') ?? ''}/>
                </Box>
                <Box className='flex flex-row w-full'>
                  <Box className='w-full'>
                    <Text size="2" weight="bold">Role Admin</Text>
                  </Box>
                  <Select.Root 
                    size="3" 
                    name='role' 
                    onValueChange={(value) => dispatch(setAdminForm({ 
                      ...adminForm, 
                      role: value }
                    ))} 
                    defaultValue={adminForm.role}
                  >
                    <Select.Trigger style={{ width: '100%'}}/>
                      <Select.Content>
                        <Select.Group>
                          <Select.Label>Superuser dapat mengakses semua fitur!</Select.Label>
                          <Select.Separator />
                          <Select.Item value="superuser">Superuser</Select.Item>
                          <Select.Item value="admin">Admin</Select.Item>
                        </Select.Group>
                      </Select.Content>
                  </Select.Root>
                  <ErrorMessage message={getErrorMessage('role') ?? ''}/>
                </Box>
              </Flex>
              <Text size="2" weight="bold">Alamat Rumah</Text>
              <TextArea 
                size="3" 
                className='mb-1' 
                name='alamat_rumah' 
                onChange={handleFormChange} 
                defaultValue={adminForm.alamat_rumah}
              />
              <ErrorMessage 
                message={getErrorMessage('alamat_rumah') ?? ''}
              />
            </Grid>
          </Flex>

          <Flex gap="2" mt="4" justify="end">
            <AlertDialog.Cancel>
              <Button color='gray' onClick={() => setOpen(false)}>
                Batal
              </Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action>
              <ConfirmChange
                onConfirm={() => dispatch(updateAdmin({ id: String(data.id), payload: adminForm }))}
                label='Update Admin'
                customButton={
                  showConfirm ? (
                    <Button color='green'>Update</Button>
                  ) : (
                    <Button disabled={disabled} color='green' onClick={(e) => handleFormVerify(e)}>Cek Data</Button>
                  )
                }
              />
            </AlertDialog.Action>
          </Flex>        
        </form>
      </AlertDialog.Content>
    </AlertDialog.Root>
  )
}

export default AdminEditModal