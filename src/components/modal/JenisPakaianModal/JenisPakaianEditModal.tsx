import { useEffect, useState } from 'react'
import { Button, Flex, AlertDialog, Grid, TextField, Text, DropdownMenu } from '@radix-ui/themes'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/redux/store'
import { updateJenisPakaian } from '@/lib/thunk/jenispakaian/jenispakaianThunk'
import { Pencil1Icon } from '@radix-ui/react-icons';
import ConfirmChange from '@/components/dialog/ConfirmChange/ConfirmChange';
import { JenisPakaian } from '@/models/jenispakaian.model'


function MesinCuciEditModal({data}: {data: JenisPakaian}) {
  const dispatch = useDispatch<AppDispatch>()
  const [formData, setFormData] = useState({
    jenis_pakaian: '',
    harga_per_kg: '',
    harga_per_item: '',
    satuan: '',
    estimasi_waktu: '',
  })

  useEffect(() => {
    if(data) {
      setFormData({
        jenis_pakaian: data.jenis_pakaian,
        harga_per_kg: data.harga_per_kg,
        harga_per_item: data.harga_per_item,
        satuan: data.satuan,
        estimasi_waktu: data.estimasi_waktu,
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
    console.log(formData)
    dispatch(updateJenisPakaian({ id: data.id, jenisPakaian: formData }))
  }

  return (
    <AlertDialog.Root key={data.id}>
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
              <TextField.Root size="3" className='mb-1' name='jenis_pakaian' onChange={handleInputChange} defaultValue={data?.jenis_pakaian} />

              <Text size="2" weight="bold">Satuan</Text>
              <TextField.Root size="3" className='mb-1' name='satuan' onChange={handleInputChange} defaultValue={data?.satuan}/>

              <Text size="2" weight="bold">Harga / (kg)</Text>
              <TextField.Root size="3" className='mb-1' name='harga_per_kg' onChange={handleInputChange} defaultValue={data?.harga_per_kg}/>
      
              <Text size="2" weight="bold">Harga / (item)</Text>
              <TextField.Root size="3" className='mb-1' name='harga_per_item' onChange={handleInputChange} defaultValue={data?.harga_per_item}/>

              <Text size="2" weight="bold">Estimasi Waktu</Text>
              <TextField.Root size="3" type='number'className='mb-1' name='estimasi_waktu' onChange={handleInputChange} defaultValue={data?.estimasi_waktu}/>
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
                onConfirm={() => dispatch(updateJenisPakaian({ id: data.id, jenisPakaian: formData }))} 
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