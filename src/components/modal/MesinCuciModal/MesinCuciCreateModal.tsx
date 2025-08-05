import { useState } from 'react'
import { Button, Flex, AlertDialog, Grid, TextField, Text, Box, RadioCards } from '@radix-ui/themes'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/redux/store'
import { addMesinCuci } from '@/lib/thunk/mesincuci/mesincuciThunk'
import { PersonIcon } from '@radix-ui/react-icons';

function MesinCuciCreateModal() {
  const dispatch = useDispatch<AppDispatch>()
  const [formData, setFormData] = useState({
    merk: '',
    seri: '',
    tahun_pembuatan: '',
    tanggal_dibeli: '',
    is_active: true
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e : React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    dispatch(addMesinCuci(formData))
  }

  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger>
        <Button size="3" color='gray' highContrast><PersonIcon/>Add new...</Button>
      </AlertDialog.Trigger>
      <AlertDialog.Content maxWidth="500px">
        <AlertDialog.Title>Tambah Admin</AlertDialog.Title>

        <AlertDialog.Description >
          Isi form dibawah ini
        </AlertDialog.Description>

        <form onSubmit={(e) => handleSubmit(e)}>
          <Flex direction="column" gap="3" className='mt-4'>
            <Grid gap="1">
              <Text size="2" weight="bold">Merek</Text>
              <TextField.Root size="3" className='mb-1' name='merk' onChange={handleInputChange}/>

              <Text size="2" weight="bold">Seri</Text>
              <TextField.Root size="3" className='mb-1' name='seri' onChange={handleInputChange}/>

              <Text size="2" weight="bold">Tahun Pembuatan</Text>
              <TextField.Root size="3" type='number' min="1991" max="2030" className='mb-1' name='tahun_pembuatan' onChange={handleInputChange}/>

              <Text size="2" weight="bold">Tanggal Dibeli</Text>
              <TextField.Root size="3" type='date' className='mb-1' name='tanggal_dibeli' onChange={handleInputChange}/>

              <Text size="2" weight="bold">Status</Text>
              <Box maxWidth="600px">
                <RadioCards.Root name='is_active' onChange={handleInputChange} defaultValue='true'>
                  <RadioCards.Item value="true">
                    <Flex direction="column" width="100%">
                      <Text weight="bold">Active</Text>
                    </Flex>
                  </RadioCards.Item>
                  <RadioCards.Item value="false">
                    <Flex direction="column" width="100%">
                      <Text weight="bold">Inactive</Text>
                    </Flex>
                  </RadioCards.Item>
                </RadioCards.Root>
              </Box>
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

export default MesinCuciCreateModal