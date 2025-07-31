import { useState } from 'react'
import { Button, Flex, AlertDialog, Grid, TextField, Text } from '@radix-ui/themes'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/redux/store'
import { PersonIcon } from '@radix-ui/react-icons';
import { addJenisPakaian } from '@/lib/thunk/jenispakaian/jenispakaianThunk'
import { JenisPakaianCreateModalProps } from '@/models/jenispakaian.model';

function JenisPakaianCreateModal() {
  const dispatch = useDispatch<AppDispatch>()
  const [formData, setFormData] = useState<JenisPakaianCreateModalProps>({
    jenis_pakaian: '',
    satuan: '',
    harga_per_item: '',
    harga_per_kg: '',
    estimasi_waktu: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e : React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    dispatch(addJenisPakaian(formData))
  }

  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger>
        <Button size="3"><PersonIcon/>Add new...</Button>
      </AlertDialog.Trigger>
      <AlertDialog.Content maxWidth="500px">
        <AlertDialog.Title>Tambah Jenis Pakaian</AlertDialog.Title>

        <AlertDialog.Description >
          Isi form dibawah ini
        </AlertDialog.Description>

        <form onSubmit={(e) => handleSubmit(e)}>
          <Flex direction="column" gap="3" className='mt-4'>
            <Grid gap="1">
              <Text size="2" weight="bold">Jenis Pakaian</Text>
              <TextField.Root size="3" className='mb-1' name='jenis_pakaian' onChange={handleInputChange} />

              <Text size="2" weight="bold">Satuan</Text>
              <TextField.Root size="3" className='mb-1' name='satuan' onChange={handleInputChange}/>

              <Text size="2" weight="bold">Harga / (kg)</Text>
              <TextField.Root size="3" className='mb-1' name='harga_per_kg' onChange={handleInputChange}/>
      
              <Text size="2" weight="bold">Harga / (item)</Text>
              <TextField.Root size="3" className='mb-1' name='harga_per_item' onChange={handleInputChange}/>

              <Text size="2" weight="bold">Estimasi Waktu</Text>
              <TextField.Root size="3" type='number'className='mb-1' name='estimasi_waktu' onChange={handleInputChange}/>
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

export default JenisPakaianCreateModal