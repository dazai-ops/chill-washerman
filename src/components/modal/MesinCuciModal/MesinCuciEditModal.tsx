import { useEffect, useState } from 'react'
import { Button, Flex, AlertDialog, Grid, TextField, Text, Box, RadioCards, DropdownMenu } from '@radix-ui/themes'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/redux/store'
import { updateMesinCuci } from '@/lib/thunk/mesincuci/mesincuciThunk'
import { Pencil1Icon } from '@radix-ui/react-icons';
import ConfirmChange from '@/components/dialog/ConfirmChange/ConfirmChange';
import { MesinCuci } from '@/models/mesincuci.model'


function MesinCuciEditModal({data}: {data: MesinCuci}) {
  const dispatch = useDispatch<AppDispatch>()
  const [formData, setFormData] = useState({
    nama: '',
    merk: '',
    seri: '',
    tahun_pembuatan: '',
    tanggal_dibeli: '',
    is_active: false
  })

  useEffect(() => {
    if(data) {
      setFormData({
        nama: data.nama,
        merk: data.merk,
        seri: data.seri,
        tahun_pembuatan: data.tahun_pembuatan,
        tanggal_dibeli: data.tanggal_dibeli,
        is_active: data.is_active
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
    dispatch(updateMesinCuci({ id: data.id, mesinCuci: formData }))
  }

  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger>
        <DropdownMenu.Item color='yellow' onSelect={(e) => e.preventDefault()}>
          <Pencil1Icon />Edit
        </DropdownMenu.Item>
      </AlertDialog.Trigger>
      <AlertDialog.Content maxWidth="500px">
        <AlertDialog.Title>Edit Mesin Cuci</AlertDialog.Title>
        <AlertDialog.Description >
          Ubah data yang diperlukan
        </AlertDialog.Description>
        <form onSubmit={(e) => handleSubmit(e)}>
          <Flex direction="column" gap="3" className='mt-4'>
            <Grid gap="1">
              <Text size="2" weight="bold">Nama</Text>
              <TextField.Root size="3" className='mb-1' name='nama' onChange={handleInputChange} defaultValue={data?.nama} />

              <Text size="2" weight="bold">Merek</Text>
              <TextField.Root size="3" className='mb-1' name='merk' onChange={handleInputChange} defaultValue={data?.merk}/>

              <Text size="2" weight="bold">Seri</Text>
              <TextField.Root size="3" className='mb-1' name='seri' onChange={handleInputChange} defaultValue={data?.seri}/>

              <Text size="2" weight="bold">Tahun Pembuatan</Text>
              <TextField.Root size="3" type='number' min="1991" max="2030" className='mb-1' name='tahun_pembuatan' onChange={handleInputChange} defaultValue={data?.tahun_pembuatan}/>

              <Text size="2" weight="bold">Tanggal Dibeli</Text>
              <TextField.Root size="3" type='date' className='mb-1' name='tanggal_dibeli' onChange={handleInputChange} defaultValue={data?.tanggal_dibeli}/>

              <Text size="2" weight="bold">Status</Text>
              <Box maxWidth="600px">
                <RadioCards.Root name='is_active' onChange={handleInputChange} defaultValue={data?.is_active.toString()} columns={{ initial: "1", sm: "3" }}>
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
              <ConfirmChange 
                onConfirm={() => dispatch(updateMesinCuci({ id: data.id, mesinCuci: formData }))} 
                customButton={<Button color='blue'
                >
                  Update
              </Button>}/>
            </AlertDialog.Action>
          </Flex>
        </form>

      </AlertDialog.Content>
    </AlertDialog.Root>
  )
}

export default MesinCuciEditModal