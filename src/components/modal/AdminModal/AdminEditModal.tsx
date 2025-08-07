import { useEffect, useState } from 'react'
import { Button, Flex, AlertDialog, Grid, TextField, Text, TextArea, Select, DropdownMenu, Box } from '@radix-ui/themes'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/redux/store'
import { updateAdmin } from '@/lib/thunk/admin/adminThunk'
import { Pencil1Icon } from '@radix-ui/react-icons';
import ConfirmChange from '@/components/dialog/ConfirmChange/ConfirmChange';
import { Admin } from '@/models/admin.model'

function AdminEditModal({data}: {data: Admin}) {
  const dispatch = useDispatch<AppDispatch>()
  const [formData, setFormData] = useState({
    nama: '',
    no_telepon: '',
    alamat_rumah: '',
    username: '',
    role: '',
  })

  useEffect(() => {
    if(data) {
      setFormData({
        nama: data.nama,
        no_telepon: data.no_telepon,
        alamat_rumah: data.alamat_rumah,
        username: data.username,
        role: data.role
      })
    }
  }, [data])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e : React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    dispatch(updateAdmin({ id: data.id, admin: formData }))
  }

  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger>
        <DropdownMenu.Item color='yellow' onSelect={(e) => e.preventDefault()}>
          <Pencil1Icon />Edit
        </DropdownMenu.Item>
      </AlertDialog.Trigger>
      <AlertDialog.Content maxWidth="500px">
        <AlertDialog.Title>Edit Admin</AlertDialog.Title>

        <AlertDialog.Description >
          Ubah data yang diperlukan
        </AlertDialog.Description>

        <form onSubmit={(e) => handleSubmit(e)}>
          <Flex direction="column" gap="3" className='mt-4'>
            <Grid gap="1">
              <Flex className='w-full' gap="3">
                <Box className='w-full'>
                  <Text size="2" weight="bold">Nama</Text>
                  <TextField.Root size="3" className='mb-1' name='nama' onChange={handleInputChange} defaultValue={data?.nama}/>
                </Box>
                <Box className='w-full'>
                  <Text size="2" weight="bold">Nomer Telepon</Text>
                  <TextField.Root size="3" className='mb-1' name='no_telepon' type='number' onChange={handleInputChange} defaultValue={data?.no_telepon}/>
                </Box>
              </Flex>
              <Flex className='w-full' gap="3">
                <Box className='w-full'>
                  <Text size="2" weight="bold">Username</Text>
                  <TextField.Root size="3" className='mb-1' name='username' onChange={handleInputChange} defaultValue={data?.username}/>
                </Box>
                <Box className='flex flex-row w-full'>
                  <Box className='w-full'>
                    <Text size="2" weight="bold">Role Admin</Text>
                  </Box>
                  <Select.Root size="3" name='role' onValueChange={(value) => setFormData({ ...formData, role: value })} defaultValue={data?.role}>
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
                </Box>
              </Flex>
              <Text size="2" weight="bold">Alamat Rumah</Text>
              <TextArea size="3" className='mb-1' name='alamat_rumah' onChange={handleInputChange} defaultValue={data?.alamat_rumah}/>

            </Grid>
          </Flex>

          <Flex gap="3" mt="4" justify="end">
            <AlertDialog.Cancel>
              <Button color='gray'>
                Batal
              </Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action>
              <ConfirmChange 
                onConfirm={() => dispatch(updateAdmin({ id: data.id, admin: formData }))} 
                customButton={<Button color='green'>Update</Button>}/>
            </AlertDialog.Action>
          </Flex>
        </form>

      </AlertDialog.Content>
    </AlertDialog.Root>
  )
}

export default AdminEditModal