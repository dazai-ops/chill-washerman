import { useState } from 'react'
import { Button, Flex, AlertDialog, Grid, TextField, Text, TextArea, Select } from '@radix-ui/themes'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/app/redux/store'
import { addAdmin } from '@/app/redux/api/adminThunk'
import { PersonIcon } from '@radix-ui/react-icons';

function AdminAddModal() {
  const dispatch = useDispatch<AppDispatch>()
  const [formData, setFormData] = useState({
    nama: '',
    no_telepon: '',
    alamat_rumah: '',
    username: '',
    password_hash: '',
    role: '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e : React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    dispatch(addAdmin(formData))
  }

  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger>
        <Button size="3"><PersonIcon/>Add new...</Button>
      </AlertDialog.Trigger>
      <AlertDialog.Content maxWidth="500px">
        <AlertDialog.Title>Tambah Admin</AlertDialog.Title>

        <AlertDialog.Description >
          Isi form dibawah ini
        </AlertDialog.Description>

        <form onSubmit={(e) => handleSubmit(e)}>
          <Flex direction="column" gap="3" className='mt-4'>
            <Grid gap="1">
              <Text size="2" weight="bold">Nama</Text>
              <TextField.Root size="3" className='mb-1' name='nama' onChange={handleInputChange}/>

              <Text size="2" weight="bold">Nomer Telepon</Text>
              <TextField.Root size="3" className='mb-1' name='no_telepon' type='number' onChange={handleInputChange}/>

              <Text size="2" weight="bold">Alamat Rumah</Text>
              <TextArea size="3" className='mb-1' name='alamat_rumah' onChange={handleInputChange}/>

              <Text size="2" weight="bold">Username</Text>
              <TextField.Root size="3" className='mb-1' name='username' onChange={handleInputChange}/>

              <Text size="2" weight="bold">Password</Text>
              <TextField.Root size="3" className='mb-1' name='password_hash' type='password' onChange={handleInputChange}/>
              
              <Text size="2" weight="bold">Role Admin</Text>
              <Select.Root defaultValue="apple" size="3" name='role' onValueChange={(value) => setFormData({ ...formData, role: value })}>
                <Select.Trigger />
                  <Select.Content>
                    <Select.Group>
                      <Select.Label>Superuser dapat mengakses semua fitur!</Select.Label>
                      <Select.Separator />
                      <Select.Item value="superuser">Superuser</Select.Item>
                      <Select.Item value="admin">Admin</Select.Item>
                    </Select.Group>
                  </Select.Content>
              </Select.Root>
            </Grid>
          </Flex>

          <Flex gap="3" mt="4" justify="end">
            <AlertDialog.Cancel>
              <Button color='red'>
                Batal
              </Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action>
              <Button type='submit'>
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
