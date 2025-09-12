// lib
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { PersonIcon } from '@radix-ui/react-icons';
import { Button, Flex, AlertDialog, Grid, TextField, Text, TextArea, Select, Box } from '@radix-ui/themes'

// redux
import { AppDispatch, RootState } from '@/redux/store'
import { addAdmin } from '@/lib/thunk/admin/adminThunk'
import { clearForm, setErrors, clearErrors } from '@/redux/slices/form-validation/singleForm'

// utils
import { validateForm } from '@/utils/form-validation/validateForm'
import { FieldRules } from '@/utils/form-validation/validation.model'

// component
import ErrorMessage from '../../ui/FieldError/ErrorMessage';
import { setAdminForm } from '@/redux/slices/adminSlice';

const rules: Record<string, FieldRules> = {
  nama: ['required'],
  no_telepon: ['required'],
  alamat_rumah: ['required'],
  username: ['required'],
  password_hash: ['required', {minLength: 6}],
  role: ['required'],
}

const AdminCreateModal = () => {
  const [open, setOpen] = useState(false)
  const [disabled, setDisabled] = useState(false)

  const dispatch = useDispatch<AppDispatch>()
  const {adminForm} = useSelector((state:RootState) => state.admin)
  const {errors} = useSelector((state:RootState) => state.validateSingleForm)

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {name, value} = e.target
    dispatch(setAdminForm({
      ...adminForm,
      [name]: value
    }))
  }

  const handleFormSubmit = (e : React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formError = validateForm(adminForm, rules)
    
    if (formError.length > 0) {
      dispatch(setErrors(formError))
      setDisabled(true)
    } else {
      dispatch(clearErrors())
      dispatch(addAdmin(adminForm as {password_hash: string}))
      setOpen(false)
    } 
  }

  const getErrorMessage = (field: string) => {
    return errors.find((err) => err.field === field)?.message
  }
  
  useEffect(() => {
    if(!open) {
      dispatch(clearErrors())
      dispatch(clearForm())
    }
  }, [open, dispatch])

  useEffect(() => {
    setDisabled(false)
  }, [adminForm])

  return (
    <AlertDialog.Root open={open}>
      <AlertDialog.Trigger>
        <Button 
          size={{initial: '2', sm: '3'}} 
          color='gray' 
          onClick={() => setOpen(true)} 
          highContrast
        >
          <PersonIcon/>Tambah...
        </Button>
      </AlertDialog.Trigger>
      <AlertDialog.Content maxWidth="600px">
        <AlertDialog.Title>Tambah Admin</AlertDialog.Title>

        <AlertDialog.Description >
          Isi form dibawah ini
        </AlertDialog.Description>

        <form onSubmit={(e) => handleFormSubmit(e)}>
          <Flex direction="column" gap="3" className='mt-4'>
            <Grid gap="1">
              <Flex className='w-full' gap="2">
                {/* Field nama admin */}
                <Box className='w-full'>
                  <Text size="2" weight="bold">Nama</Text>
                  <TextField.Root 
                    size="3" 
                    name='nama' 
                    className={`mb-1 ${getErrorMessage('nama') ? 'border border-red-500' : ''}`}
                    aria-invalid='true'
                    onChange={handleFormChange}
                  />
                  <ErrorMessage 
                    message={getErrorMessage('nama') ?? ''}
                    className="mt-[-2px]"
                  />
                </Box>

                {/* Field no telepon */}
                <Box className='w-full'>
                  <Text size="2" weight="bold">Nomer Telepon</Text>
                  <TextField.Root 
                    type='number'
                    size="3" 
                    name='no_telepon' 
                    className={`mb-1 ${getErrorMessage('no_telepon') ? 'border border-red-500' : ''}`}
                    onChange={handleFormChange}
                  />
                  <ErrorMessage message={getErrorMessage('no_telepon') ?? ''}/>
                </Box>
              </Flex>
              <Flex className='w-full' gap="2">
                {/* Field username admin*/}
                <Box className='w-full'>
                  <Text size="2" weight="bold">Username</Text>
                  <TextField.Root 
                    size="3" 
                    name='username' 
                    className={`mb-1 ${getErrorMessage('username') ? 'border border-red-500' : ''}`}
                    onChange={handleFormChange}
                  />
                  <ErrorMessage message={getErrorMessage('username') ?? ''}/>
                </Box>

                {/* Field password admin*/}
                <Box className='w-full'>
                  <Text size="2" weight="bold">Password</Text>
                  <TextField.Root 
                    type='password' 
                    name='password_hash' 
                    size="3" 
                    className={`mb-1 ${getErrorMessage('password_hash') ? 'border border-red-500' : ''}`}
                    onChange={handleFormChange}
                  />
                  <ErrorMessage message={getErrorMessage('password_hash') ?? ''}/>
                </Box>
              </Flex>

              {/* Field alamat rumah admin */}
              <Box>
                <Text size="2" weight="bold">Alamat Rumah</Text>
                <TextArea 
                  size="3" 
                  className='mb-1' 
                  name='alamat_rumah' 
                  onChange={handleFormChange}
                />
                <ErrorMessage message={getErrorMessage('alamat_rumah') ?? ''}/>
              </Box>

              {/* Select role admin */}
              <Text size="2" weight="bold">Role Admin</Text>
              <Select.Root 
                size="3" 
                name='role' 
                defaultValue="apple" 
                onValueChange={(value) => dispatch(setAdminForm({
                  ...adminForm,
                  role: value
                }))}
              >
                <Select.Trigger 
                  className={`mb-1 ${getErrorMessage('role') ? 'border border-red-500' : ''}`}
                />
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
            </Grid>
          </Flex>
          <Flex gap="3" mt="4" justify="between">
            <Button type='reset' color='yellow' variant='soft'>
              Reset
            </Button>
            <Flex gap={"2"}>
              <AlertDialog.Cancel>
                <Button 
                  color='gray' 
                  onClick={() => setOpen(false)}
                >
                  Batal
                </Button>
              </AlertDialog.Cancel>
              <AlertDialog.Action>
                <Button 
                  type='submit' 
                  color='green'
                  disabled={disabled}
                >
                  Tambah
                </Button>
              </AlertDialog.Action>
            </Flex>
          </Flex>
        </form>

      </AlertDialog.Content>
    </AlertDialog.Root>
  )
}

export default AdminCreateModal
