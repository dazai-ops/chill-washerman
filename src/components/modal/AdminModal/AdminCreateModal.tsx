// lib
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Flex, AlertDialog, Grid, TextField, Text, TextArea, Select, Box } from '@radix-ui/themes'
import { PersonIcon } from '@radix-ui/react-icons';

// redux
import { AppDispatch, RootState } from '@/redux/store'
import { clearError } from '@/redux/slices/authSlice'
import { addAdmin } from '@/lib/thunk/admin/adminThunk'

// form validate
import { validateForm } from '@/utils/form-validation/validateForm'
import { FieldRules } from '@/utils/form-validation/singleFormValidation.model'
import { clearForm, setErrors, setField } from '@/redux/slices/form-validation/formAdminSlice'

// component
import ErrorMessage from '../../ui/FieldError/ErrorMessage';

const rules: Record<string, FieldRules> = {
  nama: ['required'],
  no_telepon: ['required'],
  alamat_rumah: ['required'],
  username: ['required'],
  password_hash: ['required', {minLength: 6}],
  role: ['required'],
}

function AdminAddModal() {
  const [open, setOpen] = useState(false)
  const [disabled, setDisabled] = useState(false)

  const dispatch = useDispatch<AppDispatch>()
  const formData = useSelector((state:RootState) => state.formAdmin.data)
  const errors = useSelector((state:RootState) => state.formAdmin.errors)

  const formChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {name, value} = e.target
    dispatch(setField({field: name, value: value}))
  }

  const formSubmit = (e : React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formError = validateForm(formData, rules)
    
    if (formError.length > 0) {
      dispatch(setErrors(formError))
      setDisabled(true)
    } else {
      dispatch(clearError())
      dispatch(addAdmin(formData as {password_hash: string}))
      setOpen(false)
    } 
  }

  const getErrorMessage = (field: string) => {
    return errors.find((err) => err.field === field)?.message
  }
  
  useEffect(() => {
    if(!open) {
      dispatch(clearError())
      dispatch(clearForm())
    }
  }, [open, dispatch])

  useEffect(() => {
    setDisabled(false)
  }, [formData])

  return (
    <AlertDialog.Root open={open}>
      <AlertDialog.Trigger>
        <Button size="3" color='gray' onClick={() => setOpen(true)} highContrast><PersonIcon/>Add new...</Button>
      </AlertDialog.Trigger>
      <AlertDialog.Content maxWidth="550px">
        <AlertDialog.Title>Tambah Admin</AlertDialog.Title>

        <AlertDialog.Description >
          Isi form dibawah ini
        </AlertDialog.Description>

        <form onSubmit={(e) => formSubmit(e)}>
          <Flex direction="column" gap="3" className='mt-4'>
            <Grid gap="1">
              <Flex className='w-full' gap="2">
                {/* Field nama admin */}
                <Box className='w-full'>
                  <Text size="2" weight="bold">Nama</Text>
                  <TextField.Root 
                    size="3" 
                    className={`mb-1 ${getErrorMessage('nama') ? 'border border-red-500' : ''}`}
                    name='nama' 
                    aria-invalid='true'
                    onChange={formChange}
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
                    size="3" 
                    className={`mb-1 ${getErrorMessage('no_telepon') ? 'border border-red-500' : ''}`}
                    name='no_telepon' 
                    type='number'
                    onChange={formChange}
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
                    className={`mb-1 ${getErrorMessage('username') ? 'border border-red-500' : ''}`}
                    name='username' 
                    onChange={formChange}
                  />
                  <ErrorMessage message={getErrorMessage('username') ?? ''}/>
                </Box>

                {/* Field password admin*/}
                <Box className='w-full'>
                  <Text size="2" weight="bold">Password</Text>
                  <TextField.Root 
                    size="3" 
                    className={`mb-1 ${getErrorMessage('username') ? 'border border-red-500' : ''}`}
                    name='password_hash' 
                    type='password' 
                    onChange={formChange}
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
                  onChange={formChange}
                />
                <ErrorMessage message={getErrorMessage('alamat_rumah') ?? ''}/>
              </Box>

              {/* Select role admin */}
              <Text size="2" weight="bold">Role Admin</Text>
              <Select.Root 
                defaultValue="apple" 
                size="3" 
                name='role' 
                onValueChange={(val) => dispatch(setField({field: 'role', value: val}))}
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

          <Flex gap="3" mt="4" justify="end">
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
                Submit
              </Button>
            </AlertDialog.Action>
          </Flex>
        </form>
        
      </AlertDialog.Content>
    </AlertDialog.Root>
  )
}

export default AdminAddModal
